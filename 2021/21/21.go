package main

import (
	"fmt"
	"regexp"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

func main() {
	playerPositions := parseInput(utils.LoadInputSlice(2021, 21, "\n"))
	fmt.Println("Solution 1:", practiceGame(playerPositions))
	fmt.Println("Solution 2:", quantumGame(playerPositions))
}

func parseInput(inputLines []string) (playerPositions [2]int) {
	lineRegex, _ := regexp.Compile(`Player \d+ starting position: (\d+)`)
	for i := 0; i < 2; i++ {
		matches := lineRegex.FindStringSubmatch(inputLines[i])
		playerPositions[i] = utils.StringToInt(matches[1])
	}
	return playerPositions
}

func singleTurn(startingPosition, startingScore, dieRoll int) (endPosition, endScore int) {
	endPosition = startingPosition + dieRoll
	endPosition = (endPosition-1)%10 + 1
	endScore = startingScore + endPosition
	return endPosition, endScore
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
			playerPositions[player], playerScores[player] = singleTurn(playerPositions[player], playerScores[player], rollDie()+rollDie()+rollDie())
			if playerScores[player] >= 1000 {
				return playerScores[1-player] * numberOfDiceRolls
			}
		}
	}
}

func quantumGame(startingPositions [2]int) int64 {
	dieRollOutcomes := map[int]int64{
		3: 1,
		4: 3,
		5: 6,
		6: 7,
		7: 6,
		8: 3,
		9: 1,
	}

	type GameState struct {
		positions [2]int
		scores    [2]int
	}
	numberOfOccurrencesOfGameState := map[GameState]int64{{startingPositions, [2]int{0, 0}}: 1}
	numberOfWins := [2]int64{}

	for {
		for player := 0; player < 2; player++ {
			if len(numberOfOccurrencesOfGameState) == 0 {
				if numberOfWins[0] > numberOfWins[1] {
					return numberOfWins[0]
				} else {
					return numberOfWins[1]
				}
			}
			newNumberOfOccurrencesWithGameState := make(map[GameState]int64)

			for gameState, numberOfOccurrences := range numberOfOccurrencesOfGameState {
				for dieRoll, numberOfDieRollOccurrences := range dieRollOutcomes {
					newGameState := GameState{
						positions: [2]int{gameState.positions[0], gameState.positions[1]},
						scores:    [2]int{gameState.scores[0], gameState.scores[1]},
					}
					newPosition, newScore := singleTurn(gameState.positions[player], gameState.scores[player], dieRoll)
					if newScore >= 21 {
						numberOfWins[player] += numberOfOccurrences * numberOfDieRollOccurrences
						continue
					}
					newGameState.positions[player] = newPosition
					newGameState.scores[player] = newScore
					newNumberOfOccurrencesWithGameState[newGameState] += numberOfOccurrences * numberOfDieRollOccurrences
				}
			}
			numberOfOccurrencesOfGameState = newNumberOfOccurrencesWithGameState
		}
	}
}
