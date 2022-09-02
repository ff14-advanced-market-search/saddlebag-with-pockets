import {ReactComponent as MRDIcon} from './svg/ItemCategory_MRD.svg'
import {FC}                        from "react"

type Props = {
    className?: string;
}

export const MRD: FC<Props> = ({className = ''}) =>
    {
        return <MRDIcon className={className}/>
    }
