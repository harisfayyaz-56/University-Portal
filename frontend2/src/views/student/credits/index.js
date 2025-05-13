import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
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

const initialCredits = [
  {
    id: 1,
    studentName: 'Alice Johnson',
    course: 'Computer Science',
    creditsEarned: 18,
    totalCredits: 24,
  },
  {
    id: 2,
    studentName: 'Bob Smith',
    course: 'Mechanical Engineering',
    creditsEarned: 20,
    totalCredits: 24,
  },
  {
    id: 3,
    studentName: 'Charlie Davis',
    course: 'Business Administration',
    creditsEarned: 15,
    totalCredits: 24,
  },
];

const CreditsPage = () => {
  const [credits, setCredits] = useState(initialCredits);
  const [open, setOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [course, setCourse] = useState('');
  const [creditsEarned, setCreditsEarned] = useState('');
  const [totalCredits, setTotalCredits] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setStudentName('');
    setCourse('');
    setCreditsEarned('');
    setTotalCredits('');
  };

  const handleSubmit = () => {
    const newCredit = {
      id: Math.max(...credits.map((c) => c.id)) + 1,
      studentName,
      course,
      creditsEarned: parseInt(creditsEarned, 10),
      totalCredits: parseInt(totalCredits, 10),
    };

    setCredits([...credits, newCredit]);
    handleClose();
  };

  return (
    <PageContainer title="Credits" description="This is the admin's credits page">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <PageHeader title="Credits" />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Credit Record
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Student Name</strong></TableCell>
              <TableCell><strong>Course</strong></TableCell>
              <TableCell><strong>Credits Earned</strong></TableCell>
              <TableCell><strong>Total Credits</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {credits.map((credit) => (
              <TableRow key={credit.id}>
                <TableCell>{credit.id}</TableCell>
                <TableCell>{credit.studentName}</TableCell>
                <TableCell>{credit.course}</TableCell>
                <TableCell>
                  <Typography
                    color={
                      credit.creditsEarned < credit.totalCredits
                        ? 'warning.main'
                        : 'success.main'
                    }
                  >
                    {credit.creditsEarned}
                  </Typography>
                </TableCell>
                <TableCell>{credit.totalCredits}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Credit Record Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Credit Record</DialogTitle>
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
          <TextField
            margin="dense"
            label="Credits Earned"
            type="number"
            fullWidth
            value={creditsEarned}
            onChange={(e) => setCreditsEarned(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Total Credits"
            type="number"
            fullWidth
            value={totalCredits}
            onChange={(e) => setTotalCredits(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!studentName || !course || !creditsEarned || !totalCredits}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default CreditsPage;
