import { getInput } from "../utils";

type BagId = string;
type BagGraphEdge = Map<BagId, Map<BagId, number>>;

interface BagGraph {
  canContain: BagGraphEdge;
  canBeContainedBy: BagGraphEdge;
}

export function parseLine(line: string) {
  const [_, outerBagColor, innerBags] = line.match(
    /^(\w+ \w+) bags contain ((\d+ \w+ \w+ bags?(, )?)+|no other bags).$/
  );
  const mapOfInnerBags = new Map<BagId, number>();
  for (const innerBag of innerBags.split(", ")) {
    const match = innerBag.match(/^(\d+) (\w+ \w+) bags?$/);
    if (match) {
      const [_, numberOfBags, innerBagColor] = match;
      mapOfInnerBags.set(innerBagColor, +numberOfBags);
    }
  }
  return [outerBagColor, mapOfInnerBags] as const;
}

export function buildBagGraph(lines: string) {
  const graph: BagGraph = {
    canContain: new Map(),
    canBeContainedBy: new Map(),
  };
  const parsedLines = lines.split("\n").map(parseLine);

  for (const [bagColor] of parsedLines) {
    // make sure that there is an empty map for each color
    graph.canBeContainedBy.set(bagColor, new Map());
  }
  for (const [outerBagColor, mapOfInnerBags] of parsedLines) {
    graph.canContain.set(outerBagColor, mapOfInnerBags);
    mapOfInnerBags.forEach((numberOfBags, innerBagColor) => {
      graph.canBeContainedBy
        .get(innerBagColor)
        .set(outerBagColor, numberOfBags);
    });
  }
  return graph;
}

export function getValidOutermostBags(bagColor: BagId, graph: BagGraph) {
  const validOutermostBags = new Set<BagId>([bagColor]);
  let foundNewBag = true;
  while (foundNewBag) {
    foundNewBag = false;
    validOutermostBags.forEach((innerBagColor: BagId) => {
      graph.canBeContainedBy
        .get(innerBagColor)
        .forEach((_, outerBagColor: BagId) => {
          if (!validOutermostBags.has(outerBagColor)) {
            validOutermostBags.add(outerBagColor);
            foundNewBag = true;
          }
        });
    });
  }
  validOutermostBags.delete(bagColor);
  return validOutermostBags;
}

export function getNumberOfBagsInside(bagColor: BagId, graph: BagGraph) {
  const memoizedBagsInside = new Map<BagId, number>();

  function getNumberOfBagsInsideWorker(bagColor: BagId) {
    if (memoizedBagsInside.has(bagColor)) {
      return memoizedBagsInside.get(bagColor);
    }
    let count = 0;
    graph.canContain.get(bagColor).forEach((numberOfBags, innerBagColor) => {
      count += numberOfBags * (1 + getNumberOfBagsInsideWorker(innerBagColor));
    });
    memoizedBagsInside.set(bagColor, count);

    return count;
  }

  return getNumberOfBagsInsideWorker(bagColor);
}

export function solution1() {
  const lines = getInput(7, 2020).trim();
  const graph = buildBagGraph(lines);
  const validOutermostBags = getValidOutermostBags("shiny gold", graph);
  return validOutermostBags.size;
}

export function solution2() {
  const lines = getInput(7, 2020).trim();
  const graph = buildBagGraph(lines);
  return getNumberOfBagsInside("shiny gold", graph);
}
