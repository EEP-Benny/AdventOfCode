package main

import (
	"fmt"

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

func main() {
	input := utils.LoadInputSlice(2021, 10, "\n")
	fmt.Println("Solution 1:", getSyntaxErrorScore(input))
	// fmt.Println("Solution 2:", ???)
}

func validateLine(line string) (isValid bool, illegalChars []rune, openChunks []rune) {
	for _, char := range line {
		if _, exists := matchingCharacters[char]; exists {
			// opening chunk
			openChunks = append(openChunks, char)
		} else if char == matchingCharacters[openChunks[len(openChunks)-1]] {
			// closing chunk
			openChunks = openChunks[:len(openChunks)-1]
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
