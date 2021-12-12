package main

import (
	"fmt"
	"math"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type CaveConnections map[string]map[string]bool
type Path []string

func main() {
	input := createCaveConnections(utils.LoadInputSlice(2021, 12, "\n"))
	pathsWithoutRevisits := generatePathsThroughCaveSystem(input, 0)
	fmt.Println("Solution 1:", countPathsToEnd(pathsWithoutRevisits))
	pathsWithOneRevisit := generatePathsThroughCaveSystem(input, 1)
	fmt.Println("Solution 2:", countPathsToEnd(pathsWithOneRevisit))
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

func countRevisitedSmallCaves(path Path) int {
	alreadyVisitedSmallCaves := make(map[string]bool)
	numberOfRevisitedSmallCaves := 0
	for _, cave := range path {
		if _, exists := alreadyVisitedSmallCaves[cave]; exists {
			numberOfRevisitedSmallCaves++
			if cave == "start" {
				return math.MaxInt
			}
		}
		if strings.ToLower(cave) == cave { // small cave
			alreadyVisitedSmallCaves[cave] = true
		}
	}
	return numberOfRevisitedSmallCaves
}

func pathDoesLeadToEnd(path Path) bool {
	return path[len(path)-1] == "end"
}

func generatePathsThroughCaveSystem(caveSystem CaveConnections, maxRevisitsOfSmallCaves int) []Path {
	allPaths := []Path{}
	pathsToExplore := []Path{{"start"}}
	for len(pathsToExplore) > 0 {
		allPaths = append(allPaths, pathsToExplore...)
		newPaths := []Path{}
		for _, path := range pathsToExplore {
			lastCave := path[len(path)-1]
			if lastCave == "end" {
				continue
			}
			for nextCave := range caveSystem[lastCave] {
				newPath := make(Path, len(path)+1)
				_ = copy(newPath, path)
				newPath[len(newPath)-1] = nextCave
				if countRevisitedSmallCaves(newPath) <= maxRevisitsOfSmallCaves {
					newPaths = append(newPaths, newPath)
				}
			}
		}
		pathsToExplore = newPaths
	}

	return allPaths
}

func countPathsToEnd(paths []Path) int {
	pathCount := 0
	for _, path := range paths {
		if pathDoesLeadToEnd(path) {
			pathCount++
		}
	}
	return pathCount
}
