import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";
import sendEmail from "../configs/nodemailer.js";

export const inngest = new Inngest({ id: "TASK-MANAGEMENT" });

const syncUserFromClerk = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.create({
      data: {
        id: data.id,
        email: data?.email_addresses?.[0]?.email_address || null,
        name: `${data?.first_name ?? ""} ${data?.last_name ?? ""}`.trim(),
        image: data?.image_url ?? "",
      },
    });
  }
);

const deleteUserFromClerk = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.deleteMany({
      where: { id: data.id },
    });

    return "User deleted successfully";
  }
);

const updateUserFromClerk = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data?.email_addresses?.[0]?.email_address || null,
        name: `${data?.first_name ?? ""} ${data?.last_name ?? ""}`.trim(),
        image: data?.image_url ?? "",
      },
    });
  }
);

const syncWorkspaceCreation = inngest.createFunction(
  { id: "sync-workspace-from-clerk" },
  { event: "clerk/organization.created" },
  async ({ event }) => {
    const { data } = event;

    await prisma.workspace.create({
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        ownerId: data.created_by,
        image_url: data.image_url,
      },
    });

    await prisma.workspaceMember.create({
      data: {
        userId: data.created_by,
        workspaceId: data.id,
        role: "ADMIN",
      },
    });
  }
);

const syncWorkspaceUpdation = inngest.createFunction(
  { id: "update-workspace-from-clerk" },
  { event: "clerk/organization.updated" },
  async ({ event }) => {
    const { data } = event;

    await prisma.workspace.update({
      where: { id: data.id },
      data: {
        name: data.name,
        slug: data.slug,
        image_url: data.image_url,
      },
    });

    return "Workspace updated successfully";
  }
);

const syncWorkspaceDeletion = inngest.createFunction(
  { id: "delete-workspace-from-clerk" },
  { event: "clerk/organization.deleted" },
  async ({ event }) => {
    const { data } = event;

    await prisma.workspace.delete({
      where: { id: data.id },
    });
  }
);

const syncWorkspaceMemberCreation = inngest.createFunction(
  { id: "sync-workspace-member-from-clerk" },
  { event: "clerk/organization.invitation.accepted" },
  async ({ event }) => {
    const { data } = event;

    await prisma.workspaceMember.create({
      data: {
        userId: data.user_id,
        workspaceId: data.organization_id,
        role: String(data.role_name).toUpperCase(),
      },
    });

    return "Workspace member created successfully";
  }
);

const sendTaskCreationEmail = inngest.createFunction(
  { id: "send-task-creation-email" },
  { event: "app/task.assigned" },
  async ({ event, step }) => {
    const { taskID, origin } = event.data;

    const task = await prisma.task.findUnique({
      where: { id: taskID },
      include: { assignee: true, project: true },
    });

    await sendEmail({
      to: task.assignee.email,
      subject: `New Task Assigned in ${task.project.name}`,
      body: `Hi ${task.assignee.name}, you have been assigned a new task '${
        task.title
      }' due on ${new Date(
        task.due_date
      ).toLocaleDateString()}. <a href=${origin}>View Task</a>`,
    });

    if (
      new Date(task.due_date).toLocaleDateString() !==
      new Date().toLocaleDateString()
    ) {
      await step.sleepUntil("wait-for-the-due-date", new Date(task.due_date));

      await step.run("check-if-task-is-completed", async () => {
        const updatedTask = await prisma.task.findUnique({
          where: { id: taskID },
          include: { assignee: true, project: true },
        });

        if (!updatedTask) return;

        if (updatedTask.status !== "DONE") {
          await step.run("send-task-reminder-mail", async () => {
            await sendEmail({
              to: updatedTask.assignee.email,
              subject: `Reminder for ${updatedTask.project.name}`,
              body: `<div style="max-width:600px;">
                <h2>Hi ${updatedTask.assignee.name},</h2>
                <p style="font-size:16px;">You have a pending task in ${
                  updatedTask.project.name
                }:</p>
                <p style="font-size:18px;font-weight:bold;color:#007bff;margin:8px 0;">${
                  updatedTask.title
                }</p>
                <div style="border:1px solid #ddd;padding:12px 16px;border-radius:6px;margin-bottom:30px;">
                  <p style="margin:6px 0;"><strong>Due Date:</strong> ${new Date(
                    updatedTask.due_date
                  ).toLocaleDateString()}</p>
                </div>
                <a href="${origin}" style="display:inline-block;padding:12px 20px;background-color:#28a745;color:#fff;text-decoration:none;border-radius:4px;">View Task</a>
                <p style="margin-top:30px;font-size:14px;color:#555;">Please make sure to complete it before due date.</p>
              </div>`,
            });
          });
        }
      });
    }
  }
);

export const functions = [
  syncUserFromClerk,
  deleteUserFromClerk,
  updateUserFromClerk,
  syncWorkspaceCreation,
  syncWorkspaceUpdation,
  syncWorkspaceDeletion,
  syncWorkspaceMemberCreation,
  sendTaskCreationEmail,
];
