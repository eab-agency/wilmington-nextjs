import { SVGProps } from "react";

export const SvgIcon = ({ children, width, height, size, viewBox, ...props }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox || "0 0 70 70"}
      // width={width || size || "70"}
      // height={height || size || "70"}
      {...props}
    >
      {children}
    </svg>
  );
}

export interface SVGIconProps extends SVGProps<SVGSVGElement> {
  size?: string | number;
  children?: React.ReactNode;
  viewBox?: string;
  width?: string | number;
  height?: string | number;
}
