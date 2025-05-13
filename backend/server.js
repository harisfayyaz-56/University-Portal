const express = require('express')
var sql = require('mssql')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require('cors')

const app = express()
const port = 8080

app.use(express.json());
app.use(cors())

var config = {
    user: 'sa',
    password: '12345678',
    server: 'localhost', 
    database: 'UniversityManagementSystem',
    port: 50379,
    options: {
        trustServerCertificate: true
    }
};

const secretKey = "yourSuperSecretKey";

// Middleware to verify token and role
const authenticateToken = (allowedRoles) => {
    return (req, res, next) => {
        const token = req.headers["authorization"]?.split(" ")[1];  // Extract the token from the header
        if (!token) return res.status(401).json({ message: "Access Denied. You are NOT Eligible for this portion." });

        try {
            const decoded = jwt.verify(token, secretKey);
            req.user = decoded;
            
            console.log("Decoded Token: ", req.user);  // Debugging

            //role check
            if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ message: "Access Forbidden: Insufficient Permissions" });
            }

            next();  // Allow access if token is valid and role is authorized
        } catch (err) {
            console.error(err);
            return res.status(401).json({ message: "Invalid Token" });
        }
    };
};

//Get a token for CRUD operations
app.post("/login", async (req, res) => {
    const { Email, Password } = req.body;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input("Email", sql.VarChar(255), Email)
            .query("SELECT * FROM Users WHERE Email = @Email");
        console.log("Success");
        const user = result.recordset[0];
        if (!user) return res.status(404).json({ message: "User not found" });

        // Verify the password
        if (Password !== user.Password) {
    return res.status(401).json({ message: "Invalid password" });
}
        // Generate a JWT token with UserID and Role
        const token = jwt.sign(
            { userID: user.UserID, role: user.Role },
            secretKey,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            status: true,
            message: "Login successful",
            data: {
              token,
              role: user.Role,
              name: user.FullName,
            }
          });
          
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error during login", details: err });
    }
});

//=>TOTAL CREATE QUERIES = 10
//=>TOTAL READ QUERIES = 48
//=>TOTAL UPDATE QUERIES = 9
//=>TOTAL DELETE QUERIES = 5


//-----------------------------------------------QUERIES-------------------------------------------------
//CAN ALSO BE INTERPRETED AS READ OPERATIONS AS THEY FETCH THE DATA FROM THE DATABASE

//1. Get Students Enrolled in a Course by Course Code (GET)
app.get("/enrolled-students/:courseCode", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    const { courseCode } = req.params;

    try {
        const pool= await sql.connect(config); 
        const result = await pool.request().input("inputt", sql.VarChar, courseCode).query(
        `SELECT s.studentid, u.fullname, u.email, c.coursename, ce.enrollmentdate
         FROM students s
         JOIN courseenrollment ce ON s.studentid = ce.studentid
         JOIN courses c ON ce.courseid = c.courseid
         JOIN users u ON s.userid = u.userid
         WHERE c.coursecode = @inputt`
      );

      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "No students found for this course" });
      }

      res.json(result.recordset);
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: "Error fetching enrolled students", error });
    }
  });
  

//2. Get Top 5 Students by Grade for a Specific Course Code
app.get("/top-students/:courseCode", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    const { courseCode } = req.params;

    try {
        await sql.connect(config);
        const result = await sql.query`
            SELECT TOP 5 u.FullName AS studentName, g.Grade
            FROM Grades g
            JOIN Students s ON g.StudentID = s.StudentID
            JOIN Users u ON s.UserID = u.UserID
            JOIN Courses c ON g.CourseID = c.CourseID
            WHERE c.CourseCode = ${courseCode}
            ORDER BY g.Grade DESC;
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No students found for the given course." });
        }

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

//3. Get faculty assignments
app.get("/faculty-assignments/:semester", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    const { semester } = req.params;

    try {
        await sql.connect(config);
        const result = await sql.query`
            SELECT u.fullname AS facultyName, c.coursename AS courseName, fc.semester
            FROM facultycourses fc
            JOIN faculty f ON fc.facultyid = f.facultyid
            JOIN users u ON f.userid = u.userid
            JOIN courses c ON fc.courseid = c.courseid
            WHERE fc.semester = ${semester};
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No faculty assignments found for the given semester." });
        }

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

//4. Students in a department
app.get("/students-in-department/:departmentName", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    const { departmentName } = req.params;

    try {
        await sql.connect(config);
        const result = await sql.query`
            SELECT u.fullname AS studentName, d.departmentname AS departmentName, s.enrollmentyear AS enrollmentYear
            FROM students s
            JOIN users u ON s.userid = u.userid
            JOIN departments d ON s.departmentid = d.departmentid
            WHERE d.departmentname = ${departmentName};
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No students found in the specified department." });
        }

        res.json(result.recordset);  
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

//5. Announcemenmts of a department
app.get("/announcements/:departmentName", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    const { departmentName } = req.params;

    try {
        await sql.connect(config); 
        const result = await sql.query`
            SELECT a.message AS message, a.createdat AS createdAt, u.fullname AS postedBy
            FROM announcements a
            JOIN users u ON a.postedby = u.userid
            JOIN departments d ON a.departmentid = d.departmentid
            WHERE d.departmentname = ${departmentName}
            ORDER BY a.createdat DESC;
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No announcements found for the specified department." });
        }

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});


