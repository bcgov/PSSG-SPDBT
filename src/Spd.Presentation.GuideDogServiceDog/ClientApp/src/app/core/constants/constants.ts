export const SPD_CONSTANTS = {
	date: {
		birthDateMinAgeYears: 12,
		dateFormat: 'YYYY-MM-DD',
		formalDateFormat: 'MMM DD, YYYY',
		formalDateTimeFormat: 'MMM DD, YYYY HH:mm',
		monthYearFormat: 'MMM yyyy',
		dateTimeFormat: 'YYYY-MM-DD HH:mm',
		backendDateFormat: 'YYYY-MM-DD',
	},
	periods: {
		applicationNotSubmittedWarningDays: 14, // show warning 14 days before the 30 day mark
		applicationNotSubmittedErrorDays: 7, // show error 7 days before the 30 day mark
		applicationNotSubmittedValidDays: 30, // user has 30 days to submit the application, otherwise dynamics deletes it
		licenceReplacementPeriodPreventionDays: 14, // cannot replace within 14 days of expiry
		licenceRenewPeriodDays: 90, // can only renew only if current licence term is 1,2,3 or 5 years and expiry date is in 90 days or less
		licenceRenewPeriodDaysNinetyDayTerm: 60, // can only renew only if current licence term is 90 days and expiry date is in 60 days or less
		gdsdLicenceRenewAfterExpiryPeriodMonths: 6, // gdsd licence can still be renewed until 6 months after expiry
	},
	phone: {
		spdPhoneNumber: '1-855-587-0185',
		displayMask: '(000) 000-0000',
		backendMask: '000-000-0000',
	},
	message: {
		submissionSuccess:
			'Your application has been received. A confirmation email will be sent to you. We will contact you if additional information is needed.',
	},
	document: {
		maxFileSize: 26214400, // bytes
		maxFileSizeInMb: 25,
		maxNumberOfFiles: 10,
		acceptedFileTypes: [
			'.docx',
			'.doc',
			'.bmp',
			'.jpeg',
			'.jpg',
			'.tif',
			'.tiff',
			'.png',
			'.gif',
			'.pdf',
			'.html',
			'.htm',
		],
	},
	api: {
		debounceTime: 500, // milliseconds
	},
	urls: {
		addressChangeUrl: 'https://www.addresschange.gov.bc.ca/',
		bcGovPrivacyUrl: 'https://www2.gov.bc.ca/gov/content/home/privacy',
		bcGovDisclaimerUrl: 'https://www2.gov.bc.ca/gov/content/home/disclaimer',
		bcGovAccessibilityUrl: 'https://www2.gov.bc.ca/gov/content/home/accessibility',
		bcGovCopyrightUrl: 'https://www2.gov.bc.ca/gov/content/home/copyright',
		bcGovContactUrl: 'https://www2.gov.bc.ca/gov/content/home/get-help-with-government-services',
		bcServicesCardUrl: 'https://www2.gov.bc.ca/gov/content/governments/government-id/bc-services-card',
		canadianPassportPhotoUrl:
			'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html',
		changeNameOrAddressUrl: 'https://www.icbc.com/driver-licensing/getting-licensed/Change-your-name-or-address',
		contactSpdUrl:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/about/security-programs-division#contact',
		setupAccountUrl: 'https://id.gov.bc.ca/account/',
		securityIndustryLicensingUrl:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing',
	},
	files: {
		guideDogServiceDogTerms: './assets/files/Guide Dog Service Dog Applicant Terms of Use.pdf',
	},
	address: {
		provinceBC: 'BC',
		provinceBritishColumbia: 'British Columbia',
		countryCA: 'CA',
		countryCanada: 'Canada',
	},
};
