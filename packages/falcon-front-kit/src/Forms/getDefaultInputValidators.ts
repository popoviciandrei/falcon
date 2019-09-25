import * as validators from './validators';
import { IValidator } from './IValidator';

/**
 * Provides default value validators based on HTML input type
 * @see https://www.w3schools.com/html/html_form_input_types.asp
 * @param input
 */
export function getDefaultInputValidators(
  input: Pick<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'required' | 'min' | 'max'> & {
    validate?: IValidator[];
  }
): IValidator[] {
  const { type, required, validate } = input;
  const anyValidatorsDefined = !!validate;

  const result = anyValidatorsDefined ? validate : [];
  if (required) {
    result.unshift(validators.requiredValidator);
  }

  if (anyValidatorsDefined) {
    return result;
  }

  switch (type) {
    case 'password':
      result.push(validators.lengthValidator(8), validators.passwordValidator);
      break;
    case 'email':
      result.push(validators.emailValidator);
      break;
    case 'number':
      {
        const { min, max } = input;
        if (min) {
          result.push(validators.rangeValidator(parseInt(min.toString(), 10)));
        } else if (min && max) {
          result.push(validators.rangeValidator(parseInt(min.toString(), 10), parseInt(max.toString(), 10)));
        }
      }
      break;
    default:
      break;
  }

  return result;
}
