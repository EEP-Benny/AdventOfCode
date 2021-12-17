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
	// fmt.Println("Solution 2:", ???)
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

func findHighestPointInTrajectoryThatReachesTheTarget(targetArea TargetArea) int {
	// work backwards to find required x velocity to reach target
	requiredXVelocity := 0
	reachableXPosition := 0
	for reachableXPosition < targetArea.xMin {
		requiredXVelocity++
		reachableXPosition += requiredXVelocity
	}

	// yPositions are symmetric during rise and fall. This means that the probe will eventually reach posY=0 with vY=-initialVY, and must then land in the targetArea in the next step.
	maxYVelocity := -targetArea.yMin - 1
	maxHeight := 0
	for state := (State{posX: 0, posY: 0, vX: requiredXVelocity, vY: maxYVelocity}); state.posY >= maxHeight; state = step(state) {
		maxHeight = state.posY
	}

	return maxHeight
}
