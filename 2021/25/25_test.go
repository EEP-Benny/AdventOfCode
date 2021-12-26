package main

import (
	"reflect"
	"testing"
)

var exampleInput = []string{
	"v...>>.vv>",
	".vv>>.vv..",
	">>.>v>...v",
	">>v>>.>.v.",
	"v>v.vv.v..",
	">.>>..v...",
	".vv..>.>v.",
	"v.v..>>v.v",
	"....v..v.>",
}
var exampleInputFinalStep = []string{
	"..>>v>vv..",
	"..v.>>vv..",
	"..>>v>>vv.",
	"..>>>>>vv.",
	"v......>vv",
	"v>v....>>v",
	"vvv.....>>",
	">vv......>",
	".>v.vv.v..",
}

func Test_parseInput(t *testing.T) {
	type args struct {
		inputLines []string
	}
	tests := []struct {
		name string
		args args
		want OceanFloorMap
	}{
		{"example input", args{exampleInput}, OceanFloorMap{
			{"v", ".", ".", ".", ">", ">", ".", "v", "v", ">"},
			{".", "v", "v", ">", ">", ".", "v", "v", ".", "."},
			{">", ">", ".", ">", "v", ">", ".", ".", ".", "v"},
			{">", ">", "v", ">", ">", ".", ">", ".", "v", "."},
			{"v", ">", "v", ".", "v", "v", ".", "v", ".", "."},
			{">", ".", ">", ">", ".", ".", "v", ".", ".", "."},
			{".", "v", "v", ".", ".", ">", ".", ">", "v", "."},
			{"v", ".", "v", ".", ".", ">", ">", "v", ".", "v"},
			{".", ".", ".", ".", "v", ".", ".", "v", ".", ">"},
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := parseInput(tt.args.inputLines); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("parseInput() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_simulateStep(t *testing.T) {
	type args struct {
		oceanFloorMap OceanFloorMap
	}
	tests := []struct {
		name  string
		args  args
		want  bool
		want1 OceanFloorMap
	}{
		{"step example", args{parseInput([]string{
			"..........",
			".>v....v..",
			".......>..",
			"..........",
		})}, true, parseInput([]string{
			"..........",
			".>........",
			"..v....v>.",
			"..........",
		})},
		{"no movement possible", args{parseInput(exampleInputFinalStep)}, false, parseInput(exampleInputFinalStep)},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, got1 := simulateStep(tt.args.oceanFloorMap)
			if got != tt.want {
				t.Errorf("simulateStep() got = %v, want %v", got, tt.want)
			}
			if !reflect.DeepEqual(got1, tt.want1) {
				t.Errorf("simulateStep() got1 = %v, want %v", got1, tt.want1)
			}
		})
	}
}

func Test_findFirstStepWithoutMovement(t *testing.T) {
	type args struct {
		oceanFloorMap OceanFloorMap
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"example input", args{parseInput(exampleInput)}, 58},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := findFirstStepWithoutMovement(tt.args.oceanFloorMap); got != tt.want {
				t.Errorf("findFirstStepWithoutMovement() = %v, want %v", got, tt.want)
			}
		})
	}
}
