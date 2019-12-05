import { getInputArray } from '../utils';

export function fuel(mass: number) {
  return Math.floor(mass / 3) - 2;
}

export function fuel_with_fuel(mass: number) {
  let total = 0, last_fuel = fuel(mass);
  while (last_fuel > 0) {
    total += last_fuel;
    last_fuel = fuel(last_fuel);
  }
  return total;
}

export function total_fuel(masses: number[]) {
  const fuels = masses.map(fuel);
  return fuels.reduce((x, y) => x + y, 0);
}


export function total_fuel_with_fuel(masses: number[]) {
  const fuels = masses.map(fuel_with_fuel);
  return fuels.reduce((x, y) => x + y, 0);
}

function prepareInput() {
  const arr = getInputArray({ day: 1, separator: '\n' });
  const num_arr = arr.map(s => parseInt(s, 10));
  return num_arr;
}
export function solution1() {
  return total_fuel(prepareInput());

}

export function solution2() {
  return total_fuel_with_fuel(prepareInput());
}