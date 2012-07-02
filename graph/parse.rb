require 'uri'
require 'pp'
require 'json'
require 'rubygems'
require 'gruff'

def parse(s)
  uri = URI(s)
  JSON.parse(URI.unescape(uri.query))
end

def add_data(g, label, url)
  json = parse(url)
  xs =  json.flat_map do|key, values|
    if key == 'v'
      []
    else
      values.reduce(0,:+) / values.size.to_f
    end
  end
  g.data(label, xs)
end

def labels(s)
  json = parse(s)
  hash = {}
  json.keys.each_with_index do|v, i|
    next if v == 'v'
    next unless i % 3 == 0
    hash[i] = v
  end
  hash
end

def metrics(js, jsx)
  xs = parse(js).flat_map do|key, values|
    if key == 'v'
      []
    else
      values.reduce(0,:+) / values.size.to_f
    end
  end

  ys = parse(jsx).flat_map do|key, values|
    if key == 'v'
      []
    else
      values.reduce(0,:+) / values.size.to_f
    end
  end

  max = 0
  min = 0
  xs.zip(ys).each do|x, y|
    ratio = (y/x-1) * 100
    min = ratio if ratio < min
    max = ratio if ratio > max
  end

  avg = ((ys.reduce(0,:+) / xs.reduce(0,:+)) - 1) * 100

  [min,max,avg]
end

title, js, jsx = *ARGV
g = Gruff::Line.new("800x400")
g.title = title

g.marker_font_size=10
add_data(g, "Javascript", js)
add_data(g, "JSX", jsx)
g.marker_count = 2
g.labels = labels(js)
g.write(title + '.png')

puts title
puts metrics(js, jsx)
puts "------------------------------"
