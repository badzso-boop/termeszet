import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAdmin } from "../context/AdminContext";

const Courses = () => {
  const { courses, fetchCoursesUser } = useAdmin();
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
      <h1>Courses Page</h1>
      <div className="w-full border">
        <p>kurzusok</p>
        {courses.map((item) => (
          <div key={item.id} className="flex border w-full my-3">
            <div className="w-1/4 border">
              <Link to={`/course/${item.id}`}>{item.cim}</Link>
            </div>
            <div className="w-1/4 border">{item.ar} Ft</div>
            <div className="w-1/4 border">{item.helyszin}</div>
            <div className="w-1/4 border">{item.idopont}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Courses;
