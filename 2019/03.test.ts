import { splitInstruction, findCrossings, manhattanDistance, closestManhattanDistance, findClosestCrossing, closestTimeDistance } from './03'

test("splitInstruction", () => {
    expect(splitInstruction("D12")).toEqual(["D", 12]);
    expect(splitInstruction("R8")).toEqual(["R", 8]);
})

test("manhattan distance", () => {
    expect(manhattanDistance([3, 3])).toBe(6);
    expect(manhattanDistance([6, 5])).toBe(11);
    expect(manhattanDistance([-1, -1])).toBe(2);
})

test("crossings", () => {
    expect(findCrossings("R8,U5,L5,D3", "U7,R6,D4,L4")).toEqual([[6, 5, 30], [3, 3, 40]]);
})

test("closest manhattan distance", () => {
    expect(closestManhattanDistance([[6, 5, 0], [3, 3, 0]])).toBe(6);
})

test("find closest crossing", () => {
    const w1: [string, string] = ["R8,U5,L5,D3", "U7,R6,D4,L4"];
    const w2: [string, string] = ["R75,D30,R83,U83,L12,D49,R71,U7,L72", "U62,R66,U55,R34,D71,R55,D58,R83"];
    const w3: [string, string] = ["R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51", "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"];

    expect(findClosestCrossing(w1, closestManhattanDistance)).toBe(6);
    expect(findClosestCrossing(w2, closestManhattanDistance)).toBe(159);
    expect(findClosestCrossing(w3, closestManhattanDistance)).toBe(135);

    expect(findClosestCrossing(w1, closestTimeDistance)).toBe(30);
    expect(findClosestCrossing(w2, closestTimeDistance)).toBe(610);
    expect(findClosestCrossing(w3, closestTimeDistance)).toBe(410);
})