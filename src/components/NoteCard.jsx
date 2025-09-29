import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";

// Draggable / resizable sticky note
// Props:
// - note: note object from API (expects pos_x, pos_y, width, height, color, title, content, pinned, z_index)
// - onChange: function(patch) -> called with partial fields to PATCH the note on the server
// - onDelete: function() -> called when delete is requested

export default function NoteCard({ note, onChange, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState({
    title: note.title || "",
    content: note.content || "",
    color: note.color || "#FFF9C4",
  });

  const [position, setPosition] = useState({ x: note.pos_x || 0, y: note.pos_y || 0 });
  const [size, setSize] = useState({ width: note.width || 260, height: note.height || 180 });
  const [zIndex, setZIndex] = useState(note.z_index || 0);

  // keep local state in sync when parent note changes
  useEffect(() => {
    setLocal({ title: note.title || "", content: note.content || "", color: note.color || "#FFF9C4" });
    setPosition({ x: note.pos_x || 0, y: note.pos_y || 0 });
    setSize({ width: note.width || 260, height: note.height || 180 });
    setZIndex(note.z_index || 0);
  }, [note]);

  const save = async () => {
    // push the edited fields back up
    onChange({ title: local.title, content: local.content, color: local.color });
    setEditing(false);
  };

  const onDragStop = (e, d) => {
    const x = Math.round(d.x);
    const y = Math.round(d.y);
    setPosition({ x, y });
    onChange({ pos_x: x, pos_y: y });
  };

  const onResizeStop = (e, direction, ref, delta, pos) => {
    const w = parseInt(ref.style.width, 10);
    const h = parseInt(ref.style.height, 10);
    const x = Math.round(pos.x);
    const y = Math.round(pos.y);
    setSize({ width: w, height: h });
    setPosition({ x, y });
    onChange({ width: w, height: h, pos_x: x, pos_y: y });
  };

  const bringToFront = () => {
    // quick unique-ish z-index — you can implement a global z-index manager if you prefer
    const newZ = Date.now() % 1000000;
    setZIndex(newZ);
    onChange({ z_index: newZ });
  };

  return (
    <Rnd
      className="rounded-lg"
      size={{ width: size.width, height: size.height }}
      position={{ x: position.x, y: position.y }}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      bounds="parent"
      onMouseDown={bringToFront}
      minWidth={180}
      minHeight={120}
      style={{ zIndex }}
    >
      <div
        className="relative h-full w-full p-3 rounded shadow"
        style={{ backgroundColor: local.color }}
      >
        <div className="flex items-start justify-between gap-2">
          <input
            value={local.title}
            onChange={(e) => setLocal((p) => ({ ...p, title: e.target.value }))}
            onBlur={save}
            placeholder="Title"
            className="bg-transparent font-semibold text-lg focus:outline-none flex-1"
          />

          <div className="flex items-center gap-2 ml-2">
            <input
              type="color"
              value={local.color}
              onChange={(e) => {
                const c = e.target.value;
                setLocal((p) => ({ ...p, color: c }));
                // update color immediately
                onChange({ color: c });
              }}
              title="Choose color"
              className="w-8 h-8 p-0 border-0"
            />

            <button
              onClick={() => onChange({ pinned: !note.pinned })}
              className="text-sm px-2 py-1 rounded hover:bg-white/30"
              title={note.pinned ? "Unpin" : "Pin"}
            >
              {note.pinned ? "📌" : "📍"}
            </button>

            <button
              onClick={() => setEditing((s) => !s)}
              className="text-sm px-2 py-1 rounded hover:bg-white/30"
              title="Edit"
            >
              ✏️
            </button>

            <button
              onClick={onDelete}
              className="text-sm px-2 py-1 rounded text-red-600 hover:bg-white/30"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="mt-2">
          {editing ? (
            <textarea
              value={local.content}
              onChange={(e) => setLocal((p) => ({ ...p, content: e.target.value }))}
              className="w-full h-full min-h-[6rem] p-2 resize-none rounded"
              placeholder="Write your note..."
            />
          ) : (
            <p className="whitespace-pre-wrap text-sm">{local.content || "(empty)"}</p>
          )}
        </div>

        <div className="flex justify-end mt-2 gap-2">
          {editing && (
            <button
              onClick={save}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </Rnd>
  );
}
