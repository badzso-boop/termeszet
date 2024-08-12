import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";

import { useAdmin } from "../context/AdminContext";

const Header = () => {
  const {
    users,
    courses,
    registerCourses
  } = useAdmin();
  const [mostRegisteredCourses, setMostRegisteredCOurses] = useState(0)
  const [array, setArray] = useState([])
  const [youngestOldest, setYoungesOldest] = useState({})

  const getMostRegisteredCourse = () => {
    let max = 0
    let maxI = 0
    let arr = []
    for (let i = 0; i < courses.length; i++) {
      if (courses[i].felhasznalok !== null) {
        if (courses[i].felhasznalok !== "[]") {
          const cleanedStr = courses[i].felhasznalok.replace(
            /"(\d+)"/g,
            "$1"
          );
          arr = JSON.parse(cleanedStr);
        }
      }
      if (arr.length > max) {
        max = arr.length
        maxI = i
      }
    }

    return courses[maxI]
  }

  function findYoungestAndOldest(users) {
    if (users.length === 0) {
        return { youngest: null, oldest: null };
    }

    let youngest = users[0];
    let oldest = users[0];

    users.forEach(user => {
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
    setMostRegisteredCOurses(getMostRegisteredCourse())
    if (mostRegisteredCourses) {
      const cleanedStr = mostRegisteredCourses.felhasznalok.replace(
        /"(\d+)"/g,
        "$1"
      );
      setArray(JSON.parse(cleanedStr));
    }
    setYoungesOldest(findYoungestAndOldest(users))
  }, [users, courses]);
  
  return (
    <>
      <div className="w-full border h-[100px] flex flex-wrap">
        <div className="border w-1/2">
          <p>uj felhasznalok</p>
          <p>Regisztrált felhasználók száma: {users.length} db</p>
          <p>Legfiatalabb felhasznalo: {youngestOldest.youngest && youngestOldest.youngest.fullName}</p>
          <p>Legidősebb felhasznalo: {youngestOldest.oldest && youngestOldest.oldest.fullName}</p>
        </div>
        <div className="border w-1/2">
          <p>kurzusok statisztika</p>
          <p>Elérhető kurzusok száma: {courses.length} db</p>
          {mostRegisteredCourses && <p>Legtöbb felhasználó egy kurzuson: {array.length} db (<Link to={`/course/${mostRegisteredCourses.id}`}>{mostRegisteredCourses.cim}</Link>)</p>}
          <p>Kurzusra regisztrált felhasznalok száma: {registerCourses.length} db</p>
        </div>
      </div>
    </>
  );
};

export default Header;
