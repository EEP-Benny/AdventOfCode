# frozen_string_literal: true

require 'minitest/autorun'
require_relative '../02'

class TestDay02 < Minitest::Test
  include Day02

  def initialize(...)
    super(...)
    @example_input = '11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124'
  end

  def test_prepare_input
    assert_equal(
      [(11..22), (95..115), (998..1012), (1_188_511_880..1_188_511_890), (222_220..222_224), (1_698_522..1_698_528),
       (446_443..446_449), (38_593_856..38_593_862), (565_653..565_659), (824_824_821..824_824_827),
       (2_121_212_118..2_121_212_124)],
      prepare_input(@example_input)
    )
  end

  def test_get_invalid_ids
    assert_equal([11, 22], get_invalid_ids(11..22))
    assert_equal([99], get_invalid_ids(95..115))
    assert_equal([1010], get_invalid_ids(998..1012))
    assert_equal([1_188_511_885], get_invalid_ids(1_188_511_880..1_188_511_890))
    assert_equal([222_222], get_invalid_ids(222_220..222_224))
    assert_equal([], get_invalid_ids(1_698_522..1_698_528))
    assert_equal([446_446], get_invalid_ids(446_443..446_449))
    assert_equal([38_593_859], get_invalid_ids(38_593_856..38_593_862))
  end

  def test_get_advanced_invalid_ids
    assert_equal([11, 22], get_advanced_invalid_ids(11..22))
    assert_equal([99, 111], get_advanced_invalid_ids(95..115))
    assert_equal([999, 1010], get_advanced_invalid_ids(998..1012))
    assert_equal([1_188_511_885], get_advanced_invalid_ids(1_188_511_880..1_188_511_890))
    assert_equal([222_222], get_advanced_invalid_ids(222_220..222_224))
    assert_equal([], get_advanced_invalid_ids(1_698_522..1_698_528))
    assert_equal([446_446], get_advanced_invalid_ids(446_443..446_449))
    assert_equal([38_593_859], get_advanced_invalid_ids(38_593_856..38_593_862))
    assert_equal([565_656], get_advanced_invalid_ids(565_653..565_659))
    assert_equal([824_824_824], get_advanced_invalid_ids(824_824_821..824_824_827))
    assert_equal([2_121_212_121], get_advanced_invalid_ids(2_121_212_118..2_121_212_124))
  end

  def test_example_input
    input = prepare_input(@example_input)
    assert_equal(1_227_775_554, part1(input))
    assert_equal(4_174_379_265, part2(input))
  end

  def test_real_input
    input = prepare_input(real_input)
    assert_equal(16_793_817_782, part1(input))
    assert_equal(27_469_417_404, part2(input))
  end
end
