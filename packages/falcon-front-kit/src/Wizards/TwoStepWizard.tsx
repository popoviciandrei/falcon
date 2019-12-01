import React, { useState } from 'react';

export type TwoStepWizardRenderProps = {
  /** currently selected value */
  selectedOption: any;
  /** sets the selected value */
  selectOption: (value: any) => any;
  /** resets the selected value */
  resetOption: () => any;
};

export type TwoStepWizardProps = {
  initialState?: any;
  children: (props: TwoStepWizardRenderProps) => React.ReactNode;
};

/**
 * Two step wizard that can be used for any kind of "select and configure" process (like payments, shipping etc...)
 * @example
 * <TwoStepWizard>
 *   {({ selectedOption, selectOption }) => {
 *     // nothing selected - render picker
 *     if (!selectedOption) {
 *       return (
 *         <ul>
 *           <li>
 *             <label htmlFor="foo">
 *               <input id="foo" type="radio" name="wizard" value="foo" onChange={() => selectOption('foo')} />
 *               <span>Foo</span>
 *             </label>
 *           </li>
 *           <li>
 *             <label htmlFor="bar">
 *               <input id="bar" type="radio" name="wizard" value="bar" onChange={() => selectOption('bar')} />
 *               <span>Bar</span>
 *             </label>
 *           </li>
 *         </ul>
 *       );
 *     }
 *
 *     if (selectedOption === 'foo') {
 *       // render component for 'foo'
 *       return <div>configure Foo</div>;
 *     }
 *
 *     if (selectedOption === 'bar') {
 *       // render component for 'bar'
 *       return <div>configure Bar</div>;
 *     }
 *
 *     return null;
 *   }}
 * </TwoStepWizard>
 */
export const TwoStepWizard: React.SFC<TwoStepWizardProps> = ({ initialState, children }) => {
  const [selectedOption, setOption] = useState(initialState);

  const selectOption = (value: any) => setOption(value);
  const resetOption = () => setOption(null);

  return (
    <>
      {children({
        selectedOption,
        selectOption,
        resetOption
      })}
    </>
  );
};
