import Icon from './svg/ItemCategory_CUL.svg';
import {FC} from "react";

type Props = {
    className?: string;
}

export const Ingredients: FC<Props> = ({className = ''}) =>
    {
        // @ts-ignore
        return <Icon className={className}/>;
    };
