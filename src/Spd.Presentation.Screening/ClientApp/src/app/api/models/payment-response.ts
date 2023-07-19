/* tslint:disable */
/* eslint-disable */
import { PaymentStatusCode } from './payment-status-code';
export interface PaymentResponse {
  applicationId?: string;
  caseNumber?: null | string;
  message?: null | string;
  paidSuccess?: boolean;
  paymentId?: string;
  paymentStatus?: PaymentStatusCode;
  transAmount?: number;
  transDateTime?: string;
  transOrderId?: null | string;
}
