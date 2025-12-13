#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative 'utils'

module Day10
  module_function

  def real_input
    Utils.get_input(10, 2025)
  end

  def fewest_presses_partial(buttons, joltages)
    return 0 if joltages.all?(0)

    button, *remaining_buttons = buttons

    # otherwise one joltage would be too high
    max_presses = joltages.values_at(*button).min

    indices_not_covered_by_remaining_buttons = remaining_buttons.reduce(
      joltages.each_index.to_set
    ) { |set_of_indices, button| set_of_indices - button.to_set }

    # otherwise there is no way to reach the joltage with the remaining buttons
    min_presses = joltages.values_at(*indices_not_covered_by_remaining_buttons).max || 0

    # puts "Trying #{joltages}, #{buttons}, #{min_presses}..#{max_presses}"

    max_presses.downto(min_presses) do |presses|
      remaining_joltages = [*joltages]
      button.each do |index|
        remaining_joltages[index] -= presses
      end
      remaining_presses = fewest_presses_partial(remaining_buttons, remaining_joltages)
      return presses + remaining_presses if remaining_presses
    end

    nil # no valid solution
  end

  Machine = Struct.new(:lights, :buttons, :joltages) do
    def fewest_light_button_presses
      buttons.length.times.each do |number_of_buttons|
        buttons.combination(number_of_buttons).each do |buttons_to_press|
          light_states = Array.new(lights.length) { false } # initially all lights are off
          buttons_to_press.each do |button_to_press|
            button_to_press.each do |light_to_toggle|
              light_states[light_to_toggle] = !light_states[light_to_toggle]
            end
          end

          return number_of_buttons if light_states == lights
        end
      end
    end

    def fewest_joltage_button_presses
      puts "Solving for #{joltages}, #{buttons}"
      sorted_buttons = buttons.sort_by(&:length).reverse
      Day10.fewest_presses_partial(sorted_buttons, joltages)
    end
  end

  def prepare_input(input)
    input.lines.map do |line|
      match = /\[(?<lights>[#.]+)\] \((?<buttons>.*)\) \{(?<joltages>.*)\}/.match(line)
      lights = match[:lights].split('').map { |light| light == '#' }
      buttons = match[:buttons].split(') (').map { |button| button.split(',').map(&:to_i) }
      joltages = match[:joltages].split(',').map(&:to_i)
      Machine.new(lights, buttons, joltages)
    end
  end

  def part1(input)
    input.map(&:fewest_light_button_presses).sum
  end

  def part2(input)
    input.map(&:fewest_joltage_button_presses).sum
  end

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
