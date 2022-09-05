import LTWIcon from "./svg/ItemCategory_LTW.svg";
import { FC } from "react";

type Props = {
  className?: string;
};

export const LTW: FC<Props> = ({ className = "" }) => {
  // @ts-ignore
  return <LTWIcon className={className} />;
};
