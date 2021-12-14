package main

import (
	"reflect"
	"strings"
	"testing"
)

var exampleInput = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`

var exampleTemplate, exampleInsertionRules = processInput(exampleInput)

func Test_processInput(t *testing.T) {
	type args struct {
		inputString string
	}
	tests := []struct {
		name               string
		args               args
		wantTemplate       []string
		wantInsertionRules InsertionRules
	}{
		{"example input", args{exampleInput}, []string{"N", "N", "C", "B"}, InsertionRules{
			{"C", "H"}: "B",
			{"H", "H"}: "N",
			{"C", "B"}: "H",
			{"N", "H"}: "C",
			{"H", "B"}: "C",
			{"H", "C"}: "B",
			{"H", "N"}: "C",
			{"N", "N"}: "C",
			{"B", "H"}: "H",
			{"N", "C"}: "B",
			{"N", "B"}: "B",
			{"B", "N"}: "B",
			{"B", "B"}: "N",
			{"B", "C"}: "B",
			{"C", "C"}: "N",
			{"C", "N"}: "C",
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotTemplate, gotInsertionRules := processInput(tt.args.inputString)
			if !reflect.DeepEqual(gotTemplate, tt.wantTemplate) {
				t.Errorf("processInput() gotTemplate = %v, want %v", gotTemplate, tt.wantTemplate)
			}
			if !reflect.DeepEqual(gotInsertionRules, tt.wantInsertionRules) {
				t.Errorf("processInput() gotInsertionRules = %v, want %v", gotInsertionRules, tt.wantInsertionRules)
			}
		})
	}
}

func Test_executeInsertionStep(t *testing.T) {
	type args struct {
		template       []string
		insertionRules InsertionRules
	}
	tests := []struct {
		name string
		args args
		want []string
	}{
		{"exampleInput step 1", args{exampleTemplate, exampleInsertionRules}, strings.Split("NCNBCHB", "")},
		{"exampleInput step 2", args{executeInsertionStep(exampleTemplate, exampleInsertionRules), exampleInsertionRules}, strings.Split("NBCCNBBBCBHCB", "")},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := executeInsertionStep(tt.args.template, tt.args.insertionRules); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("executeInsertionStep() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_executeInsertionSteps(t *testing.T) {
	type args struct {
		template       []string
		insertionRules InsertionRules
		stepCount      int
	}
	tests := []struct {
		name string
		args args
		want []string
	}{
		{"exampleInput step 1", args{exampleTemplate, exampleInsertionRules, 1}, strings.Split("NCNBCHB", "")},
		{"exampleInput step 2", args{exampleTemplate, exampleInsertionRules, 2}, strings.Split("NBCCNBBBCBHCB", "")},
		{"exampleInput step 3", args{exampleTemplate, exampleInsertionRules, 3}, strings.Split("NBBBCNCCNBBNBNBBCHBHHBCHB", "")},
		{"exampleInput step 4", args{exampleTemplate, exampleInsertionRules, 4}, strings.Split("NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB", "")},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := executeInsertionSteps(tt.args.template, tt.args.insertionRules, tt.args.stepCount); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("executeInsertionSteps() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_countElementOccurrences(t *testing.T) {
	type args struct {
		template []string
	}
	tests := []struct {
		name string
		args args
		want map[string]int
	}{
		{"exampleInput after step 10", args{executeInsertionSteps(exampleTemplate, exampleInsertionRules, 10)}, map[string]int{"B": 1749, "C": 298, "H": 161, "N": 865}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := countElementOccurrences(tt.args.template); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("countElementOccurrences() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_differenceBetweenMostCommonAndLeastCommonElement(t *testing.T) {
	type args struct {
		template []string
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"exampleInput after step 10", args{executeInsertionSteps(exampleTemplate, exampleInsertionRules, 10)}, 1588},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := differenceBetweenMostCommonAndLeastCommonElement(tt.args.template); got != tt.want {
				t.Errorf("differenceBetweenMostCommonAndLeastCommonElement() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_templateToTemplatePairs(t *testing.T) {
	type args struct {
		template []string
	}
	tests := []struct {
		name string
		args args
		want TemplateInPairs
	}{
		{"example input", args{strings.Split("NNCB", "")}, map[[2]string]int{
			{"N", "N"}: 1,
			{"N", "C"}: 1,
			{"C", "B"}: 1,
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := templateToTemplatePairs(tt.args.template); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("templateToTemplatePairs() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_differenceBetweenMostCommonAndLeastCommonElementsOnPairs(t *testing.T) {
	type args struct {
		templatePairs    TemplateInPairs
		originalTemplate []string
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"exampleInput after step 10", args{executeInsertionStepsOnPairs(templateToTemplatePairs(exampleTemplate), exampleInsertionRules, 10), exampleTemplate}, 1588},
		{"exampleInput after step 40", args{executeInsertionStepsOnPairs(templateToTemplatePairs(exampleTemplate), exampleInsertionRules, 40), exampleTemplate}, 2188189693529},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := differenceBetweenMostCommonAndLeastCommonElementsOnPairs(tt.args.templatePairs, tt.args.originalTemplate); got != tt.want {
				t.Errorf("differenceBetweenMostCommonAndLeastCommonElementsOnPairs() = %v, want %v", got, tt.want)
			}
		})
	}
}
