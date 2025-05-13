-- Create the Database
CREATE DATABASE UniversityManagementSystem;
GO

-- Use the Database
USE UniversityManagementSystem;
GO

SELECT * FROM Users

-- 1. Users Table
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    FullName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(50) CHECK (Role IN ('Student', 'Faculty', 'Admin')) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE() NOT NULL
);
GO

SELECT * FROM Departments
-- 2. Departments Table
CREATE TABLE Departments (
    DepartmentID INT PRIMARY KEY IDENTITY(1,1),
    DepartmentName VARCHAR(255) UNIQUE NOT NULL
);
GO

SELECT * FROM Faculty
-- 3. Faculty Table
CREATE TABLE Faculty (
    FacultyID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT UNIQUE NOT NULL,
    DepartmentID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID) ON DELETE CASCADE
);
GO

SELECT * FROM Students
-- 4. Students Table
CREATE TABLE Students (
    StudentID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT UNIQUE NOT NULL,
    DepartmentID INT NOT NULL,
    EnrollmentYear INT NOT NULL CHECK (EnrollmentYear BETWEEN 1900 AND YEAR(GETDATE())), --no enrollment below 1900 or above year than the current one
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID) ON DELETE CASCADE
);
GO

SELECT * FROM Courses
-- 5. Courses Table
CREATE TABLE Courses (
    CourseID INT PRIMARY KEY IDENTITY(1,1),
    CourseName VARCHAR(255) NOT NULL,
    CourseCode VARCHAR(50) UNIQUE NOT NULL,
    DepartmentID INT NOT NULL,
    Credits INT CHECK (Credits BETWEEN 1 AND 6),
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID) ON DELETE CASCADE
);
GO

SELECT * FROM CourseEnrollment
-- 6. Course Enrollment Table
CREATE TABLE CourseEnrollment (
    EnrollmentID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT NOT NULL,
    CourseID INT NOT NULL,
    EnrollmentDate DATETIME DEFAULT GETDATE(),
    Grade VARCHAR(5) NULL,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID) ON DELETE NO ACTION,
    CONSTRAINT UQ_StudentCourse UNIQUE (StudentID, CourseID) -- Prevent duplicate enrollments, SUBJECT TO ALTER
);
GO

-- 7. Faculty Course Assignment Table
CREATE TABLE FacultyCourses (
    AssignmentID INT PRIMARY KEY IDENTITY(1,1),
    FacultyID INT NOT NULL,
    CourseID INT NOT NULL,
    Semester VARCHAR(50) NOT NULL,
    FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID) ON DELETE NO ACTION,
    CONSTRAINT UQ_FacultyCourseSemester UNIQUE (FacultyID, CourseID, Semester) -- Prevent duplicate assignments, SUBJECT TO ALTER
);
GO
SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_NAME='Announcements'

-- 8. Attendance Table
CREATE TABLE Attendance (
    AttendanceID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT NOT NULL,
    CourseID INT NOT NULL,
    AttendanceDate DATE NOT NULL,
    Status NVARCHAR(10) CHECK (Status IN ('Present', 'Absent', 'Late')),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE NO ACTION, --NOW ON DELETE< UPDATE => CASCADE
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID) ON DELETE NO ACTION,
    CONSTRAINT UQ_StudentCourseAttendance UNIQUE (StudentID, CourseID, AttendanceDate) -- Prevent duplicate attendance records
);
GO
ALTER TABLE Attendance 
ADD CONSTRAINT FK_Attendance_StudentID FOREIGN KEY (StudentID) 
REFERENCES Students(StudentID) ON DELETE CASCADE ON UPDATE CASCADE;

-- 9. Grades Table
CREATE TABLE Grades (
    GradeID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT NOT NULL,
    CourseID INT NOT NULL,
    Grade VARCHAR(5),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE NO ACTION,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID) ON DELETE NO ACTION,
    CONSTRAINT UQ_StudentCourseGrade UNIQUE (StudentID, CourseID) -- Prevent duplicate grades, SUBJECT TO ALTER
);
GO
ALTER TABLE Grades 
ADD CONSTRAINT FK_Grades_StudentID FOREIGN KEY (StudentID) 
REFERENCES Students(StudentID) ON DELETE CASCADE;

