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

const initialCourses = [
  {
    id: 101,
    courseName: 'Introduction to AI',
    instructor: 'Dr. Alan Turing',
    credits: 3,
    status: 'Active',
  },
  {
    id: 102,
    courseName: 'Thermodynamics',
    instructor: 'Dr. Marie Curie',
    credits: 4,
    status: 'Inactive',
  },
  {
    id: 103,
    courseName: 'Marketing 101',
    instructor: 'Dr. Philip Kotler',
    credits: 2,
    status: 'Active',
  },
];

const CoursesPage = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [open, setOpen] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [credits, setCredits] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCourseName('');
    setInstructor('');
    setCredits('');
  };

  const handleSubmit = () => {
    const newCourse = {
      id: Math.max(...courses.map((c) => c.id)) + 1,
      courseName,
      instructor,
      credits: parseInt(credits, 10),
      status: 'Active',
    };

    setCourses([...courses, newCourse]);
    handleClose();
  };

  return (
    <PageContainer title="Courses" description="This is the admin's courses page">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <PageHeader title="Courses" />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Course
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Course Name</strong></TableCell>
              <TableCell><strong>Instructor</strong></TableCell>
              <TableCell><strong>Credits</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.id}</TableCell>
                <TableCell>{course.courseName}</TableCell>
                <TableCell>{course.instructor}</TableCell>
                <TableCell>{course.credits}</TableCell>
                <TableCell>
                  <Chip
                    label={course.status}
                    color={course.status === 'Active' ? 'success' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Course Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Course Name"
            fullWidth
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Instructor"
            fullWidth
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Credits"
            type="number"
            fullWidth
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!courseName || !instructor || !credits}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default CoursesPage;
