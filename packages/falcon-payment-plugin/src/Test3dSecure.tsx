import React from 'react';

export type Test3dSecureProps = {
  url: string;
  method: string;
  fields: Test3dSecurePropsField[];
};

export type Test3dSecurePropsField = {
  name: string;
  value: string;
};

export class Test3dSecure extends React.Component<Test3dSecureProps> {
  form: React.RefObject<HTMLFormElement>;

  constructor(props: Test3dSecureProps) {
    super(props);
    this.form = React.createRef<HTMLFormElement>();
  }

  componentDidMount() {
    const form: HTMLFormElement = this.form.current!;
    const { method, action } = form;
    if (method.toLowerCase() === 'get') {
      window.location.href = action;
    } else {
      form.submit();
    }
  }

  render() {
    const { url, method = 'POST', fields } = this.props;

    return (
      <form ref={this.form} method={method} action={url}>
        {fields.map(field => (
          <input key={field.name} type="hidden" name={field.name} value={field.value} />
        ))}
      </form>
    );
  }
}
