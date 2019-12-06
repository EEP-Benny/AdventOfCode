export function getDigits(num: number): number[] {
    const digits = [];
    while (num > 0) {
        digits.push(num % 10);
        num = Math.floor(num / 10);
    }
    return digits.reverse();
}

export function checkPassword(pwd: number) {
    const digits = getDigits(pwd);
    if (digits.length !== 6) {
        return false; // not a six-digit number
    }
    let foundDouble = false;
    for (let i = 1; i < digits.length; i++) {
        if (digits[i - 1] === digits[i]) {
            foundDouble = true;
        }
        if (digits[i - 1] > digits[i]) {
            return false; // decreasing numbers aren't allowed
        }

    }
    return foundDouble;
}
export function checkPasswordExtended(pwd: number) {
    if (!checkPassword(pwd)) {
        return false; // original rules didn't match
    }
    let currentCount = 1;
    const digits = getDigits(pwd);
    for (let i = 1; i < digits.length; i++) {
        if (digits[i - 1] === digits[i]) {
            currentCount++;
        } else {
            if (currentCount === 2) {
                return true;
            }
            currentCount = 1;
        }
    }
    return currentCount === 2;
}

function countInRange(checkFn: (pwd: number) => boolean) {
    let count = 0;
    for (let i = 254032; i <= 789860; i++) {
        if (checkFn(i)) {
            count++;
        }
    }
    return count;
}
export function solution1() {
    return countInRange(checkPassword);
}
export function solution2() {
    return countInRange(checkPasswordExtended);
}