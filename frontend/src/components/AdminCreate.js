import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Assuming axios is being used
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";
import UserPicker from "./UserPicker";
import apiMessage from "../i18n/apiMessage";
import {
  useContentTranslations,
  AdminLanguageTabs,
  SourceText,
} from "./AdminContentTranslation";

const COURSE_TRANSLATABLE_FIELDS = ["cim", "temakor", "helyszin", "leiras", "szoveg"];

const AdminCreate = () => {
  const { rang, userId } = useAuth();
  const { users, fetchUsers } = useAdmin();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cim: '',
    ar: '',
    helyszin: '',
    idopont: '',
    video: null,
    temakor: '',
    leiras: '',
    szoveg: '',
  });
  const [felhasznalok, setFelhasznalok] = useState([]);
  const [message, setMessage] = useState('');
  const [isFileValid, setIsFileValid] = useState(true);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const tr = useContentTranslations(COURSE_TRANSLATABLE_FIELDS);
  const setField = (name) => (value) => setFormData((prev) => ({ ...prev, [name]: value }));

  useEffect(() => {
    if (rang !== 'a') {
      navigate('/');
    }
  }, [rang, navigate]);

  useEffect(() => {
    if (rang === 'a') {
      fetchUsers();
    }
  }, [rang, fetchUsers]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      const fileTypes = ['video/mp4', 'video/x-matroska', 'video/x-msvideo', 'audio/mpeg'];
      if (file && fileTypes.includes(file.type)) {
        setIsFileValid(true);
        setMessage('');
        setFormData({ ...formData, [name]: file });
      } else {
        setIsFileValid(false);
        setMessage('Csak videó és hang fájlokat tölthetsz fel (mp4, mkv, avi, mp3).');
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cim.trim() || !formData.helyszin.trim()) {
      setMessage('A magyar cím és helyszín megadása kötelező.');
      tr.setEditLang('hu');
      return;
    }
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    const translations = tr.payload();
    if (Object.keys(translations).length > 0) {
      data.append('translations', JSON.stringify(translations));
    }

    data.append('felhasznalok', JSON.stringify(felhasznalok));
    data.append('userId', userId);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/createCourse`, data);
      setMessage(apiMessage(response.data.message));
    } catch (error) {
      setMessage(apiMessage(error.response?.data?.error));
    }
  };

  return (
    <div className="flex bg-primary/60 items-center justify-center min-h-screen">
      <div className="bg-secondary p-8 rounded-md border border-secondary/30 w-full max-w-4xl">
        <h1 className="font-display text-2xl font-semibold text-center mb-6">Kurzus létrehozása</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <AdminLanguageTabs editor={tr} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div>
                <label className="block font-medium text-base mb-2 text-ink">Cím:</label>
                <input
                  type="text"
                  name="cim"
                  {...tr.bind("cim", formData.cim, setField("cim"))}
                  required={tr.isDefault}
                  className="w-full px-4 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <SourceText editor={tr} text={formData.cim} />
              </div>
              <div>
                <label className="block font-medium text-base mb-2 text-ink">Ár:</label>
                <input
                  type="number"
                  name="ar"
                  value={formData.ar}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block font-medium text-base mb-2 text-ink">Helyszín:</label>
                <input
                  type="text"
                  name="helyszin"
                  {...tr.bind("helyszin", formData.helyszin, setField("helyszin"))}
                  required={tr.isDefault}
                  className="w-full px-4 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <SourceText editor={tr} text={formData.helyszin} />
              </div>
              <div>
                <label className="block font-medium text-base mb-2 text-ink">Időpont:</label>
                <input
                  type="date"
                  name="idopont"
                  value={formData.idopont}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block font-medium text-base mb-2 text-ink">Témakör:</label>
                <input
                  type="text"
                  name="temakor"
                  {...tr.bind("temakor", formData.temakor, setField("temakor"))}
                  className="w-full px-4 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <SourceText editor={tr} text={formData.temakor} />
              </div>
              <div>
                <label className="block font-medium text-base mb-2 text-ink">Videó:</label>
                <input
                  type="file"
                  name="video"
                  onChange={handleChange}
                  accept="video/mp4, video/x-matroska, video/x-msvideo"
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <div>
                <label className="block font-medium text-base mb-2 text-ink">Leírás:</label>
                <textarea
                  name="leiras"
                  {...tr.bind("leiras", formData.leiras, setField("leiras"))}
                  className="w-full h-32 px-4 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <SourceText editor={tr} text={formData.leiras} />
              </div>
              <div>
                <label className="block font-medium text-base mb-2 text-ink">Szöveg:</label>
                <textarea
                  name="szoveg"
                  {...tr.bind("szoveg", formData.szoveg, setField("szoveg"))}
                  className="w-full h-32 px-4 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <SourceText editor={tr} text={formData.szoveg} />
              </div>
              <div>
                <UserPicker
                  users={users}
                  selectedIds={felhasznalok}
                  onChange={setFelhasznalok}
                  label="Felhasználók"
                  emptyHint="Nincs kiválasztva (üresen mindenki hozzáfér)"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={!isFileValid}
              className="btn-brand disabled:opacity-50"
            >
              Kurzus létrehozása
            </button>
          </div>
        </form>
        <div className='flex justify-center'>
        {message && <p className="text-center bg-ink text-ivory w-full sm:w-1/2 mt-4 p-4 rounded-md">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminCreate;
