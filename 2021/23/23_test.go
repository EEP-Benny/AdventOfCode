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
var allGameStates = []ComparableGameState{
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
		want ComparableGameState
	}{
		{"example input", args{exampleInput}, ComparableGameState{
			maxAmphipodIndex: 2,
			positions: [16]Position{
				{2, 2},
				{8, 2},
				{},
				{},
				{2, 1},
				{6, 1},
				{},
				{},
				{4, 1},
				{6, 2},
				{},
				{},
				{8, 1},
				{4, 2},
				{},
				{},
			},
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

func TestGameState_isFinished(t *testing.T) {
	tests := []struct {
		name      string
		gameState GameState
		want      bool
	}{
		{"not finished", exampleGameState.toGameState(), false},
		{"finished", finishedGameState.toGameState(), true},
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
		{"hallway to room (free)", middleGameState.toGameState(), args{Position{5, 0}, Position{4, 1}}, true, 2},
		{"hallway to room (occupied)", middleGameState.toGameState(), args{Position{5, 0}, Position{4, 2}}, false, 3},
		{"hallway to room (occupied 2)", middleGameState.toGameState(), args{Position{5, 0}, Position{2, 1}}, false, 4},
		{"room to room (free)", middleGameState.toGameState(), args{Position{2, 1}, Position{4, 1}}, true, 4},
		{"room to hallway (free)", middleGameState.toGameState(), args{Position{2, 1}, Position{3, 0}}, true, 2},
		{"room to hallway (occupied)", middleGameState.toGameState(), args{Position{2, 1}, Position{7, 0}}, false, 6},
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
		{"middle game state", middleGameState.toGameState(), []Move{
			{Amphipod{"B", 1}, Position{4, 1}, 40},
		}},
		{"step 0", allGameStates[0].toGameState(), []Move{
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
		{"step 1", allGameStates[1].toGameState(), []Move{
			{Amphipod{"C", 1}, Position{6, 1}, 400}, // *
		}},
		{"step 2", allGameStates[2].toGameState(), []Move{
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
		{"step 3", allGameStates[3].toGameState(), []Move{
			{Amphipod{"B", 1}, Position{4, 2}, 30}, // *
		}},
		{"step 4", allGameStates[4].toGameState(), []Move{
			{Amphipod{"B", 1}, Position{4, 1}, 40}, // *
		}},
		{"step 5", allGameStates[5].toGameState(), []Move{
			{Amphipod{"D", 2}, Position{7, 0}, 2000}, // *
			{Amphipod{"D", 2}, Position{9, 0}, 2000},
			{Amphipod{"D", 2}, Position{10, 0}, 3000},
		}},
		{"step 6", allGameStates[6].toGameState(), []Move{
			{Amphipod{"A", 2}, Position{9, 0}, 3}, // *
			{Amphipod{"A", 2}, Position{10, 0}, 4},
		}},
		{"step 7", allGameStates[7].toGameState(), []Move{
			{Amphipod{"D", 2}, Position{8, 2}, 3000}, // *
		}},
		{"step 8", allGameStates[8].toGameState(), []Move{
			{Amphipod{"D", 1}, Position{8, 1}, 4000}, // *
		}},
		{"step 9", allGameStates[9].toGameState(), []Move{
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
		initalGameState ComparableGameState
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"example input", args{exampleGameState}, 12521},
		// {"example input extended", args{parseInput(extendInput(exampleInput))}, 44169}, // runs into a timeout
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := findBestSolution(tt.args.initalGameState); got != tt.want {
				t.Errorf("findBestSolution() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_extendInput(t *testing.T) {
	type args struct {
		inputLines []string
	}
	tests := []struct {
		name string
		args args
		want []string
	}{
		{"example input", args{exampleInput}, []string{
			"#############",
			"#...........#",
			"###B#C#B#D###",
			"  #D#C#B#A#",
			"  #D#B#A#C#",
			"  #A#D#C#A#",
			"  #########",
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := extendInput(tt.args.inputLines); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("extendInput() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestGameState_getBottomMostIncorrectAmphipodForColor(t *testing.T) {
	type args struct {
		color Color
	}
	tests := []struct {
		name      string
		gameState GameState
		args      args
		want      int
	}{
		{"A, only last correct", parseInput([]string{
			"#############",
			"#...........#",
			"###B#C#B#D###",
			"  #D#C#B#A#",
			"  #D#B#A#C#",
			"  #A#D#C#A#",
			"  #########",
		}).toGameState(), args{"A"}, 3},
		{"B, last incorrect", parseInput([]string{
			"#############",
			"#...........#",
			"###B#C#B#D###",
			"  #D#C#B#A#",
			"  #D#B#A#C#",
			"  #A#D#C#A#",
			"  #########",
		}).toGameState(), args{"B"}, 4},
		{"C, nothing correct", parseInput([]string{
			"#############",
			"#...........#",
			"###B#C#B#D###",
			"  #D#C#B#A#",
			"  #D#B#A#C#",
			"  #A#C#D#A#",
			"  #########",
		}).toGameState(), args{"C"}, 4},
		{"D, all correct", parseInput([]string{
			"#############",
			"#...........#",
			"###B#C#B#D###",
			"  #D#C#B#D#",
			"  #D#B#A#D#",
			"  #A#D#D#D#",
			"  #########",
		}).toGameState(), args{"D"}, 0},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.gameState.getBottomMostIncorrectAmphipodForColor(tt.args.color); got != tt.want {
				t.Errorf("GameState.getBottomMostIncorrectAmphipodForColor() = %v, want %v", got, tt.want)
			}
		})
	}
}
