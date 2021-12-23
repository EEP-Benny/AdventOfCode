package main

import (
	"reflect"
	"testing"
)

var exampleInput = []string{
	"#############",
	"#...........#",
	"###B#C#B#D###",
	"  #A#D#C#A#",
	"  #########",
}
var exampleGameState = parseInput(exampleInput)
var middleGameState = parseInput([]string{
	"#############",
	"#.....D.....#",
	"###B#.#C#D###",
	"  #A#B#C#A#",
	"  #########",
})
var finishedGameState = parseInput([]string{
	"#############",
	"#...........#",
	"###A#B#C#D###",
	"  #A#B#C#D#",
	"  #########",
})
var allGameStates = []GameState{
	exampleGameState,
	parseInput([]string{
		"#############",
		"#...B.......#",
		"###B#C#.#D###",
		"  #A#D#C#A#",
		"  #########",
	}),
	parseInput([]string{
		"#############",
		"#...B.......#",
		"###B#.#C#D###",
		"  #A#D#C#A#",
		"  #########",
	}),
	parseInput([]string{
		"#############",
		"#...B.D.....#",
		"###B#.#C#D###",
		"  #A#.#C#A#",
		"  #########",
	}),
	parseInput([]string{
		"#############",
		"#.....D.....#",
		"###B#.#C#D###",
		"  #A#B#C#A#",
		"  #########",
	}),
	parseInput([]string{
		"#############",
		"#.....D.....#",
		"###.#B#C#D###",
		"  #A#B#C#A#",
		"  #########",
	}),
	parseInput([]string{
		"#############",
		"#.....D.D...#",
		"###.#B#C#.###",
		"  #A#B#C#A#",
		"  #########",
	}),
	parseInput([]string{
		"#############",
		"#.....D.D.A.#",
		"###.#B#C#.###",
		"  #A#B#C#.#",
		"  #########",
	}),
	parseInput([]string{
		"#############",
		"#.....D...A.#",
		"###.#B#C#.###",
		"  #A#B#C#D#",
		"  #########",
	}),
	parseInput([]string{
		"#############",
		"#.........A.#",
		"###.#B#C#D###",
		"  #A#B#C#D#",
		"  #########",
	}),
	finishedGameState,
}

