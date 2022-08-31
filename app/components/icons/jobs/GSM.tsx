import {ReactComponent as GSMIcon} from './svg/ItemCategory_GSM.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const GSM: FC<Props> = ({className = ''}) => {
    return <GSMIcon className={className}/>
}
