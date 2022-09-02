import {ReactComponent as GNBIcon} from './svg/class_job_037.svg'
import {FC}                        from "react"

type Props = {
    className?: string;
}

export const GNB: FC<Props> = ({className = ''}) =>
    {
        return <GNBIcon className={className}/>
    }
