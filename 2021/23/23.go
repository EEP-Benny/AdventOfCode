package main

import (
	"fmt"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
	"gopkg.in/karalabe/cookiejar.v2/collections/prque"
)

type Position struct{ x, y int } // 0,0 is the leftmost hallway
type Color = string
type Amphipod struct {
	color Color
	index int
}
type GameState map[Amphipod]Position
type Move struct {
	amphipod     Amphipod
	position     Position
	energyNeeded int
}

var homePositionByColor = map[Color]int{"A": 2, "B": 4, "C": 6, "D": 8}
var requiredEnergyByColor = map[Color]int{"A": 1, "B": 10, "C": 100, "D": 1000}
var orderedAmphipods = []Amphipod{
	{"A", 1}, {"A", 2},
	{"B", 1}, {"B", 2},
	{"C", 1}, {"C", 2},
	{"D", 1}, {"D", 2},
}

func main() {
	initialState := parseInput(utils.LoadInputSlice(2021, 23, "\n"))
	fmt.Println("Solution 1:", findBestSolution(initialState))
	// fmt.Println("Solution 2:", ???)
}

func parseInput(inputLines []string) GameState {
	lastIndexByColor := make(map[Color]int)
	gameState := make(GameState)
	for y, inputLine := range inputLines {
		for x, char := range strings.Split(inputLine, "") {
			if char == "A" || char == "B" || char == "C" || char == "D" {
				colorAtPosition := char
				index := lastIndexByColor[colorAtPosition] + 1
				lastIndexByColor[colorAtPosition]++
				gameState[Amphipod{colorAtPosition, index}] = Position{x - 1, y - 1}
			}
		}
	}
	return gameState
}

func (gameState GameState) isOccupied(pos Position) bool {
	for _, position := range gameState {
		if position == pos {
			return true
		}
	}
	return false
}

func (gameState GameState) getAmphipodAt(pos Position) Amphipod {
	for amphipod, position := range gameState {
		if position == pos {
			return amphipod
		}
	}
	return Amphipod{}
}

func (gameState GameState) checkPath(start, end Position) (isFree bool, stepCount int) {
	isFree = true
	stepCount = 0
	current := start
	checkCurrentPos := func() {
		stepCount++
		if gameState.isOccupied(current) {
			isFree = false
		}
	}
	for current.y > 0 { // go up
		current.y--
		checkCurrentPos()
	}
	for current.x < end.x { // go right
		current.x++
		checkCurrentPos()
	}
	for current.x > end.x { // go left
		current.x--
		checkCurrentPos()
	}
	for current.y < end.y { // go down
		current.y++
		checkCurrentPos()
	}
	return isFree, stepCount
}

func (gameState GameState) isFinished() bool {
	for amphipod, position := range gameState {
		if position.y == 0 || position.x != homePositionByColor[amphipod.color] {
			return false
		}
	}
	return true
}

func (gameState GameState) moveTo(amphipod Amphipod, newPosition Position) GameState {
	newGameState := make(GameState)
	for amphipod, position := range gameState {
		newGameState[amphipod] = position
	}
	newGameState[amphipod] = newPosition
	return newGameState
}

func (gameState GameState) getPossibleMoves() []Move {
	possibleMoves := make([]Move, 0)
	for _, amphipod := range orderedAmphipods {
		position := gameState[amphipod]
		tryPosition := func(newPosition Position) bool {
			if isFree, stepCount := gameState.checkPath(position, newPosition); isFree {
				energyNeeded := stepCount * requiredEnergyByColor[amphipod.color]
				possibleMoves = append(possibleMoves, Move{amphipod, newPosition, energyNeeded})
				return true
			}
			return false
		}

		color := amphipod.color
		homePosition := homePositionByColor[color]
		topHomePosition := Position{homePosition, 1}
		bottomHomePosition := Position{homePosition, 2}
		if position.x == homePosition && gameState.getAmphipodAt(bottomHomePosition).color == color {
			// this amphipod is already at home, and don't have to move for a trapped amphipod of another color
			continue
		}
		if !gameState.isOccupied(bottomHomePosition) {
			if tryPosition(bottomHomePosition) {
				continue
			}
		} else if gameState.getAmphipodAt(bottomHomePosition).color == color && !gameState.isOccupied(topHomePosition) {
			// bottom row has correctly colored amphipod, go to the top one
			if tryPosition(topHomePosition) {
				continue
			}
		}
		if position.y > 0 {
			// go to the hallway
			for _, x := range []int{0, 1, 3, 5, 7, 9, 10} {
				tryPosition(Position{x, 0})
			}
		}

	}
	return possibleMoves
}

func findBestSolution(initalGameState GameState) int {
	pq := prque.New()
	pq.Push(initalGameState, 0)
	for !pq.Empty() {
		// fmt.Println(pq.Size())
		val, prio := pq.Pop()
		gameState := val.(GameState)
		energySpent := int(-prio)
		if gameState.isFinished() {
			return int(energySpent)
		}
		for _, move := range gameState.getPossibleMoves() {
			newGameState := gameState.moveTo(move.amphipod, move.position)
			newEnergy := energySpent + move.energyNeeded
			pq.Push(newGameState, -float32(newEnergy))
		}
	}
	fmt.Println("Didn't find a solution")
	return -1
}
