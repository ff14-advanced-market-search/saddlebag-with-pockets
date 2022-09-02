import {ReactComponent as THMIcon} from './svg/ItemCategory_THM.svg'
import {FC}                        from "react"

type Props = {
    className?: string;
}

export const THM: FC<Props> = ({className = ''}) =>
    {
        return <THMIcon className={className}/>
    }
