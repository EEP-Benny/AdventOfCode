# frozen_string_literal: true

require 'benchmark'

module Utils
  module_function

  def get_input(day, year = 2025)
    filename = format(File.join(File.dirname(__FILE__), '..', '%04d', '%02d.input.txt'), year, day)
    File.read(filename)
  end

  # Run the common part1/part2 benchmark for a Day module.
  # Expects the module to respond to :real_input, :prepare_input, :part1 and :part2.
  def run_benchmark_for(mod)
    input = mod.prepare_input(mod.real_input)
    Benchmark.bm(4) do |bm|
      solution1 = nil
      bm.report('part1') do
        solution1 = mod.part1(input)
      end
      puts "Solution for part1: #{solution1}"

      if mod.respond_to?(:part2)
        solution2 = nil
        bm.report('part2') do
          solution2 = mod.part2(input)
        end
        puts "Solution for part2: #{solution2}"
      end

      puts
    end
  end
end
