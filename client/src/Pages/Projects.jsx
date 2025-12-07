import { useState } from "react";
import { useProjectStore } from "../Store/Projectstore";
import CreateProjectDialog from "../Components/CreateProjectDialog";

export default function Projects() {
  const projects = useProjectStore((state) => state.projects);
  const removeProject = useProjectStore((state) => state.removeProject);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-gray-500 text-sm">
            Manage and track your projects
          </p>
        </div>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <p className="text-black-100 text-center py-10 font-bold ">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow transition space-y-3"
            >
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="text-gray-500 text-sm">
                {project.description || "No description"}
              </p>

              <button
                onClick={() => removeProject(project.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Keep dialog but don't trigger automatically */}
      <CreateProjectDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </div>
  );
}
