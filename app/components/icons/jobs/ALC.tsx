import {ReactComponent as ALCIcon} from './svg/ItemCategory_ALC.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const ALC: FC<Props> = ({className = ''}) => {
    return <ALCIcon className={className}/>
}
