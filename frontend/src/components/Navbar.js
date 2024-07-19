import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignInAlt, faUserPlus, faUserShield, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      <div className={`fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out bg-gray-800 text-white ${isOpen ? 'w-[300px]' : 'w-15'}`}>
        <div className={`p-4 flex ${isOpen ? 'justify-start' : 'justify-center'}`}>
          <button onClick={toggleSidebar} className="text-white text-3xl">
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </button>
        </div>
        <ul className="p-4">
          <li className="mb-4">
            <Link to="/" className={`flex ${isOpen ? 'justify-start' : 'justify-center'} items-center text-white hover:text-gray-300`}>
              <FontAwesomeIcon icon={faHome} className={`text-3xl ${isOpen ? 'mr-2' : ''}`} />
              {isOpen && <span>Home</span>}
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/login" className={`flex items-center ${isOpen ? 'justify-start' : 'justify-center'} text-white hover:text-gray-300`}>
              <FontAwesomeIcon icon={faSignInAlt} className={`text-3xl ${isOpen ? 'mr-2' : ''}`} />
              {isOpen && <span>Login</span>}
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/register" className={`flex items-center ${isOpen ? 'justify-start' : 'justify-center'} text-white hover:text-gray-300`}>
              <FontAwesomeIcon icon={faUserPlus} className={`text-3xl ${isOpen ? 'mr-2' : ''}`} />
              {isOpen && <span>Register</span>}
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/admin" className={`flex items-center ${isOpen ? 'justify-start' : 'justify-center'} text-white hover:text-gray-300`}>
              <FontAwesomeIcon icon={faUserShield} className={`text-3xl ${isOpen ? 'mr-2' : ''}`} />
              {isOpen && <span>Admin</span>}
            </Link>
          </li>
        </ul>
      </div>
      <div className={`flex-1 p-4 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-6'}`}>
        {/* Add the rest of your content here */}
      </div>
    </div>
  );
};

export default Navigation;
