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
	api: {
		debounceTime: 500, // milliseconds
	},
	maxNumberOfAliases: 3,
	// sessionStorage: {
	// 	organizationRegStateKey: 'state',
	// 	crcPortalStateKey: 'crc-state',
	// 	bannerMessageKey: 'banner-message',
	// },
};
