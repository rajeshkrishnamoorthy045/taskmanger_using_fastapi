import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // Optional: you can add custom CSS here

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:8000/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const addTask = async () => {
    try {
      const res = await axios.post("http://localhost:8000/tasks", {
        ...newTask,
        completed: false,
      });
      setTasks([...tasks, res.data]);
      setNewTask({ title: "", description: "" });
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      await axios.put(`http://localhost:8000/tasks/${id}`, updatedTask);
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto shadow-lg bg-white rounded-xl p-6">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
          🚀 Task Manager
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            className="form-control border border-blue-300 rounded-md shadow-sm"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.target.value })
            }
          />
          <input
            className="form-control border border-blue-300 rounded-md shadow-sm"
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
        </div>

        <div className="text-end mb-6">
          <button
            onClick={addTask}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            ➕ Add Task
          </button>
        </div>

        <div className="overflow-auto">
          <table className="table table-hover table-bordered">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>📝 Title</th>
                <th>📄 Description</th>
                <th>Status</th>
                <th className="text-center">⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No tasks available.
                  </td>
                </tr>
              )}
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    <span
                      className={`badge ${
                        task.completed ? "bg-success" : "bg-warning text-dark"
                      }`}
                    >
                      {task.completed ? "Done" : "Pending"}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-success me-2"
                      onClick={() =>
                        updateTask(task.id, {
                          ...task,
                          completed: !task.completed,
                        })
                      }
                    >
                      {task.completed ? "Undo" : "Complete"}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteTask(task.id)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
