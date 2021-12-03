package main

import (
	"reflect"
	"testing"
)

var exampleInput = []string{
	"00100",
	"11110",
	"10110",
	"10111",
	"10101",
	"01111",
	"00111",
	"11100",
	"10000",
	"11001",
	"00010",
	"01010",
}

func Test_convertToBitField(t *testing.T) {
	type args struct {
		inputAsString string
	}
	tests := []struct {
		name string
		args args
		want []int
	}{
		{exampleInput[0], args{exampleInput[0]}, []int{0, 0, 1, 0, 0}},
		{exampleInput[1], args{exampleInput[1]}, []int{1, 1, 1, 1, 0}},
		{exampleInput[2], args{exampleInput[2]}, []int{1, 0, 1, 1, 0}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := convertToBitField(tt.args.inputAsString); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("convertToBitField() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_sumBits(t *testing.T) {
	type args struct {
		inputBits [][]int
	}
	tests := []struct {
		name string
		args args
		want []int
	}{
		{"example input", args{convertToBitFields(exampleInput)}, []int{7, 5, 8, 7, 5}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := sumBits(tt.args.inputBits); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("sumBits() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_findMostCommonBits(t *testing.T) {
	type args struct {
		inputBits [][]int
	}
	tests := []struct {
		name string
		args args
		want []int
	}{
		{"example input", args{convertToBitFields(exampleInput)}, []int{1, 0, 1, 1, 0}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := findMostCommonBits(tt.args.inputBits); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("findMostCommonBits() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_findLeastCommonBits(t *testing.T) {
	type args struct {
		inputBits [][]int
	}
	tests := []struct {
		name string
		args args
		want []int
	}{
		{"example input", args{convertToBitFields(exampleInput)}, []int{0, 1, 0, 0, 1}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := findLeastCommonBits(tt.args.inputBits); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("findLeastCommonBits() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_convertBitsToInt(t *testing.T) {
	type args struct {
		inputBits []int
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"10110", args{[]int{1, 0, 1, 1, 0}}, 22},
		{"01001", args{[]int{0, 1, 0, 0, 1}}, 9},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := convertBitsToInt(tt.args.inputBits); got != tt.want {
				t.Errorf("convertBitsToInt() = %v, want %v", got, tt.want)
			}
		})
	}
}
