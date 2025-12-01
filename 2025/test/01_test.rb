# frozen_string_literal: true

require 'minitest/autorun'
require_relative '../01'

# :nodoc:
class TestDay01 < Minitest::Test
  include Day01

  def initialize(...)
    super(...)
    @example_input = <<~INPUT
      L68
      L30
      R48
      L5
      R60
      L55
      L1
      L99
      R14
      L82
    INPUT
  end

  def test_prepare_input
    assert_equal(
      [-68, -30, +48, -5, +60, -55, -1, -99, +14, -82],
      prepare_input(@example_input)
    )
  end

  def test_example_input
    input = prepare_input(@example_input)
    assert_equal(3, part1(input))
  end

  def test_real_input
    input = prepare_input(get_input(1, 2025))
    assert_equal(1180, part1(input))
  end
end
