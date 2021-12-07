package utils

import (
	"strconv"
)

func StringToInt(str string) int {
	if num, err := strconv.Atoi(str); err != nil {
		panic(err)
	} else {
		return num
	}
}

func Abs(num int) int {
	if num < 0 {
		return -num
	} else {
		return num
	}
}

func MinMax(numbers []int) (min int, max int) {
	min = numbers[0]
	max = numbers[0]
	for _, number := range numbers {
		if number < min {
			min = number
		}
		if number > max {
			max = number
		}
	}
	return min, max
}
