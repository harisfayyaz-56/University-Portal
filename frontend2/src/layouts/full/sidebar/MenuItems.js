import { uniqueId } from 'lodash';
import { Dashboard, Group, School, Book, Person, Assignment, Class } from '@mui/icons-material';

// Admin Menu
export const AdminMenuItems = [
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: <Dashboard />,
    href: '/admin/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Departments',
    icon: <Group />,
    href: '/admin/departments',
  },
  {
    id: uniqueId(),
    title: 'Faculty',
    icon: <Person />,
    href: '/admin/faculty',
  },
  {
    id: uniqueId(),
    title: 'Students',
    icon: <School />,
    href: '/admin/students',
  },
  {
    id: uniqueId(),
    title: 'Courses',
    icon: <Class />,
    href: '/admin/courses',
  },
];

// Student Menu
export const StudentMenuItems = [
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: <Dashboard />,
    href: '/student/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Enrollments',
    icon: <Book />,
    href: '/student/enrollments',
  },
  {
    id: uniqueId(),
    title: 'Grades',
    icon: <School />,
    href: '/student/grades',
  },
  {
    id: uniqueId(),
    title: 'Credits',
    icon: <Class />,
    href: '/student/credits',
  },
];

// Faculty Menu
export const FacultyMenuItems = [
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: <Dashboard />,
    href: '/faculty/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Students',
    icon: <School />,
    href: '/faculty/students',
  },
  {
    id: uniqueId(),
    title: 'Assignments',
    icon: <Assignment />,
    href: '/faculty/assignments',
  },
  {
    id: uniqueId(),
    title: 'Attendance',
    icon: <Person />,
    href: '/faculty/attendance',
  },
];