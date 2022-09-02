import {ReactComponent as Icon} from './svg/ItemCategory_ExteriorFixtures.svg'
import {FC}                     from "react"

type Props = {
    className?: string;
}

export const ExteriorFixtures: FC<Props> = ({className = ''}) =>
    {
        return <Icon className={className}/>
    }
