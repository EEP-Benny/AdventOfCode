package main

import (
	"fmt"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type EnergyLevels [][]int

func main() {
	input := processInput(utils.LoadInputSlice(2021, 11, "\n"))
	_, flashCount := simulateSteps(input, 100)
	fmt.Println("Solution 1:", flashCount)
	// fmt.Println("Solution 2:", ???)
}

func processInput(inputAsStrings []string) EnergyLevels {
	var energyLevels EnergyLevels
	for _, str := range inputAsStrings {
		energyLevels = append(energyLevels, utils.IntSlice(strings.Split(str, "")))
	}
	return energyLevels
}

func simulateStep(energyLevels EnergyLevels) (EnergyLevels, int) {
	hasFlashed := make([][]bool, len(energyLevels))
	increaseEnergy := func(y, x int) {
		if y >= 0 && y < len(energyLevels) && x >= 0 && x < len(energyLevels[y]) {
			energyLevels[y][x]++
		}
	}
	for y := 0; y < len(energyLevels); y++ {
		hasFlashed[y] = make([]bool, len(energyLevels[y]))
		for x := 0; x < len(energyLevels[y]); x++ {
			increaseEnergy(y, x)
		}
	}
	flashCount := 0
	stillFlashing := true
	for stillFlashing {
		stillFlashing = false
		for y := 0; y < len(energyLevels); y++ {
			for x := 0; x < len(energyLevels[y]); x++ {
				if energyLevels[y][x] > 9 && !hasFlashed[y][x] {
					hasFlashed[y][x] = true
					stillFlashing = true
					flashCount++
					increaseEnergy(y-1, x-1)
					increaseEnergy(y-1, x)
					increaseEnergy(y-1, x+1)
					increaseEnergy(y, x-1)
					increaseEnergy(y, x+1)
					increaseEnergy(y+1, x-1)
					increaseEnergy(y+1, x)
					increaseEnergy(y+1, x+1)
				}
			}
		}
	}
	for y := 0; y < len(energyLevels); y++ {
		for x := 0; x < len(energyLevels[y]); x++ {
			if hasFlashed[y][x] {
				energyLevels[y][x] = 0
			}
		}
	}

	return energyLevels, flashCount
}

func simulateSteps(energyLevels EnergyLevels, stepCount int) (EnergyLevels, int) {
	totalFlashCount := 0
	for i := 0; i < stepCount; i++ {
		newEnergyLevels, flashCount := simulateStep(energyLevels)
		energyLevels = newEnergyLevels
		totalFlashCount += flashCount
	}
	return energyLevels, totalFlashCount
}
