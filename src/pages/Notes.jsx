import React, { useEffect, useState } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Notes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "", color: "yellow" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const colorStyles = {
    yellow: "bg-yellow-200 border-yellow-400",
    pink: "bg-pink-200 border-pink-400",
    green: "bg-green-200 border-green-400",
    blue: "bg-blue-200 border-blue-400",
  };

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const notesRes = await getNotes();
        console.log("Notes response:", notesRes.data); // Debug
        setNotes(notesRes.data);
      } catch (err) {
        setError("Failed to load notes: " + (err.response?.data?.detail || err.message));
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "STUDENT") fetchNotes();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createNote(newNote);
      setNotes([...notes, response.data]);
      setNewNote({ title: "", content: "", color: "yellow" });
    } catch (err) {
      setError("Failed to create note: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, updatedNote) => {
    try {
      const response = await updateNote(id, updatedNote);
      setNotes(notes.map(note => (note.id === id ? response.data : note)));
    } catch (err) {
      setError("Failed to update note: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      setError("Failed to delete note: " + (err.response?.data?.detail || err.message));
    }
  };

  if (user?.role !== "STUDENT") return <div className="p-6">Access denied.</div>;
  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">My Notes</h1>
      {/* Create Note Form */}
      <form onSubmit={handleCreate} className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Note Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <textarea
          placeholder="Note Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
          rows="4"
          required
        />
        <select
          value={newNote.color}
          onChange={(e) => setNewNote({ ...newNote, color: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="yellow">Yellow</option>
          <option value="pink">Pink</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          Add Note
        </button>
      </form>

      {/* Sticky Notes Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {notes.map(note => (
          <div
            key={note.id}
            className={`p-4 rounded-lg shadow-md ${colorStyles[note.color]} relative transform hover:scale-105 transition-transform`}
            style={{ minHeight: "200px", borderWidth: "2px" }}
          >
            <h3 className="font-bold mb-2 text-lg">{note.title}</h3>
            <p className="text-sm">{note.content}</p>
            <div className="absolute bottom-2 right-2 flex gap-2">
              <button
                onClick={() => {
                  const updated = {
                    ...note,
                    title: prompt("New title:", note.title),
                    content: prompt("New content:", note.content),
                    color: prompt("New color (yellow, pink, green, blue):", note.color),
                  };
                  if (updated.title && updated.content && updated.color) handleUpdate(note.id, updated);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;