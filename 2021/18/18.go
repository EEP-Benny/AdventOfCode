package main

import (
	"fmt"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type Pair struct {
	regularNumber int
	left          *Pair
	right         *Pair
}

func main() {
	input := parseInput(utils.LoadInputSlice(2021, 18, "\n"))
	fmt.Println("Solution 1:", getMagnitude(addList(input)))
	fmt.Println("Solution 2:", findLargestMagnitudeOfSum(input))
}

func parseInput(inputStrings []string) []Pair {
	pairs := make([]Pair, len(inputStrings))
	for i, inputString := range inputStrings {
		pairs[i], _ = stringToPair(inputString)
	}
	return pairs
}

func stringToPair(inputString string) (pair Pair, restString string) {
	restString = inputString

	popLetter := func() (letter string) {
		letter, restString = restString[:1], restString[1:]
		return letter
	}

	if firstLetter := popLetter(); firstLetter == "[" {
		var leftPair Pair
		var rightPair Pair
		leftPair, restString = stringToPair(restString)
		if popLetter() != "," {
			panic("Invalid string, expected ','")
		}
		rightPair, restString = stringToPair(restString)
		if popLetter() != "]" {
			panic("Invalid string, expected ']'")
		}
		pair.left = &leftPair
		pair.right = &rightPair
	} else {
		pair.regularNumber = utils.StringToInt(firstLetter)
	}

	return pair, restString
}

func pairToString(pair Pair) string {
	if pair.left != nil {
		return fmt.Sprint("[", pairToString(*pair.left), ",", pairToString(*pair.right), "]")
	}
	return fmt.Sprint(pair.regularNumber)
}

func reduce(pair Pair) Pair {
	for {
		if hasExploded := maybeExplode(&pair); hasExploded {
			continue
		}
		if hasSplit := maybeSplit(&pair); hasSplit {
			continue
		}
		break
	}
	return pair
}

func maybeExplode(pair *Pair) bool {
	hasExploded := false
	var process func(*Pair, int)
	var leftPairWithRegularNumber *Pair
	var rightPairOfExplodedPairThatStillNeedsToBeAdded *Pair
	process = func(currentPair *Pair, currentIndentationLevel int) {
		if currentIndentationLevel > 3 && currentPair.left != nil && !hasExploded {
			if leftPairWithRegularNumber != nil {
				leftPairWithRegularNumber.regularNumber += currentPair.left.regularNumber
			}
			rightPairOfExplodedPairThatStillNeedsToBeAdded = currentPair.right
			currentPair.left = nil
			currentPair.right = nil
			currentPair.regularNumber = 0
			hasExploded = true
		} else if currentPair.left != nil {
			process(currentPair.left, currentIndentationLevel+1)
			process(currentPair.right, currentIndentationLevel+1)
		} else {
			if !hasExploded {
				leftPairWithRegularNumber = currentPair
			} else if rightPairOfExplodedPairThatStillNeedsToBeAdded != nil {
				currentPair.regularNumber += rightPairOfExplodedPairThatStillNeedsToBeAdded.regularNumber
				rightPairOfExplodedPairThatStillNeedsToBeAdded = nil
			}
		}
	}
	process(pair, 0)
	return hasExploded
}

func maybeSplit(pair *Pair) bool {
	hasSplit := false
	var process func(*Pair)
	process = func(currentPair *Pair) {
		if hasSplit {
			return
		}
		if currentPair.left != nil {
			process(currentPair.left)
			process(currentPair.right)
		} else if currentPair.regularNumber >= 10 {
			currentPair.left = &Pair{regularNumber: currentPair.regularNumber / 2}
			currentPair.right = &Pair{regularNumber: (currentPair.regularNumber + 1) / 2}
			currentPair.regularNumber = 0
			hasSplit = true
		}
	}
	process(pair)
	return hasSplit
}

func add(pair1, pair2 Pair) Pair {
	// there is no deep copy in Go
	copyOfPair1, _ := stringToPair(pairToString(pair1))
	copyOfPair2, _ := stringToPair(pairToString(pair2))
	addedPair := Pair{left: &copyOfPair1, right: &copyOfPair2}
	return reduce(addedPair)
}

func addList(pairs []Pair) Pair {
	currentPair := pairs[0]
	for _, newPair := range pairs[1:] {
		currentPair = add(currentPair, newPair)
	}
	return currentPair
}

func getMagnitude(pair Pair) int {
	if pair.left != nil {
		return 3*getMagnitude(*pair.left) + 2*getMagnitude(*pair.right)
	}
	return pair.regularNumber
}

func findLargestMagnitudeOfSum(pairs []Pair) int {
	magnitudesOfSums := make([]int, 0)
	for i1, pair1 := range pairs {
		for i2, pair2 := range pairs {
			if i1 != i2 {
				magnitudesOfSums = append(magnitudesOfSums, getMagnitude(add(pair1, pair2)))
			}
		}
	}

	_, largestMagnitude := utils.MinMax(magnitudesOfSums)
	return largestMagnitude
}
