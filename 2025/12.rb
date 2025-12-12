#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative 'utils'

module Day12
  module_function

  def real_input
    Utils.get_input(12, 2025)
  end

  class Shape
    attr_reader :size

    def initialize(shape_string)
      # original_shape = shape_string.lines.map { |line| line.split.map { |char| char == '#' } }
      @size = shape_string.count('#')
    end
  end

  Region = Struct.new(:width, :height, :shape_counts)

  Input = Struct.new(:shapes, :regions)

  def prepare_input(input)
    *shape_strings, regions_string = input.split("\n\n")
    shapes = shape_strings.map do |shape_string|
      Shape.new(shape_string.lines[1..].join)
    end
    regions = regions_string.lines.map do |region_string|
      match = /(?<width>\d+)x(?<height>\d+): (?<counts>.*)/.match(region_string)
      width = match[:width].to_i
      height = match[:height].to_i
      counts = match[:counts].split(' ').map(&:to_i)
      Region.new(width, height, counts)
    end
    Input.new(shapes, regions)
  end

  def part1(input)
    result = input.regions.map do |region|
      region_size = region.width * region.height
      shape_count = region.shape_counts.sum
      size_of_all_shapes = region.shape_counts.each_with_index.map do |count, index|
        input.shapes[index].size * count
      end.sum
      fits_for_sure = region.width / 3 * region.height / 3 >= shape_count
      cannot_fit = size_of_all_shapes > region_size
      result_string = if fits_for_sure
                        'Fits for sure'
                      else
                        cannot_fit ? "Can't fit" : 'Maybe'
                      end
      # puts "#{region.width}x#{region.height} = #{region_size}. #{shape_count} presents need at least #{size_of_all_shapes} => #{result_string}"
      result_string
    end.tally
    # puts result
    result['Fits for sure']
  end

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
