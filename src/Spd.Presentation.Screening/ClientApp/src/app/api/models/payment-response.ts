/* tslint:disable */
/* eslint-disable */
import { ApplicationTypeCode } from './application-type-code';
import { LicenceTermCode } from './licence-term-code';
import { PaymentStatusCode } from './payment-status-code';
import { PaymentTypeCode } from './payment-type-code';
import { ServiceTypeCode } from './service-type-code';
export interface PaymentResponse {
  applicationId?: string;
  applicationTypeCode?: ApplicationTypeCode;
  caseNumber?: null | string;
  email?: null | string;
  licenceTermCode?: LicenceTermCode;
  message?: null | string;
  paidSuccess?: boolean;
  paymentId?: string;
  paymentStatus?: PaymentStatusCode;
  paymentType?: PaymentTypeCode;
  serviceTypeCode?: ServiceTypeCode;
  transAmount?: number;
  transDateTime?: string;
  transOrderId?: null | string;
}
