import { useState } from "react";
import { useProjectStore } from "../Store/Projectstore";

export default function Home() {
  const addProject = useProjectStore((state) => state.addProject);
  const [project, setProject] = useState({ name: "", description: "" });

  const handleAdd = () => {
    if (!project.name.trim()) return;
    addProject(project);
    setProject({ name: "", description: "" });
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Add Project</h1>
      

      <input
        type="text"
        placeholder="Project name"
        value={project.name}
        onChange={(e) => setProject({ ...project, name: e.target.value })}
        className="w-full border px-3 py-2"
      />

      <textarea
        placeholder="Description"
        value={project.description}
        onChange={(e) =>
          setProject({ ...project, description: e.target.value })
        }
        className="w-full border px-3 py-2"
      />

      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Project
      </button>
    </div>
  );
}
