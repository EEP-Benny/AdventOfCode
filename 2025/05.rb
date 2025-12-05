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

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
