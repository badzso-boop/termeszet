import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

import Header from "../components/Header";

import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";

const Admin = () => {
  const { rang, userId } = useAuth();
  const { users, courses, homeworks, fetchData, deleteUser, deleteCourse } = useAdmin();
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
      <h1 className="font-bold">Admin Page</h1>
      <div className="w-full border">
        <p>Felhasznalok</p>
        <Link
          to="/register"
          className={`flex bg-red-900 items-center text-white hover:text-gray-300`}
        >
          <FontAwesomeIcon icon={faUserPlus} className={`text-3xl mr-2`} />
          <span>Új felhasználó</span>
        </Link>
        {users.map((item) => (
          <div key={item.id} className="flex border w-full my-3">
            <div className="w-1/4 border">{item.fullName}</div>
            <div className="w-1/4 border">{item.username}</div>
            <div className="w-1/4 border">{item.email}</div>
            <div className="w-1/4 border">{item.bornDate}</div>
            <div className="w-1/4 border">
              <Link
                to={`/adminupdateuser/${item.id}`}
                className={`flex items-center hover:text-gray-300`}
              >
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className="text-xl mr-2"
                />
                <span>Felhasználó szerkesztése</span>
              </Link>
            </div>
            <div className="w-1/4 border" onClick={() => deleteUser(item.id,userId)}>
              <FontAwesomeIcon icon={faTrash} className={`text-xl mr-2`} />
              <span>Felhasználó törlése</span>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full border">
        <p>kurzusok</p>
        <Link
          to="/admincreate/course"
          className={`flex bg-red-900 items-center text-white hover:text-gray-300`}
        >
          <FontAwesomeIcon icon={faUserPlus} className={`text-3xl mr-2`} />
          <span>Új kurzus</span>
        </Link>
        {courses.map((item) => (
          <div key={item.id} className="flex border w-full my-3">
            <Link to={`/course/${item.id}`} className={`w-1/4 border`}>{item.cim}</Link>
            <div className="w-1/4 border">{item.ar} Ft</div>
            <div className="w-1/4 border">{item.helyszin}</div>
            <div className="w-1/4 border">{item.idopont}</div>
            <div className="w-1/4 border">
            <Link
                to={`/adminupdatecourse/${item.id}`}
                className={`flex items-center hover:text-gray-300`}
              >
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className="text-xl mr-2"
                />
                <span>Kurzus szerkesztése</span>
              </Link>
            </div>
            <div className="w-1/4 border" onClick={() => deleteCourse(item.id,userId)}>
              <FontAwesomeIcon icon={faTrash} className={`text-xl mr-2`} />
              <span>Kurzus törlése</span>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full border">
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
      </div>
    </>
  );
};

export default Admin;
