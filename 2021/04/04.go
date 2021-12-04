package main

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type Board [][]int

const MARKED = -1

func main() {
	input := utils.LoadInput(2021, 4)
	numbers, boards := processInput(input)
	fmt.Println("Solution 1:", runBoardsUntilOneWins(numbers, boards))
	// fmt.Println("Solution 2:", TODO)
}

func makeBoard(boardString string) Board {
	boardStringLines := strings.Split(boardString, "\n")
	var boardLines [][]int
	for _, boardStringLine := range boardStringLines {
		var boardLine []int
		cellStrings := strings.Split(boardStringLine, " ")
		for _, cellString := range cellStrings {
			if strings.TrimSpace(cellString) == "" {
				continue
			}
			if numericCell, err := strconv.Atoi(strings.TrimSpace(cellString)); err != nil {
				panic(err)
			} else {
				boardLine = append(boardLine, numericCell)
			}
		}
		boardLines = append(boardLines, boardLine)
	}
	return boardLines
}

func processInput(inputAsString string) (numbersDrawn []int, boards []Board) {
	splitString := strings.Split(inputAsString, "\n\n")
	numbersDrawn = utils.IntSlice(strings.Split(splitString[0], ","))

	for _, boardString := range splitString[1:] {
		boards = append(boards, makeBoard(boardString))
	}
	return numbersDrawn, boards
}

func markNumberInBoard(board Board, number int) Board {
	for y := 0; y < len(board); y++ {
		for x := 0; x < len(board[y]); x++ {
			if board[y][x] == number {
				board[y][x] = MARKED
			}
		}
	}
	return board
}

func hasBoardWon(board Board) bool {
	// check for full row
	for y := 0; y < len(board); y++ {
		isFullRowSoFar := true
		for x := 0; x < len(board[y]); x++ {
			if board[y][x] != MARKED {
				isFullRowSoFar = false
				break // inner loop
			}
		}
		if isFullRowSoFar {
			return true
		}
	}
	// check for full column
	for x := 0; x < len(board[0]); x++ {
		isFullColumnSoFar := true
		for y := 0; y < len(board); y++ {
			if board[y][x] != MARKED {
				isFullColumnSoFar = false
				break // inner loop
			}
		}
		if isFullColumnSoFar {
			return true
		}
	}
	return false
}

func getWinningScore(board Board, lastNumber int) int {
	sumOfNumbers := 0
	for y := 0; y < len(board); y++ {
		for x := 0; x < len(board[y]); x++ {
			if board[y][x] != MARKED {
				sumOfNumbers += board[y][x]
			}
		}
	}
	return sumOfNumbers * lastNumber
}

func runBoardsUntilOneWins(numbers []int, boards []Board) int {
	for _, number := range numbers {
		for i := 0; i < len(boards); i++ {
			boards[i] = markNumberInBoard(boards[i], number)
			if hasBoardWon(boards[i]) {
				// fmt.Println("Winning number: ", number)
				// fmt.Println("Winning board: ", i, boards[i])
				return getWinningScore(boards[i], number)
			}
		}
	}
	return -1
}
