package main

import (
	"os"

	"github.com/EEP-Benny/AdventOfCode/utils"
	svg "github.com/ajstarks/svgo"
)

func main() {
	f, err := os.OpenFile("./2021/01/viz/viz.svg", os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0755)
	if err != nil {
		panic(err)
	}
	defer f.Close()

	input := utils.LoadInputSliceInt(2021, 1, "\n")

	width := xScale(len(input))
	height := yScale(max(input) + 500)
	skyHeight := 4000
	x := []int{width, width, 0, 0}
	y := []int{yScale(input[len(input)-1]), height, height, yScale(input[0])}

	for i, depth := range input {
		x = append(x, xScale(i))
		y = append(y, yScale(depth))
	}

	canvas := svg.New(f)
	canvas.Startview(500, 500, 0, -skyHeight, width, height+skyHeight)
	canvas.Rect(0, -skyHeight, width, skyHeight, "fill: LightSkyBlue")
	canvas.Rect(0, 0, width, height, "fill: Navy")
	canvas.Polyline(x, y, "fill: DarkSlateGray")
	canvas.End()
}

func xScale(x int) int {
	return x * 10
}
func yScale(y int) int {
	return y
}

func max(array []int) int {
	var max int = array[0]
	for _, value := range array {
		if max < value {
			max = value
		}
	}
	return max
}
