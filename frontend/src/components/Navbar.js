import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignInAlt, faUserPlus, faUser, faUserShield, faBars, faTimes, faSignOutAlt, faTasks } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { rang, logout, userId } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex">
      <div className={`fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out bg-secondary text-black ${isOpen ? 'w-[300px]' : 'w-15'}`}>
        <div className={`p-4 flex ${isOpen ? 'justify-start' : 'justify-center'}`}>
          <button onClick={toggleSidebar} className="text-black text-3xl">
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </button>
        </div>
        <ul className="p-4">
          <li className="mb-4">
            <Link to="/" className={`flex ${isOpen ? 'justify-start' : 'justify-center'} items-center text-black hover:text-gray-300`}>
              <FontAwesomeIcon icon={faHome} className={`text-3xl ${isOpen ? 'mr-2' : ''}`} />
              {isOpen && <span>Home</span>}
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/courses" className={`flex ${isOpen ? 'justify-start' : 'justify-center'} items-center text-black hover:text-gray-300`}>
              <FontAwesomeIcon icon={faTasks} className={`text-3xl ${isOpen ? 'mr-2' : ''}`} />
              {isOpen && <span>Courses</span>}
            </Link>
          </li>
          {!rang && 
            <>
              <li className="mb-4">
                <Link to="/login" className={`flex items-center ${isOpen ? 'justify-start' : 'justify-center'} text-black hover:text-gray-300`}>
                  <FontAwesomeIcon icon={faSignInAlt} className={`text-3xl ${isOpen ? 'mr-2' : ''}`} />
                  {isOpen && <span>Login</span>}
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/register" className={`flex items-center ${isOpen ? 'justify-start' : 'justify-center'} text-black hover:text-gray-300`}>
                  <FontAwesomeIcon icon={faUserPlus} className={`text-3xl ${isOpen ? 'mr-2' : ''}`} />
                  {isOpen && <span>Register</span>}
                </Link>
              </li>
            </>}
          
          {rang === "a" && (
            <li className="mb-4">
              <Link to="/admin" className={`flex items-center ${isOpen ? 'justify-start' : 'justify-center'} text-black hover:text-gray-300`}>
                <FontAwesomeIcon icon={faUserShield} className={`text-3xl ${isOpen ? 'mr-2' : ''}`} />
                {isOpen && <span>Admin</span>}
              </Link>
            </li>
          )}
          {rang && 
          <>
            <li className="mb-4">
              <Link to={`/user/${userId}`} className={`flex items-center ${isOpen ? 'justify-start' : 'justify-center'} text-black hover:text-gray-300`}>
                <FontAwesomeIcon icon={faUser} className={`text-3xl ${isOpen ? 'mr-2' : ''}`} />
                {isOpen && <span>Profile</span>}
              </Link>
            </li>
            <li className="mb-4">
              <button onClick={handleLogout} className={`flex items-center ${isOpen ? 'justify-start' : 'justify-center'} text-black hover:text-gray-300 w-full`}>
                <FontAwesomeIcon icon={faSignOutAlt} className={`text-3xl ${isOpen ? 'mr-2' : ''}`} />
                {isOpen && <span>Logout</span>}
              </button>
            </li>
            </>}
        </ul>
      </div>
      <div className={`flex-1 p-4 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-6'}`}>
        {/* Add the rest of your content here */}
      </div>
    </div>
  );
};

export default Navigation;
