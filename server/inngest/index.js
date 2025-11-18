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

    await prisma.user.deleteMany({
      where: { id: data.id },
    });

    return "User deleted successfully";
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
//inggest function to save workspace data to database
const syncWorkspaceCreation = inngest.createFunction(
    { id: "sync-workspace-from-clerk" },
    {event: "clerk/organization.created" },
    async ({ event}) => {
        const { data } = event;
        await prisma.workspace.create ({
            data: {
                id: data.id,
                name: data.name,
                slug: data.slug,
                ownerId: data.created_by,
                image_url: data.image_url,
            },
        })
        // add creator as admin member 
        await prisma.workspaceMember.create({
            data: {
                userId: data.created_by,
                workspaceId: data.id,
                role: "ADMIN",
            },
        }); 

    }

)
//inngest function to update workspace data from database
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
// inngest function to delete workspace data from database
const syncWorkspaceDeletion = inngest.createFunction(
    { id: "delete-workspace-from-clerk" },
    { event: "clerk/organization.deleted" },
    async ({ event }) => {
        const { data } = event;
        await prisma.workspace.delete({
            where: { id: data.id}
        })

    }
)
//inngest function to save workspace member data to a database
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


// create an empty array where we will export future inngest functions
export const functions = [
  syncUserFromClerk,
  deleteUserFromClerk,
  updateUserFromClerk,
    syncWorkspaceCreation,
    syncWorkspaceUpdation,
    syncWorkspaceDeletion,
    syncWorkspaceMemberCreation,
];
