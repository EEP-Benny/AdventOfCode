package main

import (
	"reflect"
	"testing"
)

var exampleInput = processInput([]string{
	"5483143223",
	"2745854711",
	"5264556173",
	"6141336146",
	"6357385478",
	"4167524645",
	"2176841721",
	"6882881134",
	"4846848554",
	"5283751526",
})
var exampleInputAfterStep1 = processInput([]string{
	"6594254334",
	"3856965822",
	"6375667284",
	"7252447257",
	"7468496589",
	"5278635756",
	"3287952832",
	"7993992245",
	"5957959665",
	"6394862637",
})
var exampleInputAfterStep2 = processInput([]string{
	"8807476555",
	"5089087054",
	"8597889608",
	"8485769600",
	"8700908800",
	"6600088989",
	"6800005943",
	"0000007456",
	"9000000876",
	"8700006848",
})
var exampleInputAfterStep3 = processInput([]string{
	"0050900866",
	"8500800575",
	"9900000039",
	"9700000041",
	"9935080063",
	"7712300000",
	"7911250009",
	"2211130000",
	"0421125000",
	"0021119000",
})
var exampleInputAfterStep100 = processInput([]string{
	"0397666866",
	"0749766918",
	"0053976933",
	"0004297822",
	"0004229892",
	"0053222877",
	"0532222966",
	"9322228966",
	"7922286866",
	"6789998766",
})

func Test_simulateStep(t *testing.T) {
	type args struct {
		energyLevels EnergyLevels
	}
	tests := []struct {
		name  string
		args  args
		want  EnergyLevels
		want1 int
	}{
		{"exampleInput step 1", args{exampleInput}, exampleInputAfterStep1, 0},
		{"exampleInput step 2", args{exampleInputAfterStep1}, exampleInputAfterStep2, 35},
		{"exampleInput step 3", args{exampleInputAfterStep2}, exampleInputAfterStep3, 45},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, got1 := simulateStep(tt.args.energyLevels)
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("simulateStep() got = %v, want %v", got, tt.want)
			}
			if got1 != tt.want1 {
				t.Errorf("simulateStep() got1 = %v, want %v", got1, tt.want1)
			}
		})
	}
}

func Test_simulateSteps(t *testing.T) {
	type args struct {
		energyLevels EnergyLevels
		stepCount    int
	}
	tests := []struct {
		name  string
		args  args
		want  EnergyLevels
		want1 int
	}{
		{"exampleInput for 100 steps", args{exampleInput, 100}, exampleInputAfterStep100, 1656},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, got1 := simulateSteps(tt.args.energyLevels, tt.args.stepCount)
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("simulateSteps() got = %v, want %v", got, tt.want)
			}
			if got1 != tt.want1 {
				t.Errorf("simulateSteps() got1 = %v, want %v", got1, tt.want1)
			}
		})
	}
}
