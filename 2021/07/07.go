package main

import (
	"fmt"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

func main() {
	input := utils.LoadInputSliceInt(2021, 7, ",")
	fmt.Println("Solution 1:", getLowestFuelCost(input))
	// fmt.Println("Solution 2:", ???)
}

func calculateFuelCost(startPositions []int, targetPosition int) int {
	fuelCost := 0
	for _, startPosition := range startPositions {
		fuelCost += utils.Abs(startPosition - targetPosition)
	}
	return fuelCost
}

func getLowestFuelCost(startPositions []int) int {
	lowest, highest := utils.MinMax(startPositions)
	lowestFuelCost := calculateFuelCost(startPositions, lowest)
	for targetPosition := lowest + 1; targetPosition <= highest; targetPosition++ {
		fuelCost := calculateFuelCost(startPositions, targetPosition)
		if fuelCost < lowestFuelCost {
			lowestFuelCost = fuelCost
		}
	}
	return lowestFuelCost
}
