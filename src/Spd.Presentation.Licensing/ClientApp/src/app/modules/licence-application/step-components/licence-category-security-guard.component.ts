import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WorkerCategoryTypeCode } from 'src/app/api/models';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { SecurityGuardRequirementCode } from 'src/app/core/code-types/model-desc.models';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-security-guard',
	template: `
		<div class="text-minor-heading mb-2">Proof of experience or training required</div>

		<form [formGroup]="form" novalidate>
			<div class="alert alert-category d-flex" role="alert">
				<div>
					<div class="fs-6 fw-bold mb-2">Experience:</div>
					To qualify for a security guard security worker licence, you must meet one of the following training or
					experience requirements:
					<mat-radio-group class="category-radio-group" aria-label="Select an option" formControlName="requirementCode">
						<mat-radio-button
							class="radio-label"
							[value]="securityGuardRequirementCodes.BasicSecurityTrainingCertificate"
						>
							Basic Security Training Certificate issued by the Justice Institute of British Columbia (JIBC)
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button class="radio-label" [value]="securityGuardRequirementCodes.PoliceExperienceOrTraining">
							Proof of training or experience providing general duties as a Canadian police officer, correctional
							officer, sheriff, auxiliary, reserve, or border service officer
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button
							class="radio-label"
							[value]="securityGuardRequirementCodes.BasicSecurityTrainingCourseEquivalent"
						>
							Certificate equivalent to the Basic Security Training course offered by JIBC
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
				<div
					class="fs-6 fw-bold mb-2"
					*ngIf="requirementCode.value == securityGuardRequirementCodes.PoliceExperienceOrTraining; else uploadcopy"
				>
					Upload a training certificate or reference letter from your employment supervisor or human resources office:
				</div>
				<ng-template #uploadcopy>
					<div class="fs-6 fw-bold mb-2">Upload a copy of your certificate:</div>
				</ng-template>
				<div class="my-2">
					<app-file-upload
						[maxNumberOfFiles]="10"
						[files]="attachments.value"
						(filesChanged)="onFilesChanged()"
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
	styles: [
		`
			.category-radio-group > .radio-label .mdc-label {
				font-size: initial;
				color: initial;
			}
		`,
	],
	animations: [showHideTriggerSlideAnimation],
	encapsulation: ViewEncapsulation.None,
})
export class LicenceCategorySecurityGuardComponent implements OnInit, LicenceFormStepComponent {
	form: FormGroup = this.licenceApplicationService.categorySecurityGuardFormGroup;
	title = '';

	securityGuardRequirementCodes = SecurityGuardRequirementCode;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(WorkerCategoryTypeCode.SecurityGuard, 'SwlCategoryTypes');
	}

	isFormValid(): boolean {
		this.onFilesChanged();

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFilesChanged(): void {
		const attachments =
			this.fileUploadComponent?.files && this.fileUploadComponent?.files.length > 0
				? this.fileUploadComponent.files
				: [];
		this.form.controls['attachments'].setValue(attachments);
	}

	public get requirementCode(): FormControl {
		return this.form.get('requirementCode') as FormControl;
	}

	public get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
