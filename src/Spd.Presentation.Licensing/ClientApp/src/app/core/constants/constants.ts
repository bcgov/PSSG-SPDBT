export const SPD_CONSTANTS = {
	list: {
		defaultPageSize: 10,
	},
	date: {
		birthDateStartAtYears: 25,
		birthDateMinAgeYears: 12,
		dateFormat: 'YYYY-MM-DD',
		formalDateFormat: 'MMM DD, YYYY',
		formalDateTimeFormat: 'MMM DD, YYYY HH:mm',
		monthYearFormat: 'MMM yyyy',
		dateTimeFormat: 'YYYY-MM-DD HH:mm',
		backendDateFormat: 'YYYY-MM-DD',
	},
	periods: {
		notSubmittedLicenceWarningDays: 14, // show warning 14 days before the 30 day mark
		notSubmittedLicenceErrorDays: 7, // show error 7 days before the 30 day mark
		notSubmittedLicenceHide: 30, // do not show licence 30 days after created
		replacementPeriodPreventionDays: 14, // cannot replace within 14 days of expiry
		updatePeriodPreventionDays: 14, // cannot update within 14 days of expiry
		renewPeriodDays: 90, // can only renew only if current licence term is 1,2,3 or 5 years and expiry date is in 90 days or less
		renewPeriodDaysNinetyDayTerm: 60, // can only renew only if current licence term is 90 days and expiry date is in 60 days or less
	},
	phone: {
		spdPhoneNumber: '1-855-587-0185',
		displayMask: '(000) 000-0000',
		backendMask: '000-000-0000',
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
	payment: {
		maxNumberOfAttempts: 3,
	},
	maxNumberOfAliases: 3,
	// sessionStorage: {
	// 	organizationRegStateKey: 'state',
	// 	crcPortalStateKey: 'crc-state',
	// 	bannerMessageKey: 'banner-message',
	// },
	urls: {
		requestReplacementUrl:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/about/security-programs-division#contact',
		contactSpdUrl:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/about/security-programs-division#contact',
		setupAccountUrl: 'https://id.gov.bc.ca/account/',
		addressChangeUrl: 'https://www.addresschange.gov.bc.ca/',
		permitBodyAmourViewExemptions:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/body-armour/possessing',
		permitArmouredVehicleViewExemptions:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/armoured-vehicles/who-not-require-permit',
	},
	files: {
		securityServicesApplicantTerms: '/assets/files/Security Services Applicant Terms of Use.pdf',
		securityServicesApplicantUpdateTerms: '/assets/files/Security Services Applicant Update Terms of Use.pdf',
		securityServicesBusinessApplicantTerms: '/assets/files/Security Services Business Applicant Terms of Use .pdf',
		securityServicesBusinessApplicantUpdateTerms:
			'/assets/files/Security Services Business Applicant Update Terms of Use.pdf',
	},
};
