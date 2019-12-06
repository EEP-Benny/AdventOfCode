import { getInputArray } from '../utils';

export function splitDescription(desc: string) {
    const [parent, child] = desc.split(')');
    return [parent, child];
}

export function buildOrbitalTree(descriptions: string[]) {
    const tree = {};
    descriptions.forEach(description => {
        const [parent, child] = splitDescription(description);
        tree[child] = { parent, children: [] };
        if (!tree[parent]) {
            tree[parent] = { parent: null, children: [] };
        }
        tree[parent].children.push(child);
    });
    return tree;
}

export function countOrbits(tree: object, node: string) {
    const parent = tree[node].parent;
    if (parent === null) { return 0; }
    return 1 + countOrbits(tree, parent);
}

export function allParentOrbits(tree: object, node: string) {
    const parents = [];
    let currentNode = tree[node].parent;
    while (currentNode) {
        parents.push(currentNode);
        currentNode = tree[currentNode].parent;
    }
    return parents;
}

export function findOverlap(arr1: any[], arr2: any[]) {
    let count = 0;
    while (arr1[count] === arr2[count] && count < Math.min(arr1.length, arr2.length)) {
        count++;
    }
    return count;
}

export function orbitalTransferCount(tree: object, start: string, end: string): number {
    const parentsStart = allParentOrbits(tree, start);
    const parentsEnd = allParentOrbits(tree, end);
    const overlap = findOverlap(parentsStart.reverse(), parentsEnd.reverse());
    const transferCount = parentsStart.length - 2 * overlap + parentsEnd.length;
    return transferCount;
}

function getTree() {
    const descriptions = getInputArray({ day: 6, separator: '\n' });
    const tree = buildOrbitalTree(descriptions);
    return tree;
}
export function solution1() {
    const tree = getTree();
    let count = 0;
    for (const node in tree) {
        count += countOrbits(tree, node);
    }
    return count;
}

export function solution2() {
    const tree = getTree();
    return orbitalTransferCount(tree, "YOU", "SAN");
}