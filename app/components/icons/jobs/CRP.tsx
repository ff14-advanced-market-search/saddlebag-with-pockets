import CRPIcon from './svg/ItemCategory_CRP.svg'
import {FC}    from "react"

type Props = {
    className?: string;
}

export const CRP: FC<Props> = ({className = ''}) =>
    {
        // @ts-ignore
        return <CRPIcon className={className}/>
    }
