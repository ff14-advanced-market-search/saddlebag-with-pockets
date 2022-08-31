import {ReactComponent as LNCIcon} from './svg/ItemCategory_LNC.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const LNC: FC<Props> = ({className = ''}) => {
    return <LNCIcon className={className}/>
}
