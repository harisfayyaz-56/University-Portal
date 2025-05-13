import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import PageHeader from 'src/shared/PageHeader';

const initialEnrollments = [
  {
    id: 1,
    studentName: 'Alice Johnson',
    course: 'Introduction to AI',
    semester: 'Spring 2025',
    status: 'Confirmed',
  },
  {
    id: 2,
    studentName: 'Bob Smith',
    course: 'Thermodynamics',
    semester: 'Spring 2025',
    status: 'Pending',
  },
  {
    id: 3,
    studentName: 'Charlie Davis',
    course: 'Marketing 101',
    semester: 'Spring 2025',
    status: 'Cancelled',
  },
];

const EnrollmentPage = () => {
  const [enrollments, setEnrollments] = useState(initialEnrollments);
  const [open, setOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [course, setCourse] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setStudentName('');
    setCourse('');
  };

  const handleSubmit = () => {
    const newEnrollment = {
      id: enrollments.length + 1,
      studentName,
      course,
      semester: 'Spring 2025', // hardcoded for now; can make selectable if needed
      status: 'Pending', // default status
    };

    setEnrollments([...enrollments, newEnrollment]);
    handleClose();
  };

  return (
    <PageContainer title="Enrollments" description="This is the admin's enrollments page">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <PageHeader title="Enrollments" />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Enroll in Course
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Student Name</strong></TableCell>
              <TableCell><strong>Course</strong></TableCell>
              <TableCell><strong>Semester</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments.map((enrollment) => (
              <TableRow key={enrollment.id}>
                <TableCell>{enrollment.id}</TableCell>
                <TableCell>{enrollment.studentName}</TableCell>
                <TableCell>{enrollment.course}</TableCell>
                <TableCell>{enrollment.semester}</TableCell>
                <TableCell>
                  <Chip
                    label={enrollment.status}
                    color={
                      enrollment.status === 'Confirmed'
                        ? 'success'
                        : enrollment.status === 'Pending'
                        ? 'warning'
                        : 'error'
                    }
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Enroll Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enroll in Course</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Student Name"
            fullWidth
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Course"
            fullWidth
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!studentName || !course}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default EnrollmentPage;