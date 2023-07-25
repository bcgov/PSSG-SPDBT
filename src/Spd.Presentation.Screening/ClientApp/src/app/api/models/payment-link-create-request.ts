/* tslint:disable */
/* eslint-disable */
import { PaymentMethodCode } from './payment-method-code';
export interface PaymentLinkCreateRequest {
  applicationId?: null | string;
  description?: null | string;
  paymentMethod?: PaymentMethodCode;
}
