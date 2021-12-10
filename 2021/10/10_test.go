package main

import (
	"reflect"
	"testing"
)

var exampleInput = []string{
	"[({(<(())[]>[[{[]{<()<>>",
	"[(()[<>])]({[<{<<[]>>(",
	"{([(<{}[<>[]}>{[]{[(<()>",
	"(((({<>}<{<{<>}{[]{[]{}",
	"[[<[([]))<([[{}[[()]]]",
	"[{[{({}]{}}([{[{{{}}([]",
	"{<[[]]>}<{[{[{[]{()[[[]",
	"[<(<(<(<{}))><([]([]()",
	"<{([([[(<>()){}]>(<<{{",
	"<{([{{}}[<[[[<>{}]]]>[]]",
}

func Test_validateLine(t *testing.T) {
	type args struct {
		line string
	}
	tests := []struct {
		name             string
		args             args
		wantIsValid      bool
		wantIllegalChars []rune
		wantOpenChunks   []rune
	}{
		{"{([(<{}[<>[]}>{[]{[(<()>", args{"{([(<{}[<>[]}>{[]{[(<()>"}, false, []rune{'}'}, []rune{}},
		{"[[<[([]))<([[{}[[()]]]", args{"[[<[([]))<([[{}[[()]]]"}, false, []rune{')'}, []rune{}},
		{"[{[{({}]{}}([{[{{{}}([]", args{"[{[{({}]{}}([{[{{{}}([]"}, false, []rune{']'}, []rune{}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotIsValid, gotIllegalChars, gotOpenChunks := validateLine(tt.args.line)
			if gotIsValid != tt.wantIsValid {
				t.Errorf("validateLine() gotIsValid = %v, want %v", gotIsValid, tt.wantIsValid)
			}
			if !reflect.DeepEqual(gotIllegalChars, tt.wantIllegalChars) {
				t.Errorf("validateLine() gotIllegalChars = %v, want %v", gotIllegalChars, tt.wantIllegalChars)
			}
			if !reflect.DeepEqual(gotOpenChunks, tt.wantOpenChunks) {
				t.Errorf("validateLine() gotOpenChunks = %v, want %v", gotOpenChunks, tt.wantOpenChunks)
			}
		})
	}
}

func Test_getSyntaxErrorScore(t *testing.T) {
	type args struct {
		lines []string
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"example input", args{exampleInput}, 26397},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := getSyntaxErrorScore(tt.args.lines); got != tt.want {
				t.Errorf("getSyntaxErrorScore() = %v, want %v", got, tt.want)
			}
		})
	}
}
