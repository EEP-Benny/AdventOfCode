package main

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type InsertionRules = map[[2]string]string

func main() {
	template, insertionRules := processInput(utils.LoadInput(2021, 14))
	templateAfterStep10 := executeInsertionSteps(template, insertionRules, 10)
	fmt.Println("Solution 1:", differenceBetweenMostCommonAndLeastCommonElement(templateAfterStep10))
	// fmt.Println("Solution 2:", ???)
}

func processInput(inputString string) (template []string, insertionRules InsertionRules) {
	splitInputString := strings.Split(inputString, "\n\n")
	template = strings.Split(splitInputString[0], "")
	insertionRulesString := splitInputString[1]
	insertionRules = make(InsertionRules)

	var ruleRegex, _ = regexp.Compile(`(\w)(\w) -> (\w)`)

	for _, insertionRuleString := range strings.Split(insertionRulesString, "\n") {
		matches := ruleRegex.FindStringSubmatch(insertionRuleString)

		insertionRules[[2]string{matches[1], matches[2]}] = matches[3]
	}

	return template, insertionRules
}

func executeInsertionStep(template []string, insertionRules InsertionRules) []string {
	newTemplate := []string{}
	for i := 1; i < len(template); i++ {
		newTemplate = append(newTemplate, template[i-1])
		if insertion, exists := insertionRules[[2]string{template[i-1], template[i]}]; exists {
			newTemplate = append(newTemplate, insertion)
		}
	}
	newTemplate = append(newTemplate, template[len(template)-1])
	return newTemplate
}

func executeInsertionSteps(template []string, insertionRules InsertionRules, stepCount int) []string {
	for i := 0; i < stepCount; i++ {
		template = executeInsertionStep(template, insertionRules)
	}
	return template
}

func countElementOccurrences(template []string) map[string]int {
	occurrenceMap := make(map[string]int)
	for _, element := range template {
		occurrenceMap[element]++
	}
	return occurrenceMap
}

func differenceBetweenMostCommonAndLeastCommonElement(template []string) int {
	occurrenceMap := countElementOccurrences(template)
	occurrenceCount := make([]int, 0, len(occurrenceMap))
	for _, count := range occurrenceMap {
		occurrenceCount = append(occurrenceCount, count)
	}
	minCount, maxCount := utils.MinMax(occurrenceCount)
	return maxCount - minCount
}
