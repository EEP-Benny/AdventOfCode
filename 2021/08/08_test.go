package main

import (
	"reflect"
	"testing"
)

var exampleInputShort = []string{
	"acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf",
}
var exampleInputEasy = []string{
	"be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe",
	"edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc",
	"fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg",
	"fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb",
	"aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea",
	"fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb",
	"dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe",
	"bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef",
	"egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb",
	"gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce",
}

func Test_processInput(t *testing.T) {
	type args struct {
		inputAsStrings []string
	}
	tests := []struct {
		name string
		args args
		want []InputsAndOutputs
	}{
		{"exampleInput short", args{exampleInputShort}, []InputsAndOutputs{
			{
				inputs:  []string{"acedgfb", "cdfbe", "gcdfa", "fbcad", "dab", "cefabd", "cdfgeb", "eafb", "cagedb", "ab"},
				outputs: []string{"cdfeb", "fcadb", "cdfeb", "cdbaf"},
			},
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := processInput(tt.args.inputAsStrings); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("processInput() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_countEasyGuessableDigits(t *testing.T) {
	type args struct {
		sliceOfInputsAndOutputs []InputsAndOutputs
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"exampleInput easy", args{processInput(exampleInputEasy)}, 26},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := countEasyGuessableDigits(tt.args.sliceOfInputsAndOutputs); got != tt.want {
				t.Errorf("countEasyGuessableDigits() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_getDigit(t *testing.T) {
	type args struct {
		wireState WireState
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"0", args{getWireStateFromString("abcefg")}, 0},
		{"1", args{getWireStateFromString("cf")}, 1},
		{"2", args{getWireStateFromString("acdeg")}, 2},
		{"3", args{getWireStateFromString("acdfg")}, 3},
		{"4", args{getWireStateFromString("bcdf")}, 4},
		{"5", args{getWireStateFromString("abdfg")}, 5},
		{"6", args{getWireStateFromString("abdefg")}, 6},
		{"7", args{getWireStateFromString("acf")}, 7},
		{"8", args{getWireStateFromString("abcdefg")}, 8},
		{"9", args{getWireStateFromString("abcdfg")}, 9},
		{"invalid 1", args{getWireStateFromString("")}, -1},
		{"invalid 2", args{getWireStateFromString("ab")}, -1},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := getDigit(tt.args.wireState); got != tt.want {
				t.Errorf("getDigit() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_findOutputNumber(t *testing.T) {
	type args struct {
		inputsAndOutputs InputsAndOutputs
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"exampleInput short", args{processInput(exampleInputShort)[0]}, 5353},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := findOutputNumber(tt.args.inputsAndOutputs); got != tt.want {
				t.Errorf("findOutputNumber() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_sumAllOutputNumbers(t *testing.T) {
	type args struct {
		sliceOfInputsAndOutputs []InputsAndOutputs
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"exampleInput short", args{processInput(exampleInputShort)}, 5353},
		{"exampleInput easy", args{processInput(exampleInputEasy)}, 61229},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := sumAllOutputNumbers(tt.args.sliceOfInputsAndOutputs); got != tt.want {
				t.Errorf("sumAllOutputNumbers() = %v, want %v", got, tt.want)
			}
		})
	}
}
