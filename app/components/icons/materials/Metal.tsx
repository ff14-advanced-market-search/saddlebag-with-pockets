import Icon from './svg/ItemCategory_ARM.svg';
import {FC} from "react";

type Props = {
    className?: string;
}

export const Metal: FC<Props> = ({className = ''}) =>
    {
        // @ts-ignore
        return <Icon className={className}/>;
    };
