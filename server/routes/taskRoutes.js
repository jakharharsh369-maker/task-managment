import express from "express";
import {
  createTask,
  deleteTask,
  updateTask,
  completeTask,
} from "../Controller/taskController.js";

const taskRouter = express.Router();

taskRouter.post("/", createTask);
taskRouter.put("/:id", updateTask);
taskRouter.post("/delete", deleteTask);
taskRouter.patch("/:id/complete", completeTask);

export default taskRouter;
