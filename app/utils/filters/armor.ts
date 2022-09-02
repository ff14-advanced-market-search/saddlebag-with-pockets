import {FilterFormat} from "~/utils/filters/index"
import {Shields}      from "~/components/icons/armor/Shields"
import {Head}         from "~/components/icons/armor/Head"
import {Body}         from "~/components/icons/armor/Body"
import {Legs}         from "~/components/icons/armor/Legs"
import {Hands}        from "~/components/icons/armor/Hands"
import {Feet}         from "~/components/icons/armor/Feet"

export const armor: FilterFormat[] = [
    {
        name: `Shields`,
        icon: Shields
    },
    {
        name: `Head`,
        icon: Head
    },
    {
        name: `Body`,
        icon: Body
    },
    {
        name: `Legs`,
        icon: Legs
    },
    {
        name: `Hands`,
        icon: Hands
    },
    {
        name: `Feet`,
        icon: Feet
    },
]
