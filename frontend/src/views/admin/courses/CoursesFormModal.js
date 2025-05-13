import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const CoursesFormModal = ({ open, onClose, onSubmit, department }) => {
  const [formData, setFormData] = useState({ name: '', head: '', courses: '' });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        head: department.head,
        courses: department.courses.toString(),
      });
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({ name: '', head: '', courses: '' });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6">{department ? 'Edit' : 'Add'} Courses</Typography>
        <TextField
          label="Department Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Department Head"
          name="head"
          value={formData.head}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Number of Courses"
          name="courses"
          type="number"
          value={formData.courses}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button onClick={handleSubmit} variant="contained" sx={{ mt: 2 }}>
          {department ? 'Update' : 'Add'} Department
        </Button>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: 24,
};

export default CoursesFormModal;
