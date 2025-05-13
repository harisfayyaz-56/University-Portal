import { errorToast, successToast } from 'src/shared/Toast';
import axios from '../utils/axios';

// 1. Create Department
const createDepartment = async (values) => {
  const payload = {
    DepartmentName: values.departmentName,
  };
  try {
    const { data } = await axios.post('/departments/ins', payload);

    if (data?.status) {
      successToast(data.message);
      return data;
    } else {
      errorToast(data.message);
    }
  } catch (error) {
    console.log('error', error);
    errorToast('Something went wrong!');
  }
};

const deleteDepartment = async (values) => {
  try {
    console.log(values);
    const {id}=values;
    const { data } = await axios.delete(`/deldept/${id}`);

    if (data?.status) {
      successToast(data.message);
      return data;
    } else {
      errorToast(data.message);
    }
  } catch (error) {
    console.log('error', error);
    errorToast('Something went wrong!');
  }
};

const editDepartment = async (values) => {
  try {
    console.log(values);
    const {id}=values;
    const { data } = await axios.delete(`/departments/update/${id}`);

    if (data?.status) {
      successToast(data.message);
      return data;
    } else {
      errorToast(data.message);
    }
  } catch (error) {
    console.log('error', error);
    errorToast('Something went wrong!');
  }
};

//2. Create Courses
const createCourses = async (values) => {
  const payload = {
    CourseName: values.CourseName,
    CourseCode: values.CourseCode,
    DepartmentID: values.DepartmentID,
    Credits: values.Credits,
  };
  try {
    const { data } = await axios.post('/courses/ins', payload);

    if (data?.status) {
      successToast(data.message);
      return data;
    } else {
      errorToast(data.message);
    }
  } catch (error) {
    console.log('error', error);
    errorToast('Something went wrong!');
  }
};


const getCoursesWithDepartment = async () => {
  try {
    const { data } = await axios.get('/courses-with-departments');

    if (data?.status) {
      successToast(data.message);
      return data?.data;
    } else {
      errorToast(data.message);
    }
  } catch (error) {
    console.log('error', error);
    errorToast('Something went wrong!');
  }
};

const getallDepartment = async () => {
  try {
    const { data } = await axios.get('/alldepts');

    if (data?.status) {
      successToast(data.message);
      return data?.data;
    } else {
      errorToast(data.message);
    }
  } catch (error) {
    console.log('error', error);
    errorToast('Something went wrong!');
  }
};


const getAttendanceSummary = async () => {
  try {
    const { data } = await axios.get('/attendance-summary');
    return data;
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    errorToast('Unable to fetch attendance summary.');
  }
};

const getLowAttendanceStudents = async () => {
  try {
    const { data } = await axios.get('/low_attendance');
    return data;
  } catch (error) {
    console.error('Error fetching low attendance:', error);
    errorToast('Unable to fetch low attendance students.');
  }
};


const getFacultyCourses = async () => {
  try {
    const { data } = await axios.get('/faculty-courses');
    return data;
  } catch (error) {
    console.error('Error fetching faculty courses:', error);
    errorToast('Unable to fetch faculty courses.');
  }
};


const getStudentsTotalCredits = async () => {
  try {
    const { data } = await axios.get('/students-total-credits');
    return data;
  } catch (error) {
    console.error('Error fetching student credits:', error);
    errorToast('Unable to fetch student total credits.');
  }
};


const getStudentsNotEnrolled = async () => {
  try {
    const { data } = await axios.get('/students/not-enr');
    return data;
  } catch (error) {
    console.error('Error fetching unenrolled students:', error);
    errorToast('Unable to fetch unenrolled students.');
  }
};



export {
  createDepartment,
  getCoursesWithDepartment,
  getAttendanceSummary,
  getLowAttendanceStudents,
  getFacultyCourses,
  getStudentsTotalCredits,
  getStudentsNotEnrolled,
  getallDepartment,
  deleteDepartment,
};
