import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import apiMessage from "../i18n/apiMessage";
import {
  useContentTranslations,
  AdminLanguageTabs,
  SourceText,
  TranslationBadges,
} from "./AdminContentTranslation";

const LESSON_TRANSLATABLE_FIELDS = ["cim", "szoveg"];
const inputClass = "px-3 py-1 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold";

// Egy lecke szerkesztő/létrehozó űrlapja, saját nyelvi fülekkel (a cím és a szöveg
// fordítható, a sorrend és a videó nyelvfüggetlen).
const LessonForm = ({ lesson, defaultOrder = 0, onSave, onCancel, submitLabel }) => {
  const [cim, setCim] = useState(lesson?.cim || "");
  const [sorrend, setSorrend] = useState(lesson ? lesson.sorrend : defaultOrder);
  const [szoveg, setSzoveg] = useState(lesson?.szoveg || "");
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");
  const tr = useContentTranslations(LESSON_TRANSLATABLE_FIELDS);
  const { reset } = tr;

  // Csak megnyitáskor (vagy másik leckére váltáskor) töltjük be a fordításokat: a lista
  // újratöltése (pl. egy másik lecke mentése) ne írja felül a folyamatban lévő szerkesztést.
  useEffect(() => {
    reset(lesson);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id, reset]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cim.trim()) {
      setError("A magyar cím megadása kötelező.");
      tr.setEditLang("hu");
      return;
    }
    setError("");
    onSave({ cim, sorrend, szoveg, video }, tr.payload());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <AdminLanguageTabs editor={tr} />
      <input
        type="text"
        {...tr.bind("cim", cim, setCim)}
        required={tr.isDefault}
        className={`w-full ${inputClass}`}
        placeholder="Cím"
      />
      <SourceText editor={tr} text={cim} />
      <input
        type="number"
        value={sorrend}
        onChange={(e) => setSorrend(e.target.value)}
        className={`w-24 ${inputClass}`}
        placeholder="Sorrend"
      />
      <textarea
        {...tr.bind("szoveg", szoveg, setSzoveg)}
        className={`w-full ${inputClass}`}
        rows="3"
        placeholder="Szöveg"
      />
      <SourceText editor={tr} text={szoveg} />
      <input
        type="file"
        accept="video/mp4, video/x-matroska, video/x-msvideo"
        onChange={(e) => setVideo(e.target.files[0] || null)}
      />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className={onCancel ? "btn-outline py-1 px-3" : "btn-brand"}>
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-primary text-ink border border-secondary/30 px-3 py-1 rounded-md"
          >
            Mégse
          </button>
        )}
      </div>
    </form>
  );
};

// Egy kurzushoz tartozó leckék (sorrendezett video+szöveg blokkok) kezelése az admin
// kurzus-szerkesztő oldalán. Az Authorization headert az AuthContext már beállította az
// axios defaultjaira, itt nem kell külön token-kezelés.
const LessonManager = ({ courseId }) => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [lessons, setLessons] = useState([]);
  const [editing, setEditing] = useState({}); // lessonId -> true, ha épp szerkesztés alatt áll
  const [newFormKey, setNewFormKey] = useState(0); // új lecke után üres űrlap (remount)
  const [message, setMessage] = useState("");

  const loadLessons = useCallback(async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/lessons`, { courseId });
      setLessons(res.data);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  }, [API_BASE_URL, courseId]);

  useEffect(() => {
    if (courseId) {
      loadLessons();
    }
  }, [courseId, loadLessons]);

  const startEdit = (id) => {
    setEditing((prev) => ({ ...prev, [id]: true }));
  };

  const cancelEdit = (id) => {
    setEditing((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const toFormData = (values, translations) => {
    const data = new FormData();
    data.append("cim", values.cim);
    data.append("sorrend", values.sorrend);
    data.append("szoveg", values.szoveg);
    if (values.video) {
      data.append("video", values.video);
    }
    if (Object.keys(translations).length > 0) {
      data.append("translations", JSON.stringify(translations));
    }
    return data;
  };

  const saveEdit = async (id, values, translations) => {
    const data = toFormData(values, translations);
    data.append("id", id);

    try {
      await axios.put(`${API_BASE_URL}/api/admin/updateLesson`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      cancelEdit(id);
      await loadLessons();
      setMessage("Lecke frissítve.");
    } catch (error) {
      setMessage(apiMessage(error.response?.data?.error));
    }
  };

  const deleteLesson = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/deleteLesson`, { data: { id } });
      await loadLessons();
      setMessage("Lecke törölve.");
    } catch (error) {
      setMessage(apiMessage(error.response?.data?.error));
    }
  };

  const addLesson = async (values, translations) => {
    const data = toFormData(values, translations);
    data.append("courseId", courseId);

    try {
      await axios.post(`${API_BASE_URL}/api/admin/createLesson`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await loadLessons();
      setNewFormKey((k) => k + 1);
      setMessage("Lecke létrehozva.");
    } catch (error) {
      setMessage(apiMessage(error.response?.data?.error));
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="font-display text-2xl font-semibold text-center mb-4">Leckék</h2>

      {lessons.length === 0 && (
        <p className="text-center text-gray-500 mb-4">Ehhez a kurzushoz még nincs lecke felvéve.</p>
      )}

      <div className="space-y-4 mb-6">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="border border-secondary/30 rounded-md p-4">
            {editing[lesson.id] ? (
              <LessonForm
                lesson={lesson}
                onSave={(values, translations) => saveEdit(lesson.id, values, translations)}
                onCancel={() => cancelEdit(lesson.id)}
                submitLabel="Mentés"
              />
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold">{lesson.sorrend}. {lesson.cim}</span>
                  {lesson.video && <span className="ml-2 text-sm text-gray-500">(videó csatolva)</span>}
                  <span className="ml-2 align-middle">
                    <TranslationBadges translations={lesson.translations} />
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(lesson.id)}
                    className="btn-outline py-1 px-3"
                  >
                    Szerkesztés
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteLesson(lesson.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                  >
                    Törlés
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border border-dashed border-gold/50 rounded-md p-4">
        <h3 className="font-display font-semibold text-lg mb-2">Új lecke hozzáadása</h3>
        <LessonForm
          key={newFormKey}
          lesson={null}
          defaultOrder={lessons.length}
          onSave={addLesson}
          submitLabel="Lecke hozzáadása"
        />
      </div>

      {message && (
        <p className="bg-ink text-ivory rounded-md p-4 mt-4 text-center">{message}</p>
      )}
    </div>
  );
};

export default LessonManager;
