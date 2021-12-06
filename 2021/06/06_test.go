package main

import (
	"reflect"
	"testing"
)

func Test_simulateOneDay(t *testing.T) {
	type args struct {
		oldInternalTimers []int
	}
	tests := []struct {
		name string
		args args
		want []int
	}{
		{"simple countdown", args{[]int{3, 4, 3, 1, 2}}, []int{2, 3, 2, 0, 1}},
		{"spawning multiple children", args{[]int{0, 1, 0, 5, 6, 7, 8}}, []int{6, 0, 6, 4, 5, 6, 7, 8, 8}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := simulateOneDay(tt.args.oldInternalTimers); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("simulateOneDay() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_simulateManyDays(t *testing.T) {
	type args struct {
		internalTimers []int
		numDays        int
	}
	tests := []struct {
		name string
		args args
		want []int
	}{
		{"example input after 18 days", args{[]int{3, 4, 3, 1, 2}, 18}, []int{6, 0, 6, 4, 5, 6, 0, 1, 1, 2, 6, 0, 1, 1, 1, 2, 2, 3, 3, 4, 6, 7, 8, 8, 8, 8}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := simulateManyDays(tt.args.internalTimers, tt.args.numDays); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("simulateManyDays() = %v, want %v", got, tt.want)
			}
		})
	}
}
