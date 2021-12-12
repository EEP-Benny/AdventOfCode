package main

import (
	"fmt"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type CaveConnections map[string]map[string]bool

func main() {
	input := createCaveConnections(utils.LoadInputSlice(2021, 12, "\n"))
	fmt.Println("Solution 1:", countPathsToEnd(input))
	// fmt.Println("Solution 2:", ???)
}

func createCaveConnections(inputAsStrings []string) CaveConnections {
	caveConnections := make(CaveConnections)
	for _, str := range inputAsStrings {
		caves := strings.Split(str, "-")
		cave1, cave2 := caves[0], caves[1]
		if _, exists := caveConnections[cave1]; !exists {
			caveConnections[cave1] = make(map[string]bool)
		}
		if _, exists := caveConnections[cave2]; !exists {
			caveConnections[cave2] = make(map[string]bool)
		}
		caveConnections[cave1][cave2] = true
		caveConnections[cave2][cave1] = true
	}
	return caveConnections
}

func pathDoesVisitSmallCavesAtMostOnce(caves []string) bool {
	alreadyVisitedSmallCaves := make(map[string]bool)
	for _, cave := range caves {
		if _, exists := alreadyVisitedSmallCaves[cave]; exists {
			return false // same small cave was already visited before
		}
		if strings.ToLower(cave) == cave { // small cave
			alreadyVisitedSmallCaves[cave] = true
		}
	}
	return true
}

func pathDoesLeadToEnd(caves []string) bool {
	return caves[len(caves)-1] == "end"
}

func generatePathsThroughCaveSystem(caveSystem CaveConnections) [][]string {
	allPaths := [][]string{}
	pathsToExplore := [][]string{{"start"}}
	for len(pathsToExplore) > 0 {
		allPaths = append(allPaths, pathsToExplore...)
		newPaths := [][]string{}
		for _, path := range pathsToExplore {
			lastCave := path[len(path)-1]
			if lastCave == "end" {
				continue
			}
			for nextCave := range caveSystem[lastCave] {
				newPath := make([]string, len(path)+1)
				_ = copy(newPath, path)
				newPath[len(newPath)-1] = nextCave
				if pathDoesVisitSmallCavesAtMostOnce(newPath) {
					newPaths = append(newPaths, newPath)
				}
			}
		}
		pathsToExplore = newPaths
	}

	return allPaths
}

func countPathsToEnd(caveSystem CaveConnections) int {
	pathCount := 0
	for _, path := range generatePathsThroughCaveSystem(caveSystem) {
		if pathDoesLeadToEnd(path) {
			pathCount++
		}
	}
	return pathCount
}
