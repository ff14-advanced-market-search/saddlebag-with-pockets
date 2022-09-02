import DRKIcon from './svg/ItemCategory_DRK.svg';
import {FC}    from "react";

type Props = {
    className?: string;
}

export const DRK: FC<Props> = ({className = ''}) =>
    {
        // @ts-ignore
        return <DRKIcon className={className}/>;
    };
