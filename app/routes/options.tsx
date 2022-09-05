import { Outlet } from "@remix-run/react";
import type { SelectWorldInputFields } from "./options/index";

export type { SelectWorldInputFields };

export default function Options() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
