# frozen_string_literal: true

require 'minitest/autorun'
require_relative '../05'

class TestDay05 < Minitest::Test
  include Day05

  def initialize(...)
    super(...)
    @example_input = <<~INPUT
      3-5
      10-14
      16-20
      12-18

      1
      5
      8
      11
      17
      32
    INPUT
  end

  def test_prepare_input
    assert_equal(
      Database.new(
        [
          3..5,
          10..14,
          16..20,
          12..18
        ],
        [
          1,
          5,
          8,
          11,
          17,
          32
        ]
      ),
      prepare_input(@example_input)
    )
  end

  def test_fresh_id?
    input = prepare_input(@example_input)
    assert_equal(false, input.fresh_id?(1))
    assert_equal(true, input.fresh_id?(5))
    assert_equal(false, input.fresh_id?(8))
    assert_equal(true, input.fresh_id?(11))
    assert_equal(true, input.fresh_id?(17))
    assert_equal(false, input.fresh_id?(32))
  end

  def test_example_input
    input = prepare_input(@example_input)
    assert_equal(3, part1(input))
  end

  def test_real_input
    input = prepare_input(real_input)
    assert_equal(775, part1(input))
  end
end
