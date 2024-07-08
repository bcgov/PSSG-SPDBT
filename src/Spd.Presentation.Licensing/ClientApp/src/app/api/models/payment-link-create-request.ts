/* tslint:disable */
/* eslint-disable */
import { PaymentMethodCode } from '../models/payment-method-code';
export interface PaymentLinkCreateRequest {
  applicationId?: string | null;
  description?: string | null;
  paymentMethod?: PaymentMethodCode;
}
