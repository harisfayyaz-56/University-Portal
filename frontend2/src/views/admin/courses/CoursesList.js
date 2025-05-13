import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';

const CoursesList = ({ courses, onEdit, onDelete, onAdd }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button onClick={onAdd} variant="contained" startIcon={<Add />}>
          Add Courses
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Credits</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index+1}</TableCell>
                <TableCell>{item.coursename}</TableCell>
                <TableCell>{item.departmentname}</TableCell>
                <TableCell>{item.credits}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onEdit(item)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => onDelete(item.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CoursesList;
