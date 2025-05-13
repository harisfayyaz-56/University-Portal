import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { createDepartment } from 'src/services/adminServices';

const DepartmentFormModal = ({ open, onClose, onSubmit, department }) => {
  const [formData, setFormData] = useState({ name: '', head: '', courses: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        head: department.head,
        courses: department.courses.toString(),
      });
      setErrors({});
    } else {
      setFormData({ name: '', head: '', courses: '' });
    }
  }, [department]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Department name is required.';
    // if (!formData.head.trim()) newErrors.head = 'Department head is required.';
    // if (!formData.courses.trim()) {
    //   newErrors.courses = 'Number of courses is required.';
    // } else if (!/^\d+$/.test(formData.courses) || parseInt(formData.courses, 10) < 0) {
    //   newErrors.courses = 'Courses must be a non-negative integer.';
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (validate()) {
      onSubmit({ ...formData, courses: parseInt(formData.courses, 10) });
      setFormData({ name: '', head: '', courses: '' });
      setErrors({});

      const result = await createDepartment({ departmentName: formData.name })
      
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6">{department ? 'Edit' : 'Add'} Department</Typography>
        <TextField
          label="Department Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
        />
        {/* <TextField
          label="Department Head"
          name="head"
          value={formData.head}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.head}
          helperText={errors.head}
        />
        <TextField
          label="Number of Courses"
          name="courses"
          type="number"
          value={formData.courses}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.courses}
          helperText={errors.courses}
        /> */}
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

export default DepartmentFormModal;
