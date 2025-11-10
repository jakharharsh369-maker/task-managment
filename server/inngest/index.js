import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

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

// INNGEST FUNCTION TO DELETE USER FROM DATABASE
const deleteUserFromClerk = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.delete({
      where: { id: data.id },
    });
  }
);

// INNGEST FUNCTION TO UPDATE USER FROM DATABASE
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

// create an empty array where we will export future inngest functions
export const functions = [
  syncUserFromClerk,
  deleteUserFromClerk,
  updateUserFromClerk,
];
