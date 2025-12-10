#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative 'utils'

module Day10
  module_function

  def real_input
    Utils.get_input(10, 2025)
  end

  Machine = Struct.new(:lights, :buttons, :joltages) do
    def fewest_button_presses
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
    input.map(&:fewest_button_presses).sum
  end

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
