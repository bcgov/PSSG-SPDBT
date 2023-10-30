import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WorkerCategoryTypeCode } from 'src/app/api/models';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { SecurityAlarmInstallerRequirementCode } from 'src/app/core/code-types/model-desc.models';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceApplicationService, LicenceChildStepperStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-security-alarm-installer',
	template: `
		<div class="text-minor-heading mb-2">Proof of experience or training required</div>

		<form [formGroup]="form" novalidate>
			<div class="alert alert-category d-flex" role="alert">
				<div>
					To qualify for a security alarm installer security worker licence, you must meet one of the following
					experience requirements:

					<mat-radio-group class="category-radio-group" aria-label="Select an option" formControlName="requirementCode">
						<mat-radio-button
							class="radio-label"
							[value]="
								securityAlarmInstallerRequirementCodes.CategorySecurityAlarmInstaller_TradesQualificationCertificate
							"
						>
							Trades Qualification Certificate
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button
							class="radio-label"
							[value]="
								securityAlarmInstallerRequirementCodes.CategorySecurityAlarmInstaller_ExperienceOrTrainingEquivalent
							"
						>
							Experience or training equivalent to the Trades Qualification Certificate
						</mat-radio-button>
					</mat-radio-group>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('requirementCode')?.dirty || form.get('requirementCode')?.touched) &&
							form.get('requirementCode')?.invalid &&
							form.get('requirementCode')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div>

			<div *ngIf="requirementCode.value" @showHideTriggerSlideAnimation>
				<div class="fs-6 fw-bold mb-2">
					<span
						*ngIf="
							requirementCode.value ==
							securityAlarmInstallerRequirementCodes.CategorySecurityAlarmInstaller_TradesQualificationCertificate
						"
					>
						Upload a copy of your certificate:
					</span>
					<span
						*ngIf="
							requirementCode.value ==
							securityAlarmInstallerRequirementCodes.CategorySecurityAlarmInstaller_ExperienceOrTrainingEquivalent
						"
					>
						Upload document(s) providing proof of equivalent training:
					</span>
				</div>

				<div class="my-2">
					<app-file-upload
						(filesChanged)="onFilesChanged()"
						[control]="attachments"
						[maxNumberOfFiles]="10"
						[files]="attachments.value"
					></app-file-upload>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
							form.get('attachments')?.invalid &&
							form.get('attachments')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div>
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class LicenceCategorySecurityAlarmInstallerComponent implements OnInit, LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.categorySecurityAlarmInstallerFormGroup;
	title = '';

	securityAlarmInstallerRequirementCodes = SecurityAlarmInstallerRequirementCode;

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(WorkerCategoryTypeCode.SecurityAlarmInstaller, 'WorkerCategoryTypes');
	}

	onFilesChanged(): void {
		this.licenceApplicationService.hasDocumentsChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	public get requirementCode(): FormControl {
		return this.form.get('requirementCode') as FormControl;
	}

	public get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
