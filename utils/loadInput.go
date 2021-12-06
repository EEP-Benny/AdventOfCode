package utils

import (
	"fmt"
	"os"
	"strings"
)

func LoadInput(year, day int) string {
	filename := fmt.Sprintf("%04d/%02d/input.txt", year, day)
	fileContentAsBytes, err := os.ReadFile(filename)
	if err != nil {
		panic(err)
	}
	fileContentAsString := string(fileContentAsBytes)
	return strings.TrimSpace(fileContentAsString)
}

func LoadInputSlice(year, day int, separator string) []string {
	inputAsString := LoadInput(year, day)
	slicedInput := strings.Split(inputAsString, separator)
	return slicedInput
}

func LoadInputSliceInt(year, day int, separator string) []int {
	inputLines := LoadInputSlice(year, day, separator)
	return IntSlice(inputLines)
}
