package main

import (
	"fmt"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type OceanFloorMap [][]string

var EMPTY = "."
var RIGHT = ">"
var DOWN = "v"

func main() {
	input := utils.LoadInputSlice(2021, 25, "\n")
	fmt.Println("Solution 1:", findFirstStepWithoutMovement(parseInput(input)))
	// fmt.Println("Solution 2:", ???)
}

func parseInput(inputLines []string) OceanFloorMap {
	oceanFloorMap := make(OceanFloorMap, len(inputLines))
	for i, inputLine := range inputLines {
		oceanFloorMap[i] = strings.Split(inputLine, "")
	}
	return oceanFloorMap
}

func simulateStep(oceanFloorMap OceanFloorMap) (bool, OceanFloorMap) {
	somethingHasMoved := false
	sizeY, sizeX := len(oceanFloorMap), len(oceanFloorMap[0])
	oceanFloorMapAfterStepRight := make(OceanFloorMap, sizeY)
	// move right
	for y := 0; y < sizeY; y++ {
		oceanFloorMapAfterStepRight[y] = make([]string, sizeX)
		for x := 0; x < sizeX; x++ {
			oceanFloorMapAfterStepRight[y][x] = oceanFloorMap[y][x]
			if oceanFloorMap[y][x] == RIGHT {
				if oceanFloorMap[y][(x+1)%sizeX] == EMPTY {
					oceanFloorMapAfterStepRight[y][(x+1)%sizeX] = RIGHT
					oceanFloorMapAfterStepRight[y][x] = EMPTY
					somethingHasMoved = true
					x++
				}
			}
		}
	}
	oceanFloorMapAfterStepDown := make(OceanFloorMap, sizeY)
	// move down
	for y := 0; y < sizeY; y++ {
		oceanFloorMapAfterStepDown[y] = make([]string, sizeX)
	}
	for x := 0; x < sizeX; x++ {
		for y := 0; y < sizeY; y++ {
			oceanFloorMapAfterStepDown[y][x] = oceanFloorMapAfterStepRight[y][x]
			if oceanFloorMapAfterStepRight[y][x] == DOWN {
				if oceanFloorMapAfterStepRight[(y+1)%sizeY][x] == EMPTY {
					oceanFloorMapAfterStepDown[(y+1)%sizeY][x] = DOWN
					oceanFloorMapAfterStepDown[y][x] = EMPTY
					somethingHasMoved = true
					y++
				}
			}
		}
	}
	return somethingHasMoved, oceanFloorMapAfterStepDown
}

func findFirstStepWithoutMovement(oceanFloorMap OceanFloorMap) int {
	stepCount := 0
	hasMoved := false
	for stepCount < 10000 {
		stepCount++
		hasMoved, oceanFloorMap = simulateStep(oceanFloorMap)
		if !hasMoved {
			return stepCount
		}
	}
	return -1
}
