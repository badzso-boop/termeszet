import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";

const Course = () => {
  const {
    getOneCourse,
    registerCourses,
    users,
    addUser,
    deleteUserRegisteredCourse,
    fetchUsers,
  } = useAdmin();
  const { userId, rang, token } = useAuth(); // Assume 'rang' is also available
  // const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [localRegisterCourses, setLocalRegisterCourses] = useState([]);

  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await getOneCourse(id);
        if (rang === "a") {
          await fetchUsers();
        }
        setCourse(courseData);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, rang]);

  useEffect(() => {
    setLocalRegisterCourses(registerCourses);
    setCourseId(id)
  }, [registerCourses]);

  // useEffect(() => {
  //   if (!course) return;

  //   if (course.felhasznalok !== null) {
  //     const cleanedStr = course.felhasznalok.replace(/"(\d+)"/g, "$1");
  //     arr = JSON.parse(cleanedStr);
  //   }

  //   if (arr.length === 0 || arr.includes(parseInt(userId)) || rang === "a") {
  //     return;
  //   } else {
  //     navigate("/");
  //   }
  // }, [course, userId, rang, navigate]);

  const isUserAllowed = () => {
    return localRegisterCourses.some(item => 
      item.userId === parseInt(userId) &&
      item.courseId === parseInt(id) &&
      item.enabled &&
      item.paid &&
      item.adminPaid
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    navigate('/courses');
    return null;
  }

  // A <video>/<source> tag nem tud Authorization headert küldeni, ezért a tokent
  // query paraméterként adjuk át -- ezt a backend (verifyTokenFromHeaderOrQuery,
  // src/middleware/authMiddleware.js) header helyett/mellett is elfogadja.
  const videoUrl = course.video
    ? `${API_BASE_URL}/api/video/${course.video}?token=${encodeURIComponent(token || "")}`
    : null;

  let arr = [];

  if (course.felhasznalok !== null && course.felhasznalok !== "[]") {
    const cleanedStr = course.felhasznalok.replace(/"(\d+)"/g, "$1");
    arr = JSON.parse(cleanedStr);
  }

  // Function to handle payment
  const handlePayment = async () => {
    let inCourseId = course.id;
    const eredmeny = registerCourses.find(sRegisterCourse =>  parseInt(sRegisterCourse.courseId) === parseInt(inCourseId) && parseInt(sRegisterCourse.userId) === parseInt(userId));
    try {
      const response = await axios.post(`${API_BASE_URL}/api/paid`, {
        CourseRegisterId: eredmeny.id
      });
      setPaymentMessage(response.data.message || "Payment successful.");
    } catch (error) {
      console.log(error)
      setPaymentMessage(
        error.response?.data?.error || "An error occurred while processing the payment."
      );
    }
  };

  return (
    <>
    {course && <div className="ml-4">
      <div className="w-full flex items-center h-full flex-col">
        <div className="p-6 w-full sm:w-3/4 md:w-1/3 text-center mt-12 mb-12 rounded-md border border-secondary/30 bg-secondary/90">
          <h1 className="font-display font-bold text-3xl">{course.cim}</h1>
          <h3 className="italic text-lg text-ink/70">{course.temakor}</h3>
          <div className="divider-gold my-3" />
          <div className="w-full flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 pl-4 text-regular text-center md:text-left">
              {course.helyszin}
            </div>
            <div className="w-full md:w-1/2 pr-4 text-regular text-center md:text-right">
              {course.idopont}
            </div>
          </div>
          <div className="rounded-md p-2">
            <span className="text-regular">{course.leiras}</span>
          </div>
        </div>

        {isUserAllowed() || rang=== "a" ? (
          <div className="w-full">
            <div className="flex flex-col lg:flex-row">
              {/* Video section */}
              <div className="w-full lg:w-1/2 flex justify-center">
                {videoUrl && (
                  <video controls className="m-4 rounded-md max-w-full h-auto" controlsList="nodownload" onContextMenu={(e) => e.preventDefault()}>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              {/* Text section */}
              <div className={`w-full lg:w-1/2 p-4 flex justify-center items-center overflow-auto ${course.szoveg.length > 0 ? "h-[392px]" : null}`}>
                {course.szoveg}
              </div>
            </div>

            {/* Leckék: a kurzushoz tartozó, sorrendezett video+szöveg blokkok */}
            {course.lessons && course.lessons.length > 0 && (
              <div className="w-full flex flex-col items-center mt-6">
                <h2 className="section-heading text-2xl mb-2">Leckék</h2>
                <div className="divider-gold mb-6" />
                <div className="w-full flex flex-col gap-6">
                  {course.lessons.map((lesson) => {
                    const lessonVideoUrl = lesson.video
                      ? `${API_BASE_URL}/api/video/${lesson.video}?token=${encodeURIComponent(token || "")}`
                      : null;
                    return (
                      <div key={lesson.id} className="w-full bg-secondary/90 border border-secondary/30 rounded-md p-4">
                        <h3 className="font-display text-xl font-semibold mb-2 text-center">{lesson.cim}</h3>
                        <div className="flex flex-col lg:flex-row">
                          <div className="w-full lg:w-1/2 flex justify-center">
                            {lessonVideoUrl && (
                              <video controls className="m-4 rounded-md max-w-full h-auto" controlsList="nodownload" onContextMenu={(e) => e.preventDefault()}>
                                <source src={lessonVideoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                          <div className="w-full lg:w-1/2 p-4 flex justify-center items-center overflow-auto">
                            {lesson.szoveg}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full text-center mt-4">
            <p className="bg-beige/40 border border-gold/40 text-ink rounded-md p-4">A videóhoz és a leíráshoz való hozzáférés korlátozott. Kérjük, győződjön meg róla, hogy regisztrált, kifizette a díjat, majd az admin engedélyezte.</p>
          </div>
        )}

        {!isUserAllowed() && <div className="w-full sm:w-3/4 flex justify-center">
          <div className="m-4 w-full sm:w-1/2 text-center flex flex-col bg-secondary/90 border border-secondary/30 rounded-md p-4">
            <span className="font-display text-2xl font-bold">Fizetés</span>
            <div className="divider-gold my-3" />
            <div className="w-full flex flex-col sm:flex-row">
              <div className="w-full sm:w-1/2 flex justify-center p-4">
                <div className="text-left">
                  <h1 className="font-bold text-lg uppercase">Címzett adatai:</h1>
                  <div>
                    <span className="text-regular font-bold">Név:</span>
                    <span className="text-regular"> Ujj Norbert</span>
                  </div>
                  <div>
                    <span className="text-regular font-bold">Számlaszám:</span>
                    <span className="text-regular"> sok szám</span>
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-1/2 flex flex-col sm:flex-row justify-center items-center p-2">
                <span className="font-bold">Közlemény:</span>
                <span className="ml-3 italic">
                  {course.cim}-{course.id}-{userId}
                </span>
              </div>
            </div>

            <div className="w-full flex flex-col sm:flex-row justify-center items-center">
              <div className="w-full sm:w-1/3 flex justify-center p-1">
                <div className="mx-3 rounded-md bg-ivory font-bold p-2 text-center">
                  {course.ar} Ft
                </div>
              </div>
              <div className="w-full sm:w-1/3 flex justify-center p-1">
                <button
                  className="mx-3 btn-brand"
                  onClick={handlePayment}
                >
                  Befizettem!
                </button>
              </div>
            </div>
          </div>
        </div>}

        {paymentMessage && (
          <div className="w-full text-center mt-4">
            <p className="bg-ink text-ivory rounded-md p-4">{paymentMessage}</p>
          </div>
        )}

        {rang === "a" ? (
          <div className="w-full flex flex-col p-4">
            <h1 className="section-heading italic mb-6">
              Admin rész
            </h1>
            <div className="flex flex-col lg:flex-row w-full">
              {/* Left section for users wanting to register */}
              <div className="w-full lg:w-1/2 flex justify-center mb-8 lg:mb-0">
                <div className="w-full px-4">
                  <h1 className="font-display text-2xl font-bold text-center mb-4">
                    Regisztrálni akaró felhasználók
                  </h1>
                  {registerCourses &&
                    registerCourses.map((item, index) => {
                      if (parseInt(id) === item.courseId) {
                        const user = users.find((user) => user.id === item.userId);

                        return (
                          <div key={index} className="border-b-2 border-b-black mb-4">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="border-b-2 border-b-black">
                                  <th className="px-4 py-2 text-center text-sm sm:text-base">Egyedi azonosító</th>
                                  <th className="px-4 py-2 text-center text-sm sm:text-base">Teljes név</th>
                                  <th className="px-4 py-2 text-center text-sm sm:text-base">Felhasználónév</th>
                                  <th className="px-4 py-2 text-center text-sm sm:text-base">Műveletek</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  {user ? (
                                    <>
                                      <td className="border px-4 py-2 text-center text-sm sm:text-base">{user.id}</td>
                                      <td className="border px-4 py-2 text-center text-sm sm:text-base">{user.fullName}</td>
                                      <td className="border px-4 py-2 text-center text-sm sm:text-base">{user.username}</td>
                                      <td className="border px-4 py-2 text-center flex">
                                        <button
                                          className={`${
                                            item.enabled ? "bg-red-500" : "bg-green-500"
                                          } border p-2 mr-2 text-sm sm:text-base`}
                                          onClick={() => {
                                            addUser(user.id, arr, id, item.id, userId);
                                          }}
                                        >
                                          {item.enabled ? "Letilt" : "Engedélyez"}
                                        </button>
                                        <button
                                          className="bg-red-500 border p-2 text-sm sm:text-base"
                                          onClick={() => {
                                            deleteUserRegisteredCourse(userId, item.id);
                                          }}
                                        >
                                          Töröl
                                        </button>
                                      </td>
                                    </>
                                  ) : (
                                    <td className="border px-4 py-2 text-center text-sm sm:text-base" colSpan="4">
                                      Unknown User - {item.courseId}
                                    </td>
                                  )}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        );
                      }

                      return null;
                    })}
                </div>
              </div>
              {/* Right section for already registered users */}
              <div className="w-full lg:w-1/2 text-center px-4">
                <h1 className="font-display text-2xl font-bold mb-4">Már regisztrált felhasználók</h1>
                <div className="flex justify-center">
                  <ul className="list-disc text-left pl-5">
                    {registerCourses &&
                      registerCourses.map((item, index) => {
                        if (parseInt(item.courseId) === parseInt(id) && item.enabled) {
                          const user = users.find((user) => user.id === item.userId);

                          return user ? (
                            <li key={user.id} className="my-2 text-sm sm:text-lg">{user.fullName}</li>
                          ) : null;
                        }
                        return null;
                      })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>}
    </>
  );
};

export default Course;
