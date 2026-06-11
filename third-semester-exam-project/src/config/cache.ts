
import NodeCache from "node-cache";

export const cache = new NodeCache({
  stdTTL: 60, // 1 minute default cache
  checkperiod: 120,
});