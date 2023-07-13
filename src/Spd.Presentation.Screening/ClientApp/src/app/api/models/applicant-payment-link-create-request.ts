/* tslint:disable */
/* eslint-disable */
import { PaymentMethodCode } from './payment-method-code';
export interface ApplicantPaymentLinkCreateRequest {
  applicationId?: string;
  description?: null | string;
  paymentMethod?: PaymentMethodCode;
}
