import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from "../context/AuthContext";

const AdminCreate = ({ formConfig }) => {
  const { rang, userId } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [isFileValid, setIsFileValid] = useState(true);

  useEffect(() => {
    if (rang !== "a") {
      navigate("/");
    }
  }, [rang, navigate]);

  useEffect(() => {
    const initialData = formConfig.fields.reduce((acc, field) => {
      acc[field.name] = '';
      return acc;
    }, {});
    setFormData(initialData);
  }, [formConfig]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      const fileTypes = ['video/mp4', 'video/x-matroska', 'video/x-msvideo'];
      if (file && fileTypes.includes(file.type)) {
        setIsFileValid(true);
        setMessage('');
      } else {
        setIsFileValid(false);
        setMessage('Csak videó fájlokat tölthetsz fel (mp4, mkv, avi).');
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    data.append('userId', userId);
    data.append('temakor', "");
    data.append('leiras', "");
    data.append('fajlok', "");

    try {
      const response = await formConfig.submitFunction(data);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div>
      <h1>{formConfig.title}</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {formConfig.fields.map((field) => (
          <div key={field.name}>
            <label>{field.label}:</label>
            <input
              type={field.type}
              name={field.name}
              onChange={handleChange}
              required={field.required}
            />
          </div>
        ))}
        <button type="submit" disabled={formConfig.fields.some(field => field.type === 'file') && !isFileValid}>
          {formConfig.submitButtonText}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminCreate;
