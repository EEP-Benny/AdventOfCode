import {
  buildBagGraph,
  getNumberOfBagsInside,
  getValidOutermostBags,
  parseLine,
} from "./07";

test("parseLine", () => {
  expect(
    parseLine("light red bags contain 1 bright white bag, 2 muted yellow bags.")
  ).toEqual([
    "light red",
    new Map([
      ["bright white", 1],
      ["muted yellow", 2],
    ]),
  ]);

  expect(
    parseLine(
      "dark orange bags contain 3 bright white bags, 4 muted yellow bags."
    )
  ).toEqual([
    "dark orange",
    new Map([
      ["bright white", 3],
      ["muted yellow", 4],
    ]),
  ]);

  expect(parseLine("bright white bags contain 1 shiny gold bag.")).toEqual([
    "bright white",
    new Map([["shiny gold", 1]]),
  ]);

  expect(
    parseLine("muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.")
  ).toEqual([
    "muted yellow",
    new Map([
      ["shiny gold", 2],
      ["faded blue", 9],
    ]),
  ]);

  expect(
    parseLine("shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.")
  ).toEqual([
    "shiny gold",
    new Map([
      ["dark olive", 1],
      ["vibrant plum", 2],
    ]),
  ]);

  expect(
    parseLine("dark olive bags contain 3 faded blue bags, 4 dotted black bags.")
  ).toEqual([
    "dark olive",
    new Map([
      ["faded blue", 3],
      ["dotted black", 4],
    ]),
  ]);

  expect(
    parseLine(
      "vibrant plum bags contain 5 faded blue bags, 6 dotted black bags."
    )
  ).toEqual([
    "vibrant plum",
    new Map([
      ["faded blue", 5],
      ["dotted black", 6],
    ]),
  ]);

  expect(parseLine("faded blue bags contain no other bags.")).toEqual([
    "faded blue",
    new Map([]),
  ]);

  expect(parseLine("dotted black bags contain no other bags.")).toEqual([
    "dotted black",
    new Map([]),
  ]);
});

const input = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`;

const input2 = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`;

test("buildBagGraph", () => {
  const graph = buildBagGraph(input);

  expect(graph.canContain.get("light red")).toEqual(
    new Map([
      ["bright white", 1],
      ["muted yellow", 2],
    ])
  );
  expect(graph.canBeContainedBy.get("light red")).toEqual(new Map());

  expect(graph.canContain.get("shiny gold")).toEqual(
    new Map([
      ["dark olive", 1],
      ["vibrant plum", 2],
    ])
  );
  expect(graph.canBeContainedBy.get("shiny gold")).toEqual(
    new Map([
      ["bright white", 1],
      ["muted yellow", 2],
    ])
  );
});

test("getValidOutermostBags", () => {
  const graph = buildBagGraph(input);
  expect(getValidOutermostBags("shiny gold", graph)).toEqual(
    new Set(["bright white", "muted yellow", "dark orange", "light red"])
  );
});

test("getNumberOfBagsInside", () => {
  const graph = buildBagGraph(input);
  expect(getNumberOfBagsInside("faded blue", graph)).toBe(0);
  expect(getNumberOfBagsInside("dotted black", graph)).toBe(0);
  expect(getNumberOfBagsInside("vibrant plum", graph)).toBe(11);
  expect(getNumberOfBagsInside("dark olive", graph)).toBe(7);
  expect(getNumberOfBagsInside("shiny gold", graph)).toBe(32);

  const graph2 = buildBagGraph(input2);
  expect(getNumberOfBagsInside("shiny gold", graph2)).toBe(126);
});
