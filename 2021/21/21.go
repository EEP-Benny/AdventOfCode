package main

import (
	"fmt"
	"regexp"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

func main() {
	playerPositions := parseInput(utils.LoadInputSlice(2021, 21, "\n"))
	fmt.Println("Solution 1:", practiceGame(playerPositions))
	// fmt.Println("Solution 2:", ???)
}

func parseInput(inputLines []string) (playerPositions [2]int) {
	lineRegex, _ := regexp.Compile(`Player \d+ starting position: (\d+)`)
	for i := 0; i < 2; i++ {
		matches := lineRegex.FindStringSubmatch(inputLines[i])
		playerPositions[i] = utils.StringToInt(matches[1])
	}
	return playerPositions
}

func practiceGame(playerPositions [2]int) int {
	playerScores := [2]int{}
	numberOfDiceRolls := 0
	rollDie := func() int {
		numberOfDiceRolls++
		return numberOfDiceRolls
	}
	for {
		for player := 0; player < 2; player++ {
			newPosition := playerPositions[player] + rollDie() + rollDie() + rollDie()
			newPosition = (newPosition-1)%10 + 1
			playerScores[player] += newPosition
			playerPositions[player] = newPosition
			if playerScores[player] >= 1000 {
				return playerScores[1-player] * numberOfDiceRolls
			}
		}
	}
}
