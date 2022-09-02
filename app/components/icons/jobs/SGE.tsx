import SGEIcon from './svg/class_job_040.svg'
import {FC}    from "react"

type Props = {
    className?: string;
}

export const SGE: FC<Props> = ({className = ''}) =>
    {
        // @ts-ignore
        return <SGEIcon className={className}/>
    }
