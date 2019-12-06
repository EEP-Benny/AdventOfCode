import { splitDescription, buildOrbitalTree, countOrbits, allParentOrbits, findOverlap, orbitalTransferCount } from './06';

test('description splitting', () => {
    expect(splitDescription('COM)B')).toEqual(['COM', 'B']);
    expect(splitDescription('B)C')).toEqual(['B', 'C']);
    expect(splitDescription('123)4567')).toEqual(['123', '4567']);
})

test('building orbital tree', () => {
    expect(buildOrbitalTree([
        "COM)B",
        "B)C"
    ])).toEqual({
        COM: { parent: null, children: ["B"] },
        B: { parent: "COM", children: ["C"] },
        C: { parent: "B", children: [] },
    })
})

const tree = buildOrbitalTree(["COM)B", "B)C", "C)D", "D)E", "E)F", "B)G", "G)H", "D)I", "E)J", "J)K", "K)L", "K)YOU", "I)SAN"]);
test('count orbits of single node', () => {
    expect(countOrbits(tree, "D")).toBe(3);
    expect(countOrbits(tree, "L")).toBe(7);
    expect(countOrbits(tree, "COM")).toBe(0);
})

test('get parent orbits', () => {
    expect(allParentOrbits(tree, "COM")).toEqual([]);
    expect(allParentOrbits(tree, "YOU")).toEqual(["K", "J", "E", "D", "C", "B", "COM"]);
})

test('findOverlap', () => {
    expect(findOverlap([], [])).toBe(0);
    expect(findOverlap([], [1, 2])).toBe(0);
    expect(findOverlap([2, 1], [1, 2])).toBe(0);
    expect(findOverlap([1], [1])).toBe(1);
    expect(findOverlap([1], [1, 2])).toBe(1);
    expect(findOverlap(["COM", "B", "C", "D", "E", "J", "K", "L"], ["COM", "B", "C", "D", "I", "SAN"])).toBe(4);
})

test('orbital transfer count', () => {
    expect(orbitalTransferCount(tree, "YOU", "SAN")).toBe(4);
})