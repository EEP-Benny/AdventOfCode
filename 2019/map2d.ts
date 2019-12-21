// 2D Map

const pos = (x: number, y: number) => `${x},${y}`;
const posXY = (pos: string) => { const [x, y] = pos.split(','); return { x: parseInt(x), y: parseInt(y) }; };

export class Map2D<T> {
    private map = new Map<string, T>();

    public minX: number;
    public maxX: number;
    public minY: number;
    public maxY: number;
    public set(x: number, y: number, value: T) {
        if (!(x >= this.minX)) { this.minX = x; }
        if (!(y >= this.minY)) { this.minY = y; }
        if (!(x <= this.maxX)) { this.maxX = x; }
        if (!(y <= this.maxY)) { this.maxY = y; }
        this.map.set(pos(x, y), value);
    }

    public get(x: number, y: number): T {
        return this.map.get(pos(x, y));
    }

    public forEach(callback: (value: T, x: number, y: number) => void) {
        this.map.forEach((value: T, key: string) => {
            const { x, y } = posXY(key);
            callback(value, x, y);
        });
    }
    public getPrintableMap(markers: Map<T, string> | ((item: T, x: number, y: number) => string)) {
        const getChar = (x, y) => {
            const item = this.get(x, y);
            if (markers instanceof Map) {
                return markers.get(item);
            } else {
                return markers(item, x, y);
            }
        };
        let output = "";
        for (let y = this.minY; y <= this.maxY; y++) {
            for (let x = this.minX; x <= this.maxX; x++) {
                output += getChar(x, y) || " ";
            }
            output += "\n";
        }
        return output;
    }
}