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

const canvas = d3.select(".canvas");

export const createCanvas = () => {
  canvas
    .append("svg")
    .attr("width", DIMENSIONS.width + 150)
    .attr("height", DIMENSIONS.height + 150);
};

const pie = d3.pie<Data>();
const getArcPath = d3
  .arc()
  .outerRadius(DIMENSIONS.radius)
  .innerRadius(DIMENSIONS.radius / 2);

export const createGraph = () => {
  canvas.append("g").attr("transform", `translate(${CENTER.x}, ${CENTER.y})`);
  pie.sort(null).value(d => d.cost);
};

const updateGraph = (data: Data[]) => {
  console.log({ data });
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
