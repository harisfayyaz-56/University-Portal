import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import PageHeader from 'src/shared/PageHeader';

const initialStudents = [
  {
    id: 1,
    name: 'Alice Johnson',
    grade: '10',
    section: 'A',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Bob Smith',
    grade: '11',
    section: 'B',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    name: 'Charlie Davis',
    grade: '12',
    section: 'A',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
  },
];

const StudentPage = () => {
  const [students, setStudents] = useState(initialStudents);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName('');
    setGrade('');
    setSection('');
    setAvatarUrl('');
  };

  const handleSubmit = () => {
    const newStudent = {
      id: Math.max(...students.map((s) => s.id)) + 1,
      name,
      grade,
      section,
      avatarUrl: avatarUrl || 'https://i.pravatar.cc/150',
    };

    setStudents([...students, newStudent]);
    handleClose();
  };

  return (
    <PageContainer title="Student" description="This is the admin's student page">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <PageHeader title="Student" />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Student
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Grade</strong></TableCell>
              <TableCell><strong>Section</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar src={student.avatarUrl} sx={{ mr: 2 }} />
                    <Typography>{student.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell>{student.section}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Student Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Student</DialogTitle>
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
            label="Grade"
            fullWidth
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Section"
            fullWidth
            value={section}
            onChange={(e) => setSection(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Avatar URL (optional)"
            fullWidth
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!name || !grade || !section}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default StudentPage;
