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

func Test_pathDoesVisitSmallCavesAtMostOnce(t *testing.T) {
	type args struct {
		caves []string
	}
	tests := []struct {
		name string
		args args
		want bool
	}{
		{"valid path", args{[]string{"start", "A", "b", "A", "c", "A", "end"}}, true},
		{"invalid path", args{[]string{"start", "A", "b", "A", "b", "A", "end"}}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := pathDoesVisitSmallCavesAtMostOnce(tt.args.caves); got != tt.want {
				t.Errorf("pathDoesVisitSmallCavesAtMostOnce() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_countPathsToEnd(t *testing.T) {
	type args struct {
		caveSystem CaveConnections
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"small example input", args{createCaveConnections(exampleInput1)}, 10},
		{"larger example input", args{createCaveConnections(exampleInput2)}, 19},
		{"even larger example input", args{createCaveConnections(exampleInput3)}, 226},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := countPathsToEnd(tt.args.caveSystem); got != tt.want {
				t.Errorf("countPathsToEnd() = %v, want %v", got, tt.want)
			}
		})
	}
}
