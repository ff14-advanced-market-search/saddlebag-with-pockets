import {ReactComponent as SGEIcon} from './svg/class_job_040.svg'
import {FC}                        from "react"

type Props = {
    className?: string;
}

export const SGE: FC<Props> = ({className = ''}) =>
    {
        return <SGEIcon className={className}/>
    }
