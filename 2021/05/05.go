package main

import (
	"fmt"
	"regexp"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type Line struct {
	x1, y1, x2, y2 int
}
type Diagram [][]int

func main() {
	input := utils.LoadInputSlice(2021, 5, "\n")
	diagram1 := drawLinesInDiagram(processInput(input), 1000, false)
	fmt.Println("Solution 1:", countOverlappingPoints(diagram1))
	diagram2 := drawLinesInDiagram(processInput(input), 1000, true)
	fmt.Println("Solution 2:", countOverlappingPoints(diagram2))
}

var lineRegex, _ = regexp.Compile(`(\d+),(\d+) -> (\d+),(\d+)`)

func makeLine(lineAsString string) Line {
	matches := lineRegex.FindStringSubmatch(lineAsString)
	return Line{utils.StringToInt(matches[1]), utils.StringToInt(matches[2]), utils.StringToInt(matches[3]), utils.StringToInt(matches[4])}
}

func processInput(inputAsStrings []string) []Line {
	var lines []Line

	for _, lineAsString := range inputAsStrings {
		lines = append(lines, makeLine(lineAsString))
	}
	return lines
}

func drawLinesInDiagram(lines []Line, diagramSize int, considerDiagonals bool) Diagram {
	diagram := make(Diagram, diagramSize)
	for i := 0; i < diagramSize; i++ {
		diagram[i] = make([]int, diagramSize)
	}

	for _, line := range lines {
		if line.x1 == line.x2 {
			x := line.x1
			if line.y1 < line.y2 {
				for y := line.y1; y <= line.y2; y++ {
					diagram[y][x] += 1
				}
			} else {
				for y := line.y2; y <= line.y1; y++ {
					diagram[y][x] += 1
				}
			}
		} else if line.y1 == line.y2 {
			y := line.y1
			if line.x1 < line.x2 {
				for x := line.x1; x <= line.x2; x++ {
					diagram[y][x] += 1
				}
			} else {
				for x := line.x2; x <= line.x1; x++ {
					diagram[y][x] += 1
				}
			}
		} else if considerDiagonals {
			var length, xStep, yStep int
			if line.x1 < line.x2 {
				length = line.x2 - line.x1
				xStep = 1
			} else {
				length = line.x1 - line.x2
				xStep = -1
			}
			if line.y1 < line.y2 {
				yStep = 1
			} else {
				yStep = -1
			}
			for step := 0; step <= length; step++ {
				diagram[line.y1+step*yStep][line.x1+step*xStep] += 1
			}
		}
	}

	return diagram
}

func countOverlappingPoints(diagram Diagram) int {
	overlappingPoints := 0
	for y := 0; y < len(diagram); y++ {
		for x := 0; x < len(diagram[y]); x++ {
			if diagram[y][x] > 1 {
				overlappingPoints++
			}
		}
	}
	return overlappingPoints
}
