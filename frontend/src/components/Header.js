import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAdmin } from "../context/AdminContext";

const Header = () => {
  const { users, courses, registerCourses } = useAdmin();
  const [mostRegisteredCourses, setMostRegisteredCOurses] = useState(0);
  const [array, setArray] = useState([]);
  const [youngestOldest, setYoungesOldest] = useState({});

  const getMostRegisteredCourse = () => {
    let max = 0;
    let maxI = 0;
    let arr = [];
    for (let i = 0; i < courses.length; i++) {
      if (courses[i].felhasznalok !== null) {
        if (courses[i].felhasznalok !== "[]") {
          const cleanedStr = courses[i].felhasznalok.replace(/"(\d+)"/g, "$1");
          arr = JSON.parse(cleanedStr);
        }
      }
      if (arr.length > max) {
        max = arr.length;
        maxI = i;
      }
    }

    return courses[maxI];
  };

  function findYoungestAndOldest(users) {
    if (users.length === 0) {
      return { youngest: null, oldest: null };
    }

    let youngest = users[0];
    let oldest = users[0];

    users.forEach((user) => {
      if (new Date(user.bornDate) > new Date(youngest.bornDate)) {
        youngest = user;
      }
      if (new Date(user.bornDate) < new Date(oldest.bornDate)) {
        oldest = user;
      }
    });

    return { youngest, oldest };
  }

  useEffect(() => {
    setMostRegisteredCOurses(getMostRegisteredCourse());
    if (mostRegisteredCourses) {
      const cleanedStr = mostRegisteredCourses.felhasznalok.replace(
        /"(\d+)"/g,
        "$1"
      );
      setArray(JSON.parse(cleanedStr));
    }
    setYoungesOldest(findYoungestAndOldest(users));
  }, [users, courses]);

  return (
    <>
      <div className="w-full my-4 px-2 sm:px-4 lg:px-6">
        <h1 className="text-center text-2xl font-bold mb-4">Statisztikák</h1>

        <div className="flex flex-wrap justify-center gap-4">
          {/* Felhasználói statisztika */}
          <div className="w-full sm:w-[calc(50%-1rem)] bg-secondary text-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Új felhasználók</h2>
            <p>Regisztrált felhasználók száma: {users.length} db</p>
            {youngestOldest.youngest && (
              <p>
                <Link
                  to={`/user/${youngestOldest.youngest.id}`}
                  className="text-white hover:text-gray-300"
                >
                  Legfiatalabb felhasználó: <span className="underline">{youngestOldest.youngest.fullName}</span>
                </Link>
              </p>
            )}
            {youngestOldest.oldest && (
              <p>
                <Link
                  to={`/user/${youngestOldest.oldest.id}`}
                  className="text-white hover:text-gray-300"
                >
                  Legidősebb felhasználó: <span className="underline">{youngestOldest.oldest.fullName}</span>
                </Link>
              </p>
            )}
          </div>

          {/* Kurzus statisztika */}
          <div className="w-full sm:w-[calc(50%-1rem)] bg-secondary text-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Kurzusok statisztika</h2>
            <p>Elérhető kurzusok száma: {courses.length} db</p>
            {mostRegisteredCourses && (
              <p>
                Legtöbb felhasználó egy kurzuson: {array.length} db (
                <Link
                  to={`/course/${mostRegisteredCourses.id}`}
                  className="text-white underline hover:text-gray-300"
                >
                  {mostRegisteredCourses.cim}
                </Link>
                )
              </p>
            )}
            <p>Kurzusra regisztrált felhasználók száma: {registerCourses.length} db</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
