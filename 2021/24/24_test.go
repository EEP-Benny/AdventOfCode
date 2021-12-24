package main

import (
	"reflect"
	"testing"
)

func TestALUState_executeInstruction(t *testing.T) {
	type args struct {
		instruction Instruction
	}
	tests := []struct {
		name     string
		aluState ALUState
		args     args
		want     ALUState
	}{
		{"inp", makeALUState(1, 2, 3, 4, []int{10}), args{Instruction{"inp", "w", ""}}, makeALUState(10, 2, 3, 4, []int{})},
		{"add register", makeALUState(1, 2, 3, 4, []int{10}), args{Instruction{"add", "w", "x"}}, makeALUState(3, 2, 3, 4, []int{10})},
		{"add number", makeALUState(1, 2, 3, 4, []int{10}), args{Instruction{"add", "w", "10"}}, makeALUState(11, 2, 3, 4, []int{10})},
		{"mul register", makeALUState(1, 2, 3, 4, []int{10}), args{Instruction{"mul", "x", "y"}}, makeALUState(1, 6, 3, 4, []int{10})},
		{"mul number", makeALUState(1, 2, 3, 4, []int{10}), args{Instruction{"mul", "x", "-1"}}, makeALUState(1, -2, 3, 4, []int{10})},
		{"div register", makeALUState(22, 5, 3, 4, []int{10}), args{Instruction{"div", "w", "x"}}, makeALUState(4, 5, 3, 4, []int{10})},
		{"div number", makeALUState(22, 2, 3, 4, []int{10}), args{Instruction{"div", "w", "3"}}, makeALUState(7, 2, 3, 4, []int{10})},
		{"mod register", makeALUState(22, 5, 3, 4, []int{10}), args{Instruction{"mod", "w", "x"}}, makeALUState(2, 5, 3, 4, []int{10})},
		{"mod number", makeALUState(22, 2, 3, 4, []int{10}), args{Instruction{"mod", "w", "3"}}, makeALUState(1, 2, 3, 4, []int{10})},
		{"eql register", makeALUState(1, 2, 3, 4, []int{10}), args{Instruction{"eql", "w", "x"}}, makeALUState(0, 2, 3, 4, []int{10})},
		{"eql number", makeALUState(1, 2, 3, 4, []int{10}), args{Instruction{"eql", "y", "3"}}, makeALUState(1, 2, 1, 4, []int{10})},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.aluState.executeInstruction(tt.args.instruction); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("ALUState.executeInstruction() = %v, want %v", got, tt.want)
			}
		})
	}
}
