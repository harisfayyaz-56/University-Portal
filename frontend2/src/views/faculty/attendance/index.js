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

const initialAttendance = [
  {
    id: 1,
    name: 'Alice Johnson',
    date: '2025-05-01',
    status: 'Present',
  },
  {
    id: 2,
    name: 'Bob Smith',
    date: '2025-05-01',
    status: 'Absent',
  },
  {
    id: 3,
    name: 'Charlie Davis',
    date: '2025-05-01',
    status: 'Late',
  },
];

const AttendancePage = () => {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName('');
    setDate('');
    setStatus('');
  };

  const handleSubmit = () => {
    const newRecord = {
      id: Math.max(...attendance.map((a) => a.id)) + 1,
      name,
      date,
      status,
    };
    setAttendance([...attendance, newRecord]);
    handleClose();
  };

  return (
    <PageContainer title="Attendance" description="This is the admin's attendance page">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <PageHeader title="Attendance" />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Attendance
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.id}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>
                  <Typography
                    color={
                      record.status === 'Present'
                        ? 'success.main'
                        : record.status === 'Absent'
                        ? 'error.main'
                        : 'warning.main'
                    }
                  >
                    {record.status}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Attendance Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Attendance</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Status"
            select
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="Present">Present</MenuItem>
            <MenuItem value="Absent">Absent</MenuItem>
            <MenuItem value="Late">Late</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!name || !date || !status}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default AttendancePage;
