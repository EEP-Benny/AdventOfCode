#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative 'utils'

# :nodoc:
module Day01
  def prepare_input(input)
    input.lines.map do |line|
      case line
      when /R(\d+)/
        ::Regexp.last_match(1).to_i
      when /L(\d+)/
        -::Regexp.last_match(1).to_i
      end
    end
  end

  def part1(input)
    pos = 50
    zero_count = 0
    input.each do |number|
      pos = (pos + number) % 100
      zero_count += 1 if pos.zero?
    end
    zero_count
  end

  def part2(input)
    pos = 50
    zero_count = 0
    input.each do |number|
      (1..number.abs).each do
        step = number.negative? ? -1 : +1
        pos = (pos + step) % 100
        zero_count += 1 if pos.zero?
      end
    end
    zero_count
  end
end

if __FILE__ == $PROGRAM_NAME
  input = Day01.prepare_input(get_input(1, 2025))
  puts part1(input)
  puts part2(input)
end
