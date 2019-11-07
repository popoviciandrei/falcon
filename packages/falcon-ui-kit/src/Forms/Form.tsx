import { themed, PropsWithThemingProps } from '@deity/falcon-ui';
import { Form as FrontKitForm, FormProps as FrontKitFormProps } from '@deity/falcon-front-kit';

export type FormProps = PropsWithThemingProps<FrontKitFormProps>;

export const Form = themed<FormProps>({
  tag: FrontKitForm,
  defaultTheme: {
    form: {
      display: 'grid',
      gridGap: 'sm'
    }
  }
});
