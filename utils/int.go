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
