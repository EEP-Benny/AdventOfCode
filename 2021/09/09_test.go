package main

import (
	"reflect"
	"testing"
)

var exampleInput = []string{
	"2199943210",
	"3987894921",
	"9856789892",
	"8767896789",
	"9899965678",
}

func Test_processInput(t *testing.T) {
	type args struct {
		inputAsStrings []string
	}
	tests := []struct {
		name string
		args args
		want HeightMap
	}{
		{"exampleInput", args{exampleInput}, HeightMap{
			{2, 1, 9, 9, 9, 4, 3, 2, 1, 0},
			{3, 9, 8, 7, 8, 9, 4, 9, 2, 1},
			{9, 8, 5, 6, 7, 8, 9, 8, 9, 2},
			{8, 7, 6, 7, 8, 9, 6, 7, 8, 9},
			{9, 8, 9, 9, 9, 6, 5, 6, 7, 8},
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

func Test_isLowPoint(t *testing.T) {
	type args struct {
		heightMap HeightMap
		y         int
		x         int
	}
	tests := []struct {
		name string
		args args
		want bool
	}{
		{"low point 1", args{processInput(exampleInput), 0, 1}, true},
		{"low point 2", args{processInput(exampleInput), 0, 9}, true},
		{"low point 3", args{processInput(exampleInput), 2, 2}, true},
		{"low point 4", args{processInput(exampleInput), 4, 6}, true},
		{"non-low point 1", args{processInput(exampleInput), 0, 0}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := isLowPoint(tt.args.heightMap, tt.args.y, tt.args.x); got != tt.want {
				t.Errorf("isLowPoint() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_getSumOfRiskLevelsOfLowPoints(t *testing.T) {
	type args struct {
		heightMap HeightMap
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"exampleInput", args{processInput(exampleInput)}, 15},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := getSumOfRiskLevelsOfLowPoints(tt.args.heightMap); got != tt.want {
				t.Errorf("getSumOfRiskLevelsOfLowPoints() = %v, want %v", got, tt.want)
			}
		})
	}
}
