package main

import (
	"fmt"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type RiskLevels [][]int

func main() {
	input := processInput(utils.LoadInputSlice(2021, 15, "\n"))
	fmt.Println("Solution 1:", findLowestRisk(input))
	// fmt.Println("Solution 2:", ???)
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
		for x := 0; x < len(riskLevels[y]); x++ {
			possibleRisks := make([]int, 0, 2)
			if y > 0 {
				possibleRisks = append(possibleRisks, cumulativeRiskForPosition[y-1][x])
			}
			if x > 0 {
				possibleRisks = append(possibleRisks, cumulativeRiskForPosition[y][x-1])
			}
			if len(possibleRisks) > 0 {
				minRisk, _ := utils.MinMax(possibleRisks)
				cumulativeRiskForPosition[y][x] = minRisk + riskLevels[y][x]
			}
		}
	}

	return cumulativeRiskForPosition[len(riskLevels)-1][len(riskLevels[len(riskLevels)-1])-1]
}
