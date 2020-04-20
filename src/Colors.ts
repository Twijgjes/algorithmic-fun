export const COLORS = {
  DARKEST_BROWN:  "#472d3c",
  DARK_BROWN:     "#5e3643",
  BROWN:          "#7a444a",
  LIGHT_BROWN:    "#a05b53",
  LIGHTEST_BROWN: "#bf7958",
  WEIRD_BROWN:    "#eea160",
  SAND:           "#f4cca1",
  LIGHT_GREEN:    "#b6d53c",
  GREEN:          "#71aa34",
  DARK_GREEN:     "#397b44",
  GREY_GREEN:     "#3c5956",
  DARKEST_GREY:   "#302c2e",
  DARK_GREY:      "#5a5353",
  GREY:           "#7d7071",
  LIGHT_GREY:     "#a0938e",
  LIGHTEST_GREY:  "#cfc6b8",
  HAZY_SKY:       "#dff6f5",
  SKY:            "#8aebf1",
  DARK_SKY:       "#28ccdf",
  BLUE:           "#3978a8",
  DARK_BLUE:      "#394778",
  DARKEST_PURPLE: "#39314b",
  DARK_PURPLE:    "#564064",
  PURPLE:         "#8e478c",
  DARK_PINK:      "#cd6093",
  PINK:           "#ffaeb6",
  YELLOW:         "#f4d01b",
  ORANGE_YELLOW:  "#f4b41b",
  ORANGE:         "#f47e1b",
  RED:            "#e6482e",
  DARK_RED:       "#a93b3b",
  WEIRD_PURPLE:   "#827094",
  WEIRD_GREY:     "#4f546b",
};

const BrightColors = [
  COLORS.SKY,
  COLORS.LIGHT_GREEN,
  COLORS.DARK_PINK,
  COLORS.ORANGE_YELLOW,
  COLORS.ORANGE,
  COLORS.RED,
]

export function randomBrightColor(): string {
  return BrightColors[Math.floor(Math.random() * BrightColors.length)];
}