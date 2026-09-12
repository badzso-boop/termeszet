import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Egy kurzushoz tartozó leckék (sorrendezett video+szöveg blokkok) kezelése az admin
// kurzus-szerkesztő oldalán. Az Authorization headert az AuthContext már beállította az
// axios defaultjaira, itt nem kell külön token-kezelés.
const LessonManager = ({ courseId }) => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [lessons, setLessons] = useState([]);
  const [editing, setEditing] = useState({}); // lessonId -> { cim, sorrend, szoveg, video }
  const [newLesson, setNewLesson] = useState({ cim: "", sorrend: 0, szoveg: "", video: null });
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

  const startEdit = (lesson) => {
    setEditing((prev) => ({
      ...prev,
      [lesson.id]: { cim: lesson.cim, sorrend: lesson.sorrend, szoveg: lesson.szoveg || "", video: null },
    }));
  };

  const cancelEdit = (id) => {
    setEditing((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const saveEdit = async (id) => {
    const data = new FormData();
    const edit = editing[id];
    data.append("id", id);
    data.append("cim", edit.cim);
    data.append("sorrend", edit.sorrend);
    data.append("szoveg", edit.szoveg);
    if (edit.video) {
      data.append("video", edit.video);
    }

    try {
      await axios.put(`${API_BASE_URL}/api/admin/updateLesson`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      cancelEdit(id);
      await loadLessons();
      setMessage("Lecke frissítve.");
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong.");
    }
  };

  const deleteLesson = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/deleteLesson`, { data: { id } });
      await loadLessons();
      setMessage("Lecke törölve.");
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong.");
    }
  };

  const addLesson = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("courseId", courseId);
    data.append("cim", newLesson.cim);
    data.append("sorrend", newLesson.sorrend);
    data.append("szoveg", newLesson.szoveg);
    if (newLesson.video) {
      data.append("video", newLesson.video);
    }

    try {
      await axios.post(`${API_BASE_URL}/api/admin/createLesson`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewLesson({ cim: "", sorrend: lessons.length, szoveg: "", video: null });
      await loadLessons();
      setMessage("Lecke létrehozva.");
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="font-display text-2xl font-semibold text-center mb-4">Leckék</h2>

      {lessons.length === 0 && (
        <p className="text-center text-gray-500 mb-4">Ehhez a kurzushoz még nincs lecke felvéve.</p>
      )}

      <div className="space-y-4 mb-6">
        {lessons.map((lesson) => {
          const edit = editing[lesson.id];
          return (
            <div key={lesson.id} className="border border-secondary/30 rounded-md p-4">
              {edit ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={edit.cim}
                    onChange={(e) =>
                      setEditing((prev) => ({ ...prev, [lesson.id]: { ...prev[lesson.id], cim: e.target.value } }))
                    }
                    className="w-full px-3 py-1 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
                    placeholder="Cím"
                  />
                  <input
                    type="number"
                    value={edit.sorrend}
                    onChange={(e) =>
                      setEditing((prev) => ({ ...prev, [lesson.id]: { ...prev[lesson.id], sorrend: e.target.value } }))
                    }
                    className="w-24 px-3 py-1 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
                    placeholder="Sorrend"
                  />
                  <textarea
                    value={edit.szoveg}
                    onChange={(e) =>
                      setEditing((prev) => ({ ...prev, [lesson.id]: { ...prev[lesson.id], szoveg: e.target.value } }))
                    }
                    className="w-full px-3 py-1 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
                    rows="3"
                    placeholder="Szöveg"
                  />
                  <input
                    type="file"
                    accept="video/mp4, video/x-matroska, video/x-msvideo"
                    onChange={(e) =>
                      setEditing((prev) => ({
                        ...prev,
                        [lesson.id]: { ...prev[lesson.id], video: e.target.files[0] || null },
                      }))
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(lesson.id)}
                      className="btn-outline py-1 px-3"
                    >
                      Mentés
                    </button>
                    <button
                      type="button"
                      onClick={() => cancelEdit(lesson.id)}
                      className="bg-primary text-ink border border-secondary/30 px-3 py-1 rounded-md"
                    >
                      Mégse
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold">{lesson.sorrend}. {lesson.cim}</span>
                    {lesson.video && <span className="ml-2 text-sm text-gray-500">(videó csatolva)</span>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(lesson)}
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
          );
        })}
      </div>

      <form onSubmit={addLesson} className="border border-dashed border-gold/50 rounded-md p-4 space-y-2">
        <h3 className="font-display font-semibold text-lg">Új lecke hozzáadása</h3>
        <input
          type="text"
          value={newLesson.cim}
          onChange={(e) => setNewLesson((prev) => ({ ...prev, cim: e.target.value }))}
          placeholder="Cím"
          required
          className="w-full px-3 py-1 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <input
          type="number"
          value={newLesson.sorrend}
          onChange={(e) => setNewLesson((prev) => ({ ...prev, sorrend: e.target.value }))}
          placeholder="Sorrend"
          className="w-24 px-3 py-1 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <textarea
          value={newLesson.szoveg}
          onChange={(e) => setNewLesson((prev) => ({ ...prev, szoveg: e.target.value }))}
          placeholder="Szöveg"
          rows="3"
          className="w-full px-3 py-1 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <input
          type="file"
          accept="video/mp4, video/x-matroska, video/x-msvideo"
          onChange={(e) => setNewLesson((prev) => ({ ...prev, video: e.target.files[0] || null }))}
        />
        <button type="submit" className="btn-brand">
          Lecke hozzáadása
        </button>
      </form>

      {message && (
        <p className="bg-ink text-ivory rounded-md p-4 mt-4 text-center">{message}</p>
      )}
    </div>
  );
};

export default LessonManager;
