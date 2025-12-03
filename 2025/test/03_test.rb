# frozen_string_literal: true

require 'minitest/autorun'
require_relative '../03'

class TestDay03 < Minitest::Test
  include Day03

  def initialize(...)
    super(...)
    @example_input = <<~INPUT
      987654321111111
      811111111111119
      234234234234278
      818181911112111
    INPUT
  end

  def test_prepare_input
    assert_equal(
      [
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1],
        [8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
        [2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 7, 8],
        [8, 1, 8, 1, 8, 1, 9, 1, 1, 1, 1, 2, 1, 1, 1]
      ],
      prepare_input(@example_input)
    )
  end

  def test_get_bank_joltage
    assert_equal(98, get_bank_joltage([9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1]))
    assert_equal(89, get_bank_joltage([8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9]))
    assert_equal(78, get_bank_joltage([2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 7, 8]))
    assert_equal(92, get_bank_joltage([8, 1, 8, 1, 8, 1, 9, 1, 1, 1, 1, 2, 1, 1, 1]))
  end

  def test_example_input
    input = prepare_input(@example_input)
    assert_equal(357, part1(input))
  end

  def test_real_input
    input = prepare_input(real_input)
    assert_equal(17_142, part1(input))
  end
end
