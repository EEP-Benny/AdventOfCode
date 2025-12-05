#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative 'utils'

module Day05
  module_function

  def real_input
    Utils.get_input(5, 2025)
  end

  Database = Struct.new(:fresh_id_ranges, :ids) do
    def fresh_id?(id)
      fresh_id_ranges.any? { |range| range.include? id }
    end

    def merge_fresh_id_ranges
      sorted_ranges = fresh_id_ranges.sort_by(&:first)
      merged_ranges = []
      sorted_ranges.each do |range|
        last_range = merged_ranges[-1]
        if last_range&.include? range.first
          merged_last = [last_range.last, range.last].max
          merged_ranges[-1] = last_range.first..merged_last
        else
          merged_ranges.append(range)
        end
      end
      merged_ranges
    end
  end

  def prepare_input(input)
    ranges_string, id_string = input.split("\n\n")
    Database.new(
      ranges_string.lines(chomp: true).map do |line|
        first_id, last_id = line.split('-')
        first_id.to_i..last_id.to_i
      end,
      id_string.lines(chomp: true).map(&:to_i)
    )
  end

  def part1(input)
    input.ids.count { |id| input.fresh_id?(id) }
  end

  def part2(input)
    input.merge_fresh_id_ranges.map(&:size).sum
  end

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
