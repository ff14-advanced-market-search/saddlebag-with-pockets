import {ReactComponent as Icon} from './svg/ItemCategory_Miscellany.svg'
import {FC}                     from "react"

type Props = {
    className?: string;
}

export const RegistrableMiscellany: FC<Props> = ({className = ''}) =>
    {
        return <Icon className={className}/>
    }
