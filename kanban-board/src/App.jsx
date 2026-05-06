import { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCorners,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const COLS = [
  { id: "todo", label: "To Do", color: "#6c63ff" },
  { id: "inprogress", label: "In Progress", color: "#f59e0b" },
  { id: "done", label: "Done", color: "#22c55e" },
];

const MOVE_OPTIONS = {
  todo: [
    { to: "inprogress", label: "→ In Progress" },
    { to: "done", label: "→ Done" },
  ],
  inprogress: [
    { to: "todo", label: "← To Do" },
    { to: "done", label: "→ Done" },
  ],
  done: [
    { to: "todo", label: "← To Do" },
    { to: "inprogress", label: "← In Progress" },
  ],
};

const genId = () => Math.random().toString(36).slice(2, 10);

const loadTasks = () => {
  try {
    return JSON.parse(localStorage.getItem("kanban_tasks_final")) || [];
  } catch {
    return [];
  }
};

const saveTasks = (tasks) => {
  localStorage.setItem("kanban_tasks_final", JSON.stringify(tasks));
};

function PriorityBadge({ priority }) {
  const cls =
    priority === "high"
      ? "priority-high-badge"
      : priority === "medium"
      ? "priority-medium-badge"
      : "priority-low-badge";

  return <span className={`priority-badge ${cls}`}>{priority}</span>;
}

// ================= CARD =================
function Card({ task, onDelete, onEdit, onMove }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.text);
  const inputRef = useRef();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition:
      transition || "transform 180ms cubic-bezier(0.2, 0, 0, 1)",
  };

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const save = () => {
    const trimmed = value.trim();
    if (trimmed) onEdit(task.id, trimmed);
    setEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card priority-${task.priority}`}
    >
      <div className="card-top">
        {editing ? (
          <textarea
            ref={inputRef}
            className="card-text-edit"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={save}
            onMouseDown={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="card-text" {...attributes} {...listeners}>
            {task.text}
          </span>
        )}

        <div className="card-actions">
          <button
            className="btn-icon"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setEditing(true)}
          >
            ✏️
          </button>

          <button
            className="btn-icon delete"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onDelete(task.id)}
          >
            ❌
          </button>
        </div>
      </div>

      <div className="card-footer">
        <PriorityBadge priority={task.priority} />

        {/* ✅ MOVE BUTTONS */}
        <div className="move-btns">
          {MOVE_OPTIONS[task.column].map((opt) => (
            <button
              key={opt.to}
              className="move-btn"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => onMove(task.id, opt.to)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ================= COLUMN =================
function Column({ col, tasks, onAdd, onDelete, onEdit, onMove }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");

  const { setNodeRef } = useDroppable({ id: col.id });

  const add = () => {
    if (!text.trim()) return;
    onAdd(col.id, text, priority);
    setText("");
  };

  return (
    <div ref={setNodeRef} className="column">
      <div className="col-header">
        <div className="col-title">
          <span className="col-dot" style={{ background: col.color }} />
          {col.label}
        </div>
        <span className="col-count">{tasks.length}</span>
      </div>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="cards-list">
          {tasks.length === 0 && (
            <div className="empty-state">Drop tasks here</div>
          )}

          {tasks.map((task) => (
            <Card
              key={task.id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
              onMove={onMove}
            />
          ))}
        </div>
      </SortableContext>

      <div className="add-task-form">
        <input
          className="add-task-input"
          value={text}
          placeholder={`Add to ${col.label}`}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="add-task-row">
          <select
            className="priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>

          <button
            className="add-btn"
            onClick={add}
            disabled={!text.trim()}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ================= APP =================
export default function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [search, setSearch] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (col, text, priority) => {
    setTasks((prev) => [
      ...prev,
      { id: genId(), text, priority, column: col },
    ]);
  };

  const deleteTask = (id) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const editTask = (id, text) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text } : t))
    );

  const moveTask = (id, toCol) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, column: toCol } : t
      )
    );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    let newColumn = over.id;
    const overTask = tasks.find((t) => t.id === over.id);
    if (overTask) newColumn = overTask.column;

    moveTask(active.id, newColumn);
  };

  const filtered = tasks.filter((t) =>
    t.text.toLowerCase().includes(search.toLowerCase())
  );

  const totalDone = tasks.filter((t) => t.column === "done").length;

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <span>Kanban</span>
          <span className="stat">
            {totalDone}/{tasks.length} done
          </span>
        </div>

        <div className="search-wrap">
          <input
            className="search-input"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="board">
          {COLS.map((col) => (
            <Column
              key={col.id}
              col={col}
              tasks={filtered.filter((t) => t.column === col.id)}
              onAdd={addTask}
              onDelete={deleteTask}
              onEdit={editTask}
              onMove={moveTask}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}