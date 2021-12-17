package main

import (
	"reflect"
	"testing"
)

var exampleInput = "target area: x=20..30, y=-10..-5"

func Test_parseInput(t *testing.T) {
	type args struct {
		inputString string
	}
	tests := []struct {
		name string
		args args
		want TargetArea
	}{
		{"example input", args{exampleInput}, TargetArea{xMin: 20, xMax: 30, yMin: -10, yMax: -5}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := parseInput(tt.args.inputString); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("parseInput() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_step(t *testing.T) {
	type args struct {
		oldState State
	}
	tests := []struct {
		name string
		args args
		want State
	}{
		{"A", args{State{posX: 0, posY: 0, vX: 10, vY: 5}}, State{posX: 10, posY: 5, vX: 9, vY: 4}},
		{"B", args{State{posX: 10, posY: 5, vX: 0, vY: 0}}, State{posX: 10, posY: 5, vX: 0, vY: -1}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := step(tt.args.oldState); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("step() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_findHighestPointInTrajectoryThatReachesTheTarget(t *testing.T) {
	type args struct {
		targetArea TargetArea
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"example input", args{TargetArea{xMin: 20, xMax: 30, yMin: -10, yMax: -5}}, 45},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := findHighestPointInTrajectoryThatReachesTheTarget(tt.args.targetArea); got != tt.want {
				t.Errorf("findHighestPointInTrajectoryThatReachesTheTarget() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_willReachTargetArea(t *testing.T) {
	type args struct {
		initialXVelocity int
		initialYVelocity int
		targetArea       TargetArea
	}
	tests := []struct {
		name string
		args args
		want bool
	}{
		{"example that reaches target (1)", args{7, 2, TargetArea{xMin: 20, xMax: 30, yMin: -10, yMax: -5}}, true},
		{"example that reaches target (2)", args{6, 3, TargetArea{xMin: 20, xMax: 30, yMin: -10, yMax: -5}}, true},
		{"example that reaches target (3)", args{9, 0, TargetArea{xMin: 20, xMax: 30, yMin: -10, yMax: -5}}, true},
		{"example that does not reach target", args{17, -4, TargetArea{xMin: 20, xMax: 30, yMin: -10, yMax: -5}}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := willReachTargetArea(tt.args.initialXVelocity, tt.args.initialYVelocity, tt.args.targetArea); got != tt.want {
				t.Errorf("willReachTargetArea() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_countDistinctInitialVelocitiesThatReachTheTarget(t *testing.T) {
	type args struct {
		targetArea TargetArea
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"example input", args{TargetArea{xMin: 20, xMax: 30, yMin: -10, yMax: -5}}, 112},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := countDistinctInitialVelocitiesThatReachTheTarget(tt.args.targetArea); got != tt.want {
				t.Errorf("countDistinctInitialVelocitiesThatReachTheTarget() = %v, want %v", got, tt.want)
			}
		})
	}
}
