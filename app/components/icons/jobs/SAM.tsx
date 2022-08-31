import {ReactComponent as SAMIcon} from './svg/ItemCategory_SAM.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const SAM: FC<Props> = ({className = ''}) => {
    return <SAMIcon className={className}/>
}
