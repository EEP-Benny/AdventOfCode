package main

import (
	"fmt"
	"sort"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

var matchingCharacters = map[rune]rune{
	'(': ')',
	'[': ']',
	'{': '}',
	'<': '>',
}

var illegalCharacterScore = map[rune]int{
	')': 3,
	']': 57,
	'}': 1197,
	'>': 25137,
}

var completionScore = map[rune]int{
	')': 1,
	']': 2,
	'}': 3,
	'>': 4,
}

func main() {
	input := utils.LoadInputSlice(2021, 10, "\n")
	fmt.Println("Solution 1:", getSyntaxErrorScore(input))
	fmt.Println("Solution 2:", findMiddleCompletionScore(input))
}

func validateLine(line string) (isValid bool, illegalChars []rune, openChunks []rune) {
	for _, char := range line {
		if matchingChar, exists := matchingCharacters[char]; exists {
			// opening chunk
			openChunks = append([]rune{matchingChar}, openChunks...)
		} else if char == openChunks[0] {
			// closing chunk
			openChunks = openChunks[1:]
		} else {
			// invalid closing character
			return false, []rune{char}, []rune{}
		}
	}
	return len(openChunks) == 0, []rune{}, openChunks
}

func getSyntaxErrorScore(lines []string) int {
	score := 0
	for _, line := range lines {
		_, illegalChars, _ := validateLine(line)
		if len(illegalChars) > 0 {
			score += illegalCharacterScore[illegalChars[0]]
		}
	}
	return score
}

func getCompletionScore(openChunks []rune) int {
	score := 0
	for _, closingChar := range openChunks {
		score *= 5
		score += completionScore[closingChar]
	}
	return score
}

func findMiddleCompletionScore(lines []string) int {
	completionScores := []int{}
	for _, line := range lines {
		_, _, openChunks := validateLine(line)
		if len(openChunks) > 0 {
			completionScores = append(completionScores, getCompletionScore(openChunks))
		}
	}
	sort.Ints(completionScores)
	return completionScores[len(completionScores)/2]
}
