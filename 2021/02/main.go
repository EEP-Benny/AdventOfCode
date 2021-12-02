package main

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

func main() {
	input := utils.LoadInputSlice(2021, 2, "\n")
	finalHorizontalPosition, finalDepth := processInstructions(input)
	fmt.Println("Solution 1:", finalHorizontalPosition*finalDepth)
	finalHorizontalPosition2, finalDepth2 := processInstructionsWithAim(input)
	fmt.Println("Solution 2:", finalHorizontalPosition2*finalDepth2)
}

func splitInstruction(instruction string) (string, int) {
	instructionParts := strings.Split(instruction, " ")
	stringPart := instructionParts[0]
	intPart, err := strconv.Atoi(instructionParts[1])
	if err != nil {
		panic(err)
	}

	return stringPart, intPart
}

func translateInstruction(instruction string) (horizontalPosition, depth int) {
	stringPart, intPart := splitInstruction(instruction)
	switch stringPart {
	case "forward":
		return intPart, 0
	case "up":
		return 0, -intPart
	case "down":
		return 0, intPart
	default:
		panic(fmt.Errorf("unknown instruction: %s", stringPart))
	}
}

func processInstructions(instructions []string) (finalHorizontalPosition, finalDepth int) {
	currentHorizontalPosition, currentDepth := 0, 0
	for _, instruction := range instructions {
		horizonalPosition, depth := translateInstruction(instruction)
		currentHorizontalPosition += horizonalPosition
		currentDepth += depth
	}
	return currentHorizontalPosition, currentDepth
}

func processInstructionsWithAim(instructions []string) (finalHorizontalPosition, finalDepth int) {
	currentAim, currentHorizontalPosition, currentDepth := 0, 0, 0
	for _, instruction := range instructions {
		horizonalPosition, depth := translateInstruction(instruction)
		currentAim += depth
		currentHorizontalPosition += horizonalPosition
		currentDepth += horizonalPosition * currentAim
	}
	return currentHorizontalPosition, currentDepth
}
