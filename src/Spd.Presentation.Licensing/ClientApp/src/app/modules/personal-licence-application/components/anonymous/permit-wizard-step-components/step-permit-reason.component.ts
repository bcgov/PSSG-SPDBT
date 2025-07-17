import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';

@Component({
	selector: 'app-step-permit-reason',
	template: `
		<app-step-section [heading]="title" [subheading]="subtitle">
			<form [formGroup]="form" novalidate>
				@if (serviceTypeCode === serviceTypeCodes.BodyArmourPermit) {
					<div class="row">
						<div class="col-xxl-5 col-xl-5 col-lg-8 col-md-12 mx-auto">
							<div class="form-group" formGroupName="bodyArmourRequirementFormGroup">
								<mat-checkbox formControlName="isOutdoorRecreation"> Outdoor recreation </mat-checkbox>
								<mat-checkbox formControlName="isPersonalProtection"> Personal protection </mat-checkbox>
								<mat-checkbox formControlName="isMyEmployment"> My employment </mat-checkbox>
								<mat-checkbox formControlName="isTravelForConflict">
									Travel in response to international conflict
								</mat-checkbox>
								<mat-checkbox formControlName="isOther">Other</mat-checkbox>
								@if (
									(form.get('bodyArmourRequirementFormGroup')?.dirty ||
										form.get('bodyArmourRequirementFormGroup')?.touched) &&
									form.get('bodyArmourRequirementFormGroup')?.invalid &&
									form.get('bodyArmourRequirementFormGroup')?.hasError('atLeastOneCheckbox')
								) {
									<mat-error class="mat-option-error">At least one option must be selected</mat-error>
								}
							</div>
						</div>
					</div>
				}
				@if (serviceTypeCode === serviceTypeCodes.ArmouredVehiclePermit) {
					<div class="row">
						<div class="col-xxl-4 col-xl-5 col-lg-8 col-md-12 mx-auto">
							<div class="form-group" formGroupName="armouredVehicleRequirementFormGroup">
								<mat-checkbox formControlName="isPersonalProtection"> Personal protection </mat-checkbox>
								<mat-checkbox formControlName="isMyEmployment"> My employment </mat-checkbox>
								<mat-checkbox formControlName="isProtectionOfAnotherPerson">
									Protection of another person
								</mat-checkbox>
								<mat-checkbox formControlName="isProtectionOfPersonalProperty">
									Protection of personal property
								</mat-checkbox>
								<mat-checkbox formControlName="isProtectionOfOthersProperty">
									Protection of other's property
								</mat-checkbox>
								<mat-checkbox formControlName="isOther"> Other </mat-checkbox>
								@if (
									(form.get('armouredVehicleRequirementFormGroup')?.dirty ||
										form.get('armouredVehicleRequirementFormGroup')?.touched) &&
									form.get('armouredVehicleRequirementFormGroup')?.invalid &&
									form.get('armouredVehicleRequirementFormGroup')?.hasError('atLeastOneCheckbox')
								) {
									<mat-error class="mat-option-error">At least one option must be selected</mat-error>
								}
							</div>
						</div>
					</div>
				}
				@if (isOther === true) {
					<div class="row mt-3">
						<div class="col-xl-8 col-lg-12 mx-auto">
							<mat-form-field>
								<mat-label>Describe Requirement</mat-label>
								<textarea
									matInput
									formControlName="otherReason"
									style="min-height: 150px"
									maxlength="500"
									[errorStateMatcher]="matcher"
								></textarea>
								<mat-hint>Maximum 500 characters</mat-hint>
								@if (form.get('otherReason')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
							</mat-form-field>
						</div>
					</div>
				}
			</form>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepPermitReasonComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.permitApplicationService.permitRequirementFormGroup;

	serviceTypeCodes = ServiceTypeCode;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() serviceTypeCode: ServiceTypeCode | null = null;

	constructor(
		private optionsPipe: OptionsPipe,
		private permitApplicationService: PermitApplicationService
	) {}

	ngOnInit(): void {
		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.New: {
				this.title =
					this.serviceTypeCode === ServiceTypeCode.BodyArmourPermit
						? 'Why do you need body armour?'
						: 'Why do you require an armoured vehicle?';
				this.subtitle = '';
				break;
			}
			default: {
				const name = this.serviceTypeCode === ServiceTypeCode.BodyArmourPermit ? 'body armour' : 'an armoured vehicle';
				const serviceTypeCodeDesc = this.optionsPipe.transform(this.serviceTypeCode, 'ServiceTypes');

				this.title = `Confirm your reasons for requiring ${name}`;
				this.subtitle = `If your reasons for requiring the ${serviceTypeCodeDesc} have changed since your previous application, please provide the updated information.`;
				break;
			}
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isOther(): boolean {
		if (this.serviceTypeCode === ServiceTypeCode.BodyArmourPermit) {
			const bodyArmourRequirementFormGroup = this.form.get('bodyArmourRequirementFormGroup') as FormGroup;
			return (bodyArmourRequirementFormGroup.get('isOther') as FormControl).value;
		}

		const armouredVehicleRequirementFormGroup = this.form.get('armouredVehicleRequirementFormGroup') as FormGroup;
		return (armouredVehicleRequirementFormGroup.get('isOther') as FormControl).value;
	}

	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}
}
