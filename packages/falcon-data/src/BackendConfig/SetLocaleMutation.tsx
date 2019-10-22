import gql from 'graphql-tag';
import { Mutation } from '../Mutation';
import { BackendConfig } from './BackendConfigQuery';

export const SET_LOCALE = gql`
  mutation SetLocale($locale: String!) {
    setLocale(locale: $locale) {
      activeLocale
    }
  }
`;

export type SetLocaleResponse = {
  setLocale: Pick<BackendConfig, 'activeLocale'>;
};

export type SetLocaleInput = {
  locale: string;
};

export class SetLocaleMutation extends Mutation<SetLocaleResponse, SetLocaleInput> {
  static defaultProps = {
    mutation: SET_LOCALE,
    refetchQueries: ['BackendConfig']
  };
}
