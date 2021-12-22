package main

import (
	"fmt"
	"regexp"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type Position struct {
	x, y, z int
}

type Instruction struct {
	targetState bool
	posMin      Position
	posMax      Position
}

type ReactorState = map[Position]bool

func main() {
	instructions := parseInput(utils.LoadInputSlice(2021, 22, "\n"))
	fmt.Println("Solution 1:", countActiveCubes(rebootReactor(instructions, 50)))
	// fmt.Println("Solution 2:", ???)
}

func parseInput(inputLines []string) []Instruction {
	lineRegex, _ := regexp.Compile(`(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)`)
	instructions := make([]Instruction, len(inputLines))
	for i, inputLine := range inputLines {
		matches := lineRegex.FindStringSubmatch(inputLine)
		targetState := matches[1] == "on"
		posMin := Position{x: utils.StringToInt(matches[2]), y: utils.StringToInt(matches[4]), z: utils.StringToInt(matches[6])}
		posMax := Position{x: utils.StringToInt(matches[3]), y: utils.StringToInt(matches[5]), z: utils.StringToInt(matches[7])}
		instructions[i] = Instruction{targetState: targetState, posMin: posMin, posMax: posMax}
	}
	return instructions
}

func processInstruction(instruction Instruction, reactorState ReactorState) ReactorState {
	for x := instruction.posMin.x; x <= instruction.posMax.x; x++ {
		for y := instruction.posMin.y; y <= instruction.posMax.y; y++ {
			for z := instruction.posMin.z; z <= instruction.posMax.z; z++ {
				reactorState[Position{x, y, z}] = instruction.targetState
			}
		}
	}
	return reactorState
}

func rebootReactor(instructions []Instruction, regionSize int) ReactorState {
	reactorState := make(ReactorState)
	for _, instruction := range instructions {
		if utils.Abs(instruction.posMin.x) > regionSize {
			// simplified check, seems to suffice for the given inputs
			continue
		}
		reactorState = processInstruction(instruction, reactorState)
	}
	return reactorState
}

func countActiveCubes(reactorState ReactorState) int {
	count := 0
	for _, cubeState := range reactorState {
		if cubeState {
			count++
		}
	}
	return count
}
