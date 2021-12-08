package main

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
	permutationPackage "github.com/fighterlyt/permutation"
)

type InputsAndOutputs struct {
	inputs, outputs []string
}

type WireState [7]bool

var digitWireStates = []WireState{
	{true, true, true, false, true, true, true},     // 0
	{false, false, true, false, false, true, false}, // 1
	{true, false, true, true, true, false, true},    // 2
	{true, false, true, true, false, true, true},    // 3
	{false, true, true, true, false, true, false},   // 4
	{true, true, false, true, false, true, true},    // 5
	{true, true, false, true, true, true, true},     // 6
	{true, false, true, false, false, true, false},  // 7
	{true, true, true, true, true, true, true},      // 8
	{true, true, true, true, false, true, true},     // 9
}

func main() {
	input := processInput(utils.LoadInputSlice(2021, 8, "\n"))
	fmt.Println("Solution 1:", countEasyGuessableDigits(input))
	fmt.Println("Solution 2:", sumAllOutputNumbers(input))
}

func makeInputsAndOutputs(str string) InputsAndOutputs {
	split := strings.Split(str, " | ")
	return InputsAndOutputs{
		inputs:  strings.Split(split[0], " "),
		outputs: strings.Split(split[1], " "),
	}
}

func processInput(inputAsStrings []string) []InputsAndOutputs {
	var IOs []InputsAndOutputs

	for _, str := range inputAsStrings {
		IOs = append(IOs, makeInputsAndOutputs(str))
	}
	return IOs
}

func countEasyGuessableDigits(sliceOfInputsAndOutputs []InputsAndOutputs) int {
	count := 0
	for _, inputsAndOutputs := range sliceOfInputsAndOutputs {
		for _, output := range inputsAndOutputs.outputs {
			switch len(output) {
			case 2: // digit 1
				count++
			case 3: // digit 7
				count++
			case 4: // digit 4
				count++
			case 7: // digit 8
				count++
			}
		}
	}
	return count
}

func getWireStateFromString(wireStateAsString string) WireState {
	return WireState{
		strings.Contains(wireStateAsString, "a"),
		strings.Contains(wireStateAsString, "b"),
		strings.Contains(wireStateAsString, "c"),
		strings.Contains(wireStateAsString, "d"),
		strings.Contains(wireStateAsString, "e"),
		strings.Contains(wireStateAsString, "f"),
		strings.Contains(wireStateAsString, "g"),
	}
}

func isSameWireState(a, b WireState) bool {
	for i := 0; i < 7; i++ {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

func getDigit(wireState WireState) int {
	for digit, digitWireState := range digitWireStates {
		if isSameWireState(digitWireState, wireState) {
			return digit
		}
	}
	return -1
}

func applyPermutation(wireState WireState, permutation []int) WireState {
	var newWireState WireState
	for i := 0; i < 7; i++ {
		newWireState[i] = wireState[permutation[i]]
	}
	return newWireState
}

func isValidPermutation(inputsAndOutputs InputsAndOutputs, permutation []int) bool {
	for _, input := range inputsAndOutputs.inputs {
		foundDigit := getDigit(applyPermutation(getWireStateFromString(input), permutation))
		if foundDigit == -1 {
			return false
		}
	}
	return true
}

func findWirePermutation(inputsAndOutputs InputsAndOutputs) []int {
	permutation := []int{0, 1, 2, 3, 4, 5, 6}
	permutationGenerator, err := permutationPackage.NewPerm(permutation, nil)
	if err != nil {
		panic(err)
	}
	for permutation, err := permutationGenerator.Next(); err == nil; permutation, err = permutationGenerator.Next() {
		if isValidPermutation(inputsAndOutputs, permutation.([]int)) {
			return permutation.([]int)
		}
	}
	return []int{0, 0, 0, 0, 0, 0, 0}
}

func findOutputNumber(inputsAndOutputs InputsAndOutputs) int {
	permutation := findWirePermutation(inputsAndOutputs)
	var digits []string
	for _, outputString := range inputsAndOutputs.outputs {
		digit := getDigit(applyPermutation(getWireStateFromString(outputString), permutation))
		digits = append(digits, strconv.Itoa(digit))
	}
	return utils.StringToInt(strings.Join(digits, ""))
}

func sumAllOutputNumbers(sliceOfInputsAndOutputs []InputsAndOutputs) int {
	sum := 0
	for _, inputsAndOutputs := range sliceOfInputsAndOutputs {
		sum += findOutputNumber(inputsAndOutputs)
	}
	return sum
}