-- 10. Announcements Table
CREATE TABLE Announcements (
    AnnouncementID INT PRIMARY KEY IDENTITY(1,1),
    PostedBy INT NOT NULL,  --UserID
    DepartmentID INT NULL,
    Message VARCHAR(1000) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (PostedBy) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID) ON DELETE NO ACTION
);
GO
-- Sample Data Insertion (Optional)
-- Insert sample data to test the schema
INSERT INTO Departments (DepartmentName) VALUES ('Computer Science'), ('Mathematics'), ('Physics');
INSERT INTO Users (FullName, Email, Password, Role) VALUES 
('John Doe', 'john.doe@example.com', 'password123', 'Student'),
('Jane Smith', 'jane.smith@example.com', 'password123', 'Faculty'),
('Admin User', 'admin@example.com', 'admin123', 'Admin'),
('Duke', 'duke@example.com', 'dukeforyou', 'Student'),
('Minahil Abbasi', 'minahil@example.com', 'Askari11fs', 'Faculty'),
('Moeez Ijaz', 'moeez@example.com', 'bahawalpur', 'Student');

INSERT INTO Students (UserID, DepartmentID, EnrollmentYear) VALUES 
(1, 1, 2020),
(4, 1, 2022),
(11, 5, 2020);
INSERT INTO Students (UserID, DepartmentID, EnrollmentYear) VALUES 
(15, 5, 2023)

INSERT INTO Faculty (UserID, DepartmentID) VALUES 
(2, 1), 
(13, 4);
INSERT INTO Faculty (UserID, DepartmentID) VALUES 
(14, 5)

INSERT INTO Courses (CourseName, CourseCode, DepartmentID, Credits) VALUES 
('Introduction to Programming', 'CS101', 1, 3),
('Calculus I', 'MATH101', 2, 4);

INSERT INTO CourseEnrollment (StudentID, CourseID) VALUES 
(7, 1),
(2, 1);

INSERT INTO FacultyCourses (FacultyID, CourseID, Semester) VALUES (5, 1, 'Fall 2023');
INSERT INTO Attendance (StudentID, CourseID, AttendanceDate, Status) VALUES 
(1, 1, '2023-10-01', 'Present'),
(1, 1, '2023-10-03', 'Present'),
(2, 1, '2023-10-03', 'Absent');
INSERT INTO Grades (StudentID, CourseID, Grade) VALUES (1, 1, 'A');
INSERT INTO Announcements (PostedBy, DepartmentID, Message) VALUES (3, 1, 'Welcome to the new academic year!');
INSERT INTO Announcements (PostedBy, DepartmentID, Message) VALUES (9, 4, 'Welcome!'), (9, 1, 'Hello to all');

-- Insert sample data into Departments Table
INSERT INTO Departments (DepartmentName) VALUES 
('Electrical Engineering'),
('Mechanical Engineering'),
('Business Administration');

-- Insert sample data into Users Table
INSERT INTO Users (FullName, Email, Password, Role) VALUES 
('Alice Johnson', 'alice.johnson@example.com', 'alice2023', 'Student'),
('Bob Lee', 'bob.lee@example.com', 'bobsafe', 'Faculty'),
('Sarah Connor', 'sarah.connor@example.com', 'strongpassword', 'Admin'),
('Eve Watson', 'eve.watson@example.com', 'watsonxyz', 'Student'),
('James Brown', 'james.brown@example.com', 'james1234', 'Faculty');
INSERT INTO Users (FullName, Email, Password, Role) VALUES 
('hahahahaha', 'hehehehe@example.com', 'alsdfserfg023', 'Faculty')

-- Insert sample data into Students Table
INSERT INTO Students (UserID, DepartmentID, EnrollmentYear) VALUES 
(5, 3, 2022),
(8, 2, 2023);

