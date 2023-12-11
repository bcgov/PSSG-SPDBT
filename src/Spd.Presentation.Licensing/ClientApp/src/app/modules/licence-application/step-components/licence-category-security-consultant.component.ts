import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { LicenceDocumentTypeCode, WorkerCategoryTypeCode } from 'src/app/api/models';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { SecurityConsultantRequirementCode } from 'src/app/core/code-types/model-desc.models';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceChildStepperStepComponent } from '../services/licence-application.helper';
import { LicenceApplicationService } from '../services/licence-application.service';

@Component({
	selector: 'app-licence-category-security-consultant',
	template: `
		<div class="text-minor-heading mb-2">Proof of experience required</div>

		<form [formGroup]="form" novalidate>
			<div class="alert alert-category d-flex" role="alert">
				<div>
					To qualify for a security consultant security worker licence, you must be able to provide advice and expertise
					in a number of specialized areas, including but not limited to:
					<ul>
						<li>Security alarms</li>
						<li>Closed circuit television</li>
						<li>Access controls</li>
						<li>Loss prevention surveys</li>
						<li>Physical security design</li>
						<li>Lighting and building design installation</li>
						<li>Insurance</li>
						<li>Electronic counter measures</li>
						<li>Tool marks</li>
						<li>Fingerprinting</li>
					</ul>

					You must provide proof of two years experience within the past five years in full-time employment providing
					any of the above-mentioned services.
				</div>
			</div>

			<div class="fs-6 fw-bold mb-2">Upload your resume:</div>

			<div class="my-2">
				<app-file-upload
					(fileUploaded)="onFileResumeAdded($event)"
					(fileRemoved)="onFileRemoved()"
					[control]="resumeAttachments"
					[maxNumberOfFiles]="10"
					#resumeAttachmentsRef
					[files]="resumeAttachments.value"
				></app-file-upload>
				<mat-error
					class="mat-option-error"
					*ngIf="
						(form.get('resumeAttachments')?.dirty || form.get('resumeAttachments')?.touched) &&
						form.get('resumeAttachments')?.invalid &&
						form.get('resumeAttachments')?.hasError('required')
					"
					>This is required</mat-error
				>
			</div>

			<div class="alert alert-category d-flex" role="alert">
				<div>
					You must meet the following experience requirements:
					<mat-radio-group class="category-radio-group" aria-label="Select an option" formControlName="requirementCode">
						<mat-radio-button [value]="securityConsultantRequirementCodes.CategorySecurityConsultant_ExperienceLetters">
							Written reference letters from previous employers (must be on company letterhead, dated and signed)
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button
							[value]="securityConsultantRequirementCodes.CategorySecurityConsultant_RecommendationLetters"
						>
							Clients verifying your experience
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
							requirementCode.value === securityConsultantRequirementCodes.CategorySecurityConsultant_ExperienceLetters
						"
					>
						Upload reference letters:
					</span>
					<span
						*ngIf="
							requirementCode.value ===
							securityConsultantRequirementCodes.CategorySecurityConsultant_RecommendationLetters
						"
					>
						Upload recommendation letters:
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
export class LicenceCategorySecurityConsultantComponent implements OnInit, LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.categorySecurityConsultantFormGroup;
	title = '';

	securityConsultantRequirementCodes = SecurityConsultantRequirementCode;

	@ViewChild('resumeAttachmentsRef') fileUploadResumeComponent!: FileUploadComponent;
	@ViewChild('attachmentsRef') fileUploadComponent!: FileUploadComponent;

	constructor(
		private optionsPipe: OptionsPipe,
		private authenticationService: AuthenticationService,
		private hotToastService: HotToastService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(WorkerCategoryTypeCode.SecurityConsultant, 'WorkerCategoryTypes');
	}

	onFileResumeAdded(file: File): void {
		if (this.authenticationService.isLoggedIn()) {
			this.licenceApplicationService
				.addUploadDocument(LicenceDocumentTypeCode.CategorySecurityConsultantExperienceLetters, file)
				.subscribe({
					next: (resp: any) => {
						const matchingFile = this.resumeAttachments.value.find((item: File) => item.name == file.name);
						matchingFile.documentUrlId = resp.body[0].documentUrlId;
					},
					error: (error: any) => {
						console.log('An error occurred during file upload', error);
						this.hotToastService.error('An error occurred during the file upload. Please try again.');
						this.fileUploadResumeComponent.removeFailedFile(file);
					},
				});
		}
	}

	onFileUploaded(file: File): void {
		if (this.authenticationService.isLoggedIn()) {
			this.licenceApplicationService.addUploadDocument(this.requirementCode.value, file).subscribe({
				next: (resp: any) => {
					const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
					matchingFile.documentUrlId = resp.body[0].documentUrlId;
				},
				error: (error: any) => {
					console.log('An error occurred during file upload', error);
					this.hotToastService.error('An error occurred during the file upload. Please try again.');
					this.fileUploadComponent.removeFailedFile(file);
				},
			});
		}
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

	public get resumeAttachments(): FormControl {
		return this.form.get('resumeAttachments') as FormControl;
	}
}
