import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useProjectStore = create(
  persist(
    (set) => ({
      projects: [],

      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, { id: Date.now(), ...project }],
        })),

      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      markComplete: (id) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, status: "Completed" } : p
          ),
        })),
    }),
    {
      name: "projects-storage", // key for localStorage
    }
  )
);
