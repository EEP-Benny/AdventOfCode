package main

import (
	"fmt"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

func main() {
	input := utils.LoadInputSliceInt(2021, 7, ",")
	fmt.Println("Solution 1:", getLowestFuelCost(input, calculateLinearFuelCost))
	fmt.Println("Solution 2:", getLowestFuelCost(input, calculateQuadraticFuelCost))
}

func calculateLinearFuelCost(startPositions []int, targetPosition int) int {
	fuelCost := 0
	for _, startPosition := range startPositions {
		fuelCost += utils.Abs(startPosition - targetPosition)
	}
	return fuelCost
}

func calculateQuadraticFuelCost(startPositions []int, targetPosition int) int {
	fuelCost := 0
	for _, startPosition := range startPositions {
		distance := utils.Abs(startPosition - targetPosition)
		fuelCost += (distance * (distance + 1)) / 2
	}
	return fuelCost
}

func getLowestFuelCost(startPositions []int, fuelCostFn func([]int, int) int) int {
	lowest, highest := utils.MinMax(startPositions)
	lowestFuelCost := fuelCostFn(startPositions, lowest)
	for targetPosition := lowest + 1; targetPosition <= highest; targetPosition++ {
		fuelCost := fuelCostFn(startPositions, targetPosition)
		if fuelCost < lowestFuelCost {
			lowestFuelCost = fuelCost
		}
	}
	return lowestFuelCost
}
