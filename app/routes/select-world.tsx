import {Outlet} from "@remix-run/react";
import type {SelectWorldInputFields} from "./select-world/index";

export type {SelectWorldInputFields};

export default function SelectWorld() {
    return (<div>
        <Outlet/>
    </div>)
}
