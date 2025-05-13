import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import AuthGuard from 'src/views/authentication/auth/AuthGuard';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import DepartmentPage from 'src/views/admin/departments';

/* **Layouts*** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ***Admin Pages**** */
const AdminDashboard = Loadable(lazy(() => import('../views/admin/dashboard')));
const Departments = Loadable(lazy(() => import('../views/admin/departments')));
const Faculty = Loadable(lazy(() => import('../views/admin/faculty')));
const Students = Loadable(lazy(() => import('../views/admin/students')));
const Courses = Loadable(lazy(() => import('../views/admin/courses')));

/* ***Faculty Pages**** */
const FacultyDashboard = Loadable(lazy(() => import('../views/faculty/dashboard')));
const FacultyAssignment = Loadable(lazy(() => import('../views/faculty/assignments')));
const FacultyAttendance = Loadable(lazy(() => import('../views/faculty/attendance')));
const FacultyStudent = Loadable(lazy(() => import('../views/faculty/student')));

/* ***Student Pages**** */
const StudentDashboard = Loadable(lazy(() => import('../views/student/dashboard')));
const StudentEnrollments = Loadable(lazy(() => import('../views/student/enrollments')));
const StudentGrades = Loadable(lazy(() => import('../views/student/grades')));
const StudentCredits = Loadable(lazy(() => import('../views/student/credits')));


const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));


const Router = [
  {
    path: '/',
    element: <Navigate to="/auth/login" />,
  },

  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: 'login', element: <Login /> },
    ],
  },

  // Admin Routes
  {
    path: '/admin',
    element: (
      <AuthGuard role="admin">
        <FullLayout />
      </AuthGuard>
    ),
    children: [
      { path: '', element: <Navigate to="dashboard" /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'departments', element: <Departments /> },
      { path: 'faculty', element: <Faculty /> },
      { path: 'students', element: <Students /> },
      { path: 'courses', element: <Courses /> },
    ],
  },

  // Student Routes
  {
    path: '/student',
    element: (
      <AuthGuard role="student">
         <FullLayout />
      </AuthGuard>
    ),
    children: [
      { path: '', element: <Navigate to="dashboard" /> },
      { path: 'dashboard', element: <StudentDashboard /> },
      { path: 'enrollments', element: <StudentEnrollments /> },
      { path: 'grades', element: <StudentGrades /> },
      { path: 'credits', element: <StudentCredits /> },

    ],
  },

  // Faculty Routes
  {
    path: '/faculty',
    element: (
      <AuthGuard role="faculty">
        <FullLayout />
      </AuthGuard>
    ),
    children: [
      { path: '', element: <Navigate to="dashboard" /> },
      { path: 'dashboard', element: <FacultyDashboard /> },
      { path: 'assignments', element: <FacultyAssignment /> },
      { path: 'attendance', element: <FacultyAttendance /> },
      { path: 'students', element: <FacultyStudent /> },

    ],
  },

  { path: '*', element: <Error /> },
];


export default Router;