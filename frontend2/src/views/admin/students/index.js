import React, { useEffect, useState } from 'react';
import StudentsList from './StudentsList';
import StudentsFormModal from './StudentsFormModal';
import PageContainer from 'src/components/container/PageContainer';
import PageHeader from 'src/shared/PageHeader';
import axios from 'axios';
import {
  getAttendanceSummary,
  getFacultyCourses,
  getLowAttendanceStudents,
} from '../../../services/adminServices';


const StudentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        console.log("fetching...");
        const response = await axios.get('/allstudents');
        console.log(response.data);
        setDepartments(response.data);
        const formattedFaculty = response.data.map((dept) => ({
          id: dept.StudentID,
          name: dept.FullName,
          head: 'N/A',
          courses: 0
        }));
        setDepartments(formattedFaculty);

      } catch (error) {
        console.error('Error fetching faculty:', error);
      }
    };

    fetchStudent();
  }, []);


  const handleAdd = () => {
    setSelectedDepartment(null);
    setModalOpen(true);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
  };

  const handleSubmit = (data) => {
    if (selectedDepartment) {
      setDepartments(
        departments.map((dept) =>
          dept.id === selectedDepartment.id ? { ...dept, ...data } : dept,
        ),
      );
    } else {
      setDepartments([...departments, { ...data, id: departments.length + 1 }]);
    }
    setModalOpen(false);
  };

 

  return (
    <PageContainer title="Students" description="this is admins Students page">

      <PageHeader title="Students" />

      <StudentsList
        departments={departments}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <StudentsFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        department={selectedDepartment}
      />
    </PageContainer>
  );
};

export default StudentsPage;
