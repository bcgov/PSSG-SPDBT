export const SPD_CONSTANTS = {
	list: {
		defaultPageSize: 10,
	},
	date: {
		birthDateStartAt: new Date(2000, 0, 1),
		dateFormat: 'yyyy-MM-dd',
		monthYearFormat: 'MMM yyyy',
		dateTimeFormat: 'yyyy-MM-dd HH:mm',
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
		crcPortalStateKey: 'crc-state',
		bannerMessageKey: 'banner-message',
	},
};
