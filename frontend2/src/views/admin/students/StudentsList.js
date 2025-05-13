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

const FacultyList = ({ departments, onEdit, onDelete, onAdd }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button onClick={onAdd} variant="contained" startIcon={<Add />}>
          Add Students
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Head</TableCell>
              <TableCell>Courses</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell>{dept.id}</TableCell>
                <TableCell>{dept.name}</TableCell>
                <TableCell>{dept.head}</TableCell>
                <TableCell>{dept.courses}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onEdit(dept)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => onDelete(dept.id)}>
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

export default FacultyList;
