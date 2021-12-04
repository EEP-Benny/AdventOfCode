package main

import (
	"reflect"
	"testing"
)

var exampleInput = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`

var exampleNumbers, exampleBoards = processInput(exampleInput)

func Test_processInput(t *testing.T) {
	type args struct {
		inputAsString string
	}
	tests := []struct {
		name             string
		args             args
		wantNumbersDrawn []int
		wantBoards       []Board
	}{
		{"example input", args{exampleInput}, []int{7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26, 1}, []Board{
			{
				{22, 13, 17, 11, 0},
				{8, 2, 23, 4, 24},
				{21, 9, 14, 16, 7},
				{6, 10, 3, 18, 5},
				{1, 12, 20, 15, 19},
			}, {
				{3, 15, 0, 2, 22},
				{9, 18, 13, 17, 5},
				{19, 8, 7, 25, 23},
				{20, 11, 10, 24, 4},
				{14, 21, 16, 12, 6},
			}, {
				{14, 21, 17, 24, 4},
				{10, 16, 15, 9, 19},
				{18, 8, 23, 26, 20},
				{22, 11, 13, 6, 5},
				{2, 0, 12, 3, 7},
			},
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotNumbersDrawn, gotBoards := processInput(tt.args.inputAsString)
			if !reflect.DeepEqual(gotNumbersDrawn, tt.wantNumbersDrawn) {
				t.Errorf("processInput() gotNumbersDrawn = %v, want %v", gotNumbersDrawn, tt.wantNumbersDrawn)
			}
			if !reflect.DeepEqual(gotBoards, tt.wantBoards) {
				t.Errorf("processInput() gotBoards = %v, want %v", gotBoards, tt.wantBoards)
			}
		})
	}
}

func Test_markNumberInBoard(t *testing.T) {
	type args struct {
		board  Board
		number int
	}
	tests := []struct {
		name string
		args args
		want Board
	}{
		{"Board 1, Round 1", args{
			makeBoard("22 13 17 11  0\n 8  2 23  4 24\n21  9 14 16  7\n 6 10  3 18  5\n 1 12 20 15 19"), 7},
			makeBoard("22 13 17 11  0\n 8  2 23  4 24\n21  9 14 16 -1\n 6 10  3 18  5\n 1 12 20 15 19")},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := markNumberInBoard(tt.args.board, tt.args.number); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("markNumberInBoard() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_hasBoardWon(t *testing.T) {
	type args struct {
		board Board
	}
	tests := []struct {
		name string
		args args
		want bool
	}{
		{"not won", args{makeBoard("-1 13 17 11  0\n 8 -1 23  4 24\n21  9 -1 16  7\n 6 10  3 -1  5\n 1 12 20 15 -1")}, false},
		{"full row", args{makeBoard("-1 13 17 11  0\n-1 -1 -1 -1 -1\n21  9 -1 16  7\n 6 10  3 -1  5\n 1 12 20 15 -1")}, true},
		{"full col", args{makeBoard("-1 13 17 11  0\n-1 -1 23  4 24\n-1  9 -1 16  7\n-1 10  3 -1  5\n-1 12 20 15 -1")}, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := hasBoardWon(tt.args.board); got != tt.want {
				t.Errorf("hasBoardWon() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_getWinningScore(t *testing.T) {
	type args struct {
		board      Board
		lastNumber int
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"example", args{makeBoard("-1 -1 -1 -1 -1\n10 16 15 -1 19\n18  8 -1 26 20\n22 -1 13  6 -1\n-1 -1 12  3 -1"), 24}, 4512},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := getWinningScore(tt.args.board, tt.args.lastNumber); got != tt.want {
				t.Errorf("getWinningScore() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_runBoardsUntilOneWins(t *testing.T) {
	type args struct {
		numbers []int
		boards  []Board
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"example input", args{exampleNumbers, exampleBoards}, 4512},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := runBoardsUntilOneWins(tt.args.numbers, tt.args.boards); got != tt.want {
				t.Errorf("runBoardsUntilOneWins() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_runBoardsUntilLastOneWins(t *testing.T) {
	type args struct {
		numbers []int
		boards  []Board
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"example input", args{exampleNumbers, exampleBoards}, 1924},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := runBoardsUntilLastOneWins(tt.args.numbers, tt.args.boards); got != tt.want {
				t.Errorf("runBoardsUntilLastOneWins() = %v, want %v", got, tt.want)
			}
		})
	}
}