-- Insert sample data into Faculty Table
INSERT INTO Faculty (UserID, DepartmentID) VALUES 
(9, 4),
(6, 2);

-- Insert sample data into Courses Table
INSERT INTO Courses (CourseName, CourseCode, DepartmentID, Credits) VALUES 
('Data Structures', 'CS201', 1, 4),
('Linear Algebra', 'MATH201', 2, 3),
('Thermodynamics', 'ME201', 2, 4),
('Marketing Principles', 'BA101', 3, 3);
INSERT INTO Courses (CourseName, CourseCode, DepartmentID, Credits) VALUES 
('TBW', 'TB204', 6, 2)

-- Insert sample data into Course Enrollment Table
INSERT INTO CourseEnrollment (StudentID, CourseID) VALUES 
(2, 2),
(2, 3),
(8, 4),
(7, 2);

-- Insert sample data into FacultyCourses Table
INSERT INTO FacultyCourses (FacultyID, CourseID, Semester) VALUES 
(5, 3, 'Fall 2023');
INSERT INTO FacultyCourses (FacultyID, CourseID, Semester) VALUES 
(8, 5, 'Fall 2023')
INSERT INTO FacultyCourses (FacultyID, CourseID, Semester) VALUES 
(7, 6, 'Fall 2023'),
(7, 5, 'Spring 2024'),
(7, 1, 'Summer 2022');

-- Insert sample data into Attendance Table
INSERT INTO Attendance (StudentID, CourseID, AttendanceDate, Status) VALUES 
(1, 1, '2024-03-01', 'Present'),
(1, 2, '2024-03-02', 'Late'),
(2, 3, '2024-03-01', 'Absent'),
(7, 4, '2024-03-01', 'Present');

-- Insert sample data into Grades Table
INSERT INTO Grades (StudentID, CourseID, Grade) VALUES 
(1, 2, 'B+'),
(2, 3, 'B'),
(7, 4, 'A-');

-- Insert sample data into Announcements Table
INSERT INTO Announcements (PostedBy, DepartmentID, Message) VALUES 
(3, 1, 'Midterm exams will be held next week.'),
(3, 2, 'Welcome to the Spring 2024 semester!'),
(3, NULL, 'Campus maintenance is scheduled for the weekend. Please avoid restricted areas.');


---------------------------------------------------QUERIES-------------------------------------

--1. List All Students Enrolled in a Specific Course
SELECT s.StudentID, u.FullName,u.Email, C.CourseName, ce.EnrollmentDate
FROM Students s
JOIN CourseEnrollment ce ON s.StudentID = ce.StudentID
JOIN Courses C ON ce.CourseID = C.CourseID
JOIN Users u ON s.UserID=u.UserID
WHERE C.CourseCode = 'CS101';  -- Replace with desired CourseCode

--2. Top 5 Students by Grade in a Course
SELECT TOP 5 u.FullName AS studentName, g.Grade
FROM Grades g
JOIN Students s ON g.StudentID = s.StudentID
JOIN Users u ON s.UserID = u.UserID
JOIN Courses c ON g.CourseID = c.CourseID
WHERE c.CourseCode = 'CS101'  -- Replace with desired CourseCode
ORDER BY g.Grade DESC;


--3. Faculty Course Assignments for a Given Semester
SELECT u.FullName AS facultyName, c.CourseName, fc.Semester
FROM FacultyCourses fc
JOIN Faculty f ON fc.FacultyID = f.FacultyID
JOIN Users u ON f.UserID = u.UserID
JOIN Courses c ON fc.CourseID = c.CourseID
WHERE fc.Semester = 'Fall 2023';  -- Replace with desired semester


--4. List of Students in a Department
SELECT u.FullName AS studentName, d.DepartmentName, s.EnrollmentYear
FROM Students s
JOIN Users u ON s.UserID = u.UserID
JOIN Departments d ON s.DepartmentID = d.DepartmentID
WHERE d.DepartmentName = 'Computer Science';  -- Replace with desired department


