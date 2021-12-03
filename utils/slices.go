package utils

import "strconv"

func IntSlice(stringSlice []string) []int {
	var intSlice []int
	for _, line := range stringSlice {
		if numericLine, err := strconv.Atoi(line); err != nil {
			panic(err)
		} else {
			intSlice = append(intSlice, numericLine)
		}
	}
	return intSlice
}
