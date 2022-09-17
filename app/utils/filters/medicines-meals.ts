import { FilterFormat } from '~/utils/filters/index'
import { Medicine } from '~/components/icons/medicines-meals/Medicine'
import { Ingredients } from '~/components/icons/medicines-meals/Ingredients'
import { Meals } from '~/components/icons/medicines-meals/Meals'
import { Seafood } from '~/components/icons/medicines-meals/Seafood'

export const medicinesMeals: FilterFormat[] = [
  {
    name: `Medicine`,
    icon: Medicine,
    id: 43
  },
  {
    name: `Ingredients`,
    icon: Ingredients,
    id: 44
  },
  {
    name: `Meals`,
    icon: Meals,
    id: 45
  },
  {
    name: `Seafood`,
    icon: Seafood,
    id: 46
  }
]
