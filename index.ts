import { formatFilename } from './utils';

const defaultYear = 2019;

async function printSolution(day: number, year = defaultYear) {
    try {
        let { solution1, solution2 } = await import(formatFilename(day, year))
        const outputs = [`Day ${day}`]
        if (typeof solution1 === "function") {
            outputs.push(`Solution 1: ${solution1()}`)
        }
        if (typeof solution2 === "function") {
            outputs.push(`Solution 2: ${solution2()}`)
        }
        console.log(outputs.join(" - "))
    } catch (error) {
        // ignore import errors, but not other errors
        if (error.code !== "MODULE_NOT_FOUND") {
            throw error;
        }
    }
}
async function printAllSolutions(year = defaultYear) {
    console.log(`Printing all solutions of ${year}:`);
    for (let day = 1; day <= 25; day++) {
        printSolution(day, year)
    }
}

const args = process.argv.slice(2);
if (args.length > 0) {
    const day = parseInt(args[0], 10);
    const year = parseInt(args[1], 10) || defaultYear;
    if (day < 100) {
        console.log(`Printing solutions for day ${day} of ${year}:`);
        printSolution(day, year);
    } else {
        const year = day; // year as only input
        printAllSolutions(year);
    }
} else {
    printAllSolutions();
}