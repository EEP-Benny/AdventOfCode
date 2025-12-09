# frozen_string_literal: true

require 'minitest/autorun'
require_relative '../09'

class TestDay09 < Minitest::Test
  include Day09

  def initialize(...)
    super(...)
    @example_input = <<~INPUT
      7,1
      11,1
      11,7
      9,7
      9,5
      2,5
      2,3
      7,3
    INPUT
  end

  def test_prepare_input
    assert_equal(
      [
        Position.new(7, 1),
        Position.new(11, 1),
        Position.new(11, 7),
        Position.new(9, 7),
        Position.new(9, 5),
        Position.new(2, 5),
        Position.new(2, 3),
        Position.new(7, 3)
      ],
      prepare_input(@example_input)
    )
  end

  def test_rectangle_area
    assert_equal(24, rectangle_area(Position.new(2, 5), Position.new(9, 7)))
    assert_equal(35, rectangle_area(Position.new(7, 1), Position.new(11, 7)))
    assert_equal(6, rectangle_area(Position.new(7, 3), Position.new(2, 3)))
    assert_equal(50, rectangle_area(Position.new(2, 5), Position.new(11, 1)))
  end

  def test_valid_rectangle?
    all_positions = prepare_input(@example_input)
    assert_equal(false, valid_rectangle?(Position.new(2, 5), Position.new(11, 1), all_positions))
    assert_equal(false, valid_rectangle?(Position.new(7, 1), Position.new(2, 5), all_positions))
    assert_equal(false, valid_rectangle?(Position.new(11, 1), Position.new(2, 3), all_positions))
    assert_equal(true, valid_rectangle?(Position.new(7, 3), Position.new(11, 1), all_positions))
    assert_equal(true, valid_rectangle?(Position.new(9, 7), Position.new(9, 5), all_positions))
    assert_equal(true, valid_rectangle?(Position.new(9, 5), Position.new(2, 3), all_positions))
  end

  def test_example_input
    input = prepare_input(@example_input)
    assert_equal(50, part1(input))
    assert_equal(24, part2(input))
  end

  def test_real_input
    input = prepare_input(real_input)
    assert_equal(4_781_377_701, part1(input))
    assert_equal(1_470_616_992, part2(input))
  end
end
