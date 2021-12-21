package main

import (
	"reflect"
	"testing"
)

var exampleInput = []string{
	"Player 1 starting position: 4",
	"Player 2 starting position: 8",
}

func Test_parseInput(t *testing.T) {
	type args struct {
		inputLines []string
	}
	tests := []struct {
		name                string
		args                args
		wantPlayerPositions [2]int
	}{
		{"example input", args{exampleInput}, [2]int{4, 8}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if gotPlayerPositions := parseInput(tt.args.inputLines); !reflect.DeepEqual(gotPlayerPositions, tt.wantPlayerPositions) {
				t.Errorf("parseInput() = %v, want %v", gotPlayerPositions, tt.wantPlayerPositions)
			}
		})
	}
}

func Test_practiceGame(t *testing.T) {
	type args struct {
		playerPositions [2]int
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"example input", args{parseInput(exampleInput)}, 739785},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := practiceGame(tt.args.playerPositions); got != tt.want {
				t.Errorf("practiceGame() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_quantumGame(t *testing.T) {
	type args struct {
		startingPositions [2]int
	}
	tests := []struct {
		name string
		args args
		want int64
	}{
		{"example input", args{parseInput(exampleInput)}, 444356092776315},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := quantumGame(tt.args.startingPositions); got != tt.want {
				t.Errorf("quantumGame() = %v, want %v", got, tt.want)
			}
		})
	}
}
