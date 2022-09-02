import Icon from './svg/ItemCategory_Part.svg';
import {FC} from "react";

type Props = {
    className?: string;
}

export const WeaponParts: FC<Props> = ({className = ''}) =>
    {
        // @ts-ignore
        return <Icon className={className}/>;
    };
