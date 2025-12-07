import { useState } from "react";
import { useProjectStore } from "../Store/Projectstore";
import { Plus } from "lucide-react";

export default function CreateProjectDialog({ isOpen, setIsOpen }) {
  const addProject = useProjectStore((state) => state.addProject);
  const [project, setProject] = useState({ name: "", description: "" });

  const handleSubmit = () => {
    if (!project.name.trim()) return;
    addProject(project);
    setProject({ name: "", description: "" });
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 space-y-4">
        <h2 className="text-xl font-bold">New Project</h2>

        <input
          type="text"
          placeholder="Project name"
          value={project.name}
          onChange={(e) => setProject({ ...project, name: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />

        <textarea
          placeholder="Description"
          value={project.description}
          onChange={(e) =>
            setProject({ ...project, description: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Add Project
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-600 w-full mt-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
