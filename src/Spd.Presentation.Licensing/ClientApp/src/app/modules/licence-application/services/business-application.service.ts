import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConfigService } from '@app/core/services/config.service';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { BusinessApplicationHelper } from './business-application.helper';

@Injectable({
	providedIn: 'root',
})
export class BusinessApplicationService extends BusinessApplicationHelper {
	initialized = false;
	hasValueChanged = false;

	permitModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	businessModelFormGroup: FormGroup = this.formBuilder.group({
		licenceAppId: new FormControl(null),
	});

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		formatDatePipe: FormatDatePipe
		// private licenceFeeService: LicenceFeeService,
		// private workerLicensingService: WorkerLicensingService,
		// private licenceLookupService: LicenceLookupService,
		// private authUserBcscService: AuthUserBcscService,
		// private authenticationService: AuthenticationService,
		// private utilService: UtilService
	) {
		super(formBuilder, configService, formatDatePipe);
	}

	/**
	 * Create an empty anonymous licence
	 * @returns
	 */
	createNewBusinessAnonymous(): Observable<any> {
		return this.createEmptyBusinessAnonymous().pipe(
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

		// const aliases = this.businessModelFormGroup.controls['aliasesData'].get('aliases') as FormArray;
		// aliases.clear();
	}

	private createEmptyBusinessAnonymous(): Observable<any> {
		this.reset();

		// const workerLicenceTypeData = { workerLicenceTypeCode: workerLicenceTypeCode };
		// const photographOfYourselfData = { useBcServicesCardPhoto: BooleanTypeCode.No };

		// this.businessModelFormGroup.patchValue(
		// 	{
		// 		workerLicenceTypeData,
		// 		photographOfYourselfData,
		// 		profileConfirmationData: { isProfileUpToDate: true },
		// 	},
		// 	{
		// 		emitEvent: false,
		// 	}
		// );

		return of(this.businessModelFormGroup.value);
	}
}
