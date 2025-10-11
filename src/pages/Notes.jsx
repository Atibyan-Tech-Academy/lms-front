import React, { useEffect, useState } from "react";
// Assuming a new endpoint for notes; adjust if different
import { getCourseMaterials } from "../services/api";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getCourseMaterials(); // Adjust endpoint if notes are separate
        setNotes(response.data);
      } catch (err) {
        setError("Failed to fetch notes: " + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>
      {notes.length > 0 ? (
        <ul>
          {notes.map((note) => (
            <li key={note.id} className="mb-2">
              {note.title || "Untitled Note"} - {note.description || "No description"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No notes available.</p>
      )}
    </div>
  );
};

export default Notes;