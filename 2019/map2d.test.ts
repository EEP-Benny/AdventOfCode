import { Map2D } from './map2d'

test("set and get with string content", () => {
    const map = new Map2D();

    map.set(0, 0, "Hallo");
    map.set(1, 0, "Welt");

    expect(map.get(0, 0)).toBe("Hallo");
    expect(map.get(1, 0)).toBe("Welt");
})

test("set and get with integer content", () => {
    const map = new Map2D();

    map.set(0, 0, 1);
    map.set(1, 0, 2);
    map.set(0, 0, 3);

    expect(map.get(0, 0)).toBe(3);
    expect(map.get(1, 0)).toBe(2);
})

test("determine min and max positions", () => {
    const map = new Map2D();

    map.set(5, 11, 0);
    map.set(10, 5, 0);
    map.set(0, 5, 0);

    expect(map.minX).toBe(0);
    expect(map.minY).toBe(5);
    expect(map.maxX).toBe(10);
    expect(map.maxY).toBe(11);
})

test("printable map", () => {
    const map = new Map2D();
    map.set(1, 1, 1);
    map.set(3, 2, 2);

    const markers = new Map([
        [1, "X"],
        [2, "O"],
    ]);
    expect(map.getPrintableMap(markers)).toBe("X  \n  O\n");
})