import { Address } from '@deity/falcon-shop-extension';

/**
 * Determines if the address is custom or already saved in the system
 * @param {Address} address
 */
export const isCustomAddress = (address?: Address) => !address || (address && !address.id);