//6. GET Route to Fetch Courses Offered by each Departments
app.get("/courses-with-departments", authenticateToken(["Admin", "Faculty", "Student"]), async (req, res) => {
    try {
        await sql.connect(config);
        
        const result = await sql.query(`
            SELECT d.departmentname, c.coursename, c.credits
            FROM courses c
            JOIN departments d ON c.departmentid = d.departmentid
            ORDER BY d.departmentname;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No courses found" });
        }

        res.json({status: true, data: result.recordset});

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});


//7. GET Route to Fetch Total Attendance Counts (Present and Absent) Grouped by Student and Course
app.get("/attendance-summary", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        await sql.connect(config);
        
        const result = await sql.query(`
            SELECT u.FullName AS studentName, 
                   c.CourseName,
                   SUM(CASE WHEN a.Status = 'Present' THEN 1 ELSE 0 END) AS presentCount,
                   SUM(CASE WHEN a.Status = 'Absent' THEN 1 ELSE 0 END) AS absentCount
            FROM Attendance a
            JOIN Students s ON a.StudentID = s.StudentID
            JOIN Users u ON s.UserID = u.UserID
            JOIN Courses c ON a.CourseID = c.CourseID
            GROUP BY u.FullName, c.CourseName
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No attendance records found" });
        }
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});


//8. GET Route to Fetch Students with Attendance Below 80%
app.get("/low_attendance", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT u.FullName AS studentName, 
                   SUM(CASE WHEN a.Status = 'Present' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.AttendanceID) AS attendancePercentage
            FROM Attendance a
            JOIN Students s ON a.StudentID = s.StudentID
            JOIN Users u ON s.UserID = u.UserID
            GROUP BY u.FullName
            HAVING SUM(CASE WHEN a.Status = 'Present' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.AttendanceID) < 80;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No students found with attendance below 80%" });
        }

        // Return the low attendance list as JSON
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});


//9. GET Route to Fetch Faculty, Courses, and Semester Details
app.get("/faculty-courses", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT u.FullName AS facultyName, c.CourseName, fc.Semester
            FROM FacultyCourses fc
            JOIN Faculty f ON fc.FacultyID = f.FacultyID
            JOIN Users u ON f.UserID = u.UserID
            JOIN Courses c ON fc.CourseID = c.CourseID
            ORDER BY u.FullName, fc.Semester;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No faculty-course records found" });
        }

        // Return the list of faculty courses as JSON
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});


