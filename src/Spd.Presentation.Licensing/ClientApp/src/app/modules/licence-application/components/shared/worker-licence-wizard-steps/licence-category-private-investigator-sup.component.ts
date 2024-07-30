import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WorkerCategoryTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { PrivateInvestigatorSupRequirementCode } from 'src/app/core/code-types/model-desc.models';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';

@Component({
	selector: 'app-licence-category-private-investigator-sup',
	template: `
		<div class="text-minor-heading mb-2">Proof of experience or training required</div>

		<form [formGroup]="form" novalidate>
			<div class="alert alert-category d-flex" role="alert">
				<div>
					<div class="fs-5 mb-2">Training:</div>
					To qualify for a Private Investigator Under Supervision licence, you must meet one of the following training
					requirements:

					<mat-radio-group class="category-radio-group" aria-label="Select an option" formControlName="requirementCode">
						<mat-radio-button
							[value]="
								privateInvestigatorSupRequirementCodes.CategoryPrivateInvestigatorUnderSupervision_PrivateSecurityTrainingNetworkCompletion
							"
						>
							Successful completion of the Private Security Training Network (PSTnetwork) online course
							<i>Introduction to Private Investigation</i> and proof of final exam completion
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button
							[value]="
								privateInvestigatorSupRequirementCodes.CategoryPrivateInvestigatorUnderSupervision_OtherCourseCompletion
							"
						>
							Completion of courses or demonstrated knowledge in the areas of:
							<ul>
								<li>Criminal law</li>
								<li>Civil law and process</li>
								<li>Human rights legislation</li>
								<li>Information and privacy legislation</li>
								<li>Evidence recognition, presentation and protocols</li>
								<li>Interviewing techniques</li>
								<li>Report writing</li>
								<li>Documentary research (electronic and hard copy), and</li>
								<li>Surveillance techniques</li>
							</ul>
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
				<div class="fs-5 mb-2">
					<span
						*ngIf="
							requirementCode.value ===
							privateInvestigatorSupRequirementCodes.CategoryPrivateInvestigatorUnderSupervision_PrivateSecurityTrainingNetworkCompletion
						"
					>
						Upload proof of course completion
					</span>
					<span
						*ngIf="
							requirementCode.value ===
							privateInvestigatorSupRequirementCodes.CategoryPrivateInvestigatorUnderSupervision_OtherCourseCompletion
						"
					>
						Upload document(s) providing proof of course completion or equivalent knowledge
					</span>
				</div>

				<div class="my-2">
					<app-file-upload
						(fileUploaded)="onFileUploaded($event)"
						(fileRemoved)="onFileRemoved()"
						[control]="attachments"
						[maxNumberOfFiles]="10"
						#attachmentsRef
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
export class LicenceCategoryPrivateInvestigatorSupComponent implements OnInit, LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.categoryPrivateInvestigatorSupFormGroup;
	matcher = new FormErrorStateMatcher();
	title = '';

	privateInvestigatorSupRequirementCodes = PrivateInvestigatorSupRequirementCode;

	@ViewChild('attachmentsRef') fileUploadComponent!: FileUploadComponent;

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(
			WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision,
			'WorkerCategoryTypes'
		);
	}

	onFileUploaded(file: File): void {
		this.licenceApplicationService.hasValueChanged = true;

		if (!this.licenceApplicationService.isAutoSave()) {
			return;
		}

		this.licenceApplicationService.addUploadDocument(this.requirementCode.value, file).subscribe({
			next: (resp: any) => {
				const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
				matchingFile.documentUrlId = resp.body[0].documentUrlId;
			},
			error: (error: any) => {
				console.log('An error occurred during file upload', error);

				this.fileUploadComponent.removeFailedFile(file);
			},
		});
	}

	onFileRemoved(): void {
		this.licenceApplicationService.hasValueChanged = true;
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
