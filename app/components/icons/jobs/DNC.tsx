import DNCIcon from "./svg/class_job_038.svg";
import { FC } from "react";

type Props = {
  className?: string;
};

export const DNC: FC<Props> = ({ className = "" }) => {
  // @ts-ignore
  return <DNCIcon className={className} />;
};
