import Icon from "./svg/ItemCategory_Medicine.svg";
import { FC } from "react";

type Props = {
  className?: string;
};

export const Medicine: FC<Props> = ({ className = "" }) => {
  // @ts-ignore
  return <Icon className={className} />;
};
