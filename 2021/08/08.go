package main

import (
	"fmt"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type InputsAndOutputs struct {
	inputs, outputs []string
}

func main() {
	input := processInput(utils.LoadInputSlice(2021, 8, "\n"))
	fmt.Println("Solution 1:", countEasyGuessableDigits(input))
	// fmt.Println("Solution 2:", ???)
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
