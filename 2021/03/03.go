package main

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

func main() {
	input := utils.LoadInputSlice(2021, 3, "\n")
	inputBitFields := convertToBitFields(input)

	gammaRate := convertBitsToInt(findMostCommonBits(inputBitFields))
	epsilonRate := convertBitsToInt(findLeastCommonBits(inputBitFields))
	fmt.Println("Solution 1:", gammaRate*epsilonRate)

	oxygenGeneratorRating := convertBitsToInt(filterDownToOneNumber(inputBitFields, findMostCommonBits))
	co2ScrubberRating := convertBitsToInt(filterDownToOneNumber(inputBitFields, findLeastCommonBits))
	fmt.Println("Solution 2:", oxygenGeneratorRating*co2ScrubberRating)
}

func convertToBitField(inputAsString string) []int {
	slicedInput := strings.Split(inputAsString, "")
	return utils.IntSlice(slicedInput)
}

func convertToBitFields(inputSlice []string) [][]int {
	bitFields := make([][]int, len(inputSlice))
	for i, inputAsString := range inputSlice {
		bitFields[i] = convertToBitField(inputAsString)
	}
	return bitFields
}

func sumBits(inputBitFields [][]int) []int {
	summedBits := make([]int, len(inputBitFields[0]))
	for _, bits := range inputBitFields {
		for i, bit := range bits {
			summedBits[i] += bit
		}
	}
	return summedBits
}

func findMostCommonBits(inputBitFields [][]int) []int {
	threshold := (len(inputBitFields) + 1) / 2
	summedBits := sumBits(inputBitFields)
	mostCommonBits := make([]int, len(summedBits))
	for i, summedBit := range summedBits {
		if summedBit >= threshold {
			mostCommonBits[i] = 1
		}
	}
	return mostCommonBits
}

func findLeastCommonBits(inputBitFields [][]int) []int {
	threshold := (len(inputBitFields) + 1) / 2
	summedBits := sumBits(inputBitFields)
	leastCommonBits := make([]int, len(summedBits))
	for i, summedBit := range summedBits {
		if summedBit < threshold {
			leastCommonBits[i] = 1
		}
	}
	return leastCommonBits
}

func convertBitsToInt(inputBits []int) int {
	stringSlice := make([]string, len(inputBits))
	for i, bit := range inputBits {
		stringSlice[i] = strconv.Itoa(bit)
	}
	integer, err := strconv.ParseInt(strings.Join(stringSlice, ""), 2, 0)
	if err != nil {
		panic(err)
	}
	return int(integer)
}

func filterDownToOneNumber(inputBitFields [][]int, findSurvivingBit func([][]int) []int) []int {
	currentNumbers := inputBitFields
	for i := 0; len(currentNumbers) > 1; i++ {
		survivingBit := findSurvivingBit(currentNumbers)[i]
		var survivingNumbers [][]int
		for _, currentNumber := range currentNumbers {
			if currentNumber[i] == survivingBit {
				survivingNumbers = append(survivingNumbers, currentNumber)
			}
		}
		currentNumbers = survivingNumbers
	}
	return currentNumbers[0]
}
