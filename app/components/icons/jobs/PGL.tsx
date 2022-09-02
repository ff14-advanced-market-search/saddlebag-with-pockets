import {ReactComponent as PGLIcon} from './svg/ItemCategory_PGL.svg'
import {FC}                        from "react"

type Props = {
    className?: string;
}

export const PGL: FC<Props> = ({className = ''}) =>
    {
        return <PGLIcon className={className}/>
    }
