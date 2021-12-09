package main

import (
	"fmt"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type HeightMap [][]int

func main() {
	input := processInput(utils.LoadInputSlice(2021, 9, "\n"))
	fmt.Println("Solution 1:", getSumOfRiskLevelsOfLowPoints(input))
	// fmt.Println("Solution 2:", ???)
}

func processInput(inputAsStrings []string) HeightMap {
	var heightMap HeightMap
	for _, str := range inputAsStrings {
		heightMap = append(heightMap, utils.IntSlice(strings.Split(str, "")))
	}
	return heightMap
}

func isLowPoint(heightMap HeightMap, y, x int) bool {
	height := heightMap[y][x]
	if x > 0 && heightMap[y][x-1] <= height {
		return false
	}
	if x < len(heightMap[y])-1 && heightMap[y][x+1] <= height {
		return false
	}
	if y > 0 && heightMap[y-1][x] <= height {
		return false
	}
	if y < len(heightMap)-1 && heightMap[y+1][x] <= height {
		return false
	}

	return true
}

func getSumOfRiskLevelsOfLowPoints(heightMap HeightMap) int {
	sum := 0
	for y := 0; y < len(heightMap); y++ {
		for x := 0; x < len(heightMap[y]); x++ {
			if isLowPoint(heightMap, y, x) {
				height := heightMap[y][x]
				sum += height + 1
			}
		}
	}
	return sum
}
