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
  const [galleryImages, setGalleryImages] = useState([]);
  const [services, setServices] = useState([]);

  // API base URL from the .env file
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }, []);

  const fetchGalleryImages = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/gallery`, getAuthHeaders());
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.images || [];
      setGalleryImages(data);
      return data;
    } catch (error) {
      console.warn(
        "Could not fetch /api/admin/gallery, attempting fallback to /api/gallery:",
        error
      );
      try {
        const fallback = await axios.get(`${API_BASE_URL}/api/gallery`);
        const data = Array.isArray(fallback.data)
          ? fallback.data
          : fallback.data?.images || [];
        setGalleryImages(data);
        return data;
      } catch (fallbackError) {
        console.error("Error fetching gallery images:", fallbackError);
        return [];
      }
    }
  }, [API_BASE_URL, getAuthHeaders]);

  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/services`, getAuthHeaders());
      const data = Array.isArray(response.data) ? response.data : [];
      setServices(data);
      return data;
    } catch (error) {
      try {
        const fallback = await axios.get(`${API_BASE_URL}/api/services`);
        const data = Array.isArray(fallback.data) ? fallback.data : [];
        setServices(data);
        return data;
      } catch (fallbackError) {
        console.error("Error fetching services:", fallbackError);
        return [];
      }
    }
  }, [API_BASE_URL, getAuthHeaders]);

  const fetchData = useCallback(async () => {
    try {
      const authConfig = getAuthHeaders();
      const users = await axios.post(
        `${API_BASE_URL}/api/admin/users`,
        { userId: userId },
        authConfig
      );

      const courses = await axios.post(
        `${API_BASE_URL}/api/admin/courses`,
        { userId: userId },
        authConfig
      );

      const homeworks = await axios.post(
        `${API_BASE_URL}/api/admin/homeworks`,
        { userId: userId },
        authConfig
      );

      const registerCourses = await axios.post(
        `${API_BASE_URL}/api/admin/registercourses`,
        { userId: userId },
        authConfig
      );

      if (Array.isArray(registerCourses.data)) setRegisterCourses(registerCourses.data);
      if (Array.isArray(users.data)) setUsers(users.data);
      if (Array.isArray(courses.data)) setCourses(courses.data);
      if (Array.isArray(homeworks.data)) setHomeworks(homeworks.data);

      await fetchGalleryImages();
      await fetchServices();
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  }, [userId, API_BASE_URL, fetchGalleryImages, fetchServices, getAuthHeaders]);

  const fetchUsers = useCallback(async () => {
    try {
      const authConfig = getAuthHeaders();
      const users = await axios.post(
        `${API_BASE_URL}/api/admin/users`,
        { userId: userId },
        authConfig
      );

      if (Array.isArray(users.data)) setUsers(users.data);
    } catch (error) {
      console.error("Error fetching admin users:", error);
    }
  }, [userId, API_BASE_URL, getAuthHeaders]);

  const fetchCourses = useCallback(async () => {
    try {
      const authConfig = getAuthHeaders();
      const courses = await axios.post(
        `${API_BASE_URL}/api/admin/courses`,
        { userId: userId },
        authConfig
      );

      if (Array.isArray(courses.data)) setCourses(courses.data);
    } catch (error) {
      console.error("Error fetching admin courses:", error);
    }
  }, [userId, API_BASE_URL, getAuthHeaders]);

  // Publikus kurzuslista a megadott nyelven (ahol nincs fordítás, magyarul).
  const fetchCoursesUser = useCallback(async (lang) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/courses`, { params: lang ? { lang } : {} });
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

    const authConfig = getAuthHeaders();
    const response = await axios.post(
      `${API_BASE_URL}/api/admin/toggleregistercourse`,
      {
        userId: parseInt(adminId),
        id: parseInt(registeredCourseId),
      },
      authConfig
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
    const authConfig = getAuthHeaders();
    const response = await axios.post(
      `${API_BASE_URL}/api/admin/adminpaid`,
      {
        userId: parseInt(adminId),
        CourseRegisterId: parseInt(InputCourseRegisterId),
      },
      authConfig
    );
  
    const registeredCourse = registerCourses.find((item) => item.id === InputCourseRegisterId);

    if (response.status === 200) {
      setRegisterCourses((prevCourses) =>
        prevCourses.map((item) =>
          item.id === registeredCourse.id
            ? { ...item, adminPaid: !registeredCourse.adminPaid }
            : item
        )
      );
    }
  };

  const deleteUserRegisteredCourse = async (userId, id) => {
    const authConfig = getAuthHeaders();
    const response = await axios.post(
      `${API_BASE_URL}/api/admin/deleteregistercourse`,
      {
        userId: parseInt(userId),
        id: parseInt(id),
      },
      authConfig
    );

    if (response.status === 200) {
      setRegisterCourses((prevCourses) =>
        prevCourses.filter((item) => item.id !== id)
      );

      const courses = await axios.post(
        `${API_BASE_URL}/api/admin/courses`,
        { userId: userId },
        authConfig
      );

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
      const authConfig = getAuthHeaders();
      await axios.delete(`${API_BASE_URL}/api/admin/deleteUser`, {
        ...authConfig,
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
      const authConfig = getAuthHeaders();
      await axios.delete(`${API_BASE_URL}/api/admin/deleteCourse`, {
        ...authConfig,
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

  const uploadGalleryImages = async (formData, onProgress) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percent);
        }
      },
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/gallery/upload`,
        formData,
        config
      );
      await fetchGalleryImages();
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const fallbackResponse = await axios.post(
          `${API_BASE_URL}/api/admin/gallery`,
          formData,
          config
        );
        await fetchGalleryImages();
        return fallbackResponse.data;
      }
      throw error;
    }
  };

  const toggleStarGalleryImage = async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/gallery/toggle-star/${id}`,
        {
          userId: userId,
        }
      );
      setGalleryImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? { ...img, isStarred: !img.isStarred, starred: !img.starred }
            : img
        )
      );
      return response.data;
    } catch (error) {
      try {
        const fallback = await axios.put(
          `${API_BASE_URL}/api/admin/gallery/toggle-star/${id}`,
          {
            userId: userId,
          }
        );
        setGalleryImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? { ...img, isStarred: !img.isStarred, starred: !img.starred }
              : img
          )
        );
        return fallback.data;
      } catch (err) {
        console.error("Error toggling star on gallery image:", err);
        throw err;
      }
    }
  };

  // Képcím mentése a megadott nyelven: magyar (alapnyelv) -> az eredeti `title` mező,
  // más nyelv -> fordítás (`translations`). A backend a frissített képet (fordításokkal,
  // állapotokkal) adja vissza, azzal frissítjük a listát.
  const updateGalleryImageTitle = async (id, title, lang = "hu") => {
    const body =
      lang === "hu"
        ? { title, caption: title, userId }
        : { translations: { [lang]: { title } }, userId };
    const applyResponse = (data) =>
      setGalleryImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? data?.image || (lang === "hu" ? { ...img, title, caption: title } : img)
            : img
        )
      );
    try {
      const response = await axios.put(`${API_BASE_URL}/api/admin/gallery/${id}`, body);
      applyResponse(response.data);
      return response.data;
    } catch (error) {
      try {
        const patchRes = await axios.patch(`${API_BASE_URL}/api/admin/gallery/${id}`, body);
        applyResponse(patchRes.data);
        return patchRes.data;
      } catch (err) {
        console.error("Error updating image title:", err);
        throw err;
      }
    }
  };

  const deleteGalleryImage = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/admin/gallery/${id}`,
        {
          data: {
            userId,
            id,
          },
        }
      );
      setGalleryImages((prev) => prev.filter((img) => img.id !== id));
      return response.data;
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      throw error;
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


  const createService = async (formData) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_BASE_URL}/api/admin/services`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    await fetchServices();
    return response.data;
  };

  const updateService = async (id, formData) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_BASE_URL}/api/admin/services/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    await fetchServices();
    return response.data;
  };

  const toggleStarService = async (id) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_BASE_URL}/api/admin/services/toggle-star/${id}`,
      {},
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isStarred: !s.isStarred } : s))
    );
    return response.data;
  };

  const deleteService = async (id) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_BASE_URL}/api/admin/services/${id}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    setServices((prev) => prev.filter((s) => s.id !== id));
    return response.data;
  };

  return (
    <AdminContext.Provider
      value={{
        users,
        courses,
        homeworks,
        registerCourses,
        galleryImages,
        setGalleryImages,
        services,
        setServices,
        fetchServices,
        createService,
        updateService,
        toggleStarService,
        deleteService,
        fetchData,
        fetchUsers,
        fetchCourses,
        fetchCoursesUser,
        fetchGalleryImages,
        uploadGalleryImages,
        toggleStarGalleryImage,
        updateGalleryImageTitle,
        deleteGalleryImage,
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
