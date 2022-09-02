import {ReactComponent as LTWIcon} from './svg/ItemCategory_LTW.svg'
import {FC}                        from "react"

type Props = {
    className?: string;
}

export const LTW: FC<Props> = ({className = ''}) =>
    {
        return <LTWIcon className={className}/>
    }
