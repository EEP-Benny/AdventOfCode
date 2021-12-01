package main

import (
	"testing"
)

var exampleInput = []int{
	199,
	200,
	208,
	210,
	200,
	207,
	240,
	269,
	260,
	263,
}

func Test_countDepthIncreases(t *testing.T) {
	type args struct {
		depthReadings []int
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"exampleInput", args{exampleInput}, 7},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := countDepthIncreases(tt.args.depthReadings); got != tt.want {
				t.Errorf("countDepthIncreases() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_countSmoothedDepthIncreases(t *testing.T) {
	type args struct {
		depthReadings []int
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"exampleInput", args{exampleInput}, 5},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := countSmoothedDepthIncreases(tt.args.depthReadings); got != tt.want {
				t.Errorf("countSmoothedDepthIncreases() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_sumOfThree(t *testing.T) {
	type args struct {
		numbers []int
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"A", args{[]int{199, 200, 208}}, 607},
		{"B", args{exampleInput[1:]}, 618},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := sumOfThree(tt.args.numbers); got != tt.want {
				t.Errorf("sumOfThree() = %v, want %v", got, tt.want)
			}
		})
	}
}
