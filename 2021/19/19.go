package main

import (
	"fmt"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
	"github.com/go-gl/mathgl/mgl64"
)

type Position = mgl64.Vec3
type Orientation = mgl64.Mat3

var orientations = getAllOrientations()

func main() {
	input := parseInput(utils.LoadInputSlice(2021, 19, "\n\n"))
	beaconPositions := assembleBeaconMap(input)
	fmt.Println("Solution 1:", len(beaconPositions))
	// fmt.Println("Solution 2:", ???)
}

func parseInput(inputStrings []string) [][]Position {
	beaconPositionsByScanner := make([][]Position, len(inputStrings))
	for scannerIndex, inputString := range inputStrings {
		beaconStrings := strings.Split(inputString, "\n")
		beaconPositionsByScanner[scannerIndex] = make([]Position, len(beaconStrings)-1)
		for beaconIndex, beaconString := range beaconStrings[1:] {
			positionSlice := utils.IntSlice(strings.Split(beaconString, ","))
			beaconPositionsByScanner[scannerIndex][beaconIndex] = Position{
				float64(positionSlice[0]),
				float64(positionSlice[1]),
				float64(positionSlice[2]),
			}
		}
	}
	return beaconPositionsByScanner
}

func getAllOrientations() []Orientation {
	orientations := make([]Orientation, 0, 24)
	for _, x := range []mgl64.Vec3{{1, 0, 0}, {0, 1, 0}, {0, 0, 1}, {-1, 0, 0}, {0, -1, 0}, {0, 0, -1}} {
		possibleY := make([]mgl64.Vec3, 0, 4)
		if x.X() == 0 {
			possibleY = append(possibleY, mgl64.Vec3{1, 0, 0}, mgl64.Vec3{-1, 0, 0})
		}
		if x.Y() == 0 {
			possibleY = append(possibleY, mgl64.Vec3{0, 1, 0}, mgl64.Vec3{0, -1, 0})
		}
		if x.Z() == 0 {
			possibleY = append(possibleY, mgl64.Vec3{0, 0, 1}, mgl64.Vec3{0, 0, -1})
		}
		for _, y := range possibleY {
			z := x.Cross(y)
			orientation := mgl64.Mat3FromCols(x, y, z)
			orientations = append(orientations, orientation)
		}
	}
	return orientations
}

func findMatchingBeacons(fixedBeaconPositions []Position, newBeaconPositions []Position) (Orientation, Position, bool) {
	fixedBeaconDifferenceMap := getBeaconDifferenceMap(fixedBeaconPositions, orientations[0])
	for _, scannerOrientation := range orientations {
		newBeaconDifferenceMap := getBeaconDifferenceMap(newBeaconPositions, scannerOrientation)
		numberOfMatchingBeaconsForScannerPosition := make(map[Position]int)
		for diffInFixedBeacons, relativePositionOfFixedBeacon := range fixedBeaconDifferenceMap {
			if relativePositionOfNewBeacon, exists := newBeaconDifferenceMap[diffInFixedBeacons]; exists {
				scannerPosition := relativePositionOfFixedBeacon.Sub(relativePositionOfNewBeacon)
				numberOfMatchingBeaconsForScannerPosition[scannerPosition]++
			}
		}
		if len(numberOfMatchingBeaconsForScannerPosition) > 0 {
			fmt.Println(numberOfMatchingBeaconsForScannerPosition)
		}
		for scannerPosition, matchCount := range numberOfMatchingBeaconsForScannerPosition {
			if matchCount >= 12*11 {
				fmt.Println("Found", matchCount, "matches for orientation", scannerOrientation, "with scanner position", scannerPosition)
				return scannerOrientation, scannerPosition, true
			}
		}
	}
	return Orientation{}, Position{}, false
}

func getBeaconDifferenceMap(beaconPositions []Position, orientation Orientation) map[Position]Position {
	beaconMap := make(map[Position]Position)
	for i1, beacon1Position := range beaconPositions {
		for i2, beacon2Position := range beaconPositions {
			if i1 == i2 {
				continue
			}
			diff := beacon1Position.Sub(beacon2Position)
			beaconMap[orientation.Mul3x1(diff)] = orientation.Mul3x1(beacon1Position)
		}
	}
	return beaconMap
}

func assembleBeaconMap(beaconPositionsByScanner [][]Position) []Position {
	fixedBeaconPositions := beaconPositionsByScanner[0]
	fixedBeaconPositionsMap := positionsSliceToMap(fixedBeaconPositions)
	isScannerAlreadyIntegrated := make([]bool, len(beaconPositionsByScanner))
	isScannerAlreadyIntegrated[0] = true
	for i := 0; i < len(beaconPositionsByScanner); i++ {
		for scannerIndex, newBeaconPositions := range beaconPositionsByScanner {
			if isScannerAlreadyIntegrated[scannerIndex] {
				continue
			}
			if orientation, relativePosition, foundMatch := findMatchingBeacons(fixedBeaconPositions, newBeaconPositions); foundMatch {
				for _, newBeaconPosition := range newBeaconPositions {
					transformedBeaconPosition := orientation.Mul3x1(newBeaconPosition).Add(relativePosition)
					fixedBeaconPositionsMap[transformedBeaconPosition] = true
				}
				fixedBeaconPositions = positionsMapToSlice(fixedBeaconPositionsMap)
				isScannerAlreadyIntegrated[scannerIndex] = true
				fmt.Println("Integrated", len(newBeaconPositions), "beacons from scanner", scannerIndex, ", now at", len(fixedBeaconPositions), "beacons total")
			}
		}
	}
	return fixedBeaconPositions
}

func positionsSliceToMap(positionsSlice []Position) map[Position]bool {
	positionsMap := make(map[Position]bool)
	for _, position := range positionsSlice {
		positionsMap[position] = true
	}
	return positionsMap
}
func positionsMapToSlice(positionsMap map[Position]bool) []Position {
	positionsSlice := make([]Position, 0, len(positionsMap))
	for position := range positionsMap {
		positionsSlice = append(positionsSlice, position)
	}
	return positionsSlice
}
