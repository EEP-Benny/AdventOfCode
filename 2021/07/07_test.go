package main

import (
	"testing"
)

var exampleInput = []int{16, 1, 2, 0, 4, 2, 7, 1, 2, 14}

func Test_calculateLinearFuelCost(t *testing.T) {
	type args struct {
		startPositions []int
		targetPosition int
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"example input -> 2", args{exampleInput, 2}, 37},
		{"example input -> 1", args{exampleInput, 1}, 41},
		{"example input -> 3", args{exampleInput, 3}, 39},
		{"example input -> 10", args{exampleInput, 10}, 71},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := calculateLinearFuelCost(tt.args.startPositions, tt.args.targetPosition); got != tt.want {
				t.Errorf("calculateLinearFuelCost() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_calculateQuadraticFuelCost(t *testing.T) {
	type args struct {
		startPositions []int
		targetPosition int
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"example input -> 2", args{exampleInput, 2}, 206},
		{"example input -> 5", args{exampleInput, 5}, 168},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := calculateQuadraticFuelCost(tt.args.startPositions, tt.args.targetPosition); got != tt.want {
				t.Errorf("calculateQuadraticFuelCost() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_getLowestFuelCost(t *testing.T) {
	type args struct {
		startPositions []int
		fuelCostFn     func([]int, int) int
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"example input with linear cost", args{exampleInput, calculateLinearFuelCost}, 37},
		{"example input with quadratic cost", args{exampleInput, calculateQuadraticFuelCost}, 168},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := getLowestFuelCost(tt.args.startPositions, tt.args.fuelCostFn); got != tt.want {
				t.Errorf("getLowestFuelCost() = %v, want %v", got, tt.want)
			}
		})
	}
}
