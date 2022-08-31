import {ReactComponent as WVRIcon} from './svg/ItemCategory_WVR.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const WVR: FC<Props> = ({className = ''}) => {
    return <WVRIcon className={className}/>
}
