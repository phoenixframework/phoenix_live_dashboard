const COLORS = {
  purple: 'rgb(153, 102, 255)',
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  elixir: 'rgb(78, 42, 142)',
  phoenix: 'rgb(240, 84, 35)',
  grey: 'rgb(201, 203, 207)',
}

const COLOR_NAMES = Object.keys(COLORS)

const ColorWheel = {
  at: (i) => COLORS[COLOR_NAMES[i % COLOR_NAMES.length]]
}

export default ColorWheel
