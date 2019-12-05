import { fuel, total_fuel, fuel_with_fuel } from './01'

test('calculate fuel for modules', () => {
  expect(fuel(12)).toBe(2);
  expect(fuel(14)).toBe(2);
  expect(fuel(1969)).toBe(654);
  expect(fuel(100756)).toBe(33583);
})

test('calculate total fuel requirement', () => {
  expect(total_fuel([0, 0, 0])).toBe(3 * fuel(0));
  expect(total_fuel([1, 2, 3])).toBe(fuel(1) + fuel(2) + fuel(3));
})

test('calculate fuel for fuel for modules', () => {
  expect(fuel_with_fuel(14)).toBe(2);
  expect(fuel_with_fuel(1969)).toBe(966);
  expect(fuel_with_fuel(100756)).toBe(50346);
})