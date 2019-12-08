import { formatFilename } from './utils';

async function printSolutions(year = 2019) {
    for (let day = 25; day >= 1; day--) {
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
            // ignore import errors
        }
    }
}

printSolutions()