//10. GET Route to Fetch Total Credits Earned by Each Student
app.get("/students-total-credits", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        await sql.connect(config); 

        const result = await sql.query(`
            SELECT u.FullName AS studentName, SUM(c.Credits) AS totalCredits
            FROM Students s
            JOIN Users u ON s.UserID = u.UserID
            JOIN CourseEnrollment ce ON s.StudentID = ce.StudentID
            JOIN Courses c ON ce.CourseID = c.CourseID
            GROUP BY u.FullName;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No students found" });
        }

        // Return the total credits of each student as JSON
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

//11. Login and then you can view YOUR total credits earned through this Route
app.get("/students/self-credits", authenticateToken("Student"), async (req, res) => {
    try {
        await sql.connect(config); 

        const studentID = req.user.userID;

        const result = await sql.query(`
            SELECT u.FullName AS studentName, SUM(c.Credits) AS totalCredits
            FROM Students s
            JOIN Users u ON s.UserID = u.UserID
            JOIN CourseEnrollment ce ON s.StudentID = ce.StudentID
            JOIN Courses c ON ce.CourseID = c.CourseID
            WHERE s.UserID = ${studentID}  -- Fetch only for logged-in student
            GROUP BY u.FullName;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "You are not enrolled in any courses yet." });
        }

        res.json(result.recordset[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

//12. Students who have not enrolled in any of the course
app.get("/students/not-enr", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        const pool = await sql.connect(config);

        const result = await pool.request().query(`
            SELECT u.FullName, s.StudentID
            FROM Students s
            JOIN Users u ON s.UserID = u.UserID
            WHERE s.StudentID NOT IN (
                SELECT ce.StudentID
                FROM CourseEnrollment ce
            )
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No students found without enrollment." });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching students without enrollment", details: err });
    }
});

//13. Students can view their enrolled courses by logging and then through this Route, their userID will automatically be detected
app.get("/students/selfcenr", async (req, res) => {
    try {
        const userID = req.user.userID;

        const pool = await sql.connect(config);
        const studentResult = await pool.request()
            .input("UserID", sql.Int, userID)
            .query("SELECT StudentID FROM Students WHERE UserID = @UserID");

        if (studentResult.recordset.length === 0) {
            return res.status(404).json({ message: "Student profile not found for the logged-in user." });
        }

        const studentID = studentResult.recordset[0].StudentID;

        // Fetch the courses the student is enrolled in
        const enrollmentResult = await pool.request()
            .input("StudentID", sql.Int, studentID)
            .query("SELECT ce.EnrollmentID, u.FullName, ce.courseID, ce.EnrollmentDate FROM CourseEnrollment ce JOIN Students s ON ce.StudentID=s.StudentID JOIN Users u ON s.UserID=u.UserID WHERE StudentID = @StudentID");

        if (enrollmentResult.recordset.length === 0) {
            return res.status(404).json({ message: "You are not enrolled in any courses yet." });
        }

        res.status(200).json(enrollmentResult.recordset);

    } catch (error) {
        console.error('Error fetching enrollments:', error.response ? error.response.data : error.message);
        
      }      
});

//14. Count Users per Role – Find out how many students, faculty, and admins are registered.
app.get("/users/count-by-role", authenticateToken("Admin"), async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT Role, COUNT(*) AS UserCount
            FROM Users
            GROUP BY Role;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

//15. Faculty Count per Department – Find out how many faculty members each department has.
app.get("/departments/faculty-count", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT d.DepartmentName, COUNT(f.FacultyID) AS FacultyCount
            FROM Departments d
            LEFT JOIN Faculty f ON d.DepartmentID = f.DepartmentID
            GROUP BY d.DepartmentName;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No departments found" });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

//16. Student count per department
app.get("/departments/student-count", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT d.DepartmentName, COUNT(s.StudentID) AS StudentCount
            FROM Departments d
            LEFT JOIN Students s ON d.DepartmentID = s.DepartmentID
            GROUP BY d.DepartmentName;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No departments found" });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

//17. Departments with no courses
app.get("/departments-without-courses", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT d.DepartmentName
            FROM Departments d
            LEFT JOIN Courses c ON d.DepartmentID = c.DepartmentID
            WHERE c.CourseID IS NULL;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "All departments have courses assigned" });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

//18. Course Load Analysis – Find out how many courses each student is enrolled in.
app.get("/students-course-count", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT s.StudentID, u.FullName, COUNT(ce.CourseID) AS CourseCount
            FROM Students s
            JOIN Users u ON s.UserID = u.UserID
            LEFT JOIN CourseEnrollment ce ON s.StudentID = ce.StudentID
            GROUP BY s.StudentID, u.FullName;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No student data found" });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

//19. Attendance % for each student in a course
app.get("/students-attendance", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT a.StudentID, u.FullName, a.CourseID, 
                   (SUM(CASE WHEN a.Status = 'Present' THEN 1 ELSE 0 END) * 100.0) / COUNT(*) AS AttendancePercentage
            FROM Attendance a
            JOIN Users u ON a.StudentID = (SELECT StudentID FROM Students WHERE UserID = u.UserID)
            GROUP BY a.StudentID, u.FullName, a.CourseID;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No attendance records found" });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

//20. Keyword Search – Search for announcements containing specific keywords (e.g., “exam,” “holiday”).
app.get("/announcements/search/:keyword", authenticateToken(["Admin", "Faculty", "Student"]), async (req, res) => {
    try {
        const { keyword } = req.params;
        if (!keyword) {
            return res.status(400).json({ message: "Please provide a keyword to search." });
        }

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input("Keyword", sql.VarChar(100), `%${keyword}%`)
            .query("SELECT * FROM Announcements WHERE Message LIKE @Keyword");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No announcements found for the given keyword." });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});


//-------------------------------------------VIEWS-------------------------------------------
//1. GET Route to Fetch Student Enrollments from the View
app.get("/vstudent-enrollments", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        await sql.connect(config);

        // Query to fetch student enrollments from the view
        const result = await sql.query(`
            SELECT studentName, CourseName, EnrollmentDate
            FROM vw_studentEnrollments;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No enrollments found" });
        }

        // Return the enrollment details as JSON
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});


//2. GET Route to Fetch Faculty Assignments from the View
app.get("/vfaculty-assignments", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        await sql.connect(config);

        // Query to fetch faculty assignments from the view
        const result = await sql.query(`
            SELECT facultyName, CourseName, Semester
            FROM vw_facultyAssignments;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No faculty assignments found" });
        }

        // Return the assignment details as JSON
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});


//3. GET Route to Fetch Attendance Summary from the View
app.get("/vattendance-summary", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        await sql.connect(config);

        // Query to fetch attendance summary from the view
        const result = await sql.query(`
            SELECT studentName, CourseName, attendancePercentage
            FROM vw_attendanceSummary;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No attendance data found" });
        }

        // Return the attendance summary details as JSON
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});


