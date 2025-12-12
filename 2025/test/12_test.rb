# frozen_string_literal: true

require 'minitest/autorun'
require_relative '../12'

class TestDay12 < Minitest::Test
  include Day12

  def test_real_input
    input = prepare_input(real_input)
    assert_equal(414, part1(input))
  end
end
