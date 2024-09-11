import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faUserPlus,
  faSquarePlus
} from "@fortawesome/free-solid-svg-icons";

import Header from "../components/Header";

import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";

const Admin = () => {
  const { rang, userId } = useAuth();
  const {
    users,
    courses,
    fetchData,
    deleteUser,
    deleteCourse,
    registerCourses,
    addUser,
    payToggle,
    deleteUserRegisteredCourse,
  } = useAdmin();
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (rang !== "a") {
      navigate("/");
    }
  }, [rang, navigate]);

  useEffect(() => {
    const loadData = async () => {
      await fetchData();
      setDataLoaded(true);
    };

    if (!dataLoaded) {
      loadData();
    }
  }, [fetchData, dataLoaded]);

  if (rang !== "a") {
    return null;
  }

  return (
    <>
      <Header />
      <div className="w-full my-4 px-2 sm:px-4 lg:px-6">
        <h1 className="text-center text-2xl font-bold mb-4">Felhasználók</h1>

        <div className="w-full flex justify-center">
          <button className="rounded-lg bg-red-500 p-2 mb-4">
            <Link
              to="/register"
              className="flex items-center text-white hover:text-gray-300"
            >
              <FontAwesomeIcon icon={faUserPlus} className="text-2xl mr-2" />
              <span>Új felhasználó</span>
            </Link>
          </button>
        </div>

        <div className="overflow-x-auto flex items-center justify-center">
          <div className="w-full lg:w-3/4 border border-black rounded-lg">
            {/* Fejléc (csak nagy képernyőkön látszik) */}
            <div className="hidden lg:flex w-full border-b-2 border-b-black">
              <div className="w-1/3 text-xl border-r-2 border-r-black font-bold flex items-center p-2">Teljes név</div>
              <div className="w-1/3 text-xl border-r-2 border-r-black font-bold flex items-center p-2">Email</div>
              <div className="w-1/3 text-xl font-bold p-2 text-center">Műveletek</div>
            </div>
            {users.map((item) => (
              <div key={item.id} className="flex flex-wrap lg:flex-nowrap w-full border-t border-black">
                {/* Teljes név */}
                <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r-2 border-black flex items-center text-lg p-1 truncate">
                  <span className="lg:hidden font-bold mr-2">Teljes név: </span> {item.fullName}
                </div>
                {/* Email */}
                <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r-2 border-black flex items-center text-lg p-1 truncate">
                  <span className="lg:hidden font-bold mr-2">Email: </span>{item.email}
                </div>
                {/* Műveletek */}
                <div className="w-full lg:w-1/3 p-2 flex justify-between items-center border-b-2 lg:border-b-0 border-black">
                  <Link
                    to={`/adminupdateuser/${item.id}`}
                    className="flex items-center hover:text-gray-300"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} className="text-lg mr-2" />
                    <span>Felhasználó szerkesztése</span>
                  </Link>
                  <div
                    className="flex items-center text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => deleteUser(item.id, userId)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-lg mr-2" />
                    <span>Felhasználó törlése</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>






      <div className="w-full my-4 px-2 sm:px-4 lg:px-6">
        <h1 className="text-center text-2xl font-bold mb-4">Kurzusok</h1>

        <div className="w-full flex justify-center">
          <Link
            to="/admincreate/course"
            className="rounded-lg bg-red-500 p-2 mb-4 text-white flex items-center hover:text-gray-300"
          >
            <FontAwesomeIcon icon={faSquarePlus} className="text-2xl mr-2" />
            <span>Új kurzus</span>
          </Link>
        </div>

        <div className="overflow-x-auto flex items-center justify-center">
          <div className="w-full lg:w-3/4 border border-black rounded-lg">
            {/* Fejléc (csak nagy képernyőkön látszik) */}
            <div className="hidden lg:flex w-full border-b-2 border-b-black">
              <div className="w-1/4 text-xl border-r-2 border-r-black font-bold flex items-center p-2">Cím</div>
              <div className="w-1/4 text-xl border-r-2 border-r-black font-bold flex items-center p-2">Időpont</div>
              <div className="w-1/4 text-xl border-r-2 border-r-black font-bold flex items-center p-2">Helyszín</div>
              <div className="w-1/4 text-xl font-bold p-2 text-center">Műveletek</div>
            </div>
            {courses.map((item) => (
              <div key={item.id} className="flex flex-wrap lg:flex-nowrap w-full border-t border-black">
                {/* Cím */}
                <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r-2 border-black flex items-center text-lg p-2 truncate">
                  <span className="lg:hidden font-bold mr-2">Cím: </span>{item.cim}
                </div>
                {/* Ár */}
                <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r-2 border-black flex items-center text-lg p-2 truncate">
                  <span className="lg:hidden font-bold mr-2">Időpont: </span>{item.idopont}
                </div>
                {/* Helyszín */}
                <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r-2 border-black flex items-center text-lg p-2 truncate">
                  <span className="lg:hidden font-bold mr-2">Helyszín: </span>{item.helyszin}
                </div>
                {/* Műveletek */}
                <div className="w-full lg:w-1/4 p-2 flex justify-between items-center border-b-2 lg:border-b-0 border-black">
                  <Link
                    to={`/adminupdatecourse/${item.id}`}
                    className="flex items-center hover:text-gray-300"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} className="text-lg mr-2" />
                    <span>Kurzus szerkesztése</span>
                  </Link>
                  <div
                    className="flex items-center text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => deleteCourse(item.id, userId)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-lg mr-2" />
                    <span>Kurzus törlése</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full my-4 px-2 sm:px-4 lg:px-6">
        <h1 className="text-center text-2xl font-bold mb-4">Kurzusra várók</h1>

        <div className="overflow-x-auto flex items-center justify-center">
          <div className="w-full max-w-5xl border-r border-l border-b border-black rounded-lg">
            {registerCourses &&
              registerCourses.map((item, index) => {
                const user = users.find((user) => user.id === item.userId);
                const course = courses.find((course) => course.id === item.courseId);

                let arr = [];

                if (course && course.felhasznalok && course.felhasznalok !== "[]") {
                  const cleanedStr = course.felhasznalok.replace(/"(\d+)"/g, "$1");
                  arr = JSON.parse(cleanedStr);
                }

                return (
                  <div
                    key={index}
                    className="flex flex-wrap lg:flex-nowrap w-full border-t border-black rounded-lg"
                  >
                    {/* Felhasználó információ */}
                    <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r-2 border-black flex items-center p-2">
                      {user ? (
                        <>
                          <div className="truncate flex flex-col">
                            <div>
                              <span className="font-bold mr-2">Teljes név:</span>
                              <span>{user.fullName}</span>
                            </div>
                            <div>
                              <span className="font-bold mr-2">Felhasználónév:</span>
                              <span>{user.username}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="truncate">Ismeretlen felhasználó</span>
                        </>
                      )}
                    </div>

                    {/* Kurzus információ és műveletek */}
                    <div className="w-full lg:w-2/3 p-2 flex flex-col lg:flex-row justify-between items-center border-black border-b-2 lg:border-b-0">
                      {course ? (
                        <>
                          <div className="flex flex-col lg:flex-grow lg:mr-4 truncate">
                            <div className="mb-2">
                              <span className="font-bold mr-2">Cím:</span>
                              <span>{course.cim}</span>
                            </div>
                            <div className="mb-2">
                              <span className="font-bold mr-2">Helyszín:</span>
                              <span>{course.helyszin}</span>
                            </div>
                            <div>
                              <span className="font-bold mr-2">Időpont:</span>
                              <span>{course.idopont}</span>
                            </div>
                          </div>
                          <div className={`p-2 mx-1 text-center rounded-lg mt-2 lg:mt-0 ${item.paid ? "bg-green-300 text-black" : "bg-red-300 text-black"}`}>
                            {item.paid ? "Fizetve" : "Nem fizetett még"}
                          </div>
                          <div className="border h-[120%] bg-black w-[1px] border-black mx-1">
                            
                          </div>
                          <div className="flex lg:flex-row lg:space-x-2 mt-2 lg:mt-0">
                            <button
                              className={`${
                                item.enabled ? "bg-red-500" : "bg-green-500"
                              } text-white p-2 rounded-md mx-1 lg:mb-0`}
                              onClick={() => {
                                addUser(user.id, arr, course.id, item.id, userId);
                              }}
                            >
                              {item.enabled ? "Letilt" : "Engedélyez"}
                            </button>
                            <button
                              className="bg-red-500 text-white mx-1 p-2 rounded-md"
                              onClick={() => {
                                deleteUserRegisteredCourse(userId, item.id);
                              }}
                            >
                              Elutasít
                            </button>

                            <button
                              className={`${
                                item.paid ? "bg-red-500" : "bg-green-500"
                              } text-white p-2 rounded-md mx-1 lg:mb-0`}
                              onClick={() => {
                                payToggle(item.id);
                              }}
                            >
                              {item.paid ? "Fiz. visszavonás" : "Fiz. visszaigazolás"}
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="truncate">Kurzus törölve</span>
                          <button
                            className="bg-red-500 text-white p-2 rounded-md mt-2"
                            onClick={() => {
                              deleteUserRegisteredCourse(userId, course.id);
                            }}
                          >
                            Töröl
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>


      {/* <div className="w-full border">
        <p>hazifeladatok</p>
        <Link
          to="/admincreate/homework"
          className={`flex bg-red-900 items-center text-white hover:text-gray-300`}
        >
          <FontAwesomeIcon icon={faUserPlus} className={`text-3xl mr-2`} />
          <span>Új házi</span>
        </Link>
        {homeworks.map((item) => (
          <div key={item.id} className="flex border w-full my-3">
            <div className="w-1/4 border">{item.cim}</div>
            <div className="w-1/4 border">{item.leiras}</div>
            <div className="w-1/4 border">{item.megoldas}</div>
            <div className="w-1/4 border">{item.letrehozasDatum}</div>
            <div className="w-1/4 border">
              <FontAwesomeIcon
                icon={faPenToSquare}
                className={`text-xl mr-2`}
              />
              <span>Házi szerkesztése</span>
            </div>
            <div className="w-1/4 border">
              <FontAwesomeIcon icon={faTrash} className={`text-xl mr-2`} />
              <span>Házi törlése</span>
            </div>
          </div>
        ))}
      </div> */}
    </>
  );
};

export default Admin;
