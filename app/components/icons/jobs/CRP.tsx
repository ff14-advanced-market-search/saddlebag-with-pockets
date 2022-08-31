import {ReactComponent as CRPIcon} from './svg/ItemCategory_CRP.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const CRP: FC<Props> = ({className = ''}) => {
    return <CRPIcon className={className}/>
}
