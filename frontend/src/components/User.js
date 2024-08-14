import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAdmin } from "../context/AdminContext";

const User = () => {
  const { id } = useParams();
  const {
    getOneUser,
    registerCourses,
    courses,
    fetchRegisteredCoursesUser,
    fetchCoursesUser,
  } = useAdmin();
  const [user, setUser] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getOneUser(id);
        setUser(userData.data.user);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, [getOneUser, id]);

  useEffect(() => {
    const loadData = async () => {
      await fetchCoursesUser();
      await fetchRegisteredCoursesUser();
      setDataLoaded(true);
    };

    if (!dataLoaded) {
      loadData();
    }
  }, [fetchRegisteredCoursesUser, dataLoaded]);

  return (
    <>
      <p>USER</p>
      {user && <p>{user.fullName}</p>}

      {registerCourses.length > 0 ? (
        registerCourses.map((item, index) => {
          if (parseInt(id) === parseInt(item.userId)) {
            const course = courses.find(
              (Citem) => parseInt(Citem.id) === parseInt(item.courseId)
            );

            return <p key={index}>{course.cim}</p>;
          }
        })
      ) : (
        <p>Nem regisztráltál még egy kurzusra sem</p>
      )}
    </>
  );
};

export default User;
