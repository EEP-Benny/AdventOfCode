import {
  countSafeIngredients,
  getAllergenToIngredientMap,
  getAllergenToPotentialIngredientsMap,
  parseInputLine,
} from "./21";

const exampleFoods = [
  "mxmxvkd kfcds sqjhc nhms (contains dairy, fish)",
  "trh fvjkl sbzzf mxmxvkd (contains dairy)",
  "sqjhc fvjkl (contains soy)",
  "sqjhc mxmxvkd sbzzf (contains fish)",
];

test("parseInputLine", () => {
  expect(parseInputLine(exampleFoods[0])).toEqual([
    new Set(["mxmxvkd", "kfcds", "sqjhc", "nhms"]),
    new Set(["dairy", "fish"]),
  ]);
  expect(parseInputLine(exampleFoods[2])).toEqual([
    new Set(["sqjhc", "fvjkl"]),
    new Set(["soy"]),
  ]);
});

test("getAllergenToPotentialIngredientsMap", () => {
  expect(getAllergenToPotentialIngredientsMap(exampleFoods)).toEqual(
    new Map([
      [
        "dairy",
        [
          new Set(["mxmxvkd", "kfcds", "sqjhc", "nhms"]),
          new Set(["trh", "fvjkl", "sbzzf", "mxmxvkd"]),
        ],
      ],
      [
        "fish",
        [
          new Set(["mxmxvkd", "kfcds", "sqjhc", "nhms"]),
          new Set(["sqjhc", "mxmxvkd", "sbzzf"]),
        ],
      ],
      ["soy", [new Set(["sqjhc", "fvjkl"])]],
    ])
  );
});

test("getAllergenToIngredientMap", () => {
  expect(getAllergenToIngredientMap(exampleFoods)).toEqual(
    new Map([
      ["dairy", "mxmxvkd"],
      ["fish", "sqjhc"],
      ["soy", "fvjkl"],
    ])
  );
});

test("countSafeIngredients", () => {
  expect(countSafeIngredients(exampleFoods)).toBe(5);
});
