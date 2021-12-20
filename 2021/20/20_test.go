package main

import (
	"reflect"
	"strings"
	"testing"
)

var exampleInput = strings.TrimSpace(`
..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###
`)
var exampleMapping, exampleInputImage = parseInput(exampleInput)

func Test_parseInput(t *testing.T) {
	type args struct {
		input string
	}
	tests := []struct {
		name              string
		args              args
		wantMappingLength int
		wantImage         Image
	}{
		{"exampleInput", args{exampleInput}, 512, Image{
			outsidePixels: ".",
			pixels: [][]string{
				{"#", ".", ".", "#", "."},
				{"#", ".", ".", ".", "."},
				{"#", "#", ".", ".", "#"},
				{".", ".", "#", ".", "."},
				{".", ".", "#", "#", "#"},
			},
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotMapping, gotImage := parseInput(tt.args.input)
			if len(gotMapping) != tt.wantMappingLength {
				t.Errorf("parseInput() gotMapping = %v, want string with length %v", gotMapping, tt.wantMappingLength)
			}
			if !reflect.DeepEqual(gotImage, tt.wantImage) {
				t.Errorf("parseInput() gotImage = %v, want %v", gotImage, tt.wantImage)
			}
		})
	}
}

func Test_getSurroundingPixels(t *testing.T) {
	type args struct {
		image Image
		y     int
		x     int
	}
	tests := []struct {
		name string
		args args
		want [9]string
	}{
		{"center pixel from example", args{exampleInputImage, 2, 2}, [9]string{".", ".", ".", "#", ".", ".", ".", "#", "."}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := getSurroundingPixels(tt.args.image, tt.args.y, tt.args.x); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("getSurroundingPixels() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_pixelsToNumber(t *testing.T) {
	type args struct {
		pixels [9]string
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"center pixel from example", args{[9]string{".", ".", ".", "#", ".", ".", ".", "#", "."}}, 34},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := pixelsToNumber(tt.args.pixels); got != tt.want {
				t.Errorf("pixelsToNumber() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_enhancementStep(t *testing.T) {
	type args struct {
		inputImage Image
		mapping    []string
	}
	tests := []struct {
		name string
		args args
		want Image
	}{
		{"exampleInput first step", args{exampleInputImage, exampleMapping}, Image{
			outsidePixels: ".",
			pixels: [][]string{
				{".", "#", "#", ".", "#", "#", "."},
				{"#", ".", ".", "#", ".", "#", "."},
				{"#", "#", ".", "#", ".", ".", "#"},
				{"#", "#", "#", "#", ".", ".", "#"},
				{".", "#", ".", ".", "#", "#", "."},
				{".", ".", "#", "#", ".", ".", "#"},
				{".", ".", ".", "#", ".", "#", "."},
			},
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := enhancementStep(tt.args.inputImage, tt.args.mapping); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("enhancementStep() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_enhancementSteps(t *testing.T) {
	type args struct {
		image     Image
		mapping   []string
		stepCount int
	}
	tests := []struct {
		name string
		args args
		want Image
	}{
		{"exampleInput two step", args{exampleInputImage, exampleMapping, 2}, Image{
			outsidePixels: ".",
			pixels: [][]string{
				{".", ".", ".", ".", ".", ".", ".", "#", "."},
				{".", "#", ".", ".", "#", ".", "#", ".", "."},
				{"#", ".", "#", ".", ".", ".", "#", "#", "#"},
				{"#", ".", ".", ".", "#", "#", ".", "#", "."},
				{"#", ".", ".", ".", ".", ".", "#", ".", "#"},
				{".", "#", ".", "#", "#", "#", "#", "#", "."},
				{".", ".", "#", ".", "#", "#", "#", "#", "#"},
				{".", ".", ".", "#", "#", ".", "#", "#", "."},
				{".", ".", ".", ".", "#", "#", "#", ".", "."},
			},
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := enhancementSteps(tt.args.image, tt.args.mapping, tt.args.stepCount); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("enhancementSteps() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_countLitPixels(t *testing.T) {
	type args struct {
		image Image
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"exampleInput after two step", args{enhancementSteps(exampleInputImage, exampleMapping, 2)}, 35},
		{"exampleInput after 50 step", args{enhancementSteps(exampleInputImage, exampleMapping, 50)}, 3351},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := countLitPixels(tt.args.image); got != tt.want {
				t.Errorf("countLitPixels() = %v, want %v", got, tt.want)
			}
		})
	}
}
