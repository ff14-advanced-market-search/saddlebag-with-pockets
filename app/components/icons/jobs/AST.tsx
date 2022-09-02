import {ReactComponent as ASTIcon} from './svg/ItemCategory_AST.svg'
import {FC}                        from "react"

type Props = {
    className?: string;
}

export const AST: FC<Props> = ({className = ''}) =>
    {
        return <ASTIcon className={className}/>
    }
