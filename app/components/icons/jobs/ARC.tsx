import {ReactComponent as ARCIcon} from './svg/ItemCategory_ARC.svg'
import {FC}                        from "react"

type Props = {
    className?: string;
}

export const ARC: FC<Props> = ({className = ''}) =>
    {
        return <ARCIcon className={className}/>
    }
