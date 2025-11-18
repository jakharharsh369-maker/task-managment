import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Tasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Finish frontend layout", completed: false },
    { id: 2, title: "Write Clerk authentication logic", completed: true },
    { id: 3, title: "Fix Tailwind issues", completed: false },
  ]);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const activeTasks = tasks.filter((task) => !task.completed);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-start px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Your Active Tasks</h1>

        {activeTasks.length === 0 ? (
          <p className="text-gray-500">🎉 All tasks completed! Great job!</p>
        ) : (
          <ul className="w-full max-w-md space-y-3">
            {activeTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-xl shadow-sm"
              >
                <span className="text-lg">{task.title}</span>
                <button
                  onClick={() => toggleTask(task.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
                >
                  Done
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Tasks;
