import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpa } from "@fortawesome/free-solid-svg-icons";

import { useAdmin } from "../context/AdminContext";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

const Courses = () => {
  const { userId, rang } = useAuth();
  const {
    courses,
    fetchCoursesUser,
    registerCourse,
    registerCourses,
    fetchRegisteredCoursesUser,
  } = useAdmin();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [localRegisterCourses, setLocalRegisterCourses] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCoursesUser(), fetchRegisteredCoursesUser()]);
      setDataLoaded(true);
    };

    if (!dataLoaded) {
      loadData();
    }
  }, [dataLoaded, fetchCoursesUser, fetchRegisteredCoursesUser]);

  useEffect(() => {
    setLocalRegisterCourses(registerCourses);
  }, [registerCourses]);

  const searchEnabledUser = (beUserId, beCourseId) => {
    return localRegisterCourses.some(
      (item) =>
        parseInt(item.userId) === parseInt(beUserId) &&
        item.enabled &&
        parseInt(item.courseId) === parseInt(beCourseId)
    );
  };

  const searchNotEnabledUser = (beUserId, beCourseId) => {
    return localRegisterCourses.some(
      (item) =>
        parseInt(item.userId) === parseInt(beUserId) &&
        !item.enabled &&
        parseInt(item.courseId) === parseInt(beCourseId)
    );
  };


  const handleRegistration = async (courseId) => {
    const result = await registerCourse(userId, courseId);
    if (result === "success") {
      setLocalRegisterCourses((prev) => [
        ...prev,
        { userId, courseId, enabled: false, paid: false },
      ]);
      console.log("Sikeresen regisztráltál a kurzusra!");
    } else if (result === "registered") {
      console.log("Már regisztráltál erre a kurzusra");
    } else {
      console.log("Valami hiba történt");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full flex-1 border bg-primary">
        <p className="text-center uppercase text-3xl font-bold mt-3">
          kurzusok
        </p>
        <div className="flex flex-wrap border w-full justify-center">
          {dataLoaded && courses.length === 0 && (
            <div className="flex flex-col items-center text-center w-full sm:w-2/3 lg:w-1/2 my-10 mx-4 p-8 rounded-xl bg-secondary">
              <FontAwesomeIcon icon={faSpa} className="text-5xl mb-4" />
              <p className="text-xl font-semibold mb-2">
                Jelenleg nincsenek elérhető kurzusok
              </p>
              <p className="text-base">
                Hamarosan új kurzusokkal jelentkezünk – nézz vissza később, vagy iratkozz fel a hírlevélre a főoldalon, hogy elsőként értesülj róluk!
              </p>
            </div>
          )}
          {courses.map((item) => (
            <div
              key={item.id}
              className="flex flex-col border w-full lg:w-1/5 md:w-1/4 my-3 items-center min-h-[350px] m-4 rounded-xl p-3 bg-secondary"
            >
              <div className="w-3/4 text-center">
                <p
                  className="text-lg uppercase font-bold"
                  
                >
                  {item.cim}
                </p>
                <div className="text-base">
                  {item.temakor !== "" ? item.temakor : "\u00A0"}
                </div>
              </div>
              <div className="w-full flex flex-col md:flex-row text-xl border-b-4 border-b-primary m-2">
                <div className="w-full md:w-1/2 text-base text-left">
                  {item.helyszin}
                </div>
                <div className="w-full md:w-1/2 text-base text-right">
                  {item.idopont}
                </div>
              </div>
              <div className="m-3 min-h-[250px]">{item.leiras}</div>
              <div className="flex w-full flex-col justify-center items-center p-1 mt-auto">
                <div className="m-1 w-full bg-red-600 rounded-full text-center text-base p-1 bg-primary">
                  {item.ar} Ft
                </div>

                {rang === "a" ? (
                  <Link
                    to={`/course/${item.id}`}
                    className="m-1 w-full bg-red-600 rounded-full text-center text-base p-1 bg-primary cursor-pointer"
                  >
                    Megtekintem
                  </Link>
                ) : userId === null ? (
                  <Link
                    to="/register"
                    className="m-1 w-full bg-red-600 rounded-full text-center text-base p-1 bg-primary"
                  >
                    Felhasználó létrehozása!
                  </Link>
                ) : localRegisterCourses && searchEnabledUser(userId, item.id) ? (
                  <Link
                    to={`/course/${item.id}`}
                    className="m-1 w-full bg-red-600 rounded-full text-center text-base p-1 bg-primary cursor-pointer"
                  >
                    Megtekintem
                  </Link>
                ) : localRegisterCourses && searchNotEnabledUser(userId, item.id) ? (
                  <div className="m-1 w-full bg-red-600 rounded-full text-center text-base p-1 bg-primary">
                    Már regisztráltál!
                  </div>
                ) : (
                  <div
                    className="m-1 w-full bg-red-600 rounded-full text-center text-base p-1 bg-primary cursor-pointer"
                    onClick={() => handleRegistration(item.id)}
                  >
                    Regisztrálok!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Courses;
