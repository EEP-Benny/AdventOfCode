package main

import (
	"fmt"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

func main() {
	input := utils.LoadInputSliceInt(2021, 6, ",")
	fmt.Println("Solution 1:", len(simulateManyDays(input, 80)))
	// fmt.Println("Solution 2:", ???)
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
