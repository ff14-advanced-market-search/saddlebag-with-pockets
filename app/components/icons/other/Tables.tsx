import Icon from "./svg/ItemCategory_Tables.svg";
import { FC } from "react";

type Props = {
  className?: string;
};

export const Tables: FC<Props> = ({ className = "" }) => {
  // @ts-ignore
  return <Icon className={className} />;
};
