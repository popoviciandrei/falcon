import gql from 'graphql-tag';
import { Order, OrderItem, Address, Country } from '@deity/falcon-shop-extension';
import { Query } from '@deity/falcon-data';

export const GET_ORDER = gql`
  query Order($id: ID!) {
    order(id: $id) {
      id
      referenceNo
      createdAt
      customerFirstname
      customerLastname
      status
      subtotal
      shippingAmount
      grandTotal
      orderCurrencyCode
      shippingDescription
      paymentMethodName
      items {
        itemId
        sku
        name
        rowTotalInclTax
        qty
        thumbnailUrl
        link
      }
      billingAddress {
        company
        firstname
        lastname
        street
        city
        postcode
        country {
          code
        }
        telephone
      }
      shippingAddress {
        company
        firstname
        lastname
        street
        city
        postcode
        country {
          code
        }
        telephone
      }
    }
  }
`;

export type OrderResponse = {
  order: Pick<
    Order,
    | 'id'
    | 'referenceNo'
    | 'createdAt'
    | 'customerFirstname'
    | 'customerLastname'
    | 'status'
    | 'subtotal'
    | 'shippingAmount'
    | 'grandTotal'
    | 'orderCurrencyCode'
    | 'shippingDescription'
    | 'paymentMethodName'
  >[] & {
    items: Pick<OrderItem, 'itemId' | 'sku' | 'name' | 'rowTotalInclTax' | 'qty' | 'thumbnailUrl' | 'link'>[];
    billingAddress: Pick<
      Address,
      'company' | 'firstname' | 'lastname' | 'street' | 'city' | 'postcode' | 'telephone'
    > & {
      country: Pick<Country, 'code'>;
    };
    shippingAddress: Pick<
      Address,
      'company' | 'firstname' | 'lastname' | 'street' | 'city' | 'postcode' | 'telephone'
    > & {
      country: Pick<Country, 'code'>;
    };
  };
};

export class OrderQuery extends Query<OrderResponse> {
  static defaultProps = {
    query: GET_ORDER
  };
}
