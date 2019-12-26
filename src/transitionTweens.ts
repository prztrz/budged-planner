import * as d3 from "d3";
import { Data, transitionFN } from "./types";

// tween for arc path transition
export const arcPathTweenAppear = (transition: transitionFN) => (
  data: d3.PieArcDatum<Data>
) => {
  const { endAngle, startAngle } = data;
  const interpolation = d3.interpolate(endAngle, startAngle);

  return (t: number) => {
    const updatedData = {
      ...data,
      startAngle: interpolation(t)
    };

    return transition(updatedData);
  };
};

export const arcPathTweenDisappear = (transition: transitionFN) => (
  data: d3.PieArcDatum<Data>
) => {
  const { endAngle, startAngle } = data;
  const interpolation = d3.interpolate(startAngle, endAngle);

  return (t: number) => {
    const updatedData = {
      ...data,
      startAngle: interpolation(t)
    };

    return transition(updatedData);
  };
};

export const arcPathTweenUpdate = (transition: transitionFN) => (
  data: d3.PieArcDatum<Data>,
  i: number,
  selection: SVGPathElement[]
) => {
  const path = selection[i];
  const previousData = JSON.parse(path.dataset.previous);
  const interpolation = d3.interpolate(previousData, data);

  return (t: number) => {
    const updatedData = interpolation(t);
    return transition(updatedData);
  };
};
