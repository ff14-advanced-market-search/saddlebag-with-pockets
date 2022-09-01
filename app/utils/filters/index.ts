import {arms} from "~/utils/filters/arms";
import {tools} from "~/utils/filters/tools";
import {ReactNode} from "react";
import {armor} from "~/utils/filters/armor";

export type FilterFormat = {
    name: string, abbreviation?: string, icon: ReactNode,
}

export default [{
    name: "Arms", data: arms
}, {
    name: "Tools", data: tools
}, {name: "Armor", data: armor}]
