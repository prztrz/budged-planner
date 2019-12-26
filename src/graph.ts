import * as d3 from "d3";
import { legendColor } from "d3-svg-legend";
import { firestore } from "firebase";
import { Data } from "./types";
import {
  arcPathTweenAppear,
  arcPathTweenDisappear,
  arcPathTweenUpdate
} from "./transitionTweens";
import { handleMouseOver, handleMouseOut, handleClick } from "./eventHandlers";

const DIMENSIONS = {
  height: 300,
  width: 300,
  radius: 150
};

const CENTER = { x: DIMENSIONS.width / 2 + 5, y: DIMENSIONS.height / 2 + 5 };

let data: Data[] = [];

const COLORS = d3.schemeSet3;
const colorScale = d3.scaleOrdinal<string>(COLORS);

const canvas = d3
  .select(".canvas")
  .append("svg")
  .attr("width", DIMENSIONS.width + 150)
  .attr("height", DIMENSIONS.height + 150);

const legendGroup = canvas
  .append("g")
  .attr("transform", `translate(${DIMENSIONS.width + 40}, 10)`);

const legend = legendColor()
  .shape("circle")
  .shapePadding(10)
  .scale(colorScale);

const graph = canvas
  .append("g")
  .attr("transform", `translate(${CENTER.x}, ${CENTER.y})`);

// create function that transform data to get pie arcs angles
const getPieData = d3.pie<Data>();
getPieData.sort(null).value(d => d.cost);

// create function that returns path attribute for arc of given data
const getArcPath = d3
  .arc<d3.PieArcDatum<Data>>()
  .outerRadius(DIMENSIONS.radius)
  .innerRadius(DIMENSIONS.radius / 2);

const updateGraph = (data: Data[]) => {
  //update colorScaleDomain
  colorScale.domain(data.map(({ name }) => name));
  //update and call legend
  legendGroup.call(legend);
  legendGroup.selectAll("text").attr("fill", "#fff");

  const paths = graph.selectAll("path").data(getPieData(data));

  paths
    .exit()
    .transition()
    .duration(750)
    .attrTween("d", arcPathTweenDisappear(getArcPath))
    .remove();

  paths
    .transition()
    .duration(750)
    .attrTween("d", arcPathTweenUpdate(getArcPath))
    .attr("data-previous", d => JSON.stringify(d));

  paths
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("stroke", "#fff")
    .attr("stroke-width", 3)
    .attr("cursor", "pointer")
    .attr("fill", d => colorScale(d.data.name))
    // add data-previous key to every path entering the DOM
    .attr("data-previous", d => JSON.stringify(d))
    .transition()
    .duration(750)
    // this tween also handle the start position of "d" path attribute
    .attrTween("d", arcPathTweenAppear(getArcPath));

  //add events
  graph
    .selectAll("path")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut(colorScale))
    .on("click", handleClick);
};

export const handleDataRefresh = (res: firestore.QuerySnapshot<Data>) => {
  res.docChanges().forEach(({ doc, type }) => {
    const updatedDoc = { ...doc.data(), id: doc.id };

    switch (type) {
      case "added":
        data.push(updatedDoc);
        break;
      case "removed": {
        data = data.filter(({ id }) => id !== doc.id);
        break;
      }
      case "modified":
        data[data.findIndex(({ id }) => id === doc.id)] = updatedDoc;
        break;
      default:
        break;
    }
  });
  updateGraph(data);
};
