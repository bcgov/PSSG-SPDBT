/* tslint:disable */
/* eslint-disable */
import { LicenceDocumentTypeCode } from '../models/licence-document-type-code';
export interface Document {
  documentExtension?: string | null;
  documentName?: string | null;
  documentUrlId?: string;
  expiryDate?: string | null;
  licenceAppId?: string | null;
  licenceDocumentTypeCode?: LicenceDocumentTypeCode;
  uploadedDateTime?: string;
}
