import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

import { useAuth } from "./AuthContext";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const { userId } = useAuth();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [registerCourses, setRegisterCourses] = useState([]);

  // API base URL from the .env file
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchData = async () => {
    try {
      const users = await axios.post(`${API_BASE_URL}/api/admin/users`, {
        userId: userId,
      });

      const courses = await axios.post(`${API_BASE_URL}/api/admin/courses`, {
        userId: userId,
      });

      const homeworks = await axios.post(
        `${API_BASE_URL}/api/admin/homeworks`,
        {
          userId: userId,
        }
      );

      const registerCourses = await axios.post(
        `${API_BASE_URL}/api/admin/registercourses`,
        {
          userId: userId,
        }
      );

      setRegisterCourses(registerCourses.data);
      setUsers(users.data);
      setCourses(courses.data);
      setHomeworks(homeworks.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await axios.post(`${API_BASE_URL}/api/admin/users`, {
        userId: userId,
      });

      setUsers(users.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const courses = await axios.post(`${API_BASE_URL}/api/admin/courses`, {
        userId: userId,
      });

      setCourses(courses.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const fetchCoursesUser = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/courses`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses data:", error);
    }
  }, [API_BASE_URL]); 

  const fetchRegisteredCoursesUser = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/registercourses`);
      setRegisterCourses(response.data);
    } catch (error) {
      console.error("Error fetching registered courses data:", error);
    }
  }, [API_BASE_URL]);

  const registerCourse = async (userId, courseId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/registercourse`, {
        userId: userId,
        courseId: courseId,
      });
      if (response.status === 200) {
        return "success"; // Visszatérési érték siker esetén
      } else if (response.status === 201) {
        return "registered";
      }
    } catch (error) {
      console.error("Error registering course:", error);
      return "error"; // Visszatérési érték hiba esetén
    }
  };

  const getOneUser = async (userId) => {
    const user = await axios.post(`${API_BASE_URL}/api/user`, {
      userId: userId,
    });

    return user;
  };

  const addUser = async (
    userId,
    felhasznalok,
    id,
    registeredCourseId,
    adminId
  ) => {
    if (!felhasznalok.includes(userId)) {
      felhasznalok.push(userId);
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/admin/toggleregistercourse`,
      {
        userId: parseInt(adminId),
        id: parseInt(registeredCourseId),
      }
    );

    const registeredCourse = registerCourses.find(
      (item) => item.id === registeredCourseId
    );

    if (response.status === 200) {
      setRegisterCourses((prevCourses) =>
        prevCourses.map((item) =>
          item.id === registeredCourseId
            ? { ...item, enabled: !registeredCourse.enabled }
            : item
        )
      );
    }
  };

  const payToggle = async (InputCourseRegisterId) => {
    // POST kérés az API végpontra
    const response = await axios.post(`${API_BASE_URL}/api/paid`, {
      CourseRegisterId: parseInt(InputCourseRegisterId),
    });
  
    // Megkeressük a regisztrált kurzust
    const registeredCourse = registerCourses.find((item) => item.id === InputCourseRegisterId);
  
    if (response.status === 200) {
      setRegisterCourses((prevCourses) =>
        prevCourses.map((item) =>
          item.id === registeredCourse.id
            ? { ...item, paid: !registeredCourse.paid } // paid tulajdonság változtatása
            : item
        )
      );
    }
  };

  const adminPayToggle = async (InputCourseRegisterId, adminId) => {
    // POST kérés az API végpontra
    const response = await axios.post(`${API_BASE_URL}/api/admin/adminpaid`, {
      userId: parseInt(adminId),
      CourseRegisterId: parseInt(InputCourseRegisterId),
    });
  
    // Megkeressük a regisztrált kurzust
    const registeredCourse = registerCourses.find((item) => item.id === InputCourseRegisterId);

    if (response.status === 200) {
      setRegisterCourses((prevCourses) =>
        prevCourses.map((item) =>
          item.id === registeredCourse.id
            ? { ...item, adminPaid: !registeredCourse.adminPaid } // paid tulajdonság változtatása
            : item
        )
      );
    }
  };

  const deleteUserRegisteredCourse = async (userId, id) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/admin/deleteregistercourse`,
      {
        userId: parseInt(userId),
        id: parseInt(id),
      }
    );

    if (response.status === 200) {
      setRegisterCourses((prevCourses) =>
        prevCourses.filter((item) => item.id !== id)
      );

      const courses = await axios.post(`${API_BASE_URL}/api/admin/courses`, {
        userId: userId,
      });

      setCourses(courses.data);
    }
  };

  const getOneCourse = async (courseId) => {
    const id = typeof courseId === "string" ? parseInt(courseId, 10) : courseId;
    const course = courses.find((course) => course.id === id);
    return course;
  };

  const deleteUser = async (userIdToDelete, adminId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/deleteUser`, {
        data: {
          userId: adminId,
          id: userIdToDelete,
        },
      });
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const deleteCourse = async (courseIdToDelete, adminId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/deleteCourse`, {
        data: {
          userId: adminId,
          id: courseIdToDelete,
        },
      });
      await fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const parseJsonString = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return {};
    }
  };

  function removeBackslashes(inputString) {
    return inputString;
  }

  const stringifyJsonObject = (jsonObject) => {
    console.log(jsonObject);
    console.log(JSON.stringify(jsonObject));
    return JSON.stringify(jsonObject);
  };

  return (
    <AdminContext.Provider
      value={{
        users,
        courses,
        homeworks,
        registerCourses,
        fetchData,
        fetchUsers,
        fetchCourses,
        fetchCoursesUser,
        getOneUser,
        getOneCourse,
        deleteUser,
        deleteCourse,
        parseJsonString,
        stringifyJsonObject,
        removeBackslashes,
        registerCourse,
        addUser,
        payToggle,
        adminPayToggle,
        deleteUserRegisteredCourse,
        fetchRegisteredCoursesUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
