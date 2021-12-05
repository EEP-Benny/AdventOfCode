package main

import (
	"reflect"
	"testing"
)

var exampleInput = []string{
	"0,9 -> 5,9",
	"8,0 -> 0,8",
	"9,4 -> 3,4",
	"2,2 -> 2,1",
	"7,0 -> 7,4",
	"6,4 -> 2,0",
	"0,9 -> 2,9",
	"3,4 -> 1,4",
	"0,0 -> 8,8",
	"5,5 -> 8,2",
}

func Test_makeLine(t *testing.T) {
	type args struct {
		lineAsString string
	}
	tests := []struct {
		name string
		args args
		want Line
	}{
		{"0,9 -> 5,9", args{"0,9 -> 5,9"}, Line{0, 9, 5, 9}},
		{"8,0 -> 0,8", args{"8,0 -> 0,8"}, Line{8, 0, 0, 8}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := makeLine(tt.args.lineAsString); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("makeLine() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_processInput(t *testing.T) {
	type args struct {
		inputAsStrings []string
	}
	tests := []struct {
		name string
		args args
		want []Line
	}{
		{"example input", args{exampleInput}, []Line{
			{0, 9, 5, 9},
			{8, 0, 0, 8},
			{9, 4, 3, 4},
			{2, 2, 2, 1},
			{7, 0, 7, 4},
			{6, 4, 2, 0},
			{0, 9, 2, 9},
			{3, 4, 1, 4},
			{0, 0, 8, 8},
			{5, 5, 8, 2},
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

func Test_drawLinesInDiagram(t *testing.T) {
	type args struct {
		lines             []Line
		diagramSize       int
		considerDiagonals bool
	}
	tests := []struct {
		name string
		args args
		want Diagram
	}{
		{"exampleInput without diagonals", args{processInput(exampleInput), 10, false}, [][]int{
			{0, 0, 0, 0, 0, 0, 0, 1, 0, 0},
			{0, 0, 1, 0, 0, 0, 0, 1, 0, 0},
			{0, 0, 1, 0, 0, 0, 0, 1, 0, 0},
			{0, 0, 0, 0, 0, 0, 0, 1, 0, 0},
			{0, 1, 1, 2, 1, 1, 1, 2, 1, 1},
			{0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
			{0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
			{0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
			{0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
			{2, 2, 2, 1, 1, 1, 0, 0, 0, 0},
		}},
		{"exampleInput with diagonals", args{processInput(exampleInput), 10, true}, [][]int{
			{1, 0, 1, 0, 0, 0, 0, 1, 1, 0},
			{0, 1, 1, 1, 0, 0, 0, 2, 0, 0},
			{0, 0, 2, 0, 1, 0, 1, 1, 1, 0},
			{0, 0, 0, 1, 0, 2, 0, 2, 0, 0},
			{0, 1, 1, 2, 3, 1, 3, 2, 1, 1},
			{0, 0, 0, 1, 0, 2, 0, 0, 0, 0},
			{0, 0, 1, 0, 0, 0, 1, 0, 0, 0},
			{0, 1, 0, 0, 0, 0, 0, 1, 0, 0},
			{1, 0, 0, 0, 0, 0, 0, 0, 1, 0},
			{2, 2, 2, 1, 1, 1, 0, 0, 0, 0},
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := drawLinesInDiagram(tt.args.lines, tt.args.diagramSize, tt.args.considerDiagonals); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("drawLinesInDiagram() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_countOverlappingPoints(t *testing.T) {
	type args struct {
		diagram Diagram
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"exampleInput without diagonals", args{drawLinesInDiagram(processInput(exampleInput), 10, false)}, 5},
		{"exampleInput with diagonals", args{drawLinesInDiagram(processInput(exampleInput), 10, true)}, 12},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := countOverlappingPoints(tt.args.diagram); got != tt.want {
				t.Errorf("countOverlappingPoints() = %v, want %v", got, tt.want)
			}
		})
	}
}
