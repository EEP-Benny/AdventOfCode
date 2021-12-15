package main

import (
	"fmt"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type RiskLevels [][]int
type Position struct {
	x, y int
}

func main() {
	input := processInput(utils.LoadInputSlice(2021, 15, "\n"))
	fmt.Println("Solution 1:", findLowestRisk(input))
	bigInput := tileRiskMap(input, 5, 5)
	fmt.Println("Solution 2:", findLowestRisk(bigInput))
}

func processInput(inputAsStrings []string) RiskLevels {
	var riskLevels RiskLevels
	for _, str := range inputAsStrings {
		riskLevels = append(riskLevels, utils.IntSlice(strings.Split(str, "")))
	}
	return riskLevels
}

func findLowestRisk(riskLevels RiskLevels) int {
	cumulativeRiskForPosition := make(RiskLevels, len(riskLevels))
	for y := 0; y < len(riskLevels); y++ {
		cumulativeRiskForPosition[y] = make([]int, len(riskLevels[y]))
	}

	positionsToExplore := []Position{{0, 0}}

	explore := func(x, y, previousRisk int) {
		if y >= 0 && y < len(riskLevels) && x >= 0 && x < len(riskLevels[y]) {
			currentRisk := cumulativeRiskForPosition[y][x]
			newRisk := previousRisk + riskLevels[y][x]
			if currentRisk == 0 || currentRisk > newRisk {
				cumulativeRiskForPosition[y][x] = newRisk
				positionsToExplore = append(positionsToExplore, Position{x, y})
			}
		}
	}

	for len(positionsToExplore) > 0 {
		position := positionsToExplore[0]
		positionsToExplore = positionsToExplore[1:]
		currentRisk := cumulativeRiskForPosition[position.y][position.x]
		explore(position.x-1, position.y, currentRisk)
		explore(position.x, position.y-1, currentRisk)
		explore(position.x+1, position.y, currentRisk)
		explore(position.x, position.y+1, currentRisk)
	}

	return cumulativeRiskForPosition[len(riskLevels)-1][len(riskLevels[len(riskLevels)-1])-1]
}

func tileRiskMap(riskMap RiskLevels, xFactor, yFactor int) RiskLevels {
	ySize := len(riskMap)
	xSize := len(riskMap[0])
	newRiskMap := make(RiskLevels, ySize*yFactor)
	for y := 0; y < ySize*yFactor; y++ {
		newRiskMap[y] = make([]int, xSize*xFactor)
		for x := 0; x < xSize*xFactor; x++ {
			valueFromOriginalMap := riskMap[y%ySize][x%xSize]

			newRiskMap[y][x] = ((valueFromOriginalMap+y/ySize+x/xSize)-1)%9 + 1
		}
	}

	return newRiskMap
}
