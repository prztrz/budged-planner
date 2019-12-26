import * as d3 from "d3";

export type Data = {
  name: string;
  cost: number;
  id: string;
};

export type transitionFN = d3.Arc<any, d3.PieArcDatum<Data>>;
