/* tslint:disable */
/* eslint-disable */
import { PaymentStatusCode } from './payment-status-code';
import { PaymentTypeCode } from './payment-type-code';
export interface PaymentResponse {
  applicationId?: string;
  caseNumber?: null | string;
  message?: null | string;
  paidSuccess?: boolean;
  paymentId?: string;
  paymentStatus?: PaymentStatusCode;
  paymentType?: PaymentTypeCode;
  transAmount?: number;
  transDateTime?: string;
  transOrderId?: null | string;
}
