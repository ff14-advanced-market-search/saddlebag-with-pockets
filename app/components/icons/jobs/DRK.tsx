import {ReactComponent as DRKIcon} from './svg/ItemCategory_DRK.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const DRK: FC<Props> = ({className = ''}) => {
    return <DRKIcon className={className}/>
}
