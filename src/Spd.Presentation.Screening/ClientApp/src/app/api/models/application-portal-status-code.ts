/* tslint:disable */
/* eslint-disable */
export enum ApplicationPortalStatusCode {
  VerifyIdentity = 'VerifyIdentity',
  InProgress = 'InProgress',
  AwaitingPayment = 'AwaitingPayment',
  AwaitingThirdParty = 'AwaitingThirdParty',
  AwaitingApplicant = 'AwaitingApplicant',
  UnderAssessment = 'UnderAssessment',
  Incomplete = 'Incomplete',
  CompletedCleared = 'CompletedCleared',
  RiskFound = 'RiskFound',
  ClosedJudicialReview = 'ClosedJudicialReview',
  ClosedNoResponse = 'ClosedNoResponse',
  ClosedNoConsent = 'ClosedNoConsent',
  CancelledByApplicant = 'CancelledByApplicant',
  CancelledByOrganization = 'CancelledByOrganization'
}
