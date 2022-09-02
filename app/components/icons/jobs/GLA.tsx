import {ReactComponent as GLAIcon} from './svg/ItemCategory_GLA.svg'
import {FC}                        from "react"

type Props = {
    className?: string;
}

export const GLA: FC<Props> = ({className = ''}) =>
    {
        return <GLAIcon className={className}/>
    }
