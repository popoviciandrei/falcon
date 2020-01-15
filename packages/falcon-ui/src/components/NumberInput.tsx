import React from 'react';
import { I18n } from '@deity/falcon-i18n';
import { themed, extractThemableProps } from '../theme';
import { Box } from './Box';
import { Icon } from './Icon';

// based on https://github.com/facebook/react/issues/10135#issuecomment-314441175
function triggerChange(element: any, value: any) {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')!.set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')!.set;

  if (valueSetter && prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else if (valueSetter) {
    valueSetter.call(element, value);
  }

  element.dispatchEvent(new Event('change', { bubbles: true }));
}

type NumberInputInnerDOMProps = {
  invalid?: boolean;
  min?: number;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

class NumberInputInnerDOM extends React.Component<NumberInputInnerDOMProps> {
  inputRef = React.createRef<HTMLInputElement>();

  getStep() {
    if (this.props.step === undefined) {
      return 1;
    }
    return +this.props.step;
  }

  getMax() {
    if (this.props.max === undefined) {
      return Number.POSITIVE_INFINITY;
    }
    return +this.props.max;
  }

  getMin() {
    if (this.props.min === undefined) {
      return Number.NEGATIVE_INFINITY;
    }
    return +this.props.min;
  }

  stepUp = () => {
    if (!this.inputRef.current) {
      return;
    }

    const currentValue = +this.inputRef.current.value;
    const max = this.getMax();

    let nextValue = currentValue + this.getStep();
    if (nextValue > max) {
      nextValue = max;
    }

    triggerChange(this.inputRef.current, nextValue);
  };

  stepDown = () => {
    if (!this.inputRef.current) {
      return;
    }

    const currentValue = +this.inputRef.current.value;
    const min = this.getMin();

    let nextValue = currentValue - this.getStep();
    if (nextValue < min) {
      nextValue = min;
    }

    triggerChange(this.inputRef.current, nextValue);
  };

  render() {
    const { className, invalid, min, max, ...remaining } = this.props;
    const { themableProps, rest } = extractThemableProps(remaining);
    const currentValue = this.inputRef.current.value;

    return (
      <I18n>
        {t => (
          <Box {...themableProps} className={className}>
            <button
              type="button"
              onClick={this.stepDown}
              aria-label={t('quantity.decrease')}
              className="-inner-input-step-down-element"
              disabled={parseInt(currentValue, 2) <= min}
            >
              <Icon src="numberInputDown" fallback="−" />
            </button>

            <input ref={this.inputRef} min={min} type="number" {...rest} />

            <button
              type="button"
              onClick={this.stepUp}
              aria-label={t('quantity.increase')}
              className="-inner-input-step-up-element"
              disabled={max && parseInt(currentValue, 2) >= max}
            >
              <Icon src="numberInputUp" fallback="+" />
            </button>
          </Box>
        )}
      </I18n>
    );
  }
}

export const NumberInput = themed({
  tag: NumberInputInnerDOM,

  defaultProps: {
    invalid: false,
    min: 1
  },

  defaultTheme: {
    numberInput: {
      display: 'inline-flex',
      alignItems: 'center',
      height: 'lg',

      css: ({ theme, invalid }) => ({
        input: {
          flex: 'none',
          width: theme.spacing.lg,
          height: '100%',
          appearance: 'none',
          MozAppearance: 'textfield',
          userSelect: 'none',
          fontStyle: 'inherit',
          textAlign: 'center',
          border: theme.borders.regular,
          borderRadius: theme.borderRadius.medium,
          borderColor: invalid ? theme.colors.error : theme.colors.secondaryDark,
          boxShadow: 'none',
          '::-webkit-outer-spin-button,::-webkit-inner-spin-button': {
            appearance: 'none'
          },
          ':focus': {
            outline: 'none',
            borderColor: invalid ? theme.colors.error : theme.colors.secondary
          }
        },

        '.-inner-input-step-down-element, .-inner-input-step-up-element': {
          height: '100%',
          flex: 'none',
          width: theme.spacing.lg,
          border: 'none',
          outline: 'none',
          appearance: 'none',
          transitionProperty: 'transform, background',
          transitionTimingFunction: theme.easingFunctions.easeIn,
          transitionDuration: theme.transitionDurations.short,
          background: theme.colors.secondaryDark,
          color: theme.colors.secondaryText,
          borderRadius: theme.borderRadius.round,
          fontWeight: theme.fontWeights.bold,
          fontSize: 'inherit',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: 'scale(0.8)',
          lineHeight: 1,
          ':hover': {
            background: theme.colors.secondary
          },
          ':disabled': {
            opacity: '0.5'
          }
        },
        '.-inner-input-step-down-element': {
          marginRight: theme.spacing.xs,
          ':active': {
            transform: 'scale(0.6)'
          }
        },
        '.-inner-input-step-up-element': {
          marginLeft: theme.spacing.xs,
          ':active': {
            transform: 'scale(1)'
          }
        }
      })
    }
  }
});
