import {ReactComponent as CULIcon} from './svg/ItemCategory_CUL.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const CUL: FC<Props> = ({className = ''}) => {
    return <CULIcon className={className}/>
}
