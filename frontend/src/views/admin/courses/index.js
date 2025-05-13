import React, { useEffect, useState } from 'react';
import CoursesList from './CoursesList';
import CoursesFormModal from './CoursesFormModal';
import PageContainer from 'src/components/container/PageContainer';
import PageHeader from 'src/shared/PageHeader';
import { getCoursesWithDepartment } from 'src/services/adminServices';

export const initialDepartments = [
  { id: 1, name: 'Computer Science', head: 'Dr. Ahmed', courses: 25 },
  { id: 2, name: 'Mechanical Engineering', head: 'Dr. Sara', courses: 18 },
  { id: 3, name: 'Electrical Engineering', head: 'Dr. Ali', courses: 20 },
];

const CoursesPage = () => {
  const [data, setData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdd = () => {
    setSelectedDepartment(null);
    setModalOpen(true);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setData(data.filter((dept) => dept.id !== id));
  };

  const handleSubmit = (data) => {
    if (selectedDepartment) {
      setData(
        data.map((dept) =>
          dept.id === selectedDepartment.id ? { ...dept, ...data } : dept,
        ),
      );
    } else {
      setData([...data, { ...data, id: data.length + 1 }]);
    }
    setModalOpen(false);
  };

  useEffect(() => { 
    const fetchCourses = async () => {
      const response = await getCoursesWithDepartment('/courses-with-departments');
      setData(response);
    }
    fetchCourses();
  }, []);

  return (
    <PageContainer title="Courses" description="this is admins Courses page">

      <PageHeader title="Courses" />

      <CoursesList
        courses={data}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <CoursesFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        department={selectedDepartment}
      />
    </PageContainer>
  );
};

export default CoursesPage;
