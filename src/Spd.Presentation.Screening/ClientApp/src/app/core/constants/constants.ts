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
	phone: {
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
	sessionStorage: {
		organizationRegStateKey: 'state',
		crrpaPortalStateKey: 'crrpa-state',
		pssoaPortalStateKey: 'pssoa-state',
		bannerMessageKey: 'banner-message',
	},
	payment: {
		maxNumberOfAttempts: 3,
	},
	maxNumberOfAliases: 3,
	files: {
		pssoTerms: './assets/files/Psso-terms-and-conditions.pdf',
		pssoFirstTimeTerms: './assets/files/Psso-pe-crc-org-terms-and-conditions.pdf',
		peCrcOrPeCrcVsTerms: './assets/files/Pe-crc-terms-and-conditions.pdf',
		crrpTerms: './assets/files/Crrp-terms-and-conditions.pdf',
	},
	closeRedirects: {
		crrpApplication:
			'https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check/applicants/process',
		peCrcApplication: 'https://www2.gov.bc.ca/gov/content/home',
		mcfdApplication:
			'https://www2.gov.bc.ca/gov/content/governments/organizational-structure/ministries-organizations/ministries/children-and-family-development',
		pssoCheck: 'https://www2.gov.bc.ca/gov/content/careers-myhr',
	},
	message: {
		pssoVsWarning: 'I confirm I am submitting a combined check on behalf of the Centralized Services Hub (CSH) team.',
		pssoVsPrompt:
			'In their role with your organization, will this person work directly with, or potentially have unsupervised access to, children and/or vulnerable adults?',
		pssoVsPluralPrompt:
			'In their roles with your organization, will these individuals work directly with, or potentially have unsupervised access to, children and/or vulnerable adults?',
		pssoVsNoWarning: `If the applicant will not have unsupervised access to children or vulnerable adults in this role, but they require a criminal record check for another reason, please <a href="https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check" target="_blank"> contact your local police detachment</a>`,
		pssoVsNoPluralWarning: `If the applicants will not have unsupervised access to children or vulnerable adults in this role, but they require a criminal record check for another reason, please <a href="https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check" target="_blank"> contact your local police detachment</a>`,
		pssoPeCrcWarning:
			'I confirm I am submitting a <strong>“<u>standard</u>” policy enabled check</strong> on behalf of my organization in accordance with the letter of agreement with the Security Programs Division. This check is NOT for a BC Government Employee. I confirm that I have selected the correct screening.',
		pssoPeCrcPrompt:
			'In their role with your organization, will this person fall under the position type for a Standard Policy Enabled Criminal Record Check as per section 1.3 of your LOA?',
		pssoPeCrcPluralPrompt:
			'In their roles with your organization, will these persons fall under the position type for a Standard Policy Enabled Criminal Record Check as per section 1.3 of your LOA?',
		pssoPeCrcVsWarning:
			'I confirm I am submitting an <strong>“<u>enhanced</u>” policy enabled check</strong> on behalf of my organization in accordance with the letter of agreement with the Security Programs Division. This check is NOT for a BC Government Employee. I confirm that I have selected the correct screening.',
		pssoPeCrcVsPrompt:
			'In their role with your organization, will this person fall under the position type for an Enhanced Policy Enabled Criminal Record Check as per section 1.3 of your LOA?',
		pssoPeCrcVsPluralPrompt:
			'In their roles with your organization, will these persons fall under the position type for an Enhanced Policy Enabled Criminal Record Check as per section 1.3 of your LOA?',
		pssoPeCrcAndVsPrompt:
			'In their roles with your organization, will these persons fall under the position types for Policy Enabled Criminal Record Checks as per section 1.3 of your LOA?',
	},
};
