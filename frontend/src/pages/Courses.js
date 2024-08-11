import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAdmin } from "../context/AdminContext";
import { useAuth } from "../context/AuthContext";

const Courses = () => {
  const { userId, rang } = useAuth();
  const { courses, fetchCoursesUser, registerCourse } = useAdmin();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchCoursesUser();
      setDataLoaded(true);
    };

    if (!dataLoaded) {
      loadData();
    }
  }, [fetchCoursesUser, dataLoaded]);

  return (
    <>
      <div className="w-full border bg-primary">
        <p className="text-center uppercase text-3xl font-bold mt-3">
          kurzusok
        </p>
        <div className="flex flex-wrap border w-full justify-center">
          {courses.map((item) => (
            <div
              key={item.id}
              className="flex flex-col border w-full lg:w-1/5 md:w-1/4 my-3 items-center min-h-[350px] m-4 rounded-xl p-3 bg-secondary"
            >
              <div className="w-3/4 text-center">
                <Link
                  className="text-lg uppercase font-bold"
                  to={`/course/${item.id}`}
                >
                  {item.cim}
                </Link>
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
                ) : item.felhasznalok && item.felhasznalok.includes(userId) ? (
                  <Link
                    to={`/course/${item.id}`}
                    className="m-1 w-full bg-red-600 rounded-full text-center text-base p-1 bg-primary cursor-pointer"
                  >
                    Megtekintem
                  </Link>
                ) : (
                  <div
                    className="m-1 w-full bg-red-600 rounded-full text-center text-base p-1 bg-primary cursor-pointer"
                    onClick={async () => {
                      const result = await registerCourse(userId, item.id);
                      if (result === "success") {
                        alert("Sikeresen regisztráltál a kurzusra!");
                      } else if (result === "registered") {
                        alert("Már regisztráltál erre a kurzusra");
                      } else {
                        alert("Valami hiba történt");
                      }
                    }}
                  >
                    Regisztrálok!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Courses;
