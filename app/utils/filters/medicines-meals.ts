import {FilterFormat} from "~/utils/filters/index"
import {Medicine}     from "~/components/icons/medicines-meals/Medicine"
import {Ingredients}  from "~/components/icons/medicines-meals/Ingredients"
import {Meals}        from "~/components/icons/medicines-meals/Meals"
import {Seafood}      from "~/components/icons/medicines-meals/Seafood"

export const medicinesMeals: FilterFormat[] = [
    {
        name: `Medicine`,
        icon: Medicine
    },
    {
        name: `Ingredients`,
        icon: Ingredients
    },
    {
        name: `Meals`,
        icon: Meals
    },
    {
        name: `Seafood`,
        icon: Seafood
    },
]