//4. GET Route to Fetch Students with Department Details from the View
app.get("/vdepartment-students", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query(`
            SELECT FullName, EnrollmentYear, DepartmentName
            FROM vw_departmentStudents;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No students found" });
        }
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});


//-----------------------------CRUD OPERATIONS----------------------------

//CREATE=>

//1. Users
app.post("/users/ins", authenticateToken("Admin"), async (req, res) => {
    try {
        const { FullName, Email, Password, Role } = req.body;
        if(!FullName || !Email || !Password || !Role){
            return res.status(400).json({message: "Kindly Enter all the Fileds i.e. Fullname, email, password, Role"});
        }

        const pool = await sql.connect(config);
        console.log("Cn DB");
        const result = await pool.request()
        .input("FullName", sql.VarChar(255), FullName)
        .input("Email", sql.VarChar(255), Email)
        .input("Password", sql.VarChar(255), Password)  
        .input("Role", sql.VarChar(50), Role)
        .query("INSERT INTO Users (FullName, Email, Password, Role) OUTPUT INSERTED.* VALUES(@FullName, @Email, @Password, @Role)");
        console.log("User added", result.recordset[0]);
        return res.status(201).json({ message: "User created successfully!", user: result.recordset[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error creating user", details: err });
    }
});

//2. Departments
app.post("/departments/ins", authenticateToken("Admin"), async (req, res) => {
    try {
        const { DepartmentName } = req.body;
        if (!DepartmentName) {
            return res.status(400).json({ message: "Kindly enter the DepartmentName" });
        }

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input("DepartmentName", sql.VarChar(255), DepartmentName)
            .query("INSERT INTO Departments (DepartmentName) OUTPUT INSERTED.* VALUES (@DepartmentName)");
        console.log("Inserting Department...");
        return res.status(201).json({ status:true, message: "Department created successfully!", department: result.recordset[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error creating department", details: err });
    }
});

//3. Faculty
app.post("/faculty/ins", authenticateToken("Admin"), async (req, res) => {
    try {
        const { UserID, DepartmentID } = req.body;
        if (!UserID || !DepartmentID) {
            return res.status(400).json({ message: "Kindly Enter all the fields i.e. UserID, DepartmentID" });
        }

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input("UserID", sql.Int, UserID)
            .input("DepartmentID", sql.Int, DepartmentID)
            .query("INSERT INTO Faculty (UserID, DepartmentID) OUTPUT INSERTED.* VALUES (@UserID, @DepartmentID)");

        return res.status(201).json({ message: "Faculty created successfully!", faculty: result.recordset[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error creating faculty", details: err });
    }
});

//4. Students
app.post("/students/ins", authenticateToken("Admin"), async (req, res) => {
    try {
        const { UserID, EnrollmentYear, DepartmentID } = req.body;
        if (!UserID || !EnrollmentYear || !DepartmentID) {
            return res.status(400).json({ message: "Kindly Enter all the fields i.e. UserID, EnrollmentYear, DepartmentID" });
        }

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input("UserID", sql.Int, UserID)
            .input("EnrollmentYear", sql.Int, EnrollmentYear)
            .input("DepartmentID", sql.Int, DepartmentID)
            .query("INSERT INTO Students (UserID, EnrollmentYear, DepartmentID) OUTPUT INSERTED.* VALUES (@UserID, @EnrollmentYear, @DepartmentID)");

        return res.status(201).json({ message: "Student created successfully!", student: result.recordset[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error creating student", details: err });
    }
});

//5. Courses
app.post("/courses/ins", authenticateToken("Admin"), async (req, res) => {
    try {
        const { CourseName, CourseCode, DepartmentID, Credits } = req.body;
        if (!CourseName || !CourseCode || !DepartmentID || !Credits) {
            return res.status(400).json({ message: "Kindly Enter all the fields i.e. CourseName, CourseCode, Credits, DPT ID" });
        }

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input("CourseName", sql.VarChar(255), CourseName)
            .input("CourseCode", sql.VarChar(50), CourseCode)
            .input("DepartmentID", sql.Int, DepartmentID)
            .input("Credits", sql.Int, Credits)
            .query("INSERT INTO Courses (CourseName, CourseCode, DepartmentID, Credits) OUTPUT INSERTED.* VALUES (@CourseName, @CourseCode, @DepartmentID, @Credits)");

        return res.status(201).json({ message: "Course created successfully!", course: result.recordset[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error creating course", details: err });
    }
});

//6. Course enrollments
app.post("/courseenrollment/ins", authenticateToken(["Admin", "Student"]), async (req, res) => {
    try {
        const loggedInUserID = req.user.userID;
        const { CourseID } = req.body;

        if (!CourseID) {
            return res.status(400).json({ message: "CourseID is missing!" });
        }

        const pool = await sql.connect(config);

        // Fetch the StudentID for the logged-in UserID
        const studentResult = await pool.request()
            .input("UserID", sql.Int, loggedInUserID)
            .query("SELECT StudentID FROM Students WHERE UserID = @UserID");

        if (studentResult.recordset.length === 0) {
            return res.status(403).json({ message: "Access denied: You are not a student!" });
        }

        const loggedInStudentID = studentResult.recordset[0].StudentID;

        // Now enroll the student in the course
        const result = await pool.request()
            .input("StudentID", sql.Int, loggedInStudentID)
            .input("CourseID", sql.Int, CourseID)
            .query("INSERT INTO CourseEnrollment (StudentID, CourseID) OUTPUT INSERTED.* VALUES (@StudentID, @CourseID)");

        return res.status(201).json({ message: "Student enrolled successfully!", courseEnrollment: result.recordset[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error enrolling student in course", details: err });
    }
});



//7. Faculty Courses
app.post("/facultycourses/ins", authenticateToken("Admin"), async (req, res) => {
    try {
        const { FacultyID, CourseID, Semester } = req.body;
        if (!FacultyID || !CourseID || !Semester) {
            return res.status(400).json({ message: "Kindly enter all the fields i.e. FacultyID, CourseID, Semester" });
        }

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input("FacultyID", sql.Int, FacultyID)
            .input("CourseID", sql.Int, CourseID)
            .input("Semester", sql.VarChar(50), Semester)
            .query("INSERT INTO FacultyCourses (FacultyID, CourseID, Semester) OUTPUT INSERTED.* VALUES (@FacultyID, @CourseID, @Semester)");

        return res.status(201).json({ message: "Faculty assigned to course successfully!", facultyCourse: result.recordset[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error assigning faculty to course", details: err });
    }
});

//8. Attendance
app.post("/attendance/ins", authenticateToken("Faculty"), async (req, res) => {
    try {
        const { StudentID, CourseID, Date, Status } = req.body;
        if (!StudentID || !CourseID || !Status || !Date) {
            return res.status(400).json({ message: "Kindly Enter all the fields i.e. StudentID, CourseID, Status, Date" });
        }

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input("StudentID", sql.Int, StudentID)
            .input("CourseID", sql.Int, CourseID)
            .input("Date", sql.DateTime, Date)
            .input("Status", sql.VarChar(50), Status)
            .query("INSERT INTO Attendance (StudentID, CourseID, AttendanceDate, Status) OUTPUT INSERTED.* VALUES (@StudentID, @CourseID, @Date, @Status)");

        return res.status(201).json({ message: "Attendance entry created successfully!", attendance: result.recordset[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error creating attendance entry", details: err });
    }
});

//9. Grades
app.post("/grades/ins", authenticateToken("Faculty"), async (req, res) => {
    try {
        const { StudentID, CourseID, Grade } = req.body;
        if (!StudentID || !CourseID || !Grade) {
            return res.status(400).json({ message: "Kindly Enter all the fields i.e. StudentID, CourseID, Grade" });
        }

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input("StudentID", sql.Int, StudentID)
            .input("CourseID", sql.Int, CourseID)
            .input("Grade", sql.VarChar(10), Grade)
            .query("INSERT INTO Grades (StudentID, CourseID, Grade) OUTPUT INSERTED.* VALUES (@StudentID, @CourseID, @Grade)");

        return res.status(201).json({ message: "Grade added successfully!", grade: result.recordset[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error adding grade", details: err });
    }
});

//10. Announcements
app.post("/announcements/ins", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        const { Message, PostedBy, DepartmentID } = req.body;
        if (!Message || !PostedBy || !DepartmentID) {
            return res.status(400).json({ message: "Kindly enter all the fields i.e. Message, PostedBy, DepartmentID" });
        }

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input("PostedBy", sql.Int, PostedBy)
            .input("DepartmentID", sql.Int, DepartmentID)
            .input("Message", sql.VarChar(500), Message)
            .query("INSERT INTO Announcements (PostedBy, DepartmentID, Message) OUTPUT INSERTED.* VALUES (@PostedBy, @DepartmentID, @Message)");

        return res.status(201).json({ message: "Announcement created successfully!", announcement: result.recordset[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error creating announcement", details: err });
    }
});


//-------------------------------------------READ OPEARTIONS--------------------------------------------

//1. Users
app.get("/allusers", authenticateToken("Admin"), async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT * FROM Users
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No students found" });
        }
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

app.get("/allusers/:id", authenticateToken("Admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input("UserID", sql.Int, id).query("SELECT * FROM Users WHERE UserID = @UserID");
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching user", details: err });
    }
});


//2. Deaprtment
app.get("/alldepts", async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT * FROM Departments
            ORDER BY DepartmentID DESC
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No Departments found" });
        }
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

app.get("/alldepts/:id", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input("DepartmentID", sql.Int, id).query("SELECT * FROM Departments WHERE DepartmentID = @DepartmentID");
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching department", details: err });
    }
});


//3. Faculty
app.get("/allfaculty", async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT * FROM Faculty f JOIN Users u ON f.UserID = u.UserID
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No Faculty found" });
        }
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

app.get("/allfaculty/:id", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input("FacultyID", sql.Int, id)
        // .query("SELECT * FROM Faculty f JOIN Users u ON f.UserID = u.UserID WHERE FacultyID = @FacultyID");
        .query("SELECT * FROM Faculty");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Faculty member not found" });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching faculty member", details: err });
    }
});


//4. Students
app.get("/allstudents", async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT * FROM Students JOIN Users ON Students.UserID = Users.UserID
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No students found" });
        }
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

app.get("/allstudents/:id", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input("StudentID", sql.Int, id)
        .query("SELECT * FROM Students s JOIN Users u ON s.UserID = u.UserID WHERE StudentID = @StudentID");
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching student", details: err });
    }
});


//5. Courses
app.get("/allcourses", authenticateToken(["Admin", "Faculty", "Student"]), async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT * FROM Courses
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No courses found" });
        }
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

app.get("/allcourses/:id", authenticateToken(["Admin", "Faculty", "Student"]), async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input("CourseID", sql.Int, id).query("SELECT * FROM Courses WHERE CourseID = @CourseID");
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching course", details: err });
    }
});


//6. Course Enrollment
app.get("/allcoursesenr", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT * FROM CourseEnrollment
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No courses Enrollments found" });
        }
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

    //For Faculty and Admin
app.get("/allcoursesenr/:studentId", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        const { studentId } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input("StudentID", sql.Int, studentId)
        .query("SELECT * FROM CourseEnrollment WHERE StudentID = @studentId");
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No enrollments found for this student" });
        }
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching enrollments", details: err });
    }
});


//7. Facultycoutses
app.get("/allfcourses", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT u.FullName, fc.AssignmentID, fc.CourseID, fc.FacultyID, fc.Semester
            FROM FacultyCourses fc JOIN Faculty f ON fc.FacultyID=f.FacultyID JOIN Users u ON f.UserID=u.UserID
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No Faculty courses found" });
        }
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

app.get("/allfcourses/:facultyId", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        const { facultyId } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input("FacultyID", sql.Int, facultyId)
        .query("SELECT u.FullName, fc.AssignmentID, fc.CourseID, fc.FacultyID, fc.Semester FROM FacultyCourses fc JOIN Faculty f ON fc.FacultyID=f.FacultyID JOIN Users u ON f.UserID=u.UserID WHERE fc.FacultyID = @FacultyID");
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No courses assigned to this faculty member" });
        }
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching courses for faculty", details: err });
    }
});


//8. Attendance
app.get("/allattendance", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT * FROM Attendance
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No result found" });
        }
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

    //by student id
    app.get("/allattendance/:studentId", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
        try {
            const { studentId } = req.params;
            const pool = await sql.connect(config);
            const result = await pool.request().input("StudentID", sql.Int, studentId)
            .query("SELECT * FROM Attendance WHERE StudentID = @StudentID");
            if (result.recordset.length === 0) {
                return res.status(404).json({ message: "No attendance records found for this student" });
            }
            res.status(200).json(result.recordset);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error fetching attendance for the student", details: err });
        }
    });

    //by course id
    app.get("/allattendance/course/:courseId", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
        try {
            const { courseId } = req.params;
            const pool = await sql.connect(config);
            const result = await pool.request().input("CourseID", sql.Int, courseId).query("SELECT * FROM Attendance WHERE CourseID = @CourseID");
            if (result.recordset.length === 0) {
                return res.status(404).json({ message: "No attendance records found for this course" });
            }
            res.status(200).json(result.recordset);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error fetching attendance for the course", details: err });
        }
    });


//9. Grades
app.get("/allgrades", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT u.FullName, s.StudentID, g.CourseID,c.CourseName, g.Grade
            FROM Grades g JOIN Students s ON g.StudentID=s.StudentID JOIN Users u ON s.UserID=u.UserID JOIN Courses c ON g.CourseID=c.CourseID
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No result found" });
        }
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

app.get("/allgrades/:studentId", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        const { studentId } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input("StudentID", sql.Int, studentId)
        .query("SELECT u.FullName, s.StudentID, g.CourseID,c.CourseName, g.Grade FROM Grades g JOIN Students s ON g.StudentID=s.StudentID JOIN Users u ON s.UserID=u.UserID JOIN Courses c ON g.CourseID=c.CourseID WHERE g.StudentID = @StudentID");
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No grades found for this student" });
        }
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching grades", details: err });
    }
});

//A student can also view his own grades by logging in
app.get("/mygrades", authenticateToken("Student"), async (req, res) => {
    try {
        const userID = req.user.userID; // Get the logged-in user's UserID

        const pool = await sql.connect(config);

        // Fetch StudentID from Students table using the logged-in user's UserID
        const studentResult = await pool.request()
            .input("UserID", sql.Int, userID)
            .query("SELECT StudentID FROM Students WHERE UserID = @UserID");

        if (studentResult.recordset.length === 0) {
            return res.status(404).json({ message: "Student profile not found" });
        }

        const studentID = studentResult.recordset[0].StudentID;

        // Fetch grades for the logged-in student
        const gradesResult = await pool.request()
            .input("StudentID", sql.Int, studentID)
            .query(`
                SELECT u.FullName, s.StudentID, g.CourseID, c.CourseName, g.Grade 
                FROM Grades g 
                JOIN Students s ON g.StudentID = s.StudentID 
                JOIN Users u ON s.UserID = u.UserID 
                JOIN Courses c ON g.CourseID = c.CourseID 
                WHERE g.StudentID = @StudentID
            `);

        if (gradesResult.recordset.length === 0) {
            return res.status(404).json({ message: "No grades found for this student" });
        }

        res.status(200).json(gradesResult.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching grades", details: err });
    }
});

//10. Announcements
app.get("/allannouncements", authenticateToken(["Admin", "Faculty", "Students"]), async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT * FROM Announcements
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No result found" });
        }
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", details: err });
    }
});

app.get("/allannouncements/:departmentId", authenticateToken(["Admin", "Faculty", "Students"]), async (req, res) => {
    try {
        const { departmentId } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input("DepartmentID", sql.Int, departmentId).query("SELECT * FROM Announcements WHERE DepartmentID = @DepartmentID");
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No announcements found for this department" });
        }
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching announcements", details: err });
    }
});


//----------------------------------------UPDATE-----------------------------------------------

//1. update grade of a student in a specific course by student id and courseid
app.put("/students/update-grade/:StudentID/:CourseID", authenticateToken("Faculty"), async (req, res) => {
    try {
        const { Grade } = req.body;
        const { StudentID, CourseID } = req.params;

        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input("Grade", sql.VarChar(10), Grade)
            .input("StudentID", sql.Int, StudentID)
            .input("CourseID", sql.Int, CourseID)
            .query("UPDATE Grades SET Grade = @Grade WHERE StudentID = @StudentID AND CourseID = @CourseID");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Student not found or no grade updated." });
        }

        return res.status(200).json({ message: "Student's grade updated successfully!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error updating grade", details: err });
    }
});


//2. Admin: Can update all fields for any user.
app.put("/users/update/:UserID", authenticateToken("Admin"), async (req, res) => {
    try {
        const { FullName, Email, Password } = req.body;
        const { UserID } = req.params;

        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input("FullName", sql.VarChar(255), FullName)
            .input("Email", sql.VarChar(255), Email)
            .input("Password", sql.VarChar(255), Password)
            .input("UserID", sql.Int, UserID)
            .query("UPDATE Users SET FullName = @FullName, Email = @Email, Password = @Password WHERE UserID = @UserID");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "User not found or no information updated." });
        }

        return res.status(200).json({ message: "User's information updated successfully!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error updating user info", details: err.message || err });
    }
});

//3. Students can update only Password for their own account
app.put("/users/self-update", authenticateToken("Student"), async (req, res) => {
    try {
        const { Password } = req.body;

        if (!Password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(Password, 10);

        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input("Password", sql.VarChar(255), hashedPassword)
            .input("UserID", sql.Int, req.user.userID) // Ensures the logged-in student can only update their own password
            .query("UPDATE Users SET Password = @Password WHERE UserID = @UserID");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "No information updated." });
        }

        return res.status(200).json({ message: "Your password has been updated successfully!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error updating password", details: err.message || err });
    }
});

//4. Only Admin can update course information (like CourseName, Credits, etc.)
app.put("/courses/update/:CourseID", authenticateToken("Admin"), async (req, res) => {
    try {
        const { CourseName, CourseCode, Credits } = req.body;
        const { CourseID } = req.params;

        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input("CourseID", sql.Int, CourseID)
            .input("CourseName", sql.VarChar(255), CourseName)
            .input("CourseCode", sql.VarChar(50), CourseCode)
            .input("Credits", sql.Int, Credits)
            .query("UPDATE Courses SET CourseName = @CourseName, CourseCode = @CourseCode, Credits = @Credits WHERE CourseID = @CourseID");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Course not found or no update performed." });
        }
        return res.status(200).json({ message: "Course updated successfully!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error updating course", details: err });
    }
});

//5. Faculty can update Attendance Status
app.put("/attendance/update/:StudentID/:CourseID/:AttendanceDate", authenticateToken("Faculty"), async (req, res) => {
    try {
        const { Status } = req.body;
        const { StudentID, CourseID, AttendanceDate } = req.params;

        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input("Status", sql.NVarChar(10), Status)
            .input("StudentID", sql.Int, StudentID)
            .input("CourseID", sql.Int, CourseID)
            .input("AttendanceDate", sql.Date, AttendanceDate)
            .query("UPDATE Attendance SET Status = @Status WHERE StudentID = @StudentID AND CourseID = @CourseID AND AttendanceDate = @AttendanceDate");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Attendance record not found or no update performed." });
        }
        return res.status(200).json({ message: "Attendance status updated successfully!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error updating attendance", details: err });
    }
});


//6. Only Admin can update department-related information such as DepartmentName
app.put("/departments/update/:DepartmentID", authenticateToken("Admin"), async (req, res) => {
    try {
        const { DepartmentName } = req.body;
        const { DepartmentID } = req.params;

        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input("DepartmentID", sql.Int, DepartmentID)
            .input("DepartmentName", sql.VarChar(255), DepartmentName)
            .query("UPDATE Departments SET DepartmentName = @DepartmentName WHERE DepartmentID = @DepartmentID");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Department not found or no update performed." });
        }
        return res.status(200).json({ message: "Department updated successfully!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error updating department", details: err });
    }
});

//7. Admin can update the information related to faculty members' DepartmentID.
app.put("/faculty/update/:FacultyID", authenticateToken("Admin"), async (req, res) => {
    try {
        const { DepartmentID } = req.body;
        const { FacultyID } = req.params;

        const pool = await sql.connect(config);

        const result = await pool
            .request()
            .input("DepartmentID", sql.Int, DepartmentID)
            .input("FacultyID", sql.Int, FacultyID)
            .query("UPDATE Faculty SET DepartmentID = @DepartmentID WHERE FacultyID = @FacultyID");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "No department information updated." });
        }

        return res.status(200).json({ message: "Faculty information updated successfully!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error updating faculty information", details: err.message || err });
    }
});

//8. Admin can update the CourseID and semester of the faculty
app.put("/facultyCourses/update/:AssignmentID", authenticateToken("Admin"), async (req, res) => {
    try {
        const { CourseID, Semester } = req.body; 
        const { AssignmentID } = req.params;

        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input("CourseID", sql.Int, CourseID)
            .input("Semester", sql.VarChar(50), Semester)
            .input("AssignmentID", sql.Int, AssignmentID)
            .query("UPDATE FacultyCourses SET CourseID = @CourseID, Semester = @Semester WHERE AssignmentID = @AssignmentID");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Assignment not found or no update performed." });
        }

        return res.status(200).json({ message: "Faculty course assignment updated successfully!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error updating faculty course assignment", details: err });
    }
});

//9. Admin can update the students' Department number and Enrollment Year
app.put("/students/update/:StudentID", authenticateToken("Admin"), async (req, res) => {
    try {
        const { DepartmentID, EnrollmentYear } = req.body;
        const { StudentID } = req.params;

        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input("DepartmentID", sql.Int, DepartmentID)
            .input("EnrollmentYear", sql.Int, EnrollmentYear)
            .input("StudentID", sql.Int, StudentID)
            .query("UPDATE Students SET DepartmentID = @DepartmentID, EnrollmentYear = @EnrollmentYear WHERE StudentID = @StudentID");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Student not found or no update performed." });
        }

        return res.status(200).json({ message: "Student information updated successfully!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error updating student information", details: err });
    }
});



//-------------------------------------------DELETE OPERATIONS------------------------------------------


//1. Admin can delete users by userid
app.delete("/delusers/:id", authenticateToken("Admin"), async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input("UserID", sql.Int, id)
            .query("DELETE FROM Users WHERE UserID = @UserID");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting user", details: err });
    }
});


//2. Delete Student Enrollment (Admin Only)
app.delete("/delcoursesenr/:EnrollmentID", authenticateToken("Admin"), async (req, res) => {
    try {
        const { EnrollmentID } = req.params;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input("EnrollmentID", sql.Int, EnrollmentID)
            .query("DELETE FROM CourseEnrollment WHERE EnrollmentID = @EnrollmentID");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Enrollment record not found" });
        }

        res.status(200).json({ message: "Enrollment record deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting enrollment", details: err });
    }
});

//3. Delete Announcement (Admin or Faculty)
app.delete("/delannouncement/:AnnouncementID", authenticateToken(["Admin", "Faculty"]), async (req, res) => {
    try {
        const { AnnouncementID } = req.params;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input("AnnouncementID", sql.Int, AnnouncementID)
            .input("UserID", sql.Int, req.user.userID)
            .query("DELETE FROM Announcements WHERE AnnouncementID = @AnnouncementID AND PostedBy = @UserID");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        res.status(200).json({ message: "Announcement deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting announcement", details: err });
    }
});


//NO NEED TO FACULTY OR STUDENT FROM FACULTY, FACULTY COURSES OR STUDENTS TABLE 
//AS ALL OF IT CAN BE DELETED BY SIMPLY DELETING THE USER FROM USERS TABLE


//4. Delete Department (Admin Only)
app.delete("/deldept/:DepartmentID", async (req, res) => {
    try {
        const { DepartmentID } = req.params;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input("DepartmentID", sql.Int, DepartmentID)
            .query("DELETE FROM Departments WHERE DepartmentID = @DepartmentID");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.status(200).json({ message: "Department deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting department", details: err });
    }
});


//5. Only Faculty can deleete the student record if by mistaken marked the attendance on the wrong date
app.delete("/delattendance/:AttendanceID", authenticateToken("Faculty"), async (req, res) => {
    try {
        const { AttendanceID } = req.params;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input("AttendanceID", sql.Int, AttendanceID)
            .query("DELETE FROM Attendance WHERE AttendanceID = @AttendanceID");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        res.status(200).json({ message: "Attendance record deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting attendance record", details: err });
    }
});


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })