import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import DepartmentList from './DepartmentList';
import DepartmentFormModal from './DepartmentFormModal';
import PageContainer from 'src/components/container/PageContainer';
import PageHeader from 'src/shared/PageHeader';
import axios from 'axios';
import { deleteDepartment } from 'src/services/adminServices';


const DepartmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/alldepts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Format the department objects (add dummy values for head and courses)
        const formattedDepartments = response.data.map((dept) => ({
          id: dept.DepartmentID,
          name: dept.DepartmentName,
          head: 'N/A',
          courses: 0
        }));

        setDepartments(formattedDepartments);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleAdd = () => {
    setSelectedDepartment(null);
    setModalOpen(true);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setModalOpen(true);
  };


  const handleDelete = async(id) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
     const result = await deleteDepartment({ id })
    
  };

  const handleSubmit = (data) => {
    if (selectedDepartment) {
      setDepartments(
        departments.map((dept) =>
          dept.id === selectedDepartment.id ? { ...dept, ...data } : dept
        )
      );
    } else {
      setDepartments([...departments, { ...data, id: departments.length + 1 }]);
    }
    setModalOpen(false);
  };

  return (
    <PageContainer title="Departments" description="This is admin's departments page">
      <PageHeader title="Departments" />
      <DepartmentList
        departments={departments}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <DepartmentFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        department={selectedDepartment}
      />
    </PageContainer>
  );
};

export default DepartmentPage;
