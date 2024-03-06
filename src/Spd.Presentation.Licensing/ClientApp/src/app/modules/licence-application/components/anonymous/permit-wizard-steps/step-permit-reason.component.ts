import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-permit-reason',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title [title]="title" [subtitle]="subtitle"></app-step-title>

				<form [formGroup]="form" novalidate>
					<div class="row" *ngIf="workerLicenceTypeCode === workerLicenceTypeCodes.BodyArmourPermit">
						<div class="col-xxl-4 col-xl-5 col-lg-12 mx-auto">
							<div class="form-group" formGroupName="bodyArmourRequirementFormGroup">
								<mat-checkbox formControlName="isOutdoorRecreation"> Outdoor recreation </mat-checkbox>
								<mat-checkbox formControlName="isPersonalProtection"> Personal protection </mat-checkbox>
								<mat-checkbox formControlName="isMyEmployment"> My employment </mat-checkbox>
								<mat-checkbox formControlName="isTravelForConflict">
									Travel in response to international conflict
								</mat-checkbox>
								<mat-checkbox formControlName="isOther">Other</mat-checkbox>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('bodyArmourRequirementFormGroup')?.dirty ||
											form.get('bodyArmourRequirementFormGroup')?.touched) &&
										form.get('bodyArmourRequirementFormGroup')?.invalid &&
										form.get('bodyArmourRequirementFormGroup')?.hasError('atLeastOneCheckboxValidator')
									"
									>At least one option must be selected</mat-error
								>
							</div>
						</div>
					</div>
					<div class="row" *ngIf="workerLicenceTypeCode === workerLicenceTypeCodes.ArmouredVehiclePermit">
						<div class="col-xxl-4 col-xl-5 col-lg-12 mx-auto">
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
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('armouredVehicleRequirementFormGroup')?.dirty ||
											form.get('armouredVehicleRequirementFormGroup')?.touched) &&
										form.get('armouredVehicleRequirementFormGroup')?.invalid &&
										form.get('armouredVehicleRequirementFormGroup')?.hasError('atLeastOneCheckboxValidator')
									"
									>At least one option must be selected</mat-error
								>
							</div>
						</div>
					</div>
					<div class="row mt-3" *ngIf="isOther === true">
						<div class="col-xxl-6 col-xl-8 col-lg-12 mx-auto">
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
								<mat-error *ngIf="form.get('otherReason')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
					</div>
				</form>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitReasonComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';
	matcher = new FormErrorStateMatcher();
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.permitApplicationService.permitRequirementFormGroup;

	workerLicenceTypeCodes = WorkerLicenceTypeCode;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() workerLicenceTypeCode: WorkerLicenceTypeCode | null = null;

	constructor(private permitApplicationService: PermitApplicationService) {}

	ngOnInit(): void {
		const name =
			this.workerLicenceTypeCode === WorkerLicenceTypeCode.BodyArmourPermit ? 'body armour' : 'an armoured vehicle';
		this.title = `Why do you require a permit for ${name}?`;
		this.subtitle = this.isRenewalOrUpdate
			? `If the purpose for possessing ${name} has changed from your previous application, update your selection`
			: '';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isOther(): boolean {
		if (this.workerLicenceTypeCode === WorkerLicenceTypeCode.BodyArmourPermit) {
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
