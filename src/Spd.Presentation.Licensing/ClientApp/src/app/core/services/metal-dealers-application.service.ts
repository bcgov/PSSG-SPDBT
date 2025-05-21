import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, of, Subscription } from 'rxjs';
import { CommonApplicationService } from './common-application.service';
import { ConfigService } from './config.service';
import { FileUtilService } from './file-util.service';
import { MetalDealersApplicationHelper } from './metal-dealers-application.helper';
import { UtilService } from './util.service';

@Injectable({
	providedIn: 'root',
})
export class MetalDealersApplicationService extends MetalDealersApplicationHelper {
	metalDealersModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	metalDealersModelFormGroup: FormGroup = this.formBuilder.group({
		applicationTypeData: this.applicationTypeFormGroup,
		businessOwnerData: this.businessOwnerFormGroup,
		businessManagerData: this.businessManagerFormGroup,
		businessAddressData: this.businessAddressFormGroup,
		businessMailingAddressData: this.businessMailingAddressFormGroup,
		branchesData: this.branchesFormGroup,
		consentAndDeclarationData: this.consentAndDeclarationFormGroup,
	});

	metalDealersModelChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		utilService: UtilService,
		fileUtilService: FileUtilService,
		private commonApplicationService: CommonApplicationService
	) {
		super(formBuilder, configService, utilService, fileUtilService);

		this.metalDealersModelChangedSubscription = this.metalDealersModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					const step2Complete = this.isStepBusinessInfoComplete();
					const step3Complete = this.isStepBranchOfficesComplete();
					const isValid = step2Complete && step3Complete;

					console.debug('metalDealersModelFormGroup CHANGED', this.metalDealersModelFormGroup.getRawValue());

					this.updateModelChangeFlags();

					this.metalDealersModelValueChanges$.next(isValid);
				}
			});
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepBusinessInfoComplete(): boolean {
		return (
			this.businessOwnerFormGroup.valid && this.businessManagerFormGroup.valid && this.businessAddressFormGroup.valid
		);
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepBranchOfficesComplete(): boolean {
		return this.branchesFormGroup.valid;
	}

	/**
	 * Create an empty registration
	 * @returns
	 */
	createNewRegistration(): Observable<any> {
		this.reset();

		this.commonApplicationService.setMdraApplicationTitle(ApplicationTypeCode.New);

		this.initialized = true;
		return of(this.metalDealersModelFormGroup.value);
	}

	/**
	 * Reset the licence data
	 * @returns
	 */
	reset(): void {
		this.resetModelFlags();
		this.resetCommon();

		this.consentAndDeclarationFormGroup.reset();
		this.metalDealersModelFormGroup.reset();

		console.debug('RESET', this.initialized, this.metalDealersModelFormGroup.value);
	}
}
