export class PersonalLicenceApplicationRoutes {
	public static readonly LICENCE_APPLICATION = 'personal-licence';

	// AUTHENTICATED
	public static readonly LICENCE_BASE = 'application';
	public static readonly LICENCE_USER_APPLICATIONS_AUTHENTICATED = 'user-applications';

	public static readonly LICENCE_RETURN_FROM_BL_SOLE_PROPRIETOR = 'return-user-applications';
	public static readonly LICENCE_RETURN_FROM_BL_SOLE_PROPRIETOR_ANONYMOUS = 'return-user-applications-anonymous';

	public static readonly LICENCE_FIRST_TIME_USER_TERMS = 'terms-and-conditions';
	public static readonly LICENCE_FIRST_TIME_USER_SELECTION = 'user-selection';
	public static readonly LICENCE_LINK = 'licence-link';
	public static readonly LICENCE_LOGIN_USER_PROFILE = 'user-profile';

	public static readonly WORKER_LICENCE_UPDATE_TERMS_AUTHENTICATED = 'licence-update-terms';
	public static readonly WORKER_LICENCE_USER_PROFILE_AUTHENTICATED = 'licence-user-profile';

	public static readonly PERMIT_UPDATE_TERMS_AUTHENTICATED = 'permit-update-terms';
	public static readonly PERMIT_USER_PROFILE_AUTHENTICATED = 'permit-user-profile';

	public static readonly PERMIT_NEW_AUTHENTICATED = 'permit-new';
	public static readonly PERMIT_RENEWAL_AUTHENTICATED = 'permit-renew';
	public static readonly PERMIT_UPDATE_AUTHENTICATED = 'permit-update';

	public static readonly WORKER_LICENCE_NEW_AUTHENTICATED = 'worker-licence-new';
	public static readonly WORKER_LICENCE_RENEWAL_AUTHENTICATED = 'worker-licence-renew';
	public static readonly WORKER_LICENCE_UPDATE_AUTHENTICATED = 'worker-licence-update';
	public static readonly WORKER_LICENCE_REPLACEMENT_AUTHENTICATED = 'worker-licence-replacement';

	// ANONYMOUS
	public static readonly LICENCE_APPLICATION_ANONYMOUS = 'personal-application-anonymous';
	public static readonly LICENCE_APPLICATION_TYPE_ANONYMOUS = 'licence-application-type';
	public static readonly LICENCE_ACCESS_CODE_ANONYMOUS = 'licence-access-code';

	public static readonly WORKER_LICENCE_NEW_ANONYMOUS = 'worker-licence-new';
	public static readonly WORKER_LICENCE_RENEWAL_ANONYMOUS = 'worker-licence-renewal';
	public static readonly WORKER_LICENCE_REPLACEMENT_ANONYMOUS = 'worker-licence-replacement';
	public static readonly WORKER_LICENCE_UPDATE_ANONYMOUS = 'worker-licence-update';

	public static readonly PERMIT_APPLICATION_ANONYMOUS = 'permit-application-anonymous';
	public static readonly PERMIT_ACCESS_CODE_ANONYMOUS = 'permit-access-code';
	public static readonly PERMIT_TYPE_ANONYMOUS = 'permit-type';
	public static readonly PERMIT_NEW_ANONYMOUS = 'permit-new';
	public static readonly PERMIT_RENEWAL_ANONYMOUS = 'permit-renewal';
	public static readonly PERMIT_UPDATE_ANONYMOUS = 'permit-update';

	// PAYMENT
	public static readonly PAYMENT_SUCCESS = 'payment-success';
	public static readonly PAYMENT_FAIL = 'payment-fail';
	public static readonly PAYMENT_CANCEL = 'payment-cancel';
	public static readonly PAYMENT_ERROR = 'payment-error';
	public static readonly LICENCE_UPDATE_SUCCESS = 'licence-update-success';
	public static readonly PERMIT_UPDATE_SUCCESS = 'permit-update-success';

	public static readonly MODULE_PATH = PersonalLicenceApplicationRoutes.LICENCE_APPLICATION;

	public static path(route: string | null = null): string {
		return route
			? `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${route}`
			: `/${PersonalLicenceApplicationRoutes.MODULE_PATH}`;
	}

	public static pathUserApplications(): string {
		return `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${PersonalLicenceApplicationRoutes.LICENCE_BASE}/${PersonalLicenceApplicationRoutes.LICENCE_USER_APPLICATIONS_AUTHENTICATED}`;
	}

	public static pathReturnFromBusinessLicenceSoleProprietor(): string {
		return `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${PersonalLicenceApplicationRoutes.LICENCE_BASE}/${PersonalLicenceApplicationRoutes.LICENCE_RETURN_FROM_BL_SOLE_PROPRIETOR}`;
	}

	public static pathSecurityWorkerLicenceAuthenticated(route: string | null = null): string {
		return route
			? `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${PersonalLicenceApplicationRoutes.LICENCE_BASE}/${route}`
			: `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${PersonalLicenceApplicationRoutes.LICENCE_BASE}`;
	}

	public static pathSecurityWorkerLicenceAnonymous(route: string | null = null): string {
		return route
			? `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${PersonalLicenceApplicationRoutes.LICENCE_APPLICATION_ANONYMOUS}/${route}`
			: `/${PersonalLicenceApplicationRoutes.MODULE_PATH}`;
	}

	public static pathPermitAnonymous(route: string | null = null): string {
		return route
			? `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${PersonalLicenceApplicationRoutes.PERMIT_APPLICATION_ANONYMOUS}/${route}`
			: `/${PersonalLicenceApplicationRoutes.MODULE_PATH}`;
	}

	public static pathPermitAuthenticated(route: string | null = null): string {
		return route
			? `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${PersonalLicenceApplicationRoutes.LICENCE_BASE}/${route}`
			: `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${PersonalLicenceApplicationRoutes.LICENCE_BASE}`;
	}
}
