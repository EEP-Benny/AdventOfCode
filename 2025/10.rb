#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative 'utils'

module Day10
  module_function

  def real_input
    Utils.get_input(10, 2025)
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
      @joltage_cache = {}
      @parity_cache = Hash.new { |h, k| h[k] = [] }

      (buttons.length + 1).times.each do |number_of_buttons|
        buttons.combination(number_of_buttons).each do |buttons_to_press|
          joltages = Array.new(lights.length) { 0 } # initially all lights are off
          buttons_to_press.each do |button_to_press|
            button_to_press.each do |joltage_to_increase|
              joltages[joltage_to_increase] += 1
            end
          end
          parity = joltages.map { |j| j % 2 }
          @parity_cache[parity].push([number_of_buttons, joltages])
        end
      end

      def fewest_joltage_button_presses_inner(joltages_to_test)
        cached_value = @joltage_cache[joltages_to_test]
        return cached_value if cached_value

        return 0 if joltages_to_test.all?(&:zero?)

        parity = joltages_to_test.map { |j| j % 2 }
        joltage_button_presses = @parity_cache[parity].map do |number_of_buttons, joltages|
          remaining_joltages = joltages_to_test.zip(joltages).map { |a, b| (a - b) / 2 }

          if remaining_joltages.any?(&:negative?)
            Float::INFINITY
          else
            number_of_buttons + 2 * fewest_joltage_button_presses_inner(remaining_joltages)
          end
        end
        value = joltage_button_presses.min || Float::INFINITY
        @joltage_cache[joltages_to_test] = value
        value
      end

      fewest_joltage_button_presses_inner(joltages)
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
