import * as d3 from "d3";
import { firestore } from "firebase";

type Data = {
  name: string;
  cost: number;
  id: string;
};
const DIMENSIONS = {
  height: 300,
  width: 300,
  radius: 150
};

const CENTER = { x: DIMENSIONS.width / 2 + 5, y: DIMENSIONS.height / 2 + 5 };

const data: Data[] = [];

const COLORS = d3.schemeSet3;
const colorScale = d3.scaleOrdinal<string>(COLORS);

const canvas = d3
  .select(".canvas")
  .append("svg")
  .attr("width", DIMENSIONS.width + 150)
  .attr("height", DIMENSIONS.height + 150);

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
  const paths = graph.selectAll("path").data(getPieData(data));

  paths
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("d", getArcPath)
    .attr("stroke", "#fff")
    .attr("stroke-width", 3)
    .attr("fill", d => colorScale(d.data.name));
};

export const handleDataRefresh = (res: firestore.QuerySnapshot<Data>) => {
  res.docChanges().forEach(({ doc, type }) => {
    const updatedDoc = { ...doc.data(), id: doc.id };

    switch (type) {
      case "added":
        data.push(updatedDoc);
        break;
      case "removed":
        data.filter(({ id }) => id !== doc.id);
        break;
      case "modified":
        data[data.findIndex(({ id }) => id === doc.id)] = updatedDoc;
        break;
      default:
        break;
    }
  });
  updateGraph(data);
};
