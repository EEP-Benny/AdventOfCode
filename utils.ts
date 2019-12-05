import { readFileSync } from 'fs';

export function formatFilename(day: number, year: number, suffix = '') {
    return `./${year}/${String(day).padStart(2, '0')}${suffix}`;
}
export function getInput(day, year = 2019) {
    return readFileSync(formatFilename(day, year, '.input.txt'), 'utf8');
}
export function getInputArray({ day, year = 2019, separator }) {
    const text = getInput(day, year)
    const arr = text.split(separator)
    return arr.filter(s => s !== '') //filters out empty elements
}