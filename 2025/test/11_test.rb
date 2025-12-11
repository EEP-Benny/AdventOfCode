# frozen_string_literal: true

require 'minitest/autorun'
require_relative '../11'

class TestDay11 < Minitest::Test
  include Day11

  def initialize(...)
    super(...)
    @example_input = <<~INPUT
      aaa: you hhh
      you: bbb ccc
      bbb: ddd eee
      ccc: ddd eee fff
      ddd: ggg
      eee: out
      fff: out
      ggg: out
      hhh: ccc fff iii
      iii: out
    INPUT

    @example_input2 = <<~INPUT
      svr: aaa bbb
      aaa: fft
      fft: ccc
      bbb: tty
      tty: ccc
      ccc: ddd eee
      ddd: hub
      hub: fff
      eee: dac
      dac: fff
      fff: ggg hhh
      ggg: out
      hhh: out
    INPUT
  end

  def test_prepare_input
    assert_equal(
      Graph.new(
        {
          'aaa' => %w[you hhh],
          'you' => %w[bbb ccc],
          'bbb' => %w[ddd eee],
          'ccc' => %w[ddd eee fff],
          'ddd' => %w[ggg],
          'eee' => %w[out],
          'fff' => %w[out],
          'ggg' => %w[out],
          'hhh' => %w[ccc fff iii],
          'iii' => %w[out]
        }
      ),
      prepare_input(@example_input)
    )
  end

  def test_example_input
    input = prepare_input(@example_input)
    input2 = prepare_input(@example_input2)
    assert_equal(5, part1(input))
    assert_equal(2, part2(input2))
  end

  def test_real_input
    input = prepare_input(real_input)
    assert_equal(649, part1(input))
    assert_equal(458_948_453_421_420, part2(input))
  end
end
