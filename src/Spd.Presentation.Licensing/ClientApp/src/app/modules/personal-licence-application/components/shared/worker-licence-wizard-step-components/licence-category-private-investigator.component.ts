import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WorkerCategoryTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import {
	PrivateInvestigatorRequirementCode,
	PrivateInvestigatorTrainingCode,
} from '@app/core/code-types/model-desc.models';
import { LicenceApplicationService } from '@app/modules/personal-licence-application/licence-application.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-licence-category-private-investigator',
	template: `
		<div class="text-minor-heading mb-2">Proof of experience or training required</div>

		<form [formGroup]="form" novalidate>
			<div class="alert alert-category d-flex" role="alert">
				<div>
					<div class="fs-5 mb-2">Experience:</div>
					To qualify for a private investigator security worker licence, you must meet one of the following experience
					requirements:

					<mat-radio-group class="category-radio-group" aria-label="Select an option" formControlName="requirementCode">
						<mat-radio-button
							[value]="privateInvestigatorRequirementCodes.CategoryPrivateInvestigator_ExperienceAndCourses"
						>
							a) Two years of documented experience providing the services of a private investigator or private
							investigator under supervision, AND successful completion of recognized courses in evidence gathering and
							presentation and in the aspects of criminal and civil law that are relevant to the work of a private
							investigator in B.C.
							<mat-icon
								class="info-icon"
								matTooltip="You must prove that you have 2000 hours work experience ending no more than 5 years prior to the date of the application"
							>
								info
							</mat-icon>
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button
							[value]="
								privateInvestigatorRequirementCodes.CategoryPrivateInvestigator_TenYearsPoliceExperienceAndTraining
							"
						>
							b) Ten years of experience performing general police duties in a Canadian police force, AND proof of
							registration in the Private Security Training Network online course
							<i>Introduction to Private Investigation</i>.
							<mat-icon
								class="info-icon"
								matTooltip="Course and exam must be completed within the first year of licensing"
							>
								info
							</mat-icon>
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button
							[value]="privateInvestigatorRequirementCodes.CategoryPrivateInvestigator_KnowledgeAndExperience"
						>
							c) Knowledge and experience equivalent to that which would be obtained under paragraph (a) above.
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
				<div class="fs-5">
					<span
						*ngIf="
							requirementCode.value ===
							privateInvestigatorRequirementCodes.CategoryPrivateInvestigator_ExperienceAndCourses
						"
					>
						<div class="summary-heading mb-2">Upload document(s) providing the following information:</div>
						<span class="fs-6 fw-normal">
							<ul>
								<li>The names of employers</li>
								<li>The names of supervising private investigator licensees</li>
								<li>The dates of employment, and</li>
								<li>The hours logged with each employer</li>
								<li>Proof of experience must be provided on company letterhead, dated and signed</li>
							</ul>
						</span>
					</span>
					<span
						*ngIf="
							requirementCode.value ===
							privateInvestigatorRequirementCodes.CategoryPrivateInvestigator_TenYearsPoliceExperienceAndTraining
						"
					>
						Upload proof of registration in the Private Security Training Network online course Introduction to Private
						Investigation:
					</span>
					<span
						*ngIf="
							requirementCode.value ===
							privateInvestigatorRequirementCodes.CategoryPrivateInvestigator_KnowledgeAndExperience
						"
					>
						Upload document(s) providing proof of relevant knowledge and experience:
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

			<div class="alert alert-category d-flex mt-4" role="alert">
				<div>
					<div class="fs-5 mb-2">Training:</div>
					You must meet one of the following training requirements:

					<mat-radio-group class="category-radio-group" aria-label="Select an option" formControlName="trainingCode">
						<mat-radio-button
							[value]="privateInvestigatorTrainingCodes.CategoryPrivateInvestigator_TrainingRecognizedCourse"
						>
							You must have completed a recognized training course
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button
							[value]="privateInvestigatorTrainingCodes.CategoryPrivateInvestigator_TrainingOtherCoursesOrKnowledge"
						>
							You must provide proof of completion of courses or knowledge in the areas of:
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
							(form.get('trainingCode')?.dirty || form.get('trainingCode')?.touched) &&
							form.get('trainingCode')?.invalid &&
							form.get('trainingCode')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div>

			<div *ngIf="trainingCode.value" @showHideTriggerSlideAnimation>
				<div class="my-2">
					<div class="fs-5 mb-2">
						<span
							*ngIf="
								trainingCode.value ===
								privateInvestigatorTrainingCodes.CategoryPrivateInvestigator_TrainingRecognizedCourse
							"
						>
							Upload a copy of your course certificate
						</span>
						<span
							*ngIf="
								trainingCode.value ===
								privateInvestigatorTrainingCodes.CategoryPrivateInvestigator_TrainingOtherCoursesOrKnowledge
							"
							>Upload document(s) providing proof of course completion or equivalent knowledge</span
						>
					</div>
					<app-file-upload
						(fileUploaded)="onFileTrainingAdded($event)"
						(fileRemoved)="onFileRemoved()"
						[control]="trainingAttachments"
						[maxNumberOfFiles]="10"
						#trainingAttachmentsRef
						[files]="trainingAttachments.value"
					></app-file-upload>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('trainingAttachments')?.dirty || form.get('trainingAttachments')?.touched) &&
							form.get('trainingAttachments')?.invalid &&
							form.get('trainingAttachments')?.hasError('required')
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
export class LicenceCategoryPrivateInvestigatorComponent implements OnInit, LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.categoryPrivateInvestigatorFormGroup;
	matcher = new FormErrorStateMatcher();
	title = '';

	privateInvestigatorRequirementCodes = PrivateInvestigatorRequirementCode;
	privateInvestigatorTrainingCodes = PrivateInvestigatorTrainingCode;

	@ViewChild('attachmentsRef') fileUploadComponent!: FileUploadComponent;
	@ViewChild('trainingattachmentsRef') fileUploadTrainingComponent!: FileUploadComponent;

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(WorkerCategoryTypeCode.PrivateInvestigator, 'WorkerCategoryTypes');
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

	onFileTrainingAdded(file: File): void {
		this.licenceApplicationService.hasValueChanged = true;

		if (!this.licenceApplicationService.isAutoSave()) {
			return;
		}

		this.licenceApplicationService.addUploadDocument(this.trainingCode.value, file).subscribe({
			next: (resp: any) => {
				const matchingFile = this.trainingAttachments.value.find((item: File) => item.name == file.name);
				matchingFile.documentUrlId = resp.body[0].documentUrlId;
			},
			error: (error: any) => {
				console.log('An error occurred during file upload', error);

				this.fileUploadTrainingComponent.removeFailedFile(file);
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

	public get trainingCode(): FormControl {
		return this.form.get('trainingCode') as FormControl;
	}

	public get trainingAttachments(): FormControl {
		return this.form.get('trainingAttachments') as FormControl;
	}

	// public get fireCourseCertificateAttachments(): FormControl {
	// 	return this.form.get('fireCourseCertificateAttachments') as FormControl;
	// }

	// public get fireVerificationLetterAttachments(): FormControl {
	// 	return this.form.get('fireVerificationLetterAttachments') as FormControl;
	// }

	// public get addFireInvestigator(): FormControl {
	// 	return this.form.get('addFireInvestigator') as FormControl;
	// }
}
