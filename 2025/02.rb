#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative 'utils'

module Day02
  module_function

  def real_input
    Utils.get_input(2, 2025)
  end

  def prepare_input(input)
    input.split(',').map do |range_string|
      left, right = range_string.split('-')
      (left.to_i..right.to_i)
    end
  end

  def get_invalid_ids(range)
    range.filter do |id|
      id_string = id.to_s
      next if id_string.length.odd?

      split_point = id_string.length.div 2
      left = id_string[...split_point]
      right = id_string[split_point..]

      left == right
    end
  end

  def get_advanced_invalid_ids(range)
    range.filter do |id|
      id_string = id.to_s
      length = id_string.length
      possible_split_lengths = (1..length / 2).select { |n| (length % n).zero? }
      # puts id_string
      # puts possible_split_lengths
      possible_split_lengths.any? do |split_length|
        chunks = (length / split_length).times.map { |i| id_string[i * split_length, split_length] }
        # puts split_length, ':', chunks
        chunks.uniq.length == 1
      end
    end
  end

  def part1(input)
    input.flat_map { |range| get_invalid_ids(range) }.sum
  end

  def part2(input)
    input.flat_map { |range| get_advanced_invalid_ids(range) }.sum
  end

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
