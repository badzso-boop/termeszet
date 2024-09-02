import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

const User = () => {
  const { id } = useParams();
  const {
    getOneUser,
    registerCourses,
    courses,
    fetchRegisteredCoursesUser,
    fetchCoursesUser,
    parseJsonString,
    removeBackslashes,
  } = useAdmin();

  const [user, setUser] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const beUser = await getOneUser(id);
        const userData = beUser.data.user;

        // Parsált JSON adatokat tartalmazó állapotok frissítése
        setUser({
          ...userData,
          allergies: userData.allergies
            ? Object.entries(
                parseJsonString(removeBackslashes(JSON.parse(userData.allergies) || "{}"))
              )
            : [],
          complaints: userData.complaints
            ? Object.entries(
                parseJsonString(removeBackslashes(JSON.parse(userData.complaints) || "{}"))
              )
            : [],
          courses: userData.courses
            ? Object.entries(
                parseJsonString(removeBackslashes(JSON.parse(userData.courses) || "{}"))
              )
            : [],
          drugs: userData.drugs
            ? Object.entries(
                parseJsonString(removeBackslashes(JSON.parse(userData.drugs) || "{}"))
              )
            : [],
          mutetek: userData.mutetek
            ? Object.entries(
                parseJsonString(removeBackslashes(JSON.parse(userData.mutetek) || "{}"))
              )
            : [],
        });

        setDataLoaded(true);
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

  console.log(user)
  console.log(courses)
  console.log(registerCourses)

  return (
    <>
      {user && (
        <div className="w-full max-w-4xl mx-auto p-4">
          {/* Fejléc - Felhasználói Alapadatok */}
          <div className="bg-secondary text-white p-6 rounded-lg mb-6">
            <h1 className="text-3xl font-bold">{user.fullName}</h1>
            <div className="w-full flex">
              <div className="w-1/2 flex flex-col">
                <div>
                  <span className="text-lg font-bold mr-2">Felhasználónév:</span>
                  <span>{user.username}</span>
                </div>
                <div>
                  <span className="text-lg font-bold mr-2">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div>
                  <span className="text-lg font-bold mr-2">Születési dátum:</span>
                  <span>{user.bornDate}</span>
                </div>
              </div>
              <div className="w-1/2">
                <p className="text-lg font-bold">Leírás:</p>
                <p className="text-regular">{user.description}</p>
              </div>
            </div>
          </div>

          {/* Felhasználói További Információk */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Egészségügyi és egyéb adatok</h2>

            {/* További adatok táblázatos megjelenítése */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Allergiák */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Allergiák</h3>
                {user.allergies.length > 0 ? (
                  user.allergies.map(([key, value], index) => (
                    <p key={index} className="mb-1">
                      <span className="font-bold">{key}:</span> {value}
                    </p>
                  ))
                ) : (
                  <p>-</p>
                )}
              </div>

              {/* Műtétek */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Műtétek</h3>
                {user.mutetek.length > 0 ? (
                  user.mutetek.map(([key, value], index) => (
                    <p key={index} className="mb-1">
                      <span className="font-bold">{key}:</span> {value}
                    </p>
                  ))
                ) : (
                  <p>-</p>
                )}
              </div>

              {/* Amalgán tömés */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Amalgán tömés</h3>
                <p>{user.amalganFilling ? "Van" : "Nincs"}</p>
              </div>

              {/* Gyógyszerek */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Gyógyszerek</h3>
                {user.drugs.length > 0 ? (
                  user.drugs.map(([key, value], index) => (
                    <p key={index} className="mb-1">
                      <span className="font-bold">{key}:</span> {value}
                    </p>
                  ))
                ) : (
                  <p>-</p>
                )}
              </div>

              {/* Panaszok */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Panaszok</h3>
                {user.complaints.length > 0 ? (
                  user.complaints.map(([key, value], index) => (
                    <p key={index} className="mb-1">
                      <span className="font-bold">{key}:</span> {value}
                    </p>
                  ))
                ) : (
                  <p>-</p>
                )}
              </div>

              {/* Célok */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Célok</h3>
                <p>{user.goal ? user.goal : "Nincs megadva"}</p>
              </div>

              {/* Kurzusok */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Kurzusok</h3>
                {user.courses.length > 0 ? (
                  user.courses.map(([key, value], index) => (
                    <p key={index} className="mb-1">
                      <span className="font-bold">{key}:</span> {value}
                    </p>
                  ))
                ) : (
                  <p>-</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


      <h1>Kurzusaim</h1>
      {user && registerCourses.map((item, index) => {
        if (item.userId === user.id) {
          const course = courses.find((course) => course.id === item.courseId);

          console.log(course)
        }
      })}

    </>
  );
};

export default User;
