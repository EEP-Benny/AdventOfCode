package utils

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func LoadInput(year, day int) string {
	filename := fmt.Sprintf("%04d/%02d/input.txt", year, day)
	fileContentAsBytes, err := os.ReadFile(filename)
	if err != nil {
		panic(err)
	}
	fileContentAsString := string(fileContentAsBytes)
	return fileContentAsString
}

func LoadInputSlice(year, day int, separator string) []string {
	inputAsString := LoadInput(year, day)
	slicedInput := strings.Split(strings.TrimSpace(inputAsString), separator)
	return slicedInput
}

func LoadInputSliceInt(year, day int) []int {
	inputLines := LoadInputSlice(year, day, "\n")
	var numericLines []int
	for _, line := range inputLines {
		if numericLine, err := strconv.Atoi(line); err != nil {
			panic(err)
		} else {
			numericLines = append(numericLines, numericLine)
		}
	}
	return numericLines
}
