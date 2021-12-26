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
type ComparableGameState struct {
	maxAmphipodIndex int
	positions        [16]Position
}
type GameState struct {
	maxAmphipodIndex     int
	positionsOfAmphipods map[Amphipod]Position
	amphipodAtPosition   map[Position]Amphipod
}
type Move struct {
	amphipod     Amphipod
	position     Position
	energyNeeded int
}

var homePositionByColor = map[Color]int{"A": 2, "B": 4, "C": 6, "D": 8}
var requiredEnergyByColor = map[Color]int{"A": 1, "B": 10, "C": 100, "D": 1000}
var orderedAmphipods = [16]Amphipod{
	{"A", 1}, {"A", 2}, {"A", 3}, {"A", 4},
	{"B", 1}, {"B", 2}, {"B", 3}, {"B", 4},
	{"C", 1}, {"C", 2}, {"C", 3}, {"C", 4},
	{"D", 1}, {"D", 2}, {"D", 3}, {"D", 4},
}

func main() {
	input := utils.LoadInputSlice(2021, 23, "\n")
	fmt.Println("Solution 1:", findBestSolution(parseInput(input)))
	fmt.Println("Solution 2:", findBestSolution(parseInput(extendInput(input))))
}

func extendInput(inputLines []string) []string {
	return append(inputLines[:3], append([]string{"  #D#C#B#A#", "  #D#B#A#C#"}, inputLines[3:]...)...)
}

func parseInput(inputLines []string) ComparableGameState {
	lastIndexByColor := make(map[Color]int)
	allAmphipods := make(map[Amphipod]Position)
	for y, inputLine := range inputLines {
		for x, char := range strings.Split(inputLine, "") {
			if char == "A" || char == "B" || char == "C" || char == "D" {
				colorAtPosition := char
				index := lastIndexByColor[colorAtPosition] + 1
				lastIndexByColor[colorAtPosition]++
				allAmphipods[Amphipod{colorAtPosition, index}] = Position{x - 1, y - 1}
			}
		}
	}
	gameState := ComparableGameState{
		maxAmphipodIndex: lastIndexByColor["A"],
		positions:        [16]Position{},
	}
	for i, amphipod := range orderedAmphipods {
		if position, exists := allAmphipods[amphipod]; exists {
			gameState.positions[i] = position
		}
	}
	return gameState
}

func (comparableGameState ComparableGameState) toGameState() GameState {
	gameState := GameState{
		maxAmphipodIndex:     comparableGameState.maxAmphipodIndex,
		positionsOfAmphipods: make(map[Amphipod]Position),
		amphipodAtPosition:   make(map[Position]Amphipod),
	}
	for i, amphipod := range orderedAmphipods {
		position := comparableGameState.positions[i]
		if amphipod.index <= gameState.maxAmphipodIndex {
			gameState.positionsOfAmphipods[amphipod] = position
			gameState.amphipodAtPosition[position] = amphipod
		}
	}

	return gameState
}

func (gameState GameState) isOccupied(pos Position) bool {
	_, exists := gameState.amphipodAtPosition[pos]
	return exists
}

func (gameState GameState) getAmphipodAt(pos Position) Amphipod {
	return gameState.amphipodAtPosition[pos]
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
	for position, amphipod := range gameState.amphipodAtPosition {
		if position.y == 0 || position.x != homePositionByColor[amphipod.color] {
			return false
		}
	}
	return true
}

func (gameState GameState) getBottomMostIncorrectAmphipodForColor(color Color) int {
	bottomMostIncorrectAmphipod := 0
	for y := 1; y <= gameState.maxAmphipodIndex; y++ {
		pos := Position{x: homePositionByColor[color], y: y}
		if !gameState.isOccupied(pos) {
			continue
		}
		if gameState.getAmphipodAt(pos).color != color {
			bottomMostIncorrectAmphipod = y
		}
	}
	return bottomMostIncorrectAmphipod
}

func (gameState ComparableGameState) moveTo(amphipodToMove Amphipod, newPosition Position) ComparableGameState {
	for i, amphipod := range orderedAmphipods {
		if amphipod == amphipodToMove {
			gameState.positions[i] = newPosition
		}
	}
	return gameState
}

func (gameState GameState) getPossibleMoves() []Move {
	possibleMoves := make([]Move, 0)
	for _, amphipod := range orderedAmphipods {
		if amphipod.index > gameState.maxAmphipodIndex {
			continue
		}
		position := gameState.positionsOfAmphipods[amphipod]
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
		bottomMostIncorrectAmphipodForColor := gameState.getBottomMostIncorrectAmphipodForColor(color)
		if position.x == homePosition && position.y > bottomMostIncorrectAmphipodForColor {
			// this amphipod is already at home, and don't have to move for a trapped amphipod of another color
			continue
		}
		if bottomMostIncorrectAmphipodForColor == 0 {
			// try to move to home
			for y := gameState.maxAmphipodIndex; y > 0; y-- {
				pos := Position{x: homePosition, y: y}
				if isFree, stepCount := gameState.checkPath(position, pos); isFree {
					// if one amphipod can move home, that is the best option
					energyNeeded := stepCount * requiredEnergyByColor[amphipod.color]
					return []Move{{amphipod, pos, energyNeeded}}
				}
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

func findBestSolution(initalGameState ComparableGameState) int {
	alreadyConsideredStates := make(map[ComparableGameState]bool)
	pq := prque.New()
	pq.Push(initalGameState, 0)
	counter := 0
	for !pq.Empty() {
		counter++
		// fmt.Println(pq.Size())
		val, prio := pq.Pop()
		comparableGameState := val.(ComparableGameState)
		alreadyConsideredStates[comparableGameState] = true
		gameState := comparableGameState.toGameState()
		energySpent := int(-prio)
		if gameState.isFinished() {
			fmt.Println("Found solution after searching", counter, "states")
			return energySpent
		}
		for _, move := range gameState.getPossibleMoves() {
			newGameState := comparableGameState.moveTo(move.amphipod, move.position)
			if _, exists := alreadyConsideredStates[newGameState]; exists {
				continue
			}
			newEnergy := energySpent + move.energyNeeded
			pq.Push(newGameState, -float32(newEnergy))
		}
	}
	fmt.Println("Didn't find a solution")
	return -1
}
