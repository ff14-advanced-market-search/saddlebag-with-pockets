import ROGIcon from "./svg/ItemCategory_ROG.svg";
import { FC } from "react";

type Props = {
  className?: string;
};

export const ROG: FC<Props> = ({ className = "" }) => {
  // @ts-ignore
  return <ROGIcon className={className} />;
};
