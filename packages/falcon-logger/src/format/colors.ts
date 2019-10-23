import chalk, { Chalk } from 'chalk';
import { LEVELS, LEVEL_NAMES } from './constants';

export type Colorizer = (input: string) => string;

export interface ColorizerFn {
  (input: string): string;
  message: Colorizer;
  default: Colorizer;
  random: Colorizer;
  error: Colorizer;
}

export type ColorizerMap = {
  default: Colorizer;
  60: Colorizer;
  50: Colorizer;
  40: Colorizer;
  30: Colorizer;
  20: Colorizer;
  10: Colorizer;
  message: Colorizer;
  random: Colorizer;
  error: Colorizer;
};

declare type RandomColorDictionary = {
  [key: string]: Chalk;
};

const nocolor: Colorizer = input => input;
const plain: ColorizerMap = {
  default: nocolor,
  60: nocolor,
  50: nocolor,
  40: nocolor,
  30: nocolor,
  20: nocolor,
  10: nocolor,
  message: nocolor,
  random: nocolor,
  error: nocolor
};

const ctx: Chalk = new chalk.constructor({ enabled: true, level: 3 });

const randomColorDictionary: RandomColorDictionary = {};
const randomColors: Chalk[] = [
  ctx.green,
  ctx.yellow,
  ctx.magenta,
  ctx.hex('00FF00'),
  ctx.hex('9932CC'),
  ctx.hex('A52A2A'),
  ctx.hex('1E90FF'),
  ctx.hex('ADFF2F'),
  ctx.redBright
];

const randomColor = input => {
  if (!(input in randomColorDictionary)) {
    const color = randomColors.shift();
    randomColors.push(color);
    randomColorDictionary[input] = color;
  }
  return randomColorDictionary[input](input);
};

const colored: ColorizerMap = {
  default: ctx.white,
  60: ctx.bgRed,
  50: ctx.red,
  40: ctx.yellow,
  30: ctx.green,
  20: ctx.blue,
  10: ctx.grey,
  message: ctx.cyan,
  random: randomColor,
  error: ctx.red
};

const colorizeLevel = (level: string, colorizer: ColorizerMap): string => {
  if (Number.isInteger(+level)) {
    return level in LEVELS ? colorizer[level](LEVELS[level]) : colorizer.default(LEVELS.default);
  }
  const levelNum = LEVEL_NAMES[level.toLowerCase()] || 'default';
  return colorizer[levelNum](LEVELS[levelNum]);
};

const plainColorizer = (level: string): string => {
  return colorizeLevel(level, plain);
};
plainColorizer.message = plain.message;
plainColorizer.default = plain.default;
plainColorizer.random = plain.random;
plainColorizer.error = plain.error;

const coloredColorizer = (level: string): string => {
  return colorizeLevel(level, colored);
};
coloredColorizer.message = colored.message;
coloredColorizer.default = colored.default;
coloredColorizer.random = colored.random;
coloredColorizer.error = colored.error;

/**
 * Factory function get a function to colorized levels. The returned function
 * also includes a `.message(str)` method to colorize strings.
 * @param {bool} [useColors=false] When `true` a function that applies standard
 * terminal colors is returned.
 *
 * @returns {Function} `function (level) {}` has a `.message(str)` method to
 * apply colorization to a string. The core function accepts either an integer
 * `level` or a `string` level. The integer level will map to a known level
 * string or to `USERLVL` if not known.  The string `level` will map to the same
 * colors as the integer `level` and will also default to `USERLVL` if the given
 * string is not a recognized level name.
 */
export default (useColors: boolean = false): ColorizerFn => (useColors ? coloredColorizer : plainColorizer);
