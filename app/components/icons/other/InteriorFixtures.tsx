import {ReactComponent as Icon} from './svg/ItemCategory_InteriorFixtures.svg'
import {FC}                     from "react"

type Props = {
    className?: string;
}

export const InteriorFixtures: FC<Props> = ({className = ''}) =>
    {
        return <Icon className={className}/>
    }
