import {ReactComponent as FSHIcon} from './svg/ItemCategory_FSH.svg'
import {FC}                        from "react"

type Props = {
    className?: string;
}

export const FSH: FC<Props> = ({className = ''}) =>
    {
        return <FSHIcon className={className}/>
    }
