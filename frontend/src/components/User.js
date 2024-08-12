import React, {useEffect, useState} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAdmin } from "../context/AdminContext";

const User = () => {
  const { id } = useParams();
  const { getOneUser } = useAdmin();
  const [user, setUser] = useState(null); // State to store the user data

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getOneUser(id);
        setUser(userData.data.user);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, [getOneUser, id]);

  return (
    <>
      <p>USER</p>
      {user && <p>{user.fullName}</p>}
      
    </>
  );
};

export default User;