--5. Announcements for a Specific Department
SELECT a.Message, a.CreatedAt, u.FullName AS postedBy
FROM Announcements a
JOIN Users u ON a.PostedBy = u.UserID
JOIN Departments d ON a.DepartmentID = d.DepartmentID
WHERE d.DepartmentName = 'Computer Science'  -- Replace with desired department name
ORDER BY a.CreatedAt DESC;

--6. Courses Offered by Each Department
SELECT d.DepartmentName, c.CourseName, c.Credits
FROM Courses c
JOIN Departments d ON c.DepartmentID = d.DepartmentID
ORDER BY d.DepartmentName;


--7. Attendance Summary of a particular student in a particular course
SELECT u.FullName AS studentName, c.CourseName, SUM(CASE WHEN a.Status = 'Present' THEN 1 ELSE 0 END) AS presentCount,
		SUM(CASE WHEN a.Status = 'Absent' THEN 1 ELSE 0 END) AS absentCount
FROM Attendance a
JOIN Students s ON a.StudentID = s.StudentID
JOIN Users u ON s.UserID = u.UserID
JOIN Courses c ON a.CourseID = c.CourseID
GROUP BY u.FullName, c.CourseName;


--8. List of Students Who Have Not Met Attendance Threshold (Below 80%) as per FAST-NUCES
SELECT u.FullName AS studentName, 
       SUM(CASE WHEN a.Status = 'Present' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.AttendanceID) AS attendancePercentage
FROM Attendance a
JOIN Students s ON a.StudentID = s.StudentID
JOIN Users u ON s.UserID = u.UserID
GROUP BY u.FullName
HAVING SUM(CASE WHEN a.Status = 'Present' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.AttendanceID) < 80;


--9 List of All Faculty members and their courses
SELECT u.FullName AS facultyName, c.CourseName, fc.Semester
FROM FacultyCourses fc
JOIN Faculty f ON fc.FacultyID = f.FacultyID
JOIN Users u ON f.UserID = u.UserID
JOIN Courses c ON fc.CourseID = c.CourseID
ORDER BY u.FullName, fc.Semester;


--10 Total Credit hours of a student
SELECT u.FullName AS studentName, SUM(c.Credits) AS totalCredits
FROM Students s
JOIN Users u ON s.UserID = u.UserID
JOIN CourseEnrollment ce ON s.StudentID = ce.StudentID
JOIN Courses c ON ce.CourseID = c.CourseID
GROUP BY u.FullName;

--Students who have not enrolled in any of the course
SELECT u.FullName, s.StudentID
FROM Students s
JOIN Users u ON s.UserID = u.UserID
WHERE s.StudentID NOT IN (
    SELECT ce.StudentID
    FROM CourseEnrollment ce
)

-------------------------------VIEWS----------------------------

--View for all enrollments of every user
CREATE VIEW vw_studentEnrollments AS
SELECT u.FullName AS studentName, c.CourseName, ce.EnrollmentDate
FROM Students s
JOIN Users u ON s.UserID = u.UserID
JOIN CourseEnrollment ce ON s.StudentID = ce.StudentID
JOIN Courses c ON ce.CourseID = c.CourseID;

--View for for the assigned courses of faculty and the year
CREATE VIEW vw_facultyAssignments AS
SELECT u.FullName AS facultyName, c.CourseName, fc.Semester
FROM FacultyCourses fc
JOIN Faculty f ON fc.FacultyID = f.FacultyID
JOIN Users u ON f.UserID = u.UserID
JOIN Courses c ON fc.CourseID = c.CourseID;

--View for all the summary of Attendance of all Students
CREATE VIEW vw_attendanceSummary AS
SELECT u.FullName AS studentName, c.CourseName, SUM(CASE WHEN a.Status = 'Present' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.AttendanceID) AS attendancePercentage
FROM Attendance a
JOIN Students s ON a.StudentID = s.StudentID
JOIN Users u ON s.UserID = u.UserID
JOIN Courses c ON a.CourseID = c.CourseID
GROUP BY u.FullName, c.CourseName;


