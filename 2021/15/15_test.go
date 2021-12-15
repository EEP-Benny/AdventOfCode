package main

import "testing"

var exampleInput = processInput([]string{
	"1163751742",
	"1381373672",
	"2136511328",
	"3694931569",
	"7463417111",
	"1319128137",
	"1359912421",
	"3125421639",
	"1293138521",
	"2311944581",
})

func Test_findLowestRisk(t *testing.T) {
	type args struct {
		riskLevels RiskLevels
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"example input", args{exampleInput}, 40},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := findLowestRisk(tt.args.riskLevels); got != tt.want {
				t.Errorf("findLowestRisk() = %v, want %v", got, tt.want)
			}
		})
	}
}
