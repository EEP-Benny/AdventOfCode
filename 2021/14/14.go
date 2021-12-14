package main

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type InsertionRules = map[[2]string]string
type TemplateInPairs = map[[2]string]int

func main() {
	template, insertionRules := processInput(utils.LoadInput(2021, 14))
	templateAfterStep10 := executeInsertionSteps(template, insertionRules, 10)
	fmt.Println("Solution 1:", differenceBetweenMostCommonAndLeastCommonElement(templateAfterStep10))
	templatePairsAfterStep40 := executeInsertionStepsOnPairs(templateToTemplatePairs(template), insertionRules, 40)
	fmt.Println("Solution 2:", differenceBetweenMostCommonAndLeastCommonElementsOnPairs(templatePairsAfterStep40, template))
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

func templateToTemplatePairs(template []string) TemplateInPairs {
	templatePairs := make(TemplateInPairs)
	for i := 1; i < len(template); i++ {
		templatePairs[[2]string{template[i-1], template[i]}]++
	}
	return templatePairs
}

func executeInsertionStepOnPairs(templatePairs TemplateInPairs, insertionRules InsertionRules) TemplateInPairs {
	newTemplatePairs := make(TemplateInPairs)
	for pair, count := range templatePairs {
		if insertion, exists := insertionRules[pair]; exists {
			newTemplatePairs[[2]string{pair[0], insertion}] += count
			newTemplatePairs[[2]string{insertion, pair[1]}] += count
		} else {
			newTemplatePairs[pair] += count
		}
	}
	return newTemplatePairs
}

func executeInsertionStepsOnPairs(templatePairs TemplateInPairs, insertionRules InsertionRules, stepCount int) TemplateInPairs {
	for i := 0; i < stepCount; i++ {
		templatePairs = executeInsertionStepOnPairs(templatePairs, insertionRules)
	}
	return templatePairs
}

func differenceBetweenMostCommonAndLeastCommonElementsOnPairs(templatePairs TemplateInPairs, originalTemplate []string) int {
	occurrenceMap := make(map[string]int)
	for elements, count := range templatePairs {
		occurrenceMap[elements[0]] += count
	}
	// don't forget the last character (which didn't change during all the insertions )
	occurrenceMap[originalTemplate[len(originalTemplate)-1]]++

	occurrenceCount := make([]int, 0, len(occurrenceMap))
	for _, count := range occurrenceMap {
		occurrenceCount = append(occurrenceCount, count)
	}

	minCount, maxCount := utils.MinMax(occurrenceCount)
	return maxCount - minCount
}
