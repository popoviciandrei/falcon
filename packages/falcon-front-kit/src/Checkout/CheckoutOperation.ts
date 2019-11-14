import { ExecutionResult, MutationResult, MutationFunctionOptions } from '@apollo/react-common';

export type CheckoutOperationFunctionOptions<TData = any> = Omit<MutationFunctionOptions<TData>, 'variables'>;
export type CheckoutOperationFunction<TData, TInput> = (
  input: TInput,
  options: CheckoutOperationFunctionOptions<TData>
) => Promise<ExecutionResult<TData>>;

export type CheckoutOperationHook<TData, TInput> = () => [
  CheckoutOperationFunction<TData, TInput>,
  MutationResult<TData>
];

export type CheckoutOperation<TData, TInput> = (
  checkoutOperationFunction: CheckoutOperationFunction<TData, TInput>,
  checkoutOperationResult: MutationResult<TData>
) => JSX.Element | null;
