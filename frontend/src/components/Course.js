import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";

const Course = () => {
  const { getOneCourse, registerCourses, users, addUser, deleteUserRegisteredCourse } = useAdmin();
  const { userId, rang } = useAuth(); // Feltételezve, hogy rang is elérhető
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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

    if (course.felhasznalok !== null) {
      const cleanedStr = course.felhasznalok.replace(/"(\d+)"/g, "$1");
      arr = JSON.parse(cleanedStr);
    }

    if (arr.length === 0 || arr.includes(parseInt(userId)) || rang === "a") {
      return;
    } else {
      navigate("/");
    }
  }, [course, userId, rang, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  const videoUrl = course.video
    ? `${API_BASE_URL}/api/video/${course.video}`
    : null;

  let arr = [];
  
  if (course.felhasznalok !== null && course.felhasznalok !== "[]") {
    const cleanedStr = course.felhasznalok.replace(/"(\d+)"/g, "$1");
    arr = JSON.parse(cleanedStr);
  }

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

      {rang === "a" ? (
        <>
          <h1>Már regisztrált felhasználók</h1>

          {typeof(arr) === "object" ? (
            arr.map((item, index) => <p key={index}>{item}</p>)
          ) : (
            <p>No registered users.</p>
          )}

          <h1>Regisztrálni akaró felhasználók</h1>
          {registerCourses &&
            registerCourses.map((item, index) => {
              if (parseInt(id) === item.courseId) {
                const user = users.find((user) => user.id === item.userId);

                return (
                  <h1 key={index}>
                    {user
                      ? `${user.id} - ${user.fullName} - ${user.username}`
                      : `Unknown User - ${item.courseId}`}{" "}
                    <button
                      className="bg-green-500 border p-2"
                      onClick={() => {
                        addUser(user.id, arr, id, item.id, userId);
                      }}
                    >
                      Hozzáad
                    </button>
                    <button className="bg-red-500 border p-2" onClick={() => {
                      deleteUserRegisteredCourse(userId, item.id)
                    }}>Töröl</button>
                  </h1>
                );
              }

              return null;
            })}
        </>
      ) : null}
    </>
  );
};

export default Course;
