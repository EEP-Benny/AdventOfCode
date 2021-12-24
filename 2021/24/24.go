package main

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type Instruction struct {
	instruction string
	a           string
	b           string
}

type ALUState struct {
	registers            map[string]int
	remainingInputValues []int
}

func main() {
	monadProgram := parseInput(utils.LoadInputSlice(2021, 24, "\n"))
	fmt.Println("Solution 1:", findLargestModelNumber(monadProgram))
	// fmt.Println("Solution 2:", ???)
}

func parseInput(inputLines []string) []Instruction {
	instructions := make([]Instruction, len(inputLines))
	for i, inputLine := range inputLines {
		split := strings.Split(inputLine, " ")
		instructions[i].instruction = split[0]
		instructions[i].a = split[1]
		if len(split) > 2 {
			instructions[i].b = split[2]
		}
	}
	return instructions
}

func compare(a, b int) int {
	if a == b {
		return 1
	}
	return 0
}

func makeALUState(w, x, y, z int, input []int) ALUState {
	return ALUState{registers: map[string]int{"w": w, "x": x, "y": y, "z": z}, remainingInputValues: input}
}

func (aluState ALUState) copy() ALUState {
	return makeALUState(
		aluState.registers["w"],
		aluState.registers["x"],
		aluState.registers["y"],
		aluState.registers["z"],
		aluState.remainingInputValues,
	)
}

func (aluState ALUState) executeInstruction(instruction Instruction) ALUState {
	newState := aluState.copy()
	newState.remainingInputValues = aluState.remainingInputValues
	if instruction.instruction == "inp" {
		newState.registers[instruction.a] = newState.remainingInputValues[0]
		newState.remainingInputValues = newState.remainingInputValues[1:]
	} else {
		valueA := newState.registers[instruction.a]
		valueB, ok := newState.registers[instruction.b]
		if !ok {
			valueB = utils.StringToInt(instruction.b)
		}
		result := 0
		switch instruction.instruction {
		case "add":
			result = valueA + valueB
		case "mul":
			result = valueA * valueB
		case "div":
			result = valueA / valueB
		case "mod":
			result = valueA % valueB
		case "eql":
			result = compare(valueA, valueB)
		}
		newState.registers[instruction.a] = result
	}
	return newState
}

func (aluState ALUState) executeInstructions(instructions []Instruction) ALUState {
	for _, instruction := range instructions {
		aluState = aluState.executeInstruction(instruction)
	}
	return aluState
}

func findLargestModelNumber(monadProgram []Instruction) string {
	highestNumberForZSoFar := map[int]string{0: ""}
	for index := 0; index < 14; index++ {
		newHighestNumberForZ := make(map[int]string)
		maxZToGetToZero := int64(1)
		for remainingIndex := index; remainingIndex < 14; remainingIndex++ {
			maxZToGetToZero *= 26
		}
		fmt.Println("index:", index, "number of z to consider:", len(highestNumberForZSoFar), ", maxZ:", maxZToGetToZero)
		for number := 1; number <= 9; number++ {
			for z, highestNumberSoFar := range highestNumberForZSoFar {
				if int64(z) > maxZToGetToZero {
					continue
				}
				initialALUState := makeALUState(0, 0, 0, z, []int{number})
				finalALUState := initialALUState.executeInstructions(monadProgram[18*index : 18*(index+1)])
				newHighestNumberForZ[finalALUState.registers["z"]] = highestNumberSoFar + strconv.Itoa(number)
			}
		}
		highestNumberForZSoFar = newHighestNumberForZ
	}
	return highestNumberForZSoFar[0]
}
