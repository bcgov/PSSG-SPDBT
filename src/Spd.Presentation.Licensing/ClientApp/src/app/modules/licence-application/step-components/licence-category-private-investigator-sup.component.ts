import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { LicenceDocumentTypeCode, WorkerCategoryTypeCode } from 'src/app/api/models';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { PrivateInvestigatorSupRequirementCode } from 'src/app/core/code-types/model-desc.models';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceChildStepperStepComponent } from '../licence-application.helper';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-private-investigator-sup',
	template: `
		<div class="text-minor-heading mb-2">Proof of experience or training required</div>

		<form [formGroup]="form" novalidate>
			<div class="alert alert-category d-flex" role="alert">
				<div>
					<div class="fs-6 fw-bold mb-2">Experience:</div>
					To qualify for a private investigator under supervision licence, you must meet one of the following experience
					requirements:

					<mat-radio-group class="category-radio-group" aria-label="Select an option" formControlName="requirementCode">
						<mat-radio-button
							class="radio-label"
							[value]="
								privateInvestigatorSupRequirementCodes.CategoryPrivateInvestigatorUnderSupervision_PrivateSecurityTrainingNetworkCompletion
							"
						>
							Successful completion of the Private Security Training Network (PSTnetwork) online course
							<i>Introduction to Private Investigation</i> and proof of final exam completion
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button
							class="radio-label"
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
				<div class="fs-6 fw-bold mb-2">
					<span
						*ngIf="
							requirementCode.value ==
							privateInvestigatorSupRequirementCodes.CategoryPrivateInvestigatorUnderSupervision_PrivateSecurityTrainingNetworkCompletion
						"
					>
						Upload proof of course and exam completion:
					</span>
					<span
						*ngIf="
							requirementCode.value ==
							privateInvestigatorSupRequirementCodes.CategoryPrivateInvestigatorUnderSupervision_OtherCourseCompletion
						"
					>
						Upload document(s) providing proof of course completion or equivalent knowledge:
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

				<!-- <div class="row" *ngIf="requirement.value == 'a'">
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
					You must provide proof of successfully completing any of the above two listed course requirements.
				</div>
			</div>

			<div class="fs-6 fw-bold mb-2">Upload proof of course completion:</div>

			<div class="my-2">
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
	@ViewChild('trainingAttachmentsRef') fileUploadTrainingComponent!: FileUploadComponent;

	constructor(
		private optionsPipe: OptionsPipe,
		private authenticationService: AuthenticationService,
		private hotToastService: HotToastService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(
			WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision,
			'WorkerCategoryTypes'
		);
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

	onFileTrainingAdded(file: File): void {
		if (this.authenticationService.isLoggedIn()) {
			this.licenceApplicationService
				.addUploadDocument(LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervisionTraining, file)
				.subscribe({
					next: (resp: any) => {
						const matchingFile = this.trainingAttachments.value.find((item: File) => item.name == file.name);
						matchingFile.documentUrlId = resp.body[0].documentUrlId;
					},
					error: (error: any) => {
						console.log('An error occurred during file upload', error);
						this.hotToastService.error('An error occurred during the file upload. Please try again.');
						this.fileUploadTrainingComponent.removeFailedFile(file);
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

	public get trainingAttachments(): FormControl {
		return this.form.get('trainingAttachments') as FormControl;
	}
}
