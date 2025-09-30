// src/pages/NotePages.jsx
import React, { useEffect, useState } from "react";
import { getNotes, createNote, updateNote, deleteNote, partialUpdateNote } from "../services/api";
import NoteCard from "./NoteCard";

export default function NotePages() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await getNotes();
      setNotes(res.data);
    } catch (err) {
      setError("Failed to load notes: " + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await createNote({
        title: "New note",
        content: "",
        color: "#FFF9C4",
        pos_x: 10,
        pos_y: 10,
      });
      setNotes(prev => [res.data, ...prev]);
    } catch (err) {
      setError("Create failed: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (id, patch) => {
    try {
      const res = await partialUpdateNote(id, patch);
      setNotes(prev => prev.map(n => (n.id === id ? res.data : n)));
    } catch (err) {
      console.error("Update note failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Delete note failed", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">My Notes</h2>
        <div>
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
            disabled={creating}
          >
            {creating ? "Creating..." : "New Note"}
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-3">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {notes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onChange={(patch) => handleUpdate(note.id, patch)}
              onDelete={() => handleDelete(note.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
