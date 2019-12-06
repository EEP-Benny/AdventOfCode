import { getDigits, checkPassword, checkPasswordExtended } from './04'

test("get digits", () => {
    expect(getDigits(1)).toEqual([1]);
    expect(getDigits(2)).toEqual([2]);
    expect(getDigits(12)).toEqual([1, 2]);
    expect(getDigits(123)).toEqual([1, 2, 3]);
    expect(getDigits(102030)).toEqual([1, 0, 2, 0, 3, 0]);
})

test("checkPassword", () => {
    expect(checkPassword(122345)).toBe(true);
    expect(checkPassword(111123)).toBe(true);
    expect(checkPassword(135679)).toBe(false);
    expect(checkPassword(111111)).toBe(true);
    expect(checkPassword(223450)).toBe(false);
    expect(checkPassword(123789)).toBe(false);
})

test("checkPasswordExtended", () => {
    expect(checkPasswordExtended(122345)).toBe(true);
    expect(checkPasswordExtended(111123)).toBe(false);
    expect(checkPasswordExtended(135679)).toBe(false);
    expect(checkPasswordExtended(111111)).toBe(false);
    expect(checkPasswordExtended(223450)).toBe(false);
    expect(checkPasswordExtended(123789)).toBe(false);
    expect(checkPasswordExtended(112233)).toBe(true);
    expect(checkPasswordExtended(123444)).toBe(false);
    expect(checkPasswordExtended(111122)).toBe(true);
})