import CSS from 'csstype';
import { Keyframes } from '@emotion/serialize';
import { defaultBaseTheme } from './theme';
import { PropsMappings } from './responsiveprops';
import { mergeThemes, RecursivePartial } from './utils';

// export themed component factory
export * from './themed';
export * from './utils';
export * from './responsiveprops';

export function createTheme(themeOverride: RecursivePartial<Theme> = {}): Theme {
  return mergeThemes(defaultBaseTheme, themeOverride);
}

// --- exported type definitions for theme  ----
export interface Theme {
  colors: ThemeColors;
  breakpoints: Readonly<ThemeBreakpoints>;
  spacing: Readonly<ThemeSpacing>;
  fonts: ThemeFonts;
  fontSizes: Readonly<ThemeFontSizes>;
  fontWeights: ThemeFontWeights;
  lineHeights: Readonly<ThemeLineHeights>;
  letterSpacings: Readonly<ThemeLetterSpacings>;
  borders: ThemeBorders;
  borderRadius: Readonly<ThemeBorderRadius>;
  boxShadows: ThemeBoxShadows;
  easingFunctions: ThemeEasingFunctions;
  transitionDurations: ThemeTransitionDurations;
  keyframes: ThemeKeyframes;
  zIndex: ThemeZIndex;
  components: ThemeComponents;
  icons: ThemeIcons;
}

type ThemedPropMapping = {
  themeProp: keyof Theme;
};

type CssProps = CSS.PropertiesFallback<number | string>;

type ResponsivePropMapping = {
  cssProp: keyof CssProps;
};

type CSSPseudoObject = {
  [key in CSS.SimplePseudos]?: CSSObject;
};
type CssOtherProps = undefined | number | string | CSSObject;
type CSSOthersObject = {
  [propertiesName: string]: CssOtherProps | CssOtherProps[];
};
type CssResponsiveProps = {
  [key in keyof CssProps]?: { [Breakpoint in keyof Theme['breakpoints']]?: CssProps[key] } | CssProps[key];
};

export interface CSSObject extends CssResponsiveProps, CSSPseudoObject, CSSOthersObject {}

export type PropsWithTheme<TProps> = TProps & { theme: Theme };

type ThemePropMap<TProp extends keyof PropsMappings> = PropsMappings[TProp] extends ThemedPropMapping
  ? Extract<keyof Theme[PropsMappings[TProp]['themeProp']], string>
  : PropsMappings[TProp] extends ResponsivePropMapping
  ? CssProps[PropsMappings[TProp]['cssProp']]
  : string | number;

export type BaseThemingProps = {
  [TProp in keyof PropsMappings]?:
    | ThemePropMap<TProp>
    | { [TBreakpoint in keyof ThemeBreakpoints]?: ThemePropMap<TProp> };
};
export type InlineCss<TProps> = ((props: PropsWithTheme<TProps>) => CSSObject) | CSSObject;

/** old `ThemedComponentProps` */
export type ThemingProps<TProps = any> = BaseThemingProps & {
  // as: Tag
  // defaultTheme?: ComponentTheme<TProps> | { [name: string]: ComponentTheme<TProps> };
  variant?: string;
  css?: InlineCss<TProps>;
};

export type PropsWithThemingProps<TProps> = TProps & ThemingProps<TProps>;

type ComponentThemeVariant<TProps> = BaseThemingProps & { css?: InlineCss<TProps> };
export type ComponentTheme<TProps> = ComponentThemeVariant<TProps> & {
  variants?: { [variantKey: string]: ComponentThemeVariant<TProps> };
};

export interface ThemeComponents {
  [key: string]: ComponentTheme<{}>;
}

export type ThemeIcons = {
  [name: string]: {
    icon: React.ComponentType | ((props: any) => JSX.Element);
  } & ThemingProps<any>;
};

type Colors = typeof defaultBaseTheme.colors;
export interface ThemeColors extends Colors {}

type Breakpoints = Record<keyof typeof defaultBaseTheme.breakpoints, number | string>;
export interface ThemeBreakpoints extends Breakpoints {}

type Spacing = Record<keyof typeof defaultBaseTheme.spacing, number | string>;
export interface ThemeSpacing extends Spacing {}

type Fonts = typeof defaultBaseTheme.fonts;
export interface ThemeFonts extends Fonts {}

type FontSizes = Record<keyof typeof defaultBaseTheme.fontSizes, number | string>;
export interface ThemeFontSizes extends FontSizes {}

type FontWeights = typeof defaultBaseTheme.fontWeights;
export interface ThemeFontWeights extends FontWeights {}

type LineHeights = Record<keyof typeof defaultBaseTheme.lineHeights, number | string>;
export interface ThemeLineHeights extends LineHeights {}

type LetterSpacings = Record<keyof typeof defaultBaseTheme.letterSpacings, number | string>;
export interface ThemeLetterSpacings extends LetterSpacings {}

type Borders = typeof defaultBaseTheme.borders;
export interface ThemeBorders extends Borders {}

type BorderRadius = Record<keyof typeof defaultBaseTheme.borderRadius, number | string>;
export interface ThemeBorderRadius extends BorderRadius {}

type BoxShadows = typeof defaultBaseTheme.boxShadows;
export interface ThemeBoxShadows extends BoxShadows {}

type EasingFunctions = typeof defaultBaseTheme.easingFunctions;
export interface ThemeEasingFunctions extends EasingFunctions {}

type TransitionDurations = typeof defaultBaseTheme.transitionDurations;
export interface ThemeTransitionDurations extends TransitionDurations {}

export interface ThemeKeyframes {
  [key: string]: CSSObject | Keyframes;
}

type ZIndex = typeof defaultBaseTheme.zIndex;
export interface ThemeZIndex extends ZIndex {}
