import React, { ReactElement, ReactNode, CSSProperties } from 'react';
import { htmlSvgToPdfSvg } from './imageFromSvg';

interface ChartSvgProps {
  debug?: boolean;
  style?: CSSProperties;
  children: ReactNode;
  width?: number | string;
  height?: number | string;
}

export const ChartSvg = ({ debug, style, children, width, height }: ChartSvgProps): ReactElement | null => {
  return chartToPdfSvg(children, width, height, debug, style);
};

const chartToPdfSvg = (
  children: ReactNode,
  width?: number | string,
  height?: number | string,
  debug?: boolean,
  style?: CSSProperties
): ReactElement => {
  const component = htmlSvgToPdfSvg(children as ReactElement);
  

  if (component === null) {
    return <div>No valid chart data provided.</div>; 
  }

  const result = React.cloneElement(component, { width, height, debug, style });
  return result;
};
