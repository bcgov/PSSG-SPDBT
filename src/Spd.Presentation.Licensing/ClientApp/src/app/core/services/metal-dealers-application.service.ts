import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, of, Subscription } from 'rxjs';
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
		registrationData: this.registrationFormGroup,
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
		fileUtilService: FileUtilService
	) {
		super(formBuilder, configService, utilService, fileUtilService);

		this.metalDealersModelChangedSubscription = this.metalDealersModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					const step1Complete = this.isStepRegistrationInformationComplete();
					const step2Complete = this.isStepBusinessOwnerComplete();
					const step3Complete = this.isStepBusinessManagerComplete();
					const step4Complete = this.isStepBusinessAddressesComplete();
					const step5Complete = this.isStepBranchOfficesComplete();
					const isValid = step1Complete && step2Complete && step3Complete && step4Complete && step5Complete;

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
	isStepRegistrationInformationComplete(): boolean {
		return this.registrationFormGroup.valid;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepBusinessOwnerComplete(): boolean {
		return this.businessOwnerFormGroup.valid;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepBusinessManagerComplete(): boolean {
		return this.businessManagerFormGroup.valid;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepBusinessAddressesComplete(): boolean {
		return this.businessAddressFormGroup.valid;
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
