# frozen_string_literal: true

require 'minitest/autorun'
require_relative '../04'

class TestDay04 < Minitest::Test
  include Day04

  def initialize(...)
    super(...)
    @example_input = <<~INPUT
      ..@@.@@@@.
      @@@.@.@.@@
      @@@@@.@.@@
      @.@@@@..@.
      @@.@@@@.@@
      .@@@@@@@.@
      .@.@.@.@@@
      @.@@@.@@@@
      .@@@@@@@@.
      @.@.@@@.@.
    INPUT
  end

  def test_prepare_input
    assert_equal(
      Grid.new(
        [
          %w[. . @ @ . @ @ @ @ .],
          %w[@ @ @ . @ . @ . @ @],
          %w[@ @ @ @ @ . @ . @ @],
          %w[@ . @ @ @ @ . . @ .],
          %w[@ @ . @ @ @ @ . @ @],
          %w[. @ @ @ @ @ @ @ . @],
          %w[. @ . @ . @ . @ @ @],
          %w[@ . @ @ @ . @ @ @ @],
          %w[. @ @ @ @ @ @ @ @ .],
          %w[@ . @ . @ @ @ . @ .]
        ]
      ),
      prepare_input(@example_input)
    )
  end

  def test_roll_of_paper_at_position?
    input = prepare_input(@example_input)
    assert_equal(false, input.roll_of_paper_at_position?(0, 0))
    assert_equal(false, input.roll_of_paper_at_position?(1, 0))
    assert_equal(true, input.roll_of_paper_at_position?(2, 0))
    assert_equal(true, input.roll_of_paper_at_position?(0, 1))
    # out-of-bounds
    assert_equal(false, input.roll_of_paper_at_position?(0, -1))
    assert_equal(false, input.roll_of_paper_at_position?(-1, 0))
    assert_equal(false, input.roll_of_paper_at_position?(10, 1))
  end

  def test_count_rolls_of_paper_around_position
    input = prepare_input(@example_input)
    assert_equal(2, input.count_rolls_of_paper_around_position(0, 0))
    assert_equal(3, input.count_rolls_of_paper_around_position(2, 0))
    assert_equal(6, input.count_rolls_of_paper_around_position(1, 1))
  end

  def test_example_input
    input = prepare_input(@example_input)
    assert_equal(13, part1(input))
  end

  def test_real_input
    input = prepare_input(real_input)
    assert_equal(1457, part1(input))
  end
end
