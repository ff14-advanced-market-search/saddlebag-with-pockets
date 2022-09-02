import {ReactComponent as RPRIcon} from './svg/class_job_039.svg'
import {FC}                        from "react"

type Props = {
    className?: string;
}

export const RPR: FC<Props> = ({className = ''}) =>
    {
        return <RPRIcon className={className}/>
    }
