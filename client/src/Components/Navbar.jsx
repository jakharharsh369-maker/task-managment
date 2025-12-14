import {
  IconGauge,
  IconHome2,
  IconLogout,

} from "@tabler/icons-react";
import { Tooltip, UnstyledButton } from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";




import WorkspaceDropdown from "./WorkspaceDropdown";
import classes from "../css/NavbarMinimal.module.css";

function NavbarLink({ icon: Icon, label, active, onClick }) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const navItems = [
  { icon: IconHome2, label: "Home", path: "/home" },
  { icon: IconGauge, label: "Projects", path: "/projects" },
];

function NavbarMinimal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useClerk();

  return (
    <nav className={classes.navbar}>
      {/* Logo */}
      <div className="flex justify-center py-3">
        <h1 className="font-semibold">TaskFlow</h1>
      </div>

      {/* Workspace dropdown */}
      <WorkspaceDropdown />

      {/* Main navigation */}
      <div className={classes.navbarMain}>
        <div className="flex flex-col items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <NavbarLink
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={isActive}
                onClick={() => navigate(item.path)}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col items-center gap-1 pb-3">
        <NavbarLink
          icon={IconLogout}
          label="Logout"
          onClick={() => signOut()}
        />
      </div>
    </nav>
  );
}

export default NavbarMinimal;
