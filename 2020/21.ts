import { getInputArray } from "../utils";

export function parseInputLine(inputLine: string) {
  const [, ingredients, allergens] = inputLine.match(
    /^([a-z ]+) \(contains ([a-z, ]+)\)$/
  );
  return [
    new Set(ingredients.split(" ")),
    new Set(allergens.split(", ")),
  ] as const;
}

export function getAllergenToPotentialIngredientsMap(inputLines: string[]) {
  const allergenToPotentialIngredientsMap = new Map<string, Set<string>[]>();
  for (const inputLine of inputLines) {
    const [ingredientsSet, allergensSet] = parseInputLine(inputLine);
    allergensSet.forEach((allergen) => {
      const possibleIngredients =
        allergenToPotentialIngredientsMap.get(allergen) ?? [];
      possibleIngredients.push(ingredientsSet);
      allergenToPotentialIngredientsMap.set(allergen, possibleIngredients);
    });
  }
  return allergenToPotentialIngredientsMap;
}

export function getAllergenToIngredientMap(inputLines: string[]) {
  const listsOfSetsOfPotentialIngredients = getAllergenToPotentialIngredientsMap(
    inputLines
  );
  const setsOfPotentialIngredients = new Map<string, Set<string>>();
  listsOfSetsOfPotentialIngredients.forEach((list, allergen) => {
    const [firstSet, ...remainingSets] = list;
    setsOfPotentialIngredients.set(
      allergen,
      new Set(
        Array.from(firstSet).filter((ingredient) =>
          remainingSets.every((setOfIngredients) =>
            setOfIngredients.has(ingredient)
          )
        )
      )
    );
  });
  const allergenToIngredientMap = new Map<string, string>();
  let madeProgress = true;
  while (madeProgress) {
    madeProgress = false;
    setsOfPotentialIngredients.forEach(
      (setOfPotentialIngredients, allergen) => {
        if (setOfPotentialIngredients.size === 1) {
          const ingredient = setOfPotentialIngredients.values().next().value;
          allergenToIngredientMap.set(allergen, ingredient);
          setsOfPotentialIngredients.delete(allergen);
          setsOfPotentialIngredients.forEach((otherSetOfPotentialIngredients) =>
            otherSetOfPotentialIngredients.delete(ingredient)
          );
          madeProgress = true;
        }
      }
    );
  }
  return allergenToIngredientMap;
}

export function countSafeIngredients(inputLines: string[]) {
  const allergenToIngredientMap = getAllergenToIngredientMap(inputLines);
  const listOfDangerousIngredients = Array.from(
    allergenToIngredientMap.values()
  );
  let safeIngredientsCount = 0;
  for (const inputLine of inputLines) {
    const [setOfIngredients] = parseInputLine(inputLine);
    listOfDangerousIngredients.forEach((i) => setOfIngredients.delete(i));
    safeIngredientsCount += setOfIngredients.size;
  }
  return safeIngredientsCount;
}

export function getCanonicalDangerousIngredientList(inputLines: string[]) {
  const allergenToIngredientMap = getAllergenToIngredientMap(inputLines);
  const sortedEntries = Array.from(
    allergenToIngredientMap.entries()
  ).sort(([allergen1], [allergen2]) => (allergen1 > allergen2 ? 1 : -1));
  const sortedIngredients = sortedEntries.map(
    ([allergen, ingredient]) => ingredient
  );
  return sortedIngredients.join(",");
}

export function solution1() {
  const inputLines = getInputArray({ day: 21, year: 2020, separator: "\n" });
  return countSafeIngredients(inputLines);
}
export function solution2() {
  const inputLines = getInputArray({ day: 21, year: 2020, separator: "\n" });
  return getCanonicalDangerousIngredientList(inputLines);
}
