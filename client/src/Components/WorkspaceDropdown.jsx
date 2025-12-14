import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace } from "../features/workspaceSlice";
import { useNavigate } from "react-router-dom";

import {
  useClerk,
  useOrganizationList,
  useOrganization,
} from "@clerk/clerk-react";

function WorkspaceDropdown() {
  const { setActive, userMemberships, isLoaded } = useOrganizationList({
    userMemberships: true,
  });

  const { organization: activeOrgFromClerk } = useOrganization();
  const { openCreateOrganization } = useClerk();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const workspaces = userMemberships?.data || [];

  const currentWorkspaceId = useSelector(
    (state) => state.workspace?.currentWorkspace || null
  );

  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const onSelectWorkspace = async (organizationId) => {
    await setActive({ organization: organizationId });
    dispatch(setCurrentWorkspace(organizationId)); 
    setIsOpen(false);
    navigate("/");
  };

  // Close dropdown click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync Clerk active organization to Redux on refresh
  useEffect(() => {
    if (
      activeOrgFromClerk?.id &&
      currentWorkspaceId !== activeOrgFromClerk.id
    ) {
      dispatch(setCurrentWorkspace(activeOrgFromClerk.id));
    }
  }, [activeOrgFromClerk, currentWorkspaceId, dispatch]);

  return (
    <div className="relative m-4" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-3 h-auto text-left rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
      >
        <div className="flex items-center gap-3">
          <img
            src={activeOrgFromClerk?.imageUrl}
            alt={activeOrgFromClerk?.name}
            className="w-8 h-8 rounded shadow"
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
              {activeOrgFromClerk?.name || "Select Workspace"}
            </p>
            {/* <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
              {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}
            </p> */}
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-zinc-400 flex-shrink-" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded shadow-lg top-full left-0">
          <div className="p-2">
            <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2 px-2">
              Workspaces
            </p>

            {workspaces.map(({ organization }) => (
              <div
                key={organization.id}
                onClick={() => onSelectWorkspace(organization.id)}
                className="flex items-center gap-3 p-2 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <img
                  src={organization.imageUrl}
                  alt={organization.name}
                  className="w-6 h-6 rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                    {organization.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                    {organization.membersCount || 0} members
                  </p>
                </div>

                {/* 🔥 Show active selected workspace */}
                {activeOrgFromClerk?.id === organization.id && (
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                )}
              </div>
            ))}
          </div>

          <hr className="border-gray-200 dark:border-zinc-700" />

          <div
            onClick={() => {
              openCreateOrganization();
              setIsOpen(false);
            }}
            className="p-2 cursor-pointer rounded group hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <p className="flex items-center text-xs gap-2 my-1 w-full text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300">
              <Plus className="w-4 h-4" /> Create Workspace
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkspaceDropdown;
