import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { PermitApplicationService } from '@core/services/permit-application.service';

@Component({
	selector: 'app-step-permit-reason',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<form [formGroup]="form" novalidate>
				<div class="row" *ngIf="serviceTypeCode === serviceTypeCodes.BodyArmourPermit">
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
									form.get('bodyArmourRequirementFormGroup')?.hasError('atLeastOneCheckbox')
								"
								>At least one option must be selected</mat-error
							>
						</div>
					</div>
				</div>
				<div class="row" *ngIf="serviceTypeCode === serviceTypeCodes.ArmouredVehiclePermit">
					<div class="col-xxl-4 col-xl-5 col-lg-12 mx-auto">
						<div class="form-group" formGroupName="armouredVehicleRequirementFormGroup">
							<mat-checkbox formControlName="isPersonalProtection"> Personal protection </mat-checkbox>
							<mat-checkbox formControlName="isMyEmployment"> My employment </mat-checkbox>
							<mat-checkbox formControlName="isProtectionOfAnotherPerson"> Protection of another person </mat-checkbox>
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
									form.get('armouredVehicleRequirementFormGroup')?.hasError('atLeastOneCheckbox')
								"
								>At least one option must be selected</mat-error
							>
						</div>
					</div>
				</div>
				<div class="row mt-3" *ngIf="isOther === true">
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
							<mat-error *ngIf="form.get('otherReason')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
})
export class StepPermitReasonComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.permitApplicationService.permitRequirementFormGroup;

	serviceTypeCodes = ServiceTypeCode;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() serviceTypeCode: ServiceTypeCode | null = null;

	constructor(private optionsPipe: OptionsPipe, private permitApplicationService: PermitApplicationService) {}

	ngOnInit(): void {
		const name = this.serviceTypeCode === ServiceTypeCode.BodyArmourPermit ? 'body armour' : 'an armoured vehicle';
		const serviceTypeCodeDesc = this.optionsPipe.transform(this.serviceTypeCode, 'ServiceTypes');

		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.New: {
				this.title = `Provide your reasons for requiring ${name}`;
				this.subtitle = '';
				break;
			}
			default: {
				this.title = `Confirm your reasons for requiring ${name}`;
				this.subtitle = `If the reasons for requiring your ${serviceTypeCodeDesc} have changed from your previous application, update your reasons`;
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
