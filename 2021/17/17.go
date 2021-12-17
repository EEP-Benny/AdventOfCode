package main

import (
	"fmt"
	"regexp"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type TargetArea struct {
	xMin, xMax, yMin, yMax int
}

type State struct {
	posX, posY, vX, vY int
}

func main() {
	input := parseInput(utils.LoadInput(2021, 17))
	fmt.Println("Solution 1:", findHighestPointInTrajectoryThatReachesTheTarget(input))
	fmt.Println("Solution 2:", countDistinctInitialVelocitiesThatReachTheTarget(input))
}

func parseInput(inputString string) TargetArea {
	ruleRegex, _ := regexp.Compile(`target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)`)
	matches := ruleRegex.FindStringSubmatch(inputString)
	return TargetArea{
		xMin: utils.StringToInt(matches[1]),
		xMax: utils.StringToInt(matches[2]),
		yMin: utils.StringToInt(matches[3]),
		yMax: utils.StringToInt(matches[4]),
	}
}

func step(oldState State) State {
	newState := State{
		posX: oldState.posX + oldState.vX,
		posY: oldState.posY + oldState.vY,
		vX:   oldState.vX,
		vY:   oldState.vY - 1,
	}
	if newState.vX > 0 {
		newState.vX--
	} else if newState.vX < 0 {
		newState.vX++
	}
	return newState
}

func findMinimumXVelocity(targetArea TargetArea) int {
	// work backwards to find required x velocity to reach target
	requiredXVelocity := 0
	reachableXPosition := 0
	for reachableXPosition < targetArea.xMin {
		requiredXVelocity++
		reachableXPosition += requiredXVelocity
	}
	return requiredXVelocity
}

func findHighestPointInTrajectoryThatReachesTheTarget(targetArea TargetArea) int {
	requiredXVelocity := findMinimumXVelocity(targetArea)

	// yPositions are symmetric during rise and fall. This means that the probe will eventually reach posY=0 with vY=-initialVY, and must then land in the targetArea in the next step.
	maxYVelocity := -targetArea.yMin - 1
	maxHeight := 0
	for state := (State{posX: 0, posY: 0, vX: requiredXVelocity, vY: maxYVelocity}); state.posY >= maxHeight; state = step(state) {
		maxHeight = state.posY
	}

	return maxHeight
}

func willReachTargetArea(initialXVelocity, initialYVelocity int, targetArea TargetArea) bool {
	for state := (State{posX: 0, posY: 0, vX: initialXVelocity, vY: initialYVelocity}); true; state = step(state) {
		if state.posX >= targetArea.xMin && state.posX <= targetArea.xMax && state.posY >= targetArea.yMin && state.posY <= targetArea.yMax {
			return true
		}
		if state.posX > targetArea.xMax || state.posY < targetArea.yMin {
			break
		}
	}
	return false
}

func countDistinctInitialVelocitiesThatReachTheTarget(targetArea TargetArea) int {
	initialVelocitiesThatReachTheTarget := make(map[[2]int]bool)
	minVX := findMinimumXVelocity(targetArea)
	maxVX := targetArea.xMax
	minVY := targetArea.yMin
	maxVY := -targetArea.yMin - 1 // see above

	for vX := minVX; vX <= maxVX; vX++ {
		for vY := minVY; vY <= maxVY; vY++ {
			if willReachTargetArea(vX, vY, targetArea) {
				initialVelocitiesThatReachTheTarget[[2]int{vX, vY}] = true
			}
		}
	}
	return len(initialVelocitiesThatReachTheTarget)
}
