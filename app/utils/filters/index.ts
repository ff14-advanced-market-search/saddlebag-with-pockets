import {arms}           from "~/utils/filters/arms"
import {tools}          from "~/utils/filters/tools"
import {ReactNode}      from "react"
import {armor}          from "~/utils/filters/armor"
import {accessories}    from "~/utils/filters/accessories"
import {materials}      from "~/utils/filters/materials"
import {medicinesMeals} from "~/utils/filters/medicines-meals"
import {other}          from "~/utils/filters/other"

export type FilterFormat = {
    name: string, abbreviation?: string, icon: ReactNode,
}
type FiltersList = {
    name: string, data: FilterFormat[]
}[]

const filters: FiltersList = [
    {
        name: "Arms",
        data: arms
    },
    {
        name: "Tools",
        data: tools
    },
    {
        name: "Armor",
        data: armor
    },
    {
        name: "Accessories",
        data: accessories
    },
    {
        name: "Medicines & Meals",
        data: medicinesMeals
    },
    {
        name: "Materials",
        data: materials
    },
    {
        name: "Other",
        data: other
    }
]


export default filters
