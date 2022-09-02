import {ReactComponent as MCHIcon} from './svg/ItemCategory_MCH.svg'
import {FC}                        from "react"

type Props = {
    className?: string;
}

export const MCH: FC<Props> = ({className = ''}) =>
    {
        return <MCHIcon className={className}/>
    }
