import CNJIcon from "./svg/ItemCategory_CNJ.svg";
import { FC } from "react";

type Props = {
  className?: string;
};

export const CNJ: FC<Props> = ({ className = "" }) => {
  // @ts-ignore
  return <CNJIcon className={className} />;
};
