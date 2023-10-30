import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WorkerCategoryTypeCode } from 'src/app/api/models';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import {
	BooleanTypeCode,
	PrivateInvestigatorRequirementCode,
	PrivateInvestigatorTrainingCode,
} from 'src/app/core/code-types/model-desc.models';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceApplicationService, LicenceChildStepperStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-private-investigator',
	template: `
		<div class="text-minor-heading mb-2">Proof of experience or training required</div>

		<form [formGroup]="form" novalidate>
			<div class="alert alert-category d-flex" role="alert">
				<div>
					<div class="fs-6 fw-bold mb-2">Experience:</div>
					To qualify for a private investigator security worker licence, you must meet one of the following experience
					requirements:

					<mat-radio-group class="category-radio-group" aria-label="Select an option" formControlName="requirementCode">
						<mat-radio-button
							class="radio-label"
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
							class="radio-label"
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
							class="radio-label"
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
				<div class="fs-6 fw-bold">
					<span
						*ngIf="
							requirementCode.value ==
							privateInvestigatorRequirementCodes.CategoryPrivateInvestigator_ExperienceAndCourses
						"
					>
						Upload document(s) providing the following information:
						<span class="fw-normal">
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
							requirementCode.value ==
							privateInvestigatorRequirementCodes.CategoryPrivateInvestigator_TenYearsPoliceExperienceAndTraining
						"
					>
						Upload proof of registration in the Private Security Training Network online course Introduction to Private
						Investigation:
					</span>
					<span
						*ngIf="
							requirementCode.value ==
							privateInvestigatorRequirementCodes.CategoryPrivateInvestigator_KnowledgeAndExperience
						"
					>
						Upload document(s) providing proof of relevant knowledge and experience:
					</span>
				</div>

				<div class="my-2">
					<app-file-upload
						(filesChanged)="onFilesChanged()"
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
				<!-- <div class="row" *ngIf="requirementCode.value == 'b'">
										<div class="col-lg-4 col-md-12 col-sm-12">
											<mat-form-field>
												<mat-label>Document Expiry Date</mat-label>
												<input
													matInput
													[matDatepicker]="picker"
													formControlName="documentExpiryDate"
													[errorStateMatcher]="matcher"
												/>
												<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
												<mat-datepicker #picker startView="multi-year"></mat-datepicker>
												<mat-error *ngIf="form.get('documentExpiryDate')?.hasError('required')"
													>This is required</mat-error
												>
											</mat-form-field>
										</div>
									</div> -->
			</div>

			<div class="alert alert-category d-flex mt-4" role="alert">
				<div>
					<div class="fs-6 fw-bold mb-2">Training:</div>
					You must meet one of the following training requirements:

					<mat-radio-group class="category-radio-group" aria-label="Select an option" formControlName="trainingCode">
						<mat-radio-button
							class="radio-label"
							[value]="privateInvestigatorTrainingCodes.CompleteRecognizedTrainingCourse"
						>
							You must have completed a recognized training course
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button
							class="radio-label"
							[value]="privateInvestigatorTrainingCodes.CompleteOtherCoursesOrKnowledge"
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
					<div class="fs-6 fw-bold mb-2">
						<span *ngIf="trainingCode.value == privateInvestigatorTrainingCodes.CompleteRecognizedTrainingCourse">
							Upload a copy of your course certificate:
						</span>
						<span *ngIf="trainingCode.value == privateInvestigatorTrainingCodes.CompleteOtherCoursesOrKnowledge"
							>Upload document(s) providing proof of course completion or equivalent knowledge:</span
						>
					</div>
					<app-file-upload
						(filesChanged)="onFilesChanged()"
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

			<!-- <div class="alert alert-category d-flex mt-4" role="alert">
				<div>
					<div class="fs-6 fw-bold mb-2">Do want to add Fire Investigator to this licence?</div>
					<mat-radio-group
						class="category-radio-group"
						aria-label="Select an option"
						formControlName="addFireInvestigator"
					>
						<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes"> Yes </mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No"> No </mat-radio-button>
					</mat-radio-group>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('addFireInvestigator')?.dirty || form.get('addFireInvestigator')?.touched) &&
							form.get('addFireInvestigator')?.invalid &&
							form.get('addFireInvestigator')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div>

			<div *ngIf="addFireInvestigator.value == booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
				<div class="fs-6 fw-bold mb-2">Proof of experience or training required</div>

				<div class="alert alert-category d-flex" role="alert">
					<div>
						<div class="fs-6 fw-bold mb-2">Experience:</div>
						To qualify for a fire investigator security worker licence, you must meet both of the following experience
						requirements:
						<ul>
							<li>
								JIBC Course in Fire Investigation from <i>Fire Cause & Origins</i> (or a similar course offered by
								another organization)
							</li>
							<li>Verification letter that you were investigating fires</li>
						</ul>
					</div>
				</div>

				<div class="my-2">
					<div class="text-minor-heading mb-2">Upload a copy of your course certificate:</div>
					<app-file-upload
										(filesChanged)="onFilesChanged()"
						[maxNumberOfFiles]="10"
						#fireCourseCertificateAttachmentsRef
						[files]="fireCourseCertificateAttachments.value"
						(filesChanged)="onFireCertFilesChanged()"
					></app-file-upload>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('fireCourseCertificateAttachments')?.dirty ||
								form.get('fireCourseCertificateAttachments')?.touched) &&
							form.get('fireCourseCertificateAttachments')?.invalid &&
							form.get('fireCourseCertificateAttachments')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>

				<div class="my-2">
					<div class="text-minor-heading mb-2">Upload a verification letter:</div>
					<app-file-upload
										(filesChanged)="onFilesChanged()"
						[maxNumberOfFiles]="10"
						#fireVerificationLetterAttachmentsRef
						[files]="fireVerificationLetterAttachments.value"
						(filesChanged)="onFireLetterFilesChanged()"
					></app-file-upload>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('fireVerificationLetterAttachments')?.dirty ||
								form.get('fireVerificationLetterAttachments')?.touched) &&
							form.get('fireVerificationLetterAttachments')?.invalid &&
							form.get('fireVerificationLetterAttachments')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div> -->
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class LicenceCategoryPrivateInvestigatorComponent implements OnInit, LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.categoryPrivateInvestigatorFormGroup;
	matcher = new FormErrorStateMatcher();
	title = '';

	booleanTypeCodes = BooleanTypeCode;
	privateInvestigatorRequirementCodes = PrivateInvestigatorRequirementCode;
	privateInvestigatorTrainingCodes = PrivateInvestigatorTrainingCode;

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(WorkerCategoryTypeCode.PrivateInvestigator, 'WorkerCategoryTypes');
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

	public get trainingAttachments(): FormControl {
		return this.form.get('trainingAttachments') as FormControl;
	}

	public get fireCourseCertificateAttachments(): FormControl {
		return this.form.get('fireCourseCertificateAttachments') as FormControl;
	}

	public get fireVerificationLetterAttachments(): FormControl {
		return this.form.get('fireVerificationLetterAttachments') as FormControl;
	}

	public get trainingCode(): FormControl {
		return this.form.get('trainingCode') as FormControl;
	}

	public get addFireInvestigator(): FormControl {
		return this.form.get('addFireInvestigator') as FormControl;
	}
}
