import React from "react";

const Header = () => {
  return (
    <>
      <div className="w-full border h-[100px] flex flex-wrap">
        <div className="border w-1/4">
          <p>uj felhasznalok</p>
        </div>
        <div className="border w-1/4">
          <p>uj hazifeladatok</p>
        </div>
        <div className="border w-1/4">
          <p>kurzusok statisztika</p>
        </div>
        <div className="border w-1/4">
          <p>legtobbet megnezett kurzus</p>
        </div>
      </div>
    </>
  );
};

export default Header;
