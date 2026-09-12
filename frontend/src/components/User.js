import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { Link } from "react-router-dom";

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
  }, [getOneUser, id, parseJsonString, removeBackslashes]);

  useEffect(() => {
    const loadData = async () => {
      await fetchCoursesUser();
      await fetchRegisteredCoursesUser();
      setDataLoaded(true);
    };

    if (!dataLoaded) {
      loadData();
    }
  }, [fetchRegisteredCoursesUser, dataLoaded, fetchCoursesUser]);

  return (
    <>
      {user && (
        <div className="w-full max-w-4xl mx-auto p-4">
          {/* Fejléc - Felhasználói Alapadatok */}
          <div className="bg-secondary text-ink p-6 rounded-md border border-secondary/30 mb-6">
            <h1 className="font-display text-3xl font-semibold">{user.fullName}</h1>
            <div className="divider-gold my-3" />
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
          <div className="bg-white p-6 rounded-md border border-secondary/20">
            <h2 className="font-display text-2xl font-semibold mb-4">Egészségügyi és egyéb adatok</h2>

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


      <div className="w-full flex flex-col justify-center items-center text-center py-12">
        <h1 className="section-heading mb-4">Kurzusaim</h1>
        <div className="divider-gold mb-8" />

        {user && registerCourses.map((item, index) => {
          if (item.userId === user.id) {
            const course = courses.find((course) => course.id === item.courseId);
            return (
              <>
                <div className="bg-secondary/90 border border-secondary/30 w-full lg:w-1/3 rounded-md my-3 p-4">
                  <h1 className="font-display font-semibold text-xl">{course.cim}</h1>
                  <div className="w-full flex">
                    <div className="w-1/2 p-2">
                      <p className="text-left">{course.helyszin}</p>
                    </div>
                    <div className="w-1/2 p-2">
                      <p className="text-right">{course.idopont}</p>
                    </div>
                  </div>

                  <h1 className="font-semibold text-lg">Leírás</h1>
                  <p>{course.description}</p>

                  <div className="w-full flex justify-center mt-2">
                    <Link to={`/course/${course.id}`} className="m-1 w-full lg:w-1/3 btn-brand py-2 text-sm cursor-pointer">Megtekintem</Link>
                  </div>
                </div>
              </>
            )
          }
          return <></>
        })}

      </div>

    </>
  );
};

export default User;
