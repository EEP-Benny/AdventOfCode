# frozen_string_literal: true

def get_input(day, year = 2025)
  filename = format(File.join(File.dirname(__FILE__), '..', '%04d', '%02d.input.txt'), year, day)
  File.read(filename)
end
