# frozen_string_literal: true

require 'minitest/autorun'
require_relative '../06'

class TestDay06 < Minitest::Test
  include Day06

  def initialize(...)
    super(...)
    @example_input = <<~INPUT
      123 328  51 64
       45 64  387 23
        6 98  215 314
      *   +   *   +
    INPUT
  end

  def test_prepare_input
    assert_equal(
      [
        [123, 328, 51, 64],
        [45, 64, 387, 23],
        [6, 98,  215, 314],
        %i[* + * +]
      ], prepare_input(@example_input)
    )
  end

  def test_solve_worksheet
    input = prepare_input(@example_input)
    assert_equal(
      [
        33_210,
        490,
        4_243_455,
        401
      ], solve_worksheet(input)
    )
  end

  def test_example_input
    input = prepare_input(@example_input)
    assert_equal(4_277_556, part1(input))
  end

  def test_real_input
    input = prepare_input(real_input)
    assert_equal(6_635_273_135_233, part1(input))
  end
end
