import {ReactComponent as BSMIcon} from './svg/ItemCategory_BSM.svg'
import {FC}                        from "react"

type Props = {
    className?: string;
}

export const BSM: FC<Props> = ({className = ''}) =>
    {
        return <BSMIcon className={className}/>
    }
