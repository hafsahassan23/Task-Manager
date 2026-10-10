import { useEffect, useState } from "react";
import API from "../api";

const P = ["Low", "Medium", "High"];
const S = ["Not Started", "In Progress", "Completed"];
const C = ["success", "warning", "danger"];

const empty = { title: "", description: "", priority: 1 };

const priorityColors = [
  { background: "#dcfce7", color: "#166534" },
  { background: "#fef3c7", color: "#92400e" },
  { background: "#fee2e2", color: "#991b1b" },
];

const statusColors = [
  { background: "#f1f5f9", color: "#475569" },
  { background: "#dbeafe", color: "#1d4ed8" },
  { background: "#dcfce7", color: "#166534" },
];

const primary = "#0866e9";
const navy = "#071d52";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    try {
      setError("");
      const res = await API.get("/tasks/get_all_tasks");
      setTasks(res.data?.tasks || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load tasks. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "priority" ? Number(value) : value,
    }));
  };

  const open = (task = null) => {
    setError("");
    setNotice("");
    setEditId(task?._id || null);
    setForm(
      task
        ? {
            title: task.title || "",
            description: task.description || "",
            priority: Number(task.priority ?? 1),
          }
        : { ...empty }
    );
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editId) {
        await API.put(`/tasks/update_task/${editId}`, form);
        setNotice("Task updated successfully.");
      } else {
        await API.post("/tasks/create_task", form);
        setNotice("Task created successfully.");
      }

      setModal(false);
      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save task. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await API.delete(`/tasks/delete_task/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      setNotice("Task deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete task. Please try again."
      );
    }
  };

  const changeStatus = async (task) => {
    const currentStatus = Number(task.status ?? 0);
    const nextStatus = (currentStatus + 1) % S.length;

    setError("");
    setNotice("");

    try {
      await API.put(`/tasks/update_task/${task._id}`, {
        status: nextStatus,
      });

      setTasks((prev) =>
        prev.map((item) =>
          item._id === task._id
            ? { ...item, status: nextStatus }
            : item
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update task status."
      );
    }
  };

  const getPriority = (task) => {
    const value = Number(task.priority ?? 0);
    return P[value] || "Low";
  };

  const getStatus = (task) => {
    const value = Number(task.status ?? 0);
    return S[value] || "Not Started";
  };

  const normalizedSearch = search.trim().toLowerCase();

  const list = tasks.filter((task) => {
    const matchesSearch =
      (task.title || "").toLowerCase().includes(normalizedSearch) ||
      (task.description || "").toLowerCase().includes(normalizedSearch);

    const matchesPriority =
      filter === "" || Number(task.priority ?? 0) === Number(filter);

    const matchesStatus =
      statusFilter === "" ||
      Number(task.status ?? 0) === Number(statusFilter);

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const completed = tasks.filter(
    (task) => Number(task.status ?? 0) === 2
  ).length;

  const inProgress = tasks.filter(
    (task) => Number(task.status ?? 0) === 1
  ).length;

  const notStarted = tasks.filter(
    (task) => Number(task.status ?? 0) === 0
  ).length;

  const completionRate = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const statCards = [
    {
      label: "Total Tasks",
      value: tasks.length,
      icon: "▤",
      color: "#0866e9",
      background: "#eaf2ff",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: "◷",
      color: "#b45309",
      background: "#fff7e6",
    },
    {
      label: "Completed",
      value: completed,
      icon: "✓",
      color: "#15803d",
      background: "#e8f8ed",
    },
    {
      label: "Not Started",
      value: notStarted,
      icon: "○",
      color: "#64748b",
      background: "#f1f5f9",
    },
  ];

  return (
    <div
      className="container-fluid px-3 px-md-4 px-xl-5 pb-5"
      style={{ maxWidth: 1600, color: "#17233c" }}
    >
      <style>{`
        .task-page {
          font-family: Inter, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }
        .task-stat {
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .task-stat:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(7,29,82,.08) !important;
        }
        .task-primary {
          background: ${primary};
          border-color: ${primary};
          color: #fff;
        }
        .task-primary:hover {
          background: ${navy};
          border-color: ${navy};
          color: #fff;
        }
        .task-control {
          min-height: 44px;
          border-radius: 10px;
          border-color: #e2e8f0;
          font-size: .92rem;
        }
        .task-control:focus {
          border-color: ${primary};
          box-shadow: 0 0 0 .2rem rgba(8,102,233,.12);
        }
        .task-table thead th {
          background: #f8fafc;
          color: #64748b;
          font-size: .75rem;
          font-weight: 700;
          letter-spacing: .055em;
          text-transform: uppercase;
          padding: 16px;
          white-space: nowrap;
          border-bottom: 1px solid #e9eef5;
        }
        .task-table tbody td {
          padding: 17px 16px;
          border-color: #edf1f6;
        }
        .task-table tbody tr:hover td {
          background: #f9fbff;
        }
        .task-action {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          font-size: .83rem;
        }
        .task-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1040;
          background: rgba(7, 19, 45, .55);
          backdrop-filter: blur(4px);
        }
        .task-modal {
          position: fixed;
          inset: 0;
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          overflow-y: auto;
        }
        @media (max-width: 575px) {
          .task-page-heading { font-size: 1.65rem !important; }
          .task-modal-card { width: 100% !important; }
        }
      `}</style>

      <div className="task-page">
        {/* Page heading */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <div
              className="small fw-semibold mb-2"
              style={{ color: primary }}
            >
              WORKSPACE / TASKS
            </div>
            <h1
              className="task-page-heading fw-bold mb-2"
              style={{ color: navy, fontSize: "2rem", letterSpacing: "-1px" }}
            >
              My Tasks
            </h1>
            <p className="text-secondary mb-0">
              Organize your work, track progress and get things done.
            </p>
          </div>

          <button
            type="button"
            className="btn task-primary fw-semibold px-4 py-3 rounded-3"
            onClick={() => open()}
          >
            <span className="me-2">+</span> Create New Task
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div
            className="alert alert-danger d-flex justify-content-between align-items-start gap-3 rounded-3"
            role="alert"
          >
            <span>{error}</span>
            <button
              type="button"
              className="btn-close"
              aria-label="Dismiss error"
              onClick={() => setError("")}
            />
          </div>
        )}

        {notice && (
          <div
            className="alert alert-success d-flex justify-content-between align-items-start gap-3 rounded-3"
            role="status"
          >
            <span>{notice}</span>
            <button
              type="button"
              className="btn-close"
              aria-label="Dismiss notification"
              onClick={() => setNotice("")}
            />
          </div>
        )}

        {/* Statistics */}
        <div className="row g-3 mb-4">
          {statCards.map((stat) => (
            <div className="col-6 col-xl-3" key={stat.label}>
              <div
                className="task-stat bg-white rounded-4 border p-3 p-md-4 h-100"
                style={{
                  borderColor: "#e9eef5",
                  boxShadow: "0 3px 14px rgba(7,29,82,.035)",
                }}
              >
                <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                  <span className="text-secondary small fw-medium">
                    {stat.label}
                  </span>
                  <span
                    className="d-inline-flex align-items-center justify-content-center rounded-3 fw-bold"
                    style={{
                      width: 38,
                      height: 38,
                      background: stat.background,
                      color: stat.color,
                      fontSize: "1.25rem",
                    }}
                  >
                    {stat.icon}
                  </span>
                </div>
                <div
                  className="fw-bold"
                  style={{
                    fontSize: "2rem",
                    lineHeight: 1.2,
                    color: navy,
                  }}
                >
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Completion overview */}
        <div
          className="bg-white border rounded-4 p-4 mb-4"
          style={{ borderColor: "#e9eef5" }}
        >
          <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
            <div>
              <h6 className="fw-bold mb-1">Overall Progress</h6>
              <p className="small text-secondary mb-0">
                Your task completion rate
              </p>
            </div>
            <span className="fw-bold" style={{ color: primary }}>
              {completionRate}%
            </span>
          </div>

          <div
            className="progress"
            role="progressbar"
            aria-label="Task completion"
            aria-valuenow={completionRate}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ height: 9, background: "#edf2f8", borderRadius: 20 }}
          >
            <div
              className="progress-bar"
              style={{
                width: `${completionRate}%`,
                background: `linear-gradient(90deg, ${navy}, ${primary})`,
                borderRadius: 20,
                transition: "width .3s ease",
              }}
            />
          </div>
        </div>

        {/* Task management */}
        <div
          className="bg-white border rounded-4 overflow-hidden"
          style={{
            borderColor: "#e9eef5",
            boxShadow: "0 5px 24px rgba(7,29,82,.035)",
          }}
        >
          <div className="p-3 p-md-4 border-bottom">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: navy }}>
                  All Tasks
                </h5>
                <p className="text-secondary small mb-0">
                  {list.length} {list.length === 1 ? "task" : "tasks"} found
                </p>
              </div>

              <button
                type="button"
                className="btn btn-light border rounded-3 btn-sm px-3 py-2"
                onClick={load}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "↻ Refresh"}
              </button>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6 col-xl-5">
                <div className="position-relative">
                  <input
                    type="search"
                    className="form-control task-control ps-5"
                    placeholder="Search title or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search tasks"
                  />
                  <span
                    className="position-absolute top-50 translate-middle-y"
                    style={{ left: 17, color: "#94a3b8" }}
                    aria-hidden="true"
                  >
                    ⌕
                  </span>
                </div>
              </div>

              <div className="col-6 col-md-3 col-xl-3">
                <select
                  className="form-select task-control"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  aria-label="Filter by priority"
                >
                  <option value="">All Priorities</option>
                  {P.map((item, index) => (
                    <option key={item} value={index}>
                      {item} Priority
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-6 col-md-3 col-xl-4">
                <select
                  className="form-select task-control"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter by status"
                >
                  <option value="">All Statuses</option>
                  {S.map((item, index) => (
                    <option key={item} value={index}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Task table */}
          <div className="table-responsive">
            <table className="table task-table align-middle mb-0">
              <thead>
                <tr>
                  <th>Task Details</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      <div
                        className="spinner-border spinner-border-sm me-2"
                        style={{ color: primary }}
                        role="status"
                      />
                      <span className="text-secondary">
                        Loading your tasks...
                      </span>
                    </td>
                  </tr>
                ) : list.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5 px-3">
                      <div
                        className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-4"
                        style={{
                          width: 60,
                          height: 60,
                          background: "#eaf2ff",
                          color: primary,
                          fontSize: "1.8rem",
                        }}
                      >
                        ✓
                      </div>
                      <h6 className="fw-bold" style={{ color: navy }}>
                        {tasks.length === 0
                          ? "Your workspace is ready"
                          : "No matching tasks"}
                      </h6>
                      <p
                        className="text-secondary small mx-auto mb-3"
                        style={{ maxWidth: 360 }}
                      >
                        {tasks.length === 0
                          ? "Create your first task and start organizing your work."
                          : "Try changing your search or filters to find a task."}
                      </p>
                      {tasks.length === 0 ? (
                        <button
                          type="button"
                          className="btn task-primary rounded-3 px-4"
                          onClick={() => open()}
                        >
                          + Create your first task
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-light border rounded-3"
                          onClick={() => {
                            setSearch("");
                            setFilter("");
                            setStatusFilter("");
                          }}
                        >
                          Clear filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  list.map((task) => {
                    const priority = Number(task.priority ?? 0);
                    const currentStatus = Number(task.status ?? 0);
                    const priorityStyle =
                      priorityColors[priority] || priorityColors[0];
                    const statusStyle =
                      statusColors[currentStatus] || statusColors[0];

                    return (
                      <tr key={task._id}>
                        <td style={{ minWidth: 230, maxWidth: 400 }}>
                          <div className="fw-semibold mb-1">
                            {task.title}
                          </div>
                          <div
                            className="text-secondary small"
                            style={{
                              overflowWrap: "anywhere",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {task.description || "No description provided"}
                          </div>
                        </td>

                        <td>
                          <span
                            className="badge rounded-pill px-3 py-2"
                            style={{
                              background: priorityStyle.background,
                              color: priorityStyle.color,
                              fontSize: ".76rem",
                              fontWeight: 600,
                            }}
                          >
                            {getPriority(task)}
                          </span>
                        </td>

                        <td style={{ minWidth: 155 }}>
                          <button
                            type="button"
                            className="btn btn-sm rounded-pill px-3 py-2 border-0"
                            style={{
                              background: statusStyle.background,
                              color: statusStyle.color,
                              fontWeight: 600,
                              fontSize: ".76rem",
                            }}
                            onClick={() => changeStatus(task)}
                            title="Click to move to the next status"
                            aria-label={`Change status for ${task.title}. Current status: ${getStatus(task)}`}
                          >
                            {getStatus(task)} ↻
                          </button>
                        </td>

                        <td style={{ minWidth: 100 }}>
                          <div className="d-flex align-items-center gap-2">
                            <button
                              type="button"
                              className="btn btn-outline-primary task-action"
                              onClick={() => open(task)}
                              title="Edit task"
                              aria-label={`Edit ${task.title}`}
                            >
                              ✎
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger task-action"
                              onClick={() => remove(task._id)}
                              title="Delete task"
                              aria-label={`Delete ${task.title}`}
                            >
                              ×
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="px-3 px-md-4 py-3 border-top d-flex flex-wrap justify-content-between gap-2">
            <small className="text-secondary">
              Showing {list.length} of {tasks.length} tasks
            </small>
            <small className="text-secondary">
              Keep moving forward, one task at a time.
            </small>
          </div>
        </div>

        {/* Create / Edit modal */}
        {modal && (
          <>
            <div
              className="task-modal-backdrop"
              onClick={() => {
                if (!saving) setModal(false);
              }}
            />

            <div
              className="task-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="task-modal-title"
            >
              <form
                className="task-modal-card bg-white rounded-4 overflow-hidden"
                onSubmit={save}
                style={{
                  width: 520,
                  maxWidth: "100%",
                  boxShadow: "0 25px 80px rgba(7,29,82,.25)",
                }}
              >
                <div
                  className="p-4 d-flex justify-content-between align-items-center"
                  style={{
                    background: `linear-gradient(135deg, ${navy}, ${primary})`,
                  }}
                >
                  <div>
                    <div
                      className="small mb-1"
                      style={{ color: "#bfdbfe" }}
                    >
                      TASK MANAGEMENT
                    </div>
                    <h5
                      id="task-modal-title"
                      className="text-white fw-bold mb-0"
                    >
                      {editId ? "Edit Task" : "Create New Task"}
                    </h5>
                  </div>

                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setModal(false)}
                    disabled={saving}
                    aria-label="Close"
                  />
                </div>

                <div className="p-4">
                  {error && (
                    <div className="alert alert-danger small" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="mb-3">
                    <label
                      htmlFor="task-title"
                      className="form-label fw-semibold small"
                    >
                      Task Title <span className="text-danger">*</span>
                    </label>
                    <input
                      id="task-title"
                      required
                      maxLength={150}
                      name="title"
                      className="form-control task-control"
                      placeholder="e.g. Complete project documentation"
                      value={form.title}
                      onChange={change}
                      autoFocus
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="task-description"
                      className="form-label fw-semibold small"
                    >
                      Description
                    </label>
                    <textarea
                      id="task-description"
                      name="description"
                      className="form-control task-control"
                      style={{ minHeight: 110 }}
                      rows={4}
                      maxLength={2000}
                      placeholder="Describe what needs to be done..."
                      value={form.description}
                      onChange={change}
                    />
                  </div>

                  <div className="mb-2">
                    <label
                      htmlFor="task-priority"
                      className="form-label fw-semibold small"
                    >
                      Priority
                    </label>
                    <select
                      id="task-priority"
                      name="priority"
                      className="form-select task-control"
                      value={form.priority}
                      onChange={change}
                    >
                      {P.map((item, index) => (
                        <option key={item} value={index}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-4 pt-0 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-light border rounded-3 px-4 py-2"
                    onClick={() => setModal(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn task-primary rounded-3 px-4 py-2 fw-semibold"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editId
                        ? "Save Changes"
                        : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}