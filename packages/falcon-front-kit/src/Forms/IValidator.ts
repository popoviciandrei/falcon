import { FieldConfig } from 'formik';
import { TranslationFunction } from '@deity/falcon-i18n';
import { capitalize } from './string';

export type ValidatorProps = {
  name: string;
  label?: string;
  value?: any;
  formI18nId?: string;
  t: TranslationFunction;
};
export interface IValidator {
  (props: ValidatorProps): ValidationError;
}

export type ValidationError = undefined | string | I18nValidationError;
export type I18nValidationError = {
  errorI18nId: string;
} & { [key in string]: any };

export function isI18nValidationError(error: ValidationError): error is I18nValidationError {
  return typeof error === 'object' && (error as I18nValidationError).errorI18nId !== undefined;
}

export const getErrorI18nId: (error: string, name: string, formI18nId?: string) => string | string[] = (
  error,
  name,
  formI18nId
) => {
  if (formI18nId) {
    return [`${formI18nId}.${name}Field${capitalize(error)}`, `formError.${error}`];
  }

  return `formError.${error}`;
};

export interface IFieldValidator {
  (validators: IValidator[], validatorProps: Omit<ValidatorProps, 'value'>): FieldConfig['validate'];
}
export const fieldValidator: IFieldValidator = (validators = [], { name, label, formI18nId, t }) => value => {
  for (let i = 0; i < validators.length; i++) {
    const result = validators[i]({ name, label, value, formI18nId, t });

    if (isI18nValidationError(result)) {
      const { errorI18nId: error, ...errorProps } = result;

      return t(getErrorI18nId(error, name, formI18nId), {
        name,
        value,
        ...errorProps,
        label: label || capitalize(name)
      });
    }

    if (result !== undefined) {
      return result;
    }
  }

  return undefined;
};
