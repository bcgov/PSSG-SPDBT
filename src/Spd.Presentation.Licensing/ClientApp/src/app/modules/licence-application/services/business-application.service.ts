import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { ConfigService } from '@app/core/services/config.service';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { BusinessApplicationHelper } from './business-application.helper';
import { CommonApplicationService } from './common-application.service';

@Injectable({
	providedIn: 'root',
})
export class BusinessApplicationService extends BusinessApplicationHelper {
	initialized = false;
	hasValueChanged = false;

	businessModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	businessModelFormGroup: FormGroup = this.formBuilder.group({
		licenceAppId: new FormControl(null),

		workerLicenceTypeData: this.workerLicenceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,
		businessTypeData: this.businessTypeFormGroup,
		categoryData: this.categoryFormGroup,
		categoryArmouredCarGuardData: this.categoryArmouredCarGuardFormGroup,
		categoryPrivateInvestigatorData: this.categoryPrivateInvestigatorFormGroup,
		categorySecurityGuardData: this.categorySecurityGuardFormGroup,
		businessAddressData: this.businessAddressFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		bcBusinessAddressData: this.bcBusinessAddressFormGroup,
		branchesInBcData: this.branchesInBcFormGroup,
	});

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		formatDatePipe: FormatDatePipe,
		private commonApplicationService: CommonApplicationService // private licenceFeeService: LicenceFeeService, // private securityWorkerLicensingService: WorkerLicensingService, // private licenceLookupService: LicenceLookupService, // private authUserBcscService: AuthUserBcscService, // private authenticationService: AuthenticationService, // private utilService: UtilService
	) {
		super(formBuilder, configService, formatDatePipe);
	}

	/**
	 * Create an empty anonymous licence
	 * @returns
	 */
	createNewBusinessLicence(): Observable<any> {
		return this.createEmptyBusinessLicence().pipe(
			tap((resp: any) => {
				console.debug('[createNewBusinessAnonymous] resp', resp);

				this.initialized = true;
			})
		);
	}

	/**
	 * Reset the licence data
	 * @returns
	 */
	reset(): void {
		this.initialized = false;
		console.debug('reset.initialized', this.initialized);
		this.hasValueChanged = false;

		this.businessModelFormGroup.reset();
	}

	private createEmptyBusinessLicence(): Observable<any> {
		this.reset();

		const workerLicenceTypeData = { workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityBusinessLicence };
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.New };

		this.businessModelFormGroup.patchValue(
			{
				workerLicenceTypeData,
				applicationTypeData,
			},
			{
				emitEvent: false,
			}
		);

		this.commonApplicationService.setApplicationTitle(
			WorkerLicenceTypeCode.SecurityBusinessLicence,
			ApplicationTypeCode.New
		);

		return of(this.businessModelFormGroup.value);
	}
}
