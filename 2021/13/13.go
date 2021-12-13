package main

import (
	"fmt"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type Fold = struct {
	isVertical bool
	position   int
}

type DotMatrix = [][]bool

func main() {
	dotPositions, folds := processInput(utils.LoadInput(2021, 13))
	dotMatrix := createDotMatrix(dotPositions)
	fmt.Println("Solution 1:", countDots(executeFold(dotMatrix, folds[0])))
	fmt.Println("Solution 2:")
	fmt.Println(stringifyDotMatrix(executeFolds(dotMatrix, folds)))
}

func processInput(inputString string) (dotPositions [][]int, folds []Fold) {
	splitInputString := strings.Split(inputString, "\n\n")
	dotPositionsString := splitInputString[0]
	foldsString := splitInputString[1]

	for _, dotPositionString := range strings.Split(dotPositionsString, "\n") {
		dotPositions = append(dotPositions, utils.IntSlice(strings.Split(dotPositionString, ",")))
	}

	for _, foldString := range strings.Split(foldsString, "\n") {
		splitFoldString := strings.Split(foldString, "=")
		folds = append(folds, Fold{
			isVertical: splitFoldString[0] == "fold along x",
			position:   utils.StringToInt(splitFoldString[1]),
		})
	}

	return dotPositions, folds
}

func createDotMatrix(dotPositions [][]int) DotMatrix {
	xPositions := make([]int, len(dotPositions))
	yPositions := make([]int, len(dotPositions))
	for i, dotPosition := range dotPositions {
		xPositions[i] = dotPosition[0]
		yPositions[i] = dotPosition[1]
	}
	_, maxX := utils.MinMax(xPositions)
	_, maxY := utils.MinMax(yPositions)
	dotMatrix := make(DotMatrix, maxY+1)
	for y := 0; y < maxY+1; y++ {
		dotMatrix[y] = make([]bool, maxX+1)
	}

	for i := 0; i < len(dotPositions); i++ {
		dotMatrix[yPositions[i]][xPositions[i]] = true
	}

	return dotMatrix
}

func executeFold(dotMatrix DotMatrix, fold Fold) DotMatrix {
	newSizeX := len(dotMatrix[0])
	newSizeY := len(dotMatrix)
	if fold.isVertical {
		newSizeX = fold.position
	} else {
		newSizeY = fold.position
	}

	newDotMatrix := make(DotMatrix, newSizeY)
	for y := 0; y < newSizeY; y++ {
		newDotMatrix[y] = make([]bool, newSizeX)
		for x := 0; x < newSizeX; x++ {
			newDotMatrix[y][x] = dotMatrix[y][x]
		}
	}

	if fold.isVertical {
		for y := 0; y < newSizeY; y++ {
			for x := newSizeX + 1; x < len(dotMatrix[y]); x++ {
				if dotMatrix[y][x] {
					newDotMatrix[y][len(dotMatrix[y])-x-1] = true
				}
			}
		}
	} else {
		for y := newSizeY + 1; y < len(dotMatrix); y++ {
			for x := 0; x < newSizeX; x++ {
				if dotMatrix[y][x] {
					newDotMatrix[len(dotMatrix)-y-1][x] = true
				}
			}
		}
	}

	return newDotMatrix
}

func executeFolds(dotMatrix DotMatrix, folds []Fold) DotMatrix {
	for _, fold := range folds {
		dotMatrix = executeFold(dotMatrix, fold)
	}
	return dotMatrix
}

func countDots(dotMatrix DotMatrix) int {
	count := 0
	for _, row := range dotMatrix {
		for _, cell := range row {
			if cell {
				count++
			}
		}
	}
	return count
}

func stringifyDotMatrix(dotMatrix DotMatrix) string {
	stringifiedRows := make([]string, len(dotMatrix))
	for y, row := range dotMatrix {
		stringifiedCells := make([]string, len(row))
		for x, cell := range row {
			if cell {
				stringifiedCells[x] = "#"
			} else {
				stringifiedCells[x] = "."
			}
		}
		stringifiedRows[y] = strings.Join(stringifiedCells, "")
	}
	return strings.Join(stringifiedRows, "\n")
}
