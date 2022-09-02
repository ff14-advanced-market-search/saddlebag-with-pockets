import Icon from './svg/ItemCategory_Painting.svg';
import {FC} from "react";

type Props = {
    className?: string;
}

export const Paintings: FC<Props> = ({className = ''}) =>
    {
        // @ts-ignore
        return <Icon className={className}/>;
    };
