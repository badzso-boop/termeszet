import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";

const Course = () => {
  const { getOneCourse } = useAdmin();
  const { userId, rang } = useAuth(); // Feltételezve, hogy rang is elérhető
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await getOneCourse(id);
        setCourse(courseData);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, getOneCourse]);

  useEffect(() => {
    if (!course) return;

    const felhasznalok = course.felhasznalok ? JSON.parse(course.felhasznalok) : [];
    const numbers = felhasznalok.match(/\d+/g) || [];

    // Check if numbers array is empty or userId is in the numbers array
    // Or if the user's rank is 'a', then stay on the page
    if (numbers.length === 0 || numbers.includes(userId) || rang === 'a') {
      // User is allowed to stay on the page
      return;
    } else {
      // User is not allowed to stay on the page, navigate to "/"
      navigate("/");
    }
  }, [course, userId, rang, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  const videoUrl = course.video ? `http://localhost:3000/api/video/${course.video}` : null;

  return (
    <>
      <h1>{course.cim}</h1>
      {/* Add other course details here */}
      {videoUrl && (
        <video controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </>
  );
};

export default Course;