--View for students enrolled in a specific Department
CREATE VIEW vw_departmentStudents AS
SELECT u.FullName, s.EnrollmentYear, d.DepartmentName
FROM Students s
JOIN Users u ON s.UserID = u.UserID
JOIN Departments d ON s.DepartmentID = d.DepartmentID;

SELECT * FROM Users
SELECT * FROM Departments
SELECT * FROM Faculty
SELECT * FROM Students
SELECT * FROM Courses
SELECT * FROM CourseEnrollment
SELECT * FROM FacultyCourses
SELECT * FROM Attendance
SELECT * FROM Grades
SELECT * FROM Announcements

---------------ADDITIONAL QUERIES--------------------

SELECT d.DepartmentName, u.FullName, AVG(g.Grade) AS AvgGrade
FROM Grades g
JOIN Students s ON g.StudentID = s.StudentID
JOIN Users u ON s.UserID = u.UserID
JOIN Departments d ON s.DepartmentID = d.DepartmentID
GROUP BY d.DepartmentName, u.FullName
ORDER BY d.DepartmentName, AvgGrade DESC;

--All Faculty members
SELECT u.FullName, fc.AssignmentID, fc.CourseID, fc.FacultyID, fc.Semester
FROM FacultyCourses fc JOIN Faculty f ON fc.FacultyID=f.FacultyID JOIN Users u ON f.UserID=u.UserID

--Grades of all students
SELECT u.FullName, s.StudentID, g.CourseID,c.CourseName, g.Grade
FROM Grades g JOIN Students s ON g.StudentID=s.StudentID JOIN Users u ON s.UserID=u.UserID JOIN Courses c ON g.CourseID=c.CourseID

--Count Users per Role – Find out how many students, faculty, and admins are registered.
SELECT Role, COUNT(*) AS UserCount
FROM Users
GROUP BY Role;

--Faculty count per department
SELECT d.DepartmentName, COUNT(f.FacultyID) AS FacultyCount
FROM Departments d
LEFT JOIN Faculty f ON d.DepartmentID = f.DepartmentID
GROUP BY d.DepartmentName;

--Student count per department
SELECT d.DepartmentName, COUNT(s.StudentID) AS StudentCount
FROM Departments d
LEFT JOIN Students s ON d.DepartmentID = s.DepartmentID
GROUP BY d.DepartmentName;

--Departments with no courses
SELECT d.DepartmentName
FROM Departments d
LEFT JOIN Courses c ON d.DepartmentID = c.DepartmentID
WHERE c.CourseID IS NULL;

--Course Load Analysis – Find out how many courses each student is enrolled in.
SELECT s.StudentID, u.FullName, COUNT(ce.CourseID) AS CourseCount
FROM Students s
JOIN Users u ON s.UserID = u.UserID
LEFT JOIN CourseEnrollment ce ON s.StudentID = ce.StudentID
GROUP BY s.StudentID, u.FullName;

--Attendance % for each student in a course
SELECT a.StudentID, u.FullName, a.CourseID, 
       (SUM(CASE WHEN a.Status = 'Present' THEN 1 ELSE 0 END) * 100.0) / COUNT(*) AS AttendancePercentage
FROM Attendance a
JOIN Users u ON a.StudentID = (SELECT StudentID FROM Students WHERE UserID = u.UserID)
GROUP BY a.StudentID, u.FullName, a.CourseID;

DECLARE @Keyword VARCHAR(100) = 'exam'; -- Change to desired keyword

--Keyword Search – Search for announcements containing specific keywords (e.g., “exam,” “holiday”).
SELECT * 
FROM Announcements
WHERE Message LIKE '%' + @Keyword + '%';

SELECT u.UserID, ce.EnrollmentID, u.FullName, ce.courseID, ce.EnrollmentDate FROM CourseEnrollment ce JOIN Students s ON ce.StudentID=s.StudentID JOIN Users u ON s.UserID=u.UserID

