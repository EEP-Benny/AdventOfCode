# frozen_string_literal: true

require 'minitest/autorun'
require_relative '../07'

class TestDay07 < Minitest::Test
  include Day07

  def initialize(...)
    super(...)
    @example_input = <<~INPUT
      .......S.......
      ...............
      .......^.......
      ...............
      ......^.^......
      ...............
      .....^.^.^.....
      ...............
      ....^.^...^....
      ...............
      ...^.^...^.^...
      ...............
      ..^...^.....^..
      ...............
      .^.^.^.^.^...^.
      ...............
    INPUT
  end

  def test_prepare_input
    assert_equal(
      Manifold.new(
        Position.new(7, 0),
        Set[
          Position.new(7, 2),
          Position.new(6, 4),
          Position.new(8, 4),
          Position.new(5, 6),
          Position.new(7, 6),
          Position.new(9, 6),
          Position.new(4, 8),
          Position.new(6, 8),
          Position.new(10, 8),
          Position.new(3, 10),
          Position.new(5, 10),
          Position.new(9, 10),
          Position.new(11, 10),
          Position.new(2, 12),
          Position.new(6, 12),
          Position.new(12, 12),
          Position.new(1, 14),
          Position.new(3, 14),
          Position.new(5, 14),
          Position.new(7, 14),
          Position.new(9, 14),
          Position.new(13, 14)
        ],
        16
      ),
      prepare_input(@example_input)
    )
  end

  def test_example_input
    input = prepare_input(@example_input)
    assert_equal(21, part1(input))
  end

  def test_real_input
    input = prepare_input(real_input)
    assert_equal(1553, part1(input))
  end
end
