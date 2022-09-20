import { FilterFormat } from "~/utils/filters/index"
import { Shields }      from "~/components/icons/armor/Shields"
import { Head }         from "~/components/icons/armor/Head"
import { Body }         from "~/components/icons/armor/Body"
import { Legs }         from "~/components/icons/armor/Legs"
import { Hands }        from "~/components/icons/armor/Hands"
import { Feet }         from "~/components/icons/armor/Feet"

export const armor: FilterFormat[] = [
  {
    name: `Shields`,
    icon: Shields,
    id:   17,
  },
  {
    name: `Head`,
    icon: Head,
    id:   31,
  },
  {
    name: `Body`,
    icon: Body,
    id:   33,
  },
  {
    name: `Legs`,
    icon: Legs,
    id:   35,
  },
  {
    name: `Hands`,
    icon: Hands,
    id:   36,
  },
  {
    name: `Feet`,
    icon: Feet,
    id:   37,
  },
]
