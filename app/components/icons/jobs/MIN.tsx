import MINIcon from "./svg/ItemCategory_MIN.svg";
import { FC } from "react";

type Props = {
  className?: string;
};

export const MIN: FC<Props> = ({ className = "" }) => {
  // @ts-ignore
  return <MINIcon className={className} />;
};
