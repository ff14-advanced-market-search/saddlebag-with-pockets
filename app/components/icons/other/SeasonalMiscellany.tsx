import Icon from './svg/ItemCategory_SeasonalMiscellany.svg'
import {FC} from "react"

type Props = {
    className?: string;
}

export const SeasonalMiscellany: FC<Props> = ({className = ''}) =>
    {
        // @ts-ignore
        return <Icon className={className}/>
    }
