import { getProgram } from '../utils';
import { AsciiIntcodeComputer } from './intcodeascii';
import { Map2D } from './map2d';
import * as readline from 'readline';

export function solution1() {
    const prog = getProgram({ day: 25 });
    const comp = new AsciiIntcodeComputer(prog);
    const commands = [];
    const map = new Map2D<string>();
    const roomList = new Map<string, [number, number]>();
    let x = 0, y = 0;
    map.set(x, y, "█");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on("SIGINT", () => rl.close());

    const processQuestion = (command: string) => {
        switch (command) {
            case "exit":
                rl.close();
                return;
            case "print":
                console.log(JSON.stringify(commands));
                rl.question("Command?", processQuestion);
                return;
            case "map":
                console.log(map.getPrintableMap((s, x1, y1) => (x1 == x && y1 == y) ? "X" : s));
                rl.question("Command?", processQuestion);
                return;
            case "list":
                console.log("Your position:", [x, y]);
                roomList.forEach((pos, roomName) => { console.log(roomName, pos); });
                rl.question("Command?", processQuestion);
                return;
        }
        comp.nextInputLines = [command];
        commands.push(command);
        let newRoom: string;
        do {
            newRoom = comp.runUntilNextLine();
            console.log(newRoom);
        } while (!newRoom);
        if (newRoom.startsWith("== ")) {
            switch (command) {
                case "north":
                    y -= 2;
                    break;
                case "south":
                    y += 2;
                    break;
                case "west":
                    x -= 2;
                    break;
                case "east":
                    x += 2;
                    break;
            }
            map.set(x, y, "█");
            roomList.set(newRoom, [x, y]);
        }
        while (!comp.hasHalted()) {
            const outputLine = comp.runUntilNextLine();
            switch (outputLine) {
                case "- north":
                    map.set(x, y - 1, "|");
                    break;
                case "- south":
                    map.set(x, y + 1, "|");
                    break;
                case "- west":
                    map.set(x - 1, y, "-");
                    break;
                case "- east":
                    map.set(x + 1, y, "-");
                    break;
                case "Command?":
                    rl.question(outputLine, processQuestion);
                    return;
            }
            console.log(outputLine);
        }
        rl.close();
    };
    processQuestion("");
}