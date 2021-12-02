package main

import (
	"testing"
)

var exampleInput = []string{
	"forward 5",
	"down 5",
	"forward 8",
	"up 3",
	"down 8",
	"forward 2",
}

func Test_splitInstruction(t *testing.T) {
	type args struct {
		instruction string
	}
	tests := []struct {
		name  string
		args  args
		want  string
		want1 int
	}{
		{exampleInput[0], args{exampleInput[0]}, "forward", 5},
		{exampleInput[1], args{exampleInput[1]}, "down", 5},
		{exampleInput[2], args{exampleInput[2]}, "forward", 8},
		{exampleInput[3], args{exampleInput[3]}, "up", 3},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, got1 := splitInstruction(tt.args.instruction)
			if got != tt.want {
				t.Errorf("splitInstruction() got = %v, want %v", got, tt.want)
			}
			if got1 != tt.want1 {
				t.Errorf("splitInstruction() got1 = %v, want %v", got1, tt.want1)
			}
		})
	}
}

func Test_translateInstruction(t *testing.T) {
	type args struct {
		instruction string
	}
	tests := []struct {
		name                   string
		args                   args
		wantHorizontalPosition int
		wantDepth              int
	}{
		{exampleInput[0], args{exampleInput[0]}, 5, 0},
		{exampleInput[1], args{exampleInput[1]}, 0, 5},
		{exampleInput[2], args{exampleInput[2]}, 8, 0},
		{exampleInput[3], args{exampleInput[3]}, 0, -3},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotHorizontalPosition, gotDepth := translateInstruction(tt.args.instruction)
			if gotHorizontalPosition != tt.wantHorizontalPosition {
				t.Errorf("translateInstruction() gotHorizontalPosition = %v, want %v", gotHorizontalPosition, tt.wantHorizontalPosition)
			}
			if gotDepth != tt.wantDepth {
				t.Errorf("translateInstruction() gotDepth = %v, want %v", gotDepth, tt.wantDepth)
			}
		})
	}
}

func Test_processInstructions(t *testing.T) {
	type args struct {
		instructions []string
	}
	tests := []struct {
		name                        string
		args                        args
		wantFinalHorizontalPosition int
		wantFinalDepth              int
	}{
		{"exampleInput", args{exampleInput}, 15, 10},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotFinalHorizontalPosition, gotFinalDepth := processInstructions(tt.args.instructions)
			if gotFinalHorizontalPosition != tt.wantFinalHorizontalPosition {
				t.Errorf("processInstructions() gotFinalHorizontalPosition = %v, want %v", gotFinalHorizontalPosition, tt.wantFinalHorizontalPosition)
			}
			if gotFinalDepth != tt.wantFinalDepth {
				t.Errorf("processInstructions() gotFinalDepth = %v, want %v", gotFinalDepth, tt.wantFinalDepth)
			}
		})
	}
}

func Test_processInstructionsWithAim(t *testing.T) {
	type args struct {
		instructions []string
	}
	tests := []struct {
		name                        string
		args                        args
		wantFinalHorizontalPosition int
		wantFinalDepth              int
	}{
		{"exampleInput", args{exampleInput}, 15, 60},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotFinalHorizontalPosition, gotFinalDepth := processInstructionsWithAim(tt.args.instructions)
			if gotFinalHorizontalPosition != tt.wantFinalHorizontalPosition {
				t.Errorf("processInstructionsWithAim() gotFinalHorizontalPosition = %v, want %v", gotFinalHorizontalPosition, tt.wantFinalHorizontalPosition)
			}
			if gotFinalDepth != tt.wantFinalDepth {
				t.Errorf("processInstructionsWithAim() gotFinalDepth = %v, want %v", gotFinalDepth, tt.wantFinalDepth)
			}
		})
	}
}
