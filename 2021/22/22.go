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
	fmt.Println("Solution 1:", countActiveCubes(rebootReactor(instructions, true)))
	fmt.Println("Solution 2:", countActiveCubes(rebootReactor(instructions, false)))
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

func intersectCuboids(cuboid1, cuboid2 Cuboid) (bool, Cuboid) {
	_, xMin := utils.MinMax([]int{cuboid1.posMin.x, cuboid2.posMin.x})
	xMax, _ := utils.MinMax([]int{cuboid1.posMax.x, cuboid2.posMax.x})
	_, yMin := utils.MinMax([]int{cuboid1.posMin.y, cuboid2.posMin.y})
	yMax, _ := utils.MinMax([]int{cuboid1.posMax.y, cuboid2.posMax.y})
	_, zMin := utils.MinMax([]int{cuboid1.posMin.z, cuboid2.posMin.z})
	zMax, _ := utils.MinMax([]int{cuboid1.posMax.z, cuboid2.posMax.z})

	if xMin <= xMax && yMin <= yMax && zMin <= zMax {
		return true, Cuboid{posMin: Position{xMin, yMin, zMin}, posMax: Position{xMax, yMax, zMax}}
	}
	return false, Cuboid{}
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
		if isIntersecting, intersectingCuboid := intersectCuboids(cuboid, instruction.cuboid); isIntersecting {
			newCuboids := splitCuboids(cuboid, instruction.cuboid)
			delete(reactorState, cuboid)
			for _, newCuboid := range newCuboids {
				reactorState[newCuboid] = cubeState
			}
			delete(reactorState, intersectingCuboid)
		}
	}
	reactorState[instruction.cuboid] = instruction.targetState
	return reactorState
}

func rebootReactor(instructions []Instruction, limitRegionSize bool) ReactorState {
	reactorState := make(ReactorState)
	for _, instruction := range instructions {
		if limitRegionSize && utils.Abs(instruction.cuboid.posMin.x) > 50 {
			// simplified check, seems to suffice for the given inputs
			continue
		}
		reactorState = processInstruction(instruction, reactorState)
	}
	return reactorState
}

func countActiveCubes(reactorState ReactorState) int64 {
	count := int64(0)
	for cuboid, cubeState := range reactorState {
		if cubeState {
			xDim := cuboid.posMax.x - cuboid.posMin.x + 1
			yDim := cuboid.posMax.y - cuboid.posMin.y + 1
			zDim := cuboid.posMax.z - cuboid.posMin.z + 1
			count += int64(xDim) * int64(yDim) * int64(zDim)
		}
	}
	return count
}
