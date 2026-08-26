import { useEffect, useState } from "react";
import API from "../api";

const P = ["Low", "Medium", "High"],
  S = ["Not Started", "In Progress", "Completed"];
const C = ["success", "warning", "danger"],
  empty = { title: "", description: "", priority: 1 };

export default function Tasks() {
  const [tasks, setTasks] = useState([]),
    [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null),
    [modal, setModal] = useState(false);
  const [search, setSearch] = useState(""),
    [filter, setFilter] = useState("");

  const load = async () => {
    try {
      const res = await API.get("/tasks/get_all_tasks");
      setTasks(res.data?.tasks || []);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const open = (t = null) => {
    setEditId(t?._id || null);
    setForm(
      t
        ? { title: t.title, description: t.description, priority: t.priority }
        : empty,
    );
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    editId
      ? await API.put(`/tasks/update_task/${editId}`, form)
      : await API.post("/tasks/create_task", form);
    setModal(false);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this task?")) return;
    await API.delete(`/tasks/delete_task/${id}`);
    load();
  };

  const status = async (t) => {
    await API.put(`/tasks/update_task/${t._id}`, {
      status: (t.status + 1) % 3,
    });
    load();
  };

  const list = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "" || t.priority == filter),
  );

  return (
    <div className="container py-5" style={{ maxWidth: 1400 }}>
      <h2 className="fw-bold">My Tasks</h2>
      <p className="text-muted">View and manage your tasks in one place.</p>

      <div className="bg-white border rounded-4 shadow-sm p-4">
        <div className="row g-3 mb-4">
          <div className="col-md-5">
            <input
              className="form-control"
              placeholder=" Search tasks..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Priorities</option>
              {P.map((x, i) => (
                <option key={x} value={i}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary w-100" onClick={() => open()}>
              + Add Task
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr key={t._id}>
                  <td className="fw-semibold">{t.title}</td>
                  <td className="text-muted">{t.description || "-"}</td>
                  <td>
                    <span className={`badge bg-${C[t.priority]}`}>
                      {P[t.priority]}
                    </span>
                  </td>
                  <td>
                    <button
                      className="badge bg-secondary border-0"
                      onClick={() => status(t)}
                    >
                      {S[t.status]}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => open(t)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => remove(t._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <>
          <div className="modal d-block" style={{ background: "#0006" }}>
            <div className="modal-dialog modal-dialog-centered">
              <form className="modal-content border-0 shadow" onSubmit={save}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editId ? "Edit Task" : "Add New Task"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <input
                    required
                    name="title"
                    className="form-control mb-3"
                    placeholder="Task title"
                    value={form.title}
                    onChange={change}
                  />
                  <textarea
                    name="description"
                    className="form-control mb-3"
                    rows="3"
                    placeholder="Description"
                    value={form.description}
                    onChange={change}
                  />
                  <select
                    name="priority"
                    className="form-select"
                    value={form.priority}
                    onChange={change}
                  >
                    {P.map((x, i) => (
                      <option key={x} value={i}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary">
                    {editId ? "Update Task" : "Add Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
