import { useState } from "react";
import { useProjectStore } from "../Store/Projectstore";
import { Button } from "@mantine/core";
import FloatingLabelInput from "../Components/ui/FloatingLabelInput";

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

      <FloatingLabelInput
        label="Project name"
        placeholder="Enter project name"
        value={project.name}
        onChange={(e) => setProject({ ...project, name: e.target.value })}
      />

      <FloatingLabelInput
        label="Description"
        placeholder="Enter description"
        value={project.description}
        onChange={(e) =>
          setProject({ ...project, description: e.target.value })
        }
      />

      <Button onClick={handleAdd}>Add Project</Button>
    </div>
  );
}
