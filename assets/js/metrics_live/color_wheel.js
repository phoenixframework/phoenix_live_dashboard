const COLORS = {
  phoenix: [242, 110, 64],
  elixir: [75, 68, 115],
  red: [255, 99, 132],
  orange: [255, 159, 64],
  yellow: [255, 205, 86],
  green: [75, 192, 192],
  blue: [54, 162, 253],
  purple: [153, 102, 255],
  grey: [201, 203, 207],
}

const COLOR_NAMES = Object.keys(COLORS)

export const ColorWheel = {
  at: (i) => {
    const [r, g, b] = ColorWheel.rgb(i)
    return `rgb(${r}, ${g}, ${b})`
  },
  rgb: (i) => COLORS[COLOR_NAMES[i % COLOR_NAMES.length]],
}

export const LineColor = {
  at: (i) => {
    const [r, g, b] = ColorWheel.rgb(i)
    return {
      stroke: `rgb(${r}, ${g}, ${b})`,
      fill: `rgb(${r}, ${g}, ${b}, 0.1)`
    }
  }
}

export default ColorWheel
