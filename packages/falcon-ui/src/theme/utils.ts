import merge from 'deepmerge';
import isPlainObject from 'is-plain-object';
import { keyframes } from '@emotion/core';
import { mappings } from './responsiveprops';
import { Theme, RecursivePartial } from './index';

const themablePropsKeys = [...Object.keys(mappings), 'css'];

export function extractThemableProps(props: any) {
  const themableProps: any = {};
  const rest: any = {};

  // eslint-disable-next-line
  for (let key in props) {
    if (themablePropsKeys.indexOf(key as any) !== -1) {
      themableProps[key] = props[key];
    } else {
      rest[key] = props[key];
    }
  }

  return {
    themableProps,
    rest
  };
}

/**
 * Determines if object is `@emotion`'s keyframe definition,
 * they sets `anim=1` to keyframes processed by `@emotion/core/keyframes` function
 * @param {*} object
 */
function isEmotionKeyframe(object: any) {
  return object && object.anim === 1;
}

export function mergeThemes(theme: Theme, themeOverride: RecursivePartial<Theme>): Theme {
  const newTheme = merge(theme, themeOverride as Theme, {
    isMergeableObject: x => isPlainObject(x) && !isEmotionKeyframe(x)
  });

  // keyframes merging needs to be handled in very special way
  // each not yet processed keyframes definitions needs to be passed
  // to emotion's keyframes function in order to be consumed in styles
  if (newTheme.keyframes) {
    // eslint-disable-next-line
    for (let keyframeKey in newTheme.keyframes) {
      // only process keyframes not yet processed by emotion (anim property not et)
      if (!newTheme.keyframes[keyframeKey].anim) {
        // TODO remove casting to `any` when https://github.com/deity-io/falcon/issues/545 fixed
        newTheme.keyframes[keyframeKey] = keyframes(newTheme.keyframes[keyframeKey] as any) as any;
      }
    }
  }

  return newTheme;
}
