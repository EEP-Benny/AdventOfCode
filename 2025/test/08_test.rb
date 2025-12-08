# frozen_string_literal: true

require 'minitest/autorun'
require_relative '../08'

class TestDay08 < Minitest::Test
  include Day08

  def initialize(...)
    super(...)
    @example_input = <<~INPUT
      162,817,812
      57,618,57
      906,360,560
      592,479,940
      352,342,300
      466,668,158
      542,29,236
      431,825,988
      739,650,466
      52,470,668
      216,146,977
      819,987,18
      117,168,530
      805,96,715
      346,949,466
      970,615,88
      941,993,340
      862,61,35
      984,92,344
      425,690,689
    INPUT
  end

  def test_prepare_input
    assert_equal(
      [
        Position.new(162, 817, 812),
        Position.new(57, 618, 57),
        Position.new(906, 360, 560),
        Position.new(592, 479, 940),
        Position.new(352, 342, 300),
        Position.new(466, 668, 158),
        Position.new(542, 29, 236),
        Position.new(431, 825, 988),
        Position.new(739, 650, 466),
        Position.new(52, 470, 668),
        Position.new(216, 146, 977),
        Position.new(819, 987, 18),
        Position.new(117, 168, 530),
        Position.new(805, 96, 715),
        Position.new(346, 949, 466),
        Position.new(970, 615, 88),
        Position.new(941, 993, 340),
        Position.new(862, 61, 35),
        Position.new(984, 92, 344),
        Position.new(425, 690, 689)
      ],
      prepare_input(@example_input)
    )
  end

  def test_get_shortest_connections
    input = prepare_input(@example_input)
    shortest_connections = get_shortest_connections(input)
    assert_equal([Position.new(162, 817, 812), Position.new(425, 690, 689)], shortest_connections[0])
    assert_equal([Position.new(162, 817, 812), Position.new(431, 825, 988)], shortest_connections[1])
    assert_equal([Position.new(906, 360, 560), Position.new(805, 96, 715)], shortest_connections[2])
    assert_equal([Position.new(431, 825, 988), Position.new(425, 690, 689)], shortest_connections[3])
  end

  def test_circuit_sizes
    input = prepare_input(@example_input)
    shortest_connections = get_shortest_connections(input)
    assert_equal([2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 Graph.new(input, shortest_connections[...1]).circuit_sizes)
    assert_equal([3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 Graph.new(input, shortest_connections[...2]).circuit_sizes)
    assert_equal([3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 Graph.new(input, shortest_connections[...3]).circuit_sizes)
    assert_equal([3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 Graph.new(input, shortest_connections[...4]).circuit_sizes)
    assert_equal([5, 4, 2, 2, 1, 1, 1, 1, 1, 1, 1],
                 Graph.new(input, shortest_connections[...10]).circuit_sizes)
  end

  def test_example_input
    input = prepare_input(@example_input)
    assert_equal(40, part1(input))
  end

  def test_real_input
    input = prepare_input(real_input)
    assert_equal(83_520, part1(input))
  end
end
