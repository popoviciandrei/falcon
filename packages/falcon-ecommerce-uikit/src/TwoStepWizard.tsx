import React, { useState } from 'react';
/**
 * Simple two step wizard that can be used for any kind of "select and configure" process (like payments, shipping etc)
 * Usage:
 *
 * <TwoStepWizard>
 *   {wizard => {
 *     // nothing selected - render picker
 *     if (!wizard.selectedOption) {
 *       return (
 *         <ul>
 *           <label>
 *            <input type="radio" name="wizard" value="foo" onChange={() => wizard.selectOption('foo')} />
 *            <span>Foo</span>
 *           </label>
 *           <label>
 *            <input type="radio" name="wizard" value="bar" onChange={() => wizard.selectOption('bar')} />
 *            <span>Bar</span>
 *           </label>
 *       );
 *     }
 *
 *     if (wizard.selectedOption === 'foo') {
 *       // render component for 'foo'
 *       return <div>configure Foo</div>;
 *     }
 *     if (wizard.selectedOption === 'bar') {
 *       // render component for 'bar'
 *       return <div>configure Bar</div>;
 *     }
 *
 *     return null;
 *   }}
 * </TwoStepWizard>
 *
 *
 * Render prop function passed as child of TwoStepWizard receives the following items as the first parameter:
 * - selectedOption - currently selected value
 * - selectOption(value) - function that sets the selected value
 * - resetOption() - function that resets the selected value
 */

type TwoStepWizardInjectedProps = {
  selectedOption: any;
  selectOption: (value: any) => any;
  resetOption: () => any;
};

type TwoStepWizardProps = {
  children: (props: TwoStepWizardInjectedProps) => React.ReactNode;
  initialState?: any;
};

export const TwoStepWizard: React.SFC<TwoStepWizardProps> = ({ children, initialState = null }) => {
  const [selectedOption, setOption] = useState(initialState);

  const selectOption = (value: any) => setOption(value);
  const resetOption = () => setOption(null);

  return (
    <React.Fragment>
      {children({
        selectedOption,
        selectOption,
        resetOption
      })}
    </React.Fragment>
  );
};