func Test_parseInput(t *testing.T) {
	type args struct {
		inputLines []string
	}
	tests := []struct {
		name string
		args args
		want GameState
	}{
		{"example input", args{exampleInput}, GameState{
			Amphipod{"A", 1}: Position{2, 2},
			Amphipod{"A", 2}: Position{8, 2},
			Amphipod{"B", 1}: Position{2, 1},
			Amphipod{"B", 2}: Position{6, 1},
			Amphipod{"C", 1}: Position{4, 1},
			Amphipod{"C", 2}: Position{6, 2},
			Amphipod{"D", 1}: Position{8, 1},
			Amphipod{"D", 2}: Position{4, 2},
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

func TestGameState_isOccupied(t *testing.T) {
	type args struct {
		pos Position
	}
	tests := []struct {
		name      string
		gameState GameState
		args      args
		want      bool
	}{
		{"empty", parseInput(exampleInput), args{Position{0, 0}}, false},
		{"occupied", parseInput(exampleInput), args{Position{2, 2}}, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.gameState.isOccupied(tt.args.pos); got != tt.want {
				t.Errorf("GameState.isOccupied() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestGameState_getAmphipodAt(t *testing.T) {
	type args struct {
		pos Position
	}
	tests := []struct {
		name      string
		gameState GameState
		args      args
		want      Amphipod
	}{
		{"empty", parseInput(exampleInput), args{Position{0, 0}}, Amphipod{}},
		{"occupied", parseInput(exampleInput), args{Position{2, 2}}, Amphipod{"A", 1}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.gameState.getAmphipodAt(tt.args.pos); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("GameState.getAmphipodAt() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestGameState_isFinished(t *testing.T) {
	tests := []struct {
		name      string
		gameState GameState
		want      bool
	}{
		{"not finished", exampleGameState, false},
		{"finished", finishedGameState, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.gameState.isFinished(); got != tt.want {
				t.Errorf("GameState.isFinished() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestGameState_checkPath(t *testing.T) {
	type args struct {
		start Position
		end   Position
	}
	tests := []struct {
		name          string
		gameState     GameState
		args          args
		wantIsFree    bool
		wantStepCount int
	}{
		{"hallway to room (free)", middleGameState, args{Position{5, 0}, Position{4, 1}}, true, 2},
		{"hallway to room (occupied)", middleGameState, args{Position{5, 0}, Position{4, 2}}, false, 3},
		{"hallway to room (occupied 2)", middleGameState, args{Position{5, 0}, Position{2, 1}}, false, 4},
		{"room to room (free)", middleGameState, args{Position{2, 1}, Position{4, 1}}, true, 4},
		{"room to hallway (free)", middleGameState, args{Position{2, 1}, Position{3, 0}}, true, 2},
		{"room to hallway (occupied)", middleGameState, args{Position{2, 1}, Position{7, 0}}, false, 6},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotIsFree, gotStepCount := tt.gameState.checkPath(tt.args.start, tt.args.end)
			if gotIsFree != tt.wantIsFree {
				t.Errorf("GameState.checkPath() gotIsFree = %v, want %v", gotIsFree, tt.wantIsFree)
			}
			if gotStepCount != tt.wantStepCount {
				t.Errorf("GameState.checkPath() gotStepCount = %v, want %v", gotStepCount, tt.wantStepCount)
			}
		})
	}
}

func TestGameState_getPossibleMoves(t *testing.T) {
	tests := []struct {
		name      string
		gameState GameState
		want      []Move
	}{
		{"middle game state", middleGameState, []Move{
			{Amphipod{"B", 1}, Position{4, 1}, 40},
			{Amphipod{"D", 2}, Position{7, 0}, 2000},
			{Amphipod{"D", 2}, Position{9, 0}, 2000},
			{Amphipod{"D", 2}, Position{10, 0}, 3000},
		}},
		{"step 0", allGameStates[0], []Move{
			{Amphipod{"B", 1}, Position{0, 0}, 30},
			{Amphipod{"B", 1}, Position{1, 0}, 20},
			{Amphipod{"B", 1}, Position{3, 0}, 20},
			{Amphipod{"B", 1}, Position{5, 0}, 40},
			{Amphipod{"B", 1}, Position{7, 0}, 60},
			{Amphipod{"B", 1}, Position{9, 0}, 80},
			{Amphipod{"B", 1}, Position{10, 0}, 90},

			{Amphipod{"B", 2}, Position{0, 0}, 70},
			{Amphipod{"B", 2}, Position{1, 0}, 60},
			{Amphipod{"B", 2}, Position{3, 0}, 40}, // *
			{Amphipod{"B", 2}, Position{5, 0}, 20},
			{Amphipod{"B", 2}, Position{7, 0}, 20},
			{Amphipod{"B", 2}, Position{9, 0}, 40},
			{Amphipod{"B", 2}, Position{10, 0}, 50},

			{Amphipod{"C", 1}, Position{0, 0}, 500},
			{Amphipod{"C", 1}, Position{1, 0}, 400},
			{Amphipod{"C", 1}, Position{3, 0}, 200},
			{Amphipod{"C", 1}, Position{5, 0}, 200},
			{Amphipod{"C", 1}, Position{7, 0}, 400},
			{Amphipod{"C", 1}, Position{9, 0}, 600},
			{Amphipod{"C", 1}, Position{10, 0}, 700},

			{Amphipod{"D", 1}, Position{0, 0}, 9000},
			{Amphipod{"D", 1}, Position{1, 0}, 8000},
			{Amphipod{"D", 1}, Position{3, 0}, 6000},
			{Amphipod{"D", 1}, Position{5, 0}, 4000},
			{Amphipod{"D", 1}, Position{7, 0}, 2000},
			{Amphipod{"D", 1}, Position{9, 0}, 2000},
			{Amphipod{"D", 1}, Position{10, 0}, 3000},
		}},
		{"step 1", allGameStates[1], []Move{
			{Amphipod{"B", 2}, Position{0, 0}, 30},
			{Amphipod{"B", 2}, Position{1, 0}, 20},

			{Amphipod{"C", 1}, Position{6, 1}, 400}, // *

			{Amphipod{"D", 1}, Position{5, 0}, 4000},
			{Amphipod{"D", 1}, Position{7, 0}, 2000},
			{Amphipod{"D", 1}, Position{9, 0}, 2000},
			{Amphipod{"D", 1}, Position{10, 0}, 3000},
		}},
		{"step 2", allGameStates[2], []Move{
			{Amphipod{"B", 2}, Position{0, 0}, 30},
			{Amphipod{"B", 2}, Position{1, 0}, 20},

			{Amphipod{"D", 1}, Position{5, 0}, 4000},
			{Amphipod{"D", 1}, Position{7, 0}, 2000},
			{Amphipod{"D", 1}, Position{9, 0}, 2000},
			{Amphipod{"D", 1}, Position{10, 0}, 3000},

			{Amphipod{"D", 2}, Position{5, 0}, 3000}, // *
			{Amphipod{"D", 2}, Position{7, 0}, 5000},
			{Amphipod{"D", 2}, Position{9, 0}, 7000},
			{Amphipod{"D", 2}, Position{10, 0}, 8000},
		}},
		{"step 3", allGameStates[3], []Move{
			{Amphipod{"B", 1}, Position{4, 2}, 30}, // *

			{Amphipod{"B", 2}, Position{0, 0}, 30},
			{Amphipod{"B", 2}, Position{1, 0}, 20},

			{Amphipod{"D", 2}, Position{7, 0}, 2000},
			{Amphipod{"D", 2}, Position{9, 0}, 2000},
			{Amphipod{"D", 2}, Position{10, 0}, 3000},
		}},
		{"step 4", allGameStates[4], []Move{
			{Amphipod{"B", 1}, Position{4, 1}, 40}, // *

			{Amphipod{"D", 2}, Position{7, 0}, 2000},
			{Amphipod{"D", 2}, Position{9, 0}, 2000},
			{Amphipod{"D", 2}, Position{10, 0}, 3000},
		}},
		{"step 5", allGameStates[5], []Move{
			{Amphipod{"D", 2}, Position{7, 0}, 2000}, // *
			{Amphipod{"D", 2}, Position{9, 0}, 2000},
			{Amphipod{"D", 2}, Position{10, 0}, 3000},
		}},
		{"step 6", allGameStates[6], []Move{
			{Amphipod{"A", 2}, Position{9, 0}, 3}, // *
			{Amphipod{"A", 2}, Position{10, 0}, 4},
		}},
		{"step 7", allGameStates[7], []Move{
			{Amphipod{"D", 2}, Position{8, 2}, 3000}, // *
		}},
		{"step 8", allGameStates[8], []Move{
			{Amphipod{"D", 1}, Position{8, 1}, 4000}, // *
		}},
		{"step 9", allGameStates[9], []Move{
			{Amphipod{"A", 1}, Position{2, 1}, 8}, // *
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.gameState.getPossibleMoves(); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("GameState.getPossibleMoves() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_findBestSolution(t *testing.T) {
	type args struct {
		initalGameState GameState
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"example input", args{exampleGameState}, 12521},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := findBestSolution(tt.args.initalGameState); got != tt.want {
				t.Errorf("findBestSolution() = %v, want %v", got, tt.want)
			}
		})
	}
}
