/* tslint:disable */
/* eslint-disable */
import { LicenceDocumentTypeCode } from './licence-document-type-code';
export interface Document {
  documentExtension?: null | string;
  documentName?: null | string;
  documentUrlId?: string;
  expiryDate?: null | string;
  licenceAppId?: null | string;
  licenceDocumentTypeCode?: LicenceDocumentTypeCode;
  uploadedDateTime?: string;
}
