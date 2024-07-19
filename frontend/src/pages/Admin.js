import React from "react";

import Header from "../components/Header";

const Admin = () => {
  return (
    <>
      <Header />
      <h1 className="font-bold">Admin Page</h1>
      <div className="w-full border">
        <p>Felhasznalok</p>
      </div>
      <div className="w-full border">
        <p>kurzusok</p>
      </div>
      <div className="w-full border">
        <p>hazifeladatok</p>
      </div>
    </>
  );
};

export default Admin;
