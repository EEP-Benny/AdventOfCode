package main

import (
	"reflect"
	"testing"
)

var exampleInput1 = []string{
	"start-A",
	"start-b",
	"A-c",
	"A-b",
	"b-d",
	"A-end",
	"b-end",
}
var exampleInput2 = []string{
	"dc-end",
	"HN-start",
	"start-kj",
	"dc-start",
	"dc-HN",
	"LN-dc",
	"HN-end",
	"kj-sa",
	"kj-HN",
	"kj-dc",
}

var exampleInput3 = []string{
	"fs-end",
	"he-DX",
	"fs-he",
	"start-DX",
	"pj-DX",
	"end-zg",
	"zg-sl",
	"zg-pj",
	"pj-he",
	"RW-he",
	"fs-DX",
	"pj-RW",
	"zg-RW",
	"start-pj",
	"he-WI",
	"zg-he",
	"pj-fs",
	"start-RW",
}

func Test_createCaveConnections(t *testing.T) {
	type args struct {
		inputAsStrings []string
	}
	tests := []struct {
		name string
		args args
		want CaveConnections
	}{
		{"part of example input", args{[]string{"start-A", "A-c"}}, CaveConnections{
			"start": map[string]bool{"A": true},
			"A":     map[string]bool{"start": true, "c": true},
			"c":     map[string]bool{"A": true},
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := createCaveConnections(tt.args.inputAsStrings); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("createCaveConnections() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_countRevisitedSmallCaves(t *testing.T) {
	type args struct {
		path Path
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"valid path", args{[]string{"start", "A", "b", "A", "c", "A", "end"}}, 0},
		{"invalid path", args{[]string{"start", "A", "b", "A", "b", "A", "end"}}, 1},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := countRevisitedSmallCaves(tt.args.path); got != tt.want {
				t.Errorf("countRevisitedSmallCaves() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_countPathsToEnd(t *testing.T) {
	type args struct {
		paths []Path
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"small example input", args{generatePathsThroughCaveSystem(createCaveConnections(exampleInput1), 0)}, 10},
		{"larger example input", args{generatePathsThroughCaveSystem(createCaveConnections(exampleInput2), 0)}, 19},
		{"even larger example input", args{generatePathsThroughCaveSystem(createCaveConnections(exampleInput3), 0)}, 226},
		{"small example input", args{generatePathsThroughCaveSystem(createCaveConnections(exampleInput1), 1)}, 36},
		{"larger example input", args{generatePathsThroughCaveSystem(createCaveConnections(exampleInput2), 1)}, 103},
		{"even larger example input", args{generatePathsThroughCaveSystem(createCaveConnections(exampleInput3), 1)}, 3509},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := countPathsToEnd(tt.args.paths); got != tt.want {
				t.Errorf("countPathsToEnd() = %v, want %v", got, tt.want)
			}
		})
	}
}
