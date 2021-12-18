package main

import (
	"reflect"
	"testing"
)

func fromString(input string) Pair {
	pair, _ := stringToPair(input)
	return pair
}

var exampleInput = []string{
	"[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]",
	"[[[5,[2,8]],4],[5,[[9,9],0]]]",
	"[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]",
	"[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]",
	"[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]",
	"[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]",
	"[[[[5,4],[7,7]],8],[[8,3],8]]",
	"[[9,3],[[9,9],[6,[4,9]]]]",
	"[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]",
	"[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]",
}

func Test_stringToPair(t *testing.T) {
	type args struct {
		inputString string
	}
	tests := []struct {
		name           string
		args           args
		wantPair       Pair
		wantRestString string
	}{
		{"example 1", args{"[1,2]"}, Pair{left: &Pair{regularNumber: 1}, right: &Pair{regularNumber: 2}}, ""},
		{"example 2", args{"[[1,2],3]"}, Pair{left: &Pair{left: &Pair{regularNumber: 1}, right: &Pair{regularNumber: 2}}, right: &Pair{regularNumber: 3}}, ""},
		{"example 2", args{"[9,[8,7]]"}, Pair{left: &Pair{regularNumber: 9}, right: &Pair{left: &Pair{regularNumber: 8}, right: &Pair{regularNumber: 7}}}, ""},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotPair, gotRestString := stringToPair(tt.args.inputString)
			if !reflect.DeepEqual(gotPair, tt.wantPair) {
				t.Errorf("stringToPair() gotPair = %v, want %v", gotPair, tt.wantPair)
			}
			if gotRestString != tt.wantRestString {
				t.Errorf("stringToPair() gotRestString = %v, want %v", gotRestString, tt.wantRestString)
			}
		})
	}
}

func Test_reduce(t *testing.T) {
	type args struct {
		pair Pair
	}
	tests := []struct {
		name string
		args args
		want Pair
	}{
		{"explode 1", args{fromString("[[[[[9,8],1],2],3],4]")}, fromString("[[[[0,9],2],3],4]")},
		{"explode 2", args{fromString("[7,[6,[5,[4,[3,2]]]]]")}, fromString("[7,[6,[5,[7,0]]]]")},
		{"explode 3", args{fromString("[[6,[5,[4,[3,2]]]],1]")}, fromString("[[6,[5,[7,0]]],3]")},
		{"explode 4", args{fromString("[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]")}, fromString("[[3,[2,[8,0]]],[9,[5,[7,0]]]]")},
		{"split", args{fromString("[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]")}, fromString("[[[[0,7],4],[[7,8],[6,0]]],[8,1]]")},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := reduce(tt.args.pair); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("reduce() = %v, want %v", pairToString(got), pairToString(tt.want))
			}
		})
	}
}

func Test_add(t *testing.T) {
	type args struct {
		pair1 Pair
		pair2 Pair
	}
	tests := []struct {
		name string
		args args
		want Pair
	}{
		{"example", args{fromString("[[[[4,3],4],4],[7,[[8,4],9]]]"), fromString("[1,1]")}, fromString("[[[[0,7],4],[[7,8],[6,0]]],[8,1]]")},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := add(tt.args.pair1, tt.args.pair2); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("add() = %v, want %v", pairToString(got), pairToString(tt.want))
			}
		})
	}
}

func Test_addList(t *testing.T) {
	type args struct {
		pairs []Pair
	}
	tests := []struct {
		name string
		args args
		want Pair
	}{
		{"large example", args{parseInput([]string{
			"[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]",
			"[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]",
			"[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]",
			"[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]",
			"[7,[5,[[3,8],[1,4]]]]",
			"[[2,[2,2]],[8,[8,1]]]",
			"[2,9]",
			"[1,[[[9,3],9],[[9,0],[0,7]]]]",
			"[[[5,[7,4]],7],1]",
			"[[[[4,2],2],6],[8,7]]",
		})}, fromString("[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]")},
		{"example input", args{parseInput(exampleInput)}, fromString("[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]")},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := addList(tt.args.pairs); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("addList() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_getMagnitude(t *testing.T) {
	type args struct {
		pair Pair
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"example 1", args{fromString("[9,1]")}, 29},
		{"example 2", args{fromString("[1,9]")}, 21},
		{"example 3", args{fromString("[[9,1],[1,9]]")}, 129},
		{"example 4", args{fromString("[[1,2],[[3,4],5]]")}, 143},
		{"example 5", args{fromString("[[[[0,7],4],[[7,8],[6,0]]],[8,1]]")}, 1384},
		{"example input", args{addList(parseInput(exampleInput))}, 4140},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := getMagnitude(tt.args.pair); got != tt.want {
				t.Errorf("getMagnitude() = %v, want %v", got, tt.want)
			}
		})
	}
}
