# frozen_string_literal: true

require 'minitest/autorun'
require_relative '../10'

class TestDay10 < Minitest::Test
  include Day10

  def initialize(...)
    super(...)
    @example_input = <<~INPUT
      [.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
      [...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
      [.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}
    INPUT
  end

  def test_prepare_input
    assert_equal(
      [
        Machine.new(
          [false, true, true, false],
          [[3], [1, 3], [2], [2, 3], [0, 2], [0, 1]],
          [3, 5, 4, 7]
        ),
        Machine.new(
          [false, false, false, true, false],
          [[0, 2, 3, 4], [2, 3], [0, 4], [0, 1, 2], [1, 2, 3, 4]],
          [7, 5, 12, 7, 2]
        ),
        Machine.new(
          [false, true, true, true, false, true],
          [[0, 1, 2, 3, 4], [0, 3, 4], [0, 1, 2, 4, 5], [1, 2]],
          [10, 11, 11, 5, 10, 5]
        )
      ],
      prepare_input(@example_input)
    )
  end

  def test_fewest_presses_partial
    assert_equal(0, fewest_presses_partial([[0]], [0, 0, 0])) # everything 0
    assert_equal(10, fewest_presses_partial([[0]], [10, 0, 0])) # just this one button
    assert_equal(nil, fewest_presses_partial([[0]], [0, 1])) # not possible
  end

  def test_fewest_joltage_button_presses
    machines = prepare_input(@example_input)
    assert_equal(10, machines[0].fewest_joltage_button_presses)
    assert_equal(12, machines[1].fewest_joltage_button_presses)
    assert_equal(11, machines[2].fewest_joltage_button_presses)
  end

  def test_example_input
    input = prepare_input(@example_input)
    assert_equal(7, part1(input))
    assert_equal(33, part2(input))
  end

  def test_real_input
    input = prepare_input(real_input)
    assert_equal(494, part1(input))
    assert_equal(494, part2(input))
  end
end
