import {ReactComponent as Icon} from './svg/ItemCategory_Gardening.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const GardeningItems: FC<Props> = ({className = ''}) => {
    return <Icon className={className}/>
}
