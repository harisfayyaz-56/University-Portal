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
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import PageHeader from 'src/shared/PageHeader';

const initialAssignments = [
  {
    id: 1,
    title: 'Math Homework',
    dueDate: '2025-05-05',
    status: 'Pending',
  },
  {
    id: 2,
    title: 'Science Project',
    dueDate: '2025-05-10',
    status: 'Submitted',
  },
  {
    id: 3,
    title: 'History Essay',
    dueDate: '2025-05-08',
    status: 'Overdue',
  },
];

const AssigmentsPage = () => {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setDueDate('');
    setStatus('');
  };

  const handleSubmit = () => {
    const newAssignment = {
      id: Math.max(...assignments.map((a) => a.id)) + 1,
      title,
      dueDate,
      status,
    };
    setAssignments([...assignments, newAssignment]);
    handleClose();
  };

  return (
    <PageContainer title="Assignments" description="This is the admin's assignments page">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <PageHeader title="Assignments" />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Assignment
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Due Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>{assignment.id}</TableCell>
                <TableCell>{assignment.title}</TableCell>
                <TableCell>{assignment.dueDate}</TableCell>
                <TableCell>
                  <Typography
                    color={
                      assignment.status === 'Pending'
                        ? 'warning.main'
                        : assignment.status === 'Submitted'
                        ? 'success.main'
                        : 'error.main'
                    }
                  >
                    {assignment.status}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Assignment Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Assignment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Status"
            select
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Submitted">Submitted</MenuItem>
            <MenuItem value="Overdue">Overdue</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!title || !dueDate || !status}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default AssigmentsPage;
