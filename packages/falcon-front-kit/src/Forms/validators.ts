import { IValidator } from './IValidator';

const VALID_EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const VALID_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

const isValueProvided = x => (x !== '' && x !== undefined && x !== null) || (Array.isArray(x) && (x as any[]).length);

export const requiredValidator: IValidator = ({ value }) => {
  if (!isValueProvided(value)) {
    return { errorI18nId: 'required' };
  }

  return undefined;
};

export const emailValidator: IValidator = ({ value }) => {
  if (isValueProvided(value) && !VALID_EMAIL_REGEX.test(value.toLowerCase())) {
    return { errorI18nId: 'invalid' };
  }

  return undefined;
};

export const passwordValidator: IValidator = ({ value }) => {
  if (isValueProvided(value) && !VALID_PASSWORD_REGEX.test(value)) {
    return { errorI18nId: 'uncomplexPassword' };
  }

  return undefined;
};

export function lengthValidator(min: number, max?: number): IValidator {
  if (max && max < min) {
    throw new Error(`value of 'min' can not be greater than 'max'!`);
  }

  return ({ value }) => {
    if (isValueProvided(value) && typeof value === 'string') {
      if (value.length < min) {
        return { errorI18nId: 'toShort', min, ...(max ? { max } : {}) };
      }

      if (max && value.length > max) {
        return { errorI18nId: 'toLong', min, max };
      }
    }

    return undefined;
  };
}

export function rangeValidator(min: number, max?: number): IValidator {
  if (max && max < min) {
    throw new Error(`value of 'min' can not be greater than 'max'!`);
  }

  return ({ value }) => {
    if (isValueProvided(value) && typeof value === 'number') {
      if (value < min) {
        return { errorI18nId: 'belowRange', min, ...(max ? { max } : {}) };
      }

      if (max && value > max) {
        return { errorI18nId: 'aboveRange', min, max };
      }
    }

    return undefined;
  };
}
