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
	diagram := drawLinesInDiagram(processInput(input), 1000)
	fmt.Println("Solution 1:", countOverlappingPoints(diagram))
	// fmt.Println("Solution 2:", 0)
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

func drawLinesInDiagram(lines []Line, diagramSize int) Diagram {
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
