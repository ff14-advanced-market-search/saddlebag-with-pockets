import {ReactComponent as BTNIcon} from './svg/ItemCategory_BTN.svg'
import {FC}                        from "react"

type Props = {
    className?: string;
}

export const BTN: FC<Props> = ({className = ''}) =>
    {
        return <BTNIcon className={className}/>
    }
