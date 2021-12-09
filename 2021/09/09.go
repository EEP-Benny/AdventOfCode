package main

import (
	"fmt"
	"sort"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type HeightMap [][]int

func main() {
	input := processInput(utils.LoadInputSlice(2021, 9, "\n"))
	fmt.Println("Solution 1:", getSumOfRiskLevelsOfLowPoints(input))
	fmt.Println("Solution 2:", getProductOfThreeLargestBasins(input))
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

func getSizeOfBasinAtLowPoint(heightMap HeightMap, y, x int) int {
	isPartOfBasin := map[[2]int]bool{{y, x}: true}
	previousBasinSize := 0
	checkCoordinate := func(y, x int) {
		if heightMap[y][x] < 9 {
			isPartOfBasin[[2]int{y, x}] = true
		}
	}
	for previousBasinSize < len(isPartOfBasin) {
		previousBasinSize = len(isPartOfBasin)
		for coordinate := range isPartOfBasin {
			y := coordinate[0]
			x := coordinate[1]
			if x > 0 {
				checkCoordinate(y, x-1)
			}
			if x < len(heightMap[y])-1 {
				checkCoordinate(y, x+1)
			}
			if y > 0 {
				checkCoordinate(y-1, x)
			}
			if y < len(heightMap)-1 {
				checkCoordinate(y+1, x)
			}
		}
	}
	return len(isPartOfBasin)
}

func getProductOfThreeLargestBasins(heightMap HeightMap) int {
	var basinSizes []int
	for y := 0; y < len(heightMap); y++ {
		for x := 0; x < len(heightMap[y]); x++ {
			if isLowPoint(heightMap, y, x) {
				basinSize := getSizeOfBasinAtLowPoint(heightMap, y, x)
				basinSizes = append(basinSizes, basinSize)
			}
		}
	}
	sort.Sort(sort.Reverse(sort.IntSlice(basinSizes)))
	return basinSizes[0] * basinSizes[1] * basinSizes[2]

}
