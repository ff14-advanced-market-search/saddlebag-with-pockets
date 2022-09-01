import {ReactComponent as Icon} from './svg/ItemCategory_Airship.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const AirshipSubmersibleComponents: FC<Props> = ({className = ''}) => {
    return <Icon className={className}/>
}
