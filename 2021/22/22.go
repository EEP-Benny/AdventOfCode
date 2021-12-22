package main

import (
	"fmt"
	"regexp"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type Position struct {
	x, y, z int
}

type Cuboid struct {
	posMin Position
	posMax Position
}

type Instruction struct {
	targetState bool
	cuboid      Cuboid
}

type ReactorState = map[Cuboid]bool

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
		instructions[i] = Instruction{targetState: targetState, cuboid: Cuboid{posMin: posMin, posMax: posMax}}
	}
	return instructions
}

// splits between x and x+1
func splitCuboidsX(cuboids []Cuboid, x int) []Cuboid {
	for i, cuboid := range cuboids {
		if cuboid.posMin.x <= x && x < cuboid.posMax.x {
			newCuboid1 := Cuboid{posMin: cuboid.posMin, posMax: Position{x, cuboid.posMax.y, cuboid.posMax.z}}
			newCuboid2 := Cuboid{posMin: Position{x + 1, cuboid.posMin.y, cuboid.posMin.z}, posMax: cuboid.posMax}
			cuboids[i] = newCuboid1
			cuboids = append(cuboids, newCuboid2)
		}
	}
	return cuboids
}

// splits between y and y+1
func splitCuboidsY(cuboids []Cuboid, y int) []Cuboid {
	for i, cuboid := range cuboids {
		if cuboid.posMin.y <= y && y < cuboid.posMax.y {
			newCuboid1 := Cuboid{posMin: cuboid.posMin, posMax: Position{cuboid.posMax.x, y, cuboid.posMax.z}}
			newCuboid2 := Cuboid{posMin: Position{cuboid.posMin.x, y + 1, cuboid.posMin.z}, posMax: cuboid.posMax}
			cuboids[i] = newCuboid1
			cuboids = append(cuboids, newCuboid2)
		}
	}
	return cuboids
}

// splits between z and z+1
func splitCuboidsZ(cuboids []Cuboid, z int) []Cuboid {
	for i, cuboid := range cuboids {
		if cuboid.posMin.z <= z && z < cuboid.posMax.z {
			newCuboid1 := Cuboid{posMin: cuboid.posMin, posMax: Position{cuboid.posMax.x, cuboid.posMax.y, z}}
			newCuboid2 := Cuboid{posMin: Position{cuboid.posMin.x, cuboid.posMin.y, z + 1}, posMax: cuboid.posMax}
			cuboids[i] = newCuboid1
			cuboids = append(cuboids, newCuboid2)
		}
	}
	return cuboids
}

func splitCuboids(cuboidToSplit Cuboid, splittingCuboid Cuboid) []Cuboid {
	resultingCuboids := []Cuboid{cuboidToSplit}
	resultingCuboids = splitCuboidsX(resultingCuboids, splittingCuboid.posMin.x-1)
	resultingCuboids = splitCuboidsX(resultingCuboids, splittingCuboid.posMax.x)
	resultingCuboids = splitCuboidsY(resultingCuboids, splittingCuboid.posMin.y-1)
	resultingCuboids = splitCuboidsY(resultingCuboids, splittingCuboid.posMax.y)
	resultingCuboids = splitCuboidsZ(resultingCuboids, splittingCuboid.posMin.z-1)
	resultingCuboids = splitCuboidsZ(resultingCuboids, splittingCuboid.posMax.z)
	return resultingCuboids
}

func processInstruction(instruction Instruction, reactorState ReactorState) ReactorState {
	for cuboid, cubeState := range reactorState {
		newCuboids := splitCuboids(cuboid, instruction.cuboid)
		fmt.Println("Split", cuboid, "into", len(newCuboids), "cuboids:", newCuboids)
		if len(newCuboids) > 1 {
			delete(reactorState, cuboid)
			for _, newCuboid := range newCuboids {
				reactorState[newCuboid] = cubeState
			}
		}
	}
	fmt.Println("After split still at", countActiveCubes(reactorState), "active cubes:", listActiveCubes(reactorState))

	reactorState[instruction.cuboid] = instruction.targetState
	fmt.Println("Now at", countActiveCubes(reactorState), "active cubes:", listActiveCubes(reactorState))

	return reactorState
}

func rebootReactor(instructions []Instruction, regionSize int) ReactorState {
	reactorState := make(ReactorState)
	for _, instruction := range instructions {
		if utils.Abs(instruction.cuboid.posMin.x) > regionSize {
			// simplified check, seems to suffice for the given inputs
			continue
		}
		reactorState = processInstruction(instruction, reactorState)
	}
	return reactorState
}

func countActiveCubes(reactorState ReactorState) int {
	count := 0
	for cuboid, cubeState := range reactorState {
		if cubeState {
			xDim := cuboid.posMax.x - cuboid.posMin.x + 1
			yDim := cuboid.posMax.y - cuboid.posMin.y + 1
			zDim := cuboid.posMax.z - cuboid.posMin.z + 1
			count += xDim * yDim * zDim
		}
	}
	return count
}

func listActiveCubes(reactorState ReactorState) []Position {
	activeCubes := make([]Position, 0)
	for cuboid, cubeState := range reactorState {
		if cubeState {
			for x := cuboid.posMin.x; x <= cuboid.posMax.x; x++ {
				for y := cuboid.posMin.y; y <= cuboid.posMax.y; y++ {
					for z := cuboid.posMin.z; z <= cuboid.posMax.z; z++ {
						activeCubes = append(activeCubes, Position{x, y, z})
					}
				}
			}
		}
	}

	return activeCubes
}
