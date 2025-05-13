import React, { useState, useEffect } from 'react';
import FacultyList from './FacultyList';
import FacultyFormModal from './FacultyFormModal';
import PageContainer from 'src/components/container/PageContainer';
import PageHeader from 'src/shared/PageHeader';
import axios from 'axios';

const FacultyPage = () => {
  const [faculty, setFaculty] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 👇 Fetch faculty from backend
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get('/allfaculty');
        setFaculty(response.data);
        const formattedFaculty = response.data.map((dept) => ({
          id: dept.FacultyID,
          name: dept.FullName,
          head: 'N/A',
          courses: 0
        }));
        setFaculty(formattedFaculty);

      } catch (error) {
        console.error('Error fetching faculty:', error);
      }
    };

    fetchFaculty();
  }, []);

  const handleAdd = () => {
    setSelectedFaculty(null);
    setModalOpen(true);
  };

  const handleEdit = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setFaculty(faculty.filter((f) => f.id !== id));
  };

  const handleSubmit = (data) => {
    if (selectedFaculty) {
      setFaculty(
        faculty.map((f) =>
          f.id === selectedFaculty.id ? { ...f, ...data } : f
        )
      );
    } else {
      setFaculty([...faculty, { ...data, id: faculty.length + 1 }]);
    }
    setModalOpen(false);
  };

  return (
    <PageContainer title="Faculty" description="This is admin's faculty page">
      <PageHeader title="Faculty" />
      <FacultyList
        departments={faculty}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <FacultyFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        department={selectedFaculty}
      />
    </PageContainer>
  );
};

export default FacultyPage;