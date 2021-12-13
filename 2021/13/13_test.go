package main

import (
	"reflect"
	"strings"
	"testing"
)

var exampleInput = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`

var exampleDotPositions, exampleFolds = processInput(exampleInput)

func Test_processInput(t *testing.T) {
	type args struct {
		inputString string
	}
	tests := []struct {
		name             string
		args             args
		wantDotPositions [][]int
		wantFolds        []Fold
	}{
		{"exampleInput", args{exampleInput}, [][]int{
			{6, 10},
			{0, 14},
			{9, 10},
			{0, 3},
			{10, 4},
			{4, 11},
			{6, 0},
			{6, 12},
			{4, 1},
			{0, 13},
			{10, 12},
			{3, 4},
			{3, 0},
			{8, 4},
			{1, 10},
			{2, 14},
			{8, 10},
			{9, 0},
		}, []Fold{
			{isVertical: false, position: 7},
			{isVertical: true, position: 5},
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotDotPositions, gotFolds := processInput(tt.args.inputString)
			if !reflect.DeepEqual(gotDotPositions, tt.wantDotPositions) {
				t.Errorf("processInput() gotDotPositions = %v, want %v", gotDotPositions, tt.wantDotPositions)
			}
			if !reflect.DeepEqual(gotFolds, tt.wantFolds) {
				t.Errorf("processInput() gotFolds = %v, want %v", gotFolds, tt.wantFolds)
			}
		})
	}
}

func Test_createDotMatrix(t *testing.T) {
	type args struct {
		dotPositions [][]int
	}
	tests := []struct {
		name string
		args args
		want DotMatrix
	}{
		{"exampleInput", args{exampleDotPositions}, DotMatrix{
			{false, false, false, true, false, false, true, false, false, true, false},
			{false, false, false, false, true, false, false, false, false, false, false},
			{false, false, false, false, false, false, false, false, false, false, false},
			{true, false, false, false, false, false, false, false, false, false, false},
			{false, false, false, true, false, false, false, false, true, false, true},
			{false, false, false, false, false, false, false, false, false, false, false},
			{false, false, false, false, false, false, false, false, false, false, false},
			{false, false, false, false, false, false, false, false, false, false, false},
			{false, false, false, false, false, false, false, false, false, false, false},
			{false, false, false, false, false, false, false, false, false, false, false},
			{false, true, false, false, false, false, true, false, true, true, false},
			{false, false, false, false, true, false, false, false, false, false, false},
			{false, false, false, false, false, false, true, false, false, false, true},
			{true, false, false, false, false, false, false, false, false, false, false},
			{true, false, true, false, false, false, false, false, false, false, false},
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := createDotMatrix(tt.args.dotPositions); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("createDotMatrix() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_executeFold(t *testing.T) {
	type args struct {
		dotMatrix DotMatrix
		fold      Fold
	}
	tests := []struct {
		name string
		args args
		want DotMatrix
	}{
		{"example fold 1", args{createDotMatrix(exampleDotPositions), exampleFolds[0]}, DotMatrix{
			{true, false, true, true, false, false, true, false, false, true, false},
			{true, false, false, false, true, false, false, false, false, false, false},
			{false, false, false, false, false, false, true, false, false, false, true},
			{true, false, false, false, true, false, false, false, false, false, false},
			{false, true, false, true, false, false, true, false, true, true, true},
			{false, false, false, false, false, false, false, false, false, false, false},
			{false, false, false, false, false, false, false, false, false, false, false},
		}},
		{"example fold 2", args{executeFold(createDotMatrix(exampleDotPositions), exampleFolds[0]), exampleFolds[1]}, DotMatrix{
			{true, true, true, true, true},
			{true, false, false, false, true},
			{true, false, false, false, true},
			{true, false, false, false, true},
			{true, true, true, true, true},
			{false, false, false, false, false},
			{false, false, false, false, false},
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := executeFold(tt.args.dotMatrix, tt.args.fold); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("executeFold() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_executeFolds(t *testing.T) {
	type args struct {
		dotMatrix DotMatrix
		folds     []Fold
	}
	tests := []struct {
		name string
		args args
		want DotMatrix
	}{
		{"example input", args{createDotMatrix(exampleDotPositions), exampleFolds}, DotMatrix{
			{true, true, true, true, true},
			{true, false, false, false, true},
			{true, false, false, false, true},
			{true, false, false, false, true},
			{true, true, true, true, true},
			{false, false, false, false, false},
			{false, false, false, false, false},
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := executeFolds(tt.args.dotMatrix, tt.args.folds); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("executeFolds() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_countDots(t *testing.T) {
	type args struct {
		dotMatrix DotMatrix
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"example after fold 1", args{executeFold(createDotMatrix(exampleDotPositions), exampleFolds[0])}, 17},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := countDots(tt.args.dotMatrix); got != tt.want {
				t.Errorf("countDots() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_stringifyDotMatrix(t *testing.T) {
	type args struct {
		dotMatrix DotMatrix
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{"exampleInput", args{createDotMatrix(exampleDotPositions)}, strings.Join([]string{
			"...#..#..#.",
			"....#......",
			"...........",
			"#..........",
			"...#....#.#",
			"...........",
			"...........",
			"...........",
			"...........",
			"...........",
			".#....#.##.",
			"....#......",
			"......#...#",
			"#..........",
			"#.#........",
		}, "\n")},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := stringifyDotMatrix(tt.args.dotMatrix); got != tt.want {
				t.Errorf("stringifyDotMatrix() = %v, want %v", got, tt.want)
			}
		})
	}
}
