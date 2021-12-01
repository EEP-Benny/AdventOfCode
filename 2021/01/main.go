package main

import (
	"fmt"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

func main() {
	input := utils.LoadInputSliceInt(2021, 1)
	fmt.Println("Solution 1:", countDepthIncreases(input))
	fmt.Println("Solution 2:", countSmoothedDepthIncreases(input))
}

func countDepthIncreases(depthReadings []int) int {
	numberOfIncreases := 0
	lastDepth := depthReadings[0]
	for _, numericLine := range depthReadings[1:] {
		if lastDepth < numericLine {
			numberOfIncreases++
		}
		lastDepth = numericLine
	}
	return numberOfIncreases
}

func countSmoothedDepthIncreases(depthReadings []int) int {
	numberOfIncreases := 0
	lastDepth := sumOfThree(depthReadings)
	for i := 1; i < len(depthReadings)-2; i++ {
		currentDepth := sumOfThree(depthReadings[i:])
		if lastDepth < currentDepth {
			numberOfIncreases++
		}
		lastDepth = currentDepth
	}
	return numberOfIncreases
}

func sumOfThree(numbers []int) int {
	return numbers[0] + numbers[1] + numbers[2]
}
