import React, { useState, useMemo } from "react";

// Kereshető, több-választós felhasználó-választó. Azt a mintát váltja ki, hogy az admin
// kézzel gépelt be numerikus user ID-kat egy sima szöveges tömbbe (AdminCourseUpdate.js /
// AdminCreate.js "Felhasználók" mezője) -- itt név/felhasználónév/email alapján lehet
// keresni, a numerikus ID a háttérben marad.
const UserPicker = ({ users, selectedIds, onChange, label, emptyHint }) => {
  const [query, setQuery] = useState("");

  const normalizedSelected = useMemo(
    () => selectedIds.map((id) => parseInt(id, 10)).filter((id) => !Number.isNaN(id)),
    [selectedIds]
  );
  const selectedSet = useMemo(() => new Set(normalizedSelected), [normalizedSelected]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return users
      .filter((u) => !selectedSet.has(u.id))
      .filter(
        (u) =>
          u.fullName?.toLowerCase().includes(q) ||
          u.username?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, users, selectedSet]);

  const addUser = (id) => {
    onChange([...normalizedSelected, id]);
    setQuery("");
  };

  const removeUser = (id) => {
    onChange(normalizedSelected.filter((sid) => sid !== id));
  };

  const selectedUsers = normalizedSelected
    .map((id) => users.find((u) => u.id === id))
    .filter(Boolean);

  return (
    <div>
      {label && <label className="block font-bold text-xl mb-2">{label}:</label>}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedUsers.map((u) => (
          <span
            key={u.id}
            className="flex items-center bg-beige/40 border border-gold/40 text-ink rounded-full pl-3 pr-2 py-1 text-sm"
          >
            {u.fullName} ({u.username})
            <button
              type="button"
              onClick={() => removeUser(u.id)}
              className="ml-2 text-red-500 font-bold"
              aria-label={`${u.fullName} eltávolítása`}
            >
              ×
            </button>
          </span>
        ))}
        {normalizedSelected.length === 0 && emptyHint && (
          <span className="text-gray-500 text-sm italic">{emptyHint}</span>
        )}
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Keresés név, felhasználónév vagy email alapján..."
        className="w-full px-4 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
      />
      {filtered.length > 0 && (
        <ul className="border border-secondary/30 rounded-md mt-1 max-h-48 overflow-y-auto bg-white">
          {filtered.map((u) => (
            <li
              key={u.id}
              onClick={() => addUser(u.id)}
              className="px-4 py-2 hover:bg-primary cursor-pointer text-sm"
            >
              {u.fullName} ({u.username}) — {u.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPicker;
