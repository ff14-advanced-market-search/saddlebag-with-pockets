import {ReactComponent as BLUIcon} from './svg/ItemCategory_BLU.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const BLU: FC<Props> = ({className = ''}) => {
    return <BLUIcon className={className}/>
}
