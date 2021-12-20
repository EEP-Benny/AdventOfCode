package main

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type Image struct {
	pixels        [][]string
	outsidePixels string
}

func main() {
	input := utils.LoadInput(2021, 20)
	mapping, inputImage := parseInput(input)
	imageAfterTwoSteps := enhancementSteps(inputImage, mapping, 2)
	fmt.Println("Solution 1:", countLitPixels(imageAfterTwoSteps))
	imageAfterFiftySteps := enhancementSteps(inputImage, mapping, 50)
	fmt.Println("Solution 2:", countLitPixels(imageAfterFiftySteps))
}

func parseInput(input string) (mapping []string, image Image) {
	splitInput := strings.Split(input, "\n\n")
	mapping = strings.Split(splitInput[0], "")

	for _, line := range strings.Split(splitInput[1], "\n") {
		image.pixels = append(image.pixels, strings.Split(line, ""))
	}
	image.outsidePixels = "."
	return mapping, image
}

func getPixelAt(image Image, y, x int) string {
	if y < 0 || y >= len(image.pixels) || x < 0 || x >= len(image.pixels[y]) {
		return image.outsidePixels
	}
	return image.pixels[y][x]
}
func getSurroundingPixels(image Image, y, x int) [9]string {
	return [9]string{
		getPixelAt(image, y-1, x-1),
		getPixelAt(image, y-1, x),
		getPixelAt(image, y-1, x+1),
		getPixelAt(image, y, x-1),
		getPixelAt(image, y, x),
		getPixelAt(image, y, x+1),
		getPixelAt(image, y+1, x-1),
		getPixelAt(image, y+1, x),
		getPixelAt(image, y+1, x+1),
	}
}
func pixelsToNumber(pixels [9]string) int {
	pixelsString := strings.Join(pixels[:], "")
	binaryString := strings.ReplaceAll(strings.ReplaceAll(pixelsString, "#", "1"), ".", "0")
	number, _ := strconv.ParseInt(binaryString, 2, 64)
	return int(number)
}

func enhancementStep(inputImage Image, mapping []string) (outputImage Image) {
	ySize := len(inputImage.pixels)
	xSize := len(inputImage.pixels[0])
	outputImage.pixels = make([][]string, ySize+2)
	for y := 0; y < ySize+2; y++ {
		outputImage.pixels[y] = make([]string, xSize+2)
		for x := 0; x < xSize+2; x++ {
			surroundingPixels := getSurroundingPixels(inputImage, y-1, x-1)
			number := pixelsToNumber(surroundingPixels)
			outputImage.pixels[y][x] = mapping[number]
		}
	}
	outputImage.outsidePixels = mapping[pixelsToNumber(getSurroundingPixels(inputImage, -10, -10))]
	return outputImage
}

func enhancementSteps(image Image, mapping []string, stepCount int) Image {
	for i := 0; i < stepCount; i++ {
		image = enhancementStep(image, mapping)
	}
	return image
}

func countLitPixels(image Image) int {
	count := 0
	for y := 0; y < len(image.pixels); y++ {
		for x := 0; x < len(image.pixels[y]); x++ {
			if image.pixels[y][x] == "#" {
				count++
			}
		}
	}
	return count
}
