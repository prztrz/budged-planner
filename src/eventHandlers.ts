import * as d3 from "d3";
import { Data } from "./types";
import { db } from "./db";

export const handleMouseOver = (
  data: d3.PieArcDatum<Data>,
  i: number,
  paths: SVGPathElement[] | d3.ArrayLike<SVGPathElement>
) => {
  //  transition
  d3.select(paths[i])
    .transition("changePathFill")
    .duration(300)
    .attr("fill", "#fff");
};

export const handleMouseOut = (
  colorScale: d3.ScaleOrdinal<string, string>,
  data: d3.PieArcDatum<Data>,
  i: number,
  paths: SVGPathElement[] | d3.ArrayLike<SVGPathElement>
) => {
  d3.select(paths[i])
    .transition("changePathFill")
    .duration(300)
    .attr("fill", colorScale(data.data.name));
};

export const handleClick = (
  data: d3.PieArcDatum<Data>,
  i: number,
  paths: SVGPathElement[] | d3.ArrayLike<SVGPathElement>
) => {
  const { id } = data.data;
  db.collection("expenses")
    .doc(id)
    .delete();
};
