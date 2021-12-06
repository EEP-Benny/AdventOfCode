package main

import (
	"fmt"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

func main() {
	input := utils.LoadInputSliceInt(2021, 6, ",")
	fmt.Println("Solution 1:", len(simulateManyDays(input, 80)))
	fmt.Println("Solution 2:", getNumberOfFishAfterDays(input, 256))
}

func simulateOneDay(oldInternalTimers []int) []int {
	newInternalTimers := make([]int, len(oldInternalTimers))
	for i, oldInternalTimer := range oldInternalTimers {
		if oldInternalTimer <= 0 {
			newInternalTimers[i] = 6
			newInternalTimers = append(newInternalTimers, 8)
		} else {
			newInternalTimers[i] = oldInternalTimer - 1
		}
	}
	return newInternalTimers
}

func simulateManyDays(internalTimers []int, numDays int) []int {
	for day := 0; day < numDays; day++ {
		internalTimers = simulateOneDay(internalTimers)
	}
	return internalTimers
}

func getNumberOfFishAfterDays(internalTimers []int, numDays int) int {
	numberOfFishWithInternalTimerOf := make([]int, 9)
	for _, internalTimer := range internalTimers {
		numberOfFishWithInternalTimerOf[internalTimer]++
	}
	for day := 0; day < numDays; day++ {
		newNumberOfFishWithInternalTimerOf := make([]int, 9)
		for i := 0; i < 8; i++ {
			newNumberOfFishWithInternalTimerOf[i] = numberOfFishWithInternalTimerOf[i+1]
		}
		newNumberOfFishWithInternalTimerOf[6] += numberOfFishWithInternalTimerOf[0]
		newNumberOfFishWithInternalTimerOf[8] = numberOfFishWithInternalTimerOf[0]

		numberOfFishWithInternalTimerOf = newNumberOfFishWithInternalTimerOf
	}
	totalNumberOfFish := 0
	for _, numberOfFish := range numberOfFishWithInternalTimerOf {
		totalNumberOfFish += numberOfFish
	}
	return totalNumberOfFish
}
