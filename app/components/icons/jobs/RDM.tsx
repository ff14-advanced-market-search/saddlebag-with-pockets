import {ReactComponent as RDMIcon} from './svg/ItemCategory_RDM.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const RDM: FC<Props> = ({className = ''}) => {
    return <RDMIcon className={className}/>
}
