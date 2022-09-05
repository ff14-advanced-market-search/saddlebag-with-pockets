import CULIcon from "./svg/ItemCategory_CUL.svg";
import { FC } from "react";

type Props = {
  className?: string;
};

export const CUL: FC<Props> = ({ className = "" }) => {
  // @ts-ignore
  return <CULIcon className={className} />;
};
