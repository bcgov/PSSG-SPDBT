import { Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-team-other-trainings',
	template: `
		<app-step-section
			heading="Other Training"
			subheading="If you have not attended a training school or formal training program, please list any informal training you have received."
		>
			<div [formGroup]="form">
				<div class="row my-2">
					<div class="col-xxl-11 col-xl-12 mx-auto">
						@for (group of otherTrainingsArray.controls; track group; let i = $index) {
							<section formArrayName="otherTrainings">
								<div class="other-entry" [formGroupName]="i" @showHideTriggerSlideAnimation>
									<div class="row">
										<div class="col-12">
											<div class="text-minor-heading mb-2">Training Details</div>
											<mat-form-field>
												<textarea
													matInput
													aria-label="Training details"
													formControlName="trainingDetail"
													style="min-height: 80px"
													[errorStateMatcher]="matcher"
													maxlength="1000"
												></textarea>
												<mat-hint>Maximum 1000 characters</mat-hint>
												@if (group.get('trainingDetail')?.hasError('required')) {
													<mat-error>This is required</mat-error>
												}
											</mat-form-field>
										</div>
										<div class="col-12">
											<div class="text-minor-heading mt-3 mb-2">Did you use a personal dog trainer?</div>
											<mat-radio-group aria-label="Select an option" formControlName="usePersonalDogTrainer">
												<div class="d-flex justify-content-start">
													<mat-radio-button class="radio-label w-auto" [value]="booleanTypeCodes.No"
														>No</mat-radio-button
													>
													<mat-radio-button class="radio-label w-auto" [value]="booleanTypeCodes.Yes"
														>Yes</mat-radio-button
													>
												</div>
											</mat-radio-group>
											@if (
												(group.get('usePersonalDogTrainer')?.dirty || group.get('usePersonalDogTrainer')?.touched) &&
												group.get('usePersonalDogTrainer')?.invalid &&
												group.get('usePersonalDogTrainer')?.hasError('required')
											) {
												<mat-error>This is required</mat-error>
											}
										</div>
									</div>
									@if (isUsePersonalDogTrainer(i)) {
										<div class="row mt-3" @showHideTriggerSlideAnimation>
											<div class="text-minor-heading mt-3 mb-2">Personal Trainer Information</div>
											<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12">
												<mat-form-field>
													<mat-label>Trainer Credentials</mat-label>
													<input
														matInput
														formControlName="dogTrainerCredential"
														[errorStateMatcher]="matcher"
														maxlength="100"
													/>
													@if (group.get('dogTrainerCredential')?.hasError('required')) {
														<mat-error>This is required</mat-error>
													}
												</mat-form-field>
											</div>
											<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12">
												<mat-form-field>
													<mat-label>Time Spent Training</mat-label>
													<input matInput formControlName="trainingTime" [errorStateMatcher]="matcher" maxlength="15" />
													@if (group.get('trainingTime')?.hasError('required')) {
														<mat-error>This is required</mat-error>
													}
												</mat-form-field>
											</div>
											<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12">
												<mat-form-field>
													<mat-label>Trainer Given Name</mat-label>
													<input
														matInput
														formControlName="trainerGivenName"
														[errorStateMatcher]="matcher"
														maxlength="40"
													/>
												</mat-form-field>
											</div>
											<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12">
												<mat-form-field>
													<mat-label>Trainer Surname</mat-label>
													<input
														matInput
														formControlName="trainerSurname"
														[errorStateMatcher]="matcher"
														maxlength="40"
													/>
													@if (group.get('trainerSurname')?.hasError('required')) {
														<mat-error>This is required</mat-error>
													}
												</mat-form-field>
											</div>
											<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12">
												<mat-form-field>
													<mat-label>Trainer Phone Number</mat-label>
													<input
														matInput
														formControlName="trainerPhoneNumber"
														[mask]="phoneMask"
														[showMaskTyped]="false"
														[errorStateMatcher]="matcher"
														placeholder="(123) 456-7890"
														aria-label="Enter the 10 digit phone number."
													/>
													@if (group.get('trainerPhoneNumber')?.hasError('required')) {
														<mat-error>This is required</mat-error>
													}
												</mat-form-field>
											</div>
											<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12">
												<mat-form-field>
													<mat-label>Trainer Email Address <span class="optional-label">(optional)</span></mat-label>
													<input
														matInput
														formControlName="trainerEmailAddress"
														[errorStateMatcher]="matcher"
														maxlength="75"
													/>
													@if (group.get('trainerEmailAddress')?.hasError('email')) {
														<mat-error>Must be a valid email address</mat-error>
													}
												</mat-form-field>
											</div>
											<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12">
												<mat-form-field>
													<mat-label>Hours spent practicing the skills learned</mat-label>
													<input
														matInput
														formControlName="hoursPracticingSkill"
														[errorStateMatcher]="matcher"
														maxlength="100"
													/>
													<mat-hint>e.g. 20 hours/week for 8 weeks</mat-hint>
													@if (group.get('hoursPracticingSkill')?.hasError('required')) {
														<mat-error>This is required</mat-error>
													}
												</mat-form-field>
											</div>
										</div>
									}
									<div class="d-flex justify-content-end">
										@if (isAllowDelete()) {
											<button
												mat-flat-button
												type="button"
												color="primary"
												class="large w-auto"
												aria-label="Remove this training"
												(click)="onRemoveOtherTrainingRow(i)"
											>
												Remove this Training
											</button>
										}
									</div>
								</div>
							</section>
						}

						<div class="mb-4 d-flex justify-content-center">
							<button
								mat-flat-button
								type="button"
								color="primary"
								class="large w-auto mt-2 mt-md-0"
								(click)="onAddOtherTraining()"
							>
								Add Another Training
							</button>
						</div>

						<div class="mb-4">
							<div class="text-minor-heading">
								Upload supporting documentation (e.g. curriculum document, certificate, etc.)
								<span class="optional-label">(optional)</span>
							</div>
							<div class="mt-2">
								<app-file-upload
									(fileUploaded)="onFileUploaded($event)"
									(fileRemoved)="onFileRemoved()"
									[maxNumberOfFiles]="10"
									[control]="attachments"
									#attachmentsRef
									[files]="attachments.value"
									ariaFileUploadLabel="Upload supporting training documentation"
								></app-file-upload>
							</div>
						</div>

						<div class="text-minor-heading">
							Upload logs of practice hours <span class="optional-label">(optional)</span>
						</div>
						<div class="mt-2">
							<app-file-upload
								(fileUploaded)="onFileUploadedPracticeLog($event)"
								(fileRemoved)="onFileRemoved()"
								[maxNumberOfFiles]="10"
								[control]="practiceLogAttachments"
								#practiceLogAttachmentsRef
								[files]="practiceLogAttachments.value"
								ariaFileUploadLabel="Upload logs of practice hours"
							></app-file-upload>
						</div>
					</div>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [
		`
			.other-entry {
				border: 2px solid var(--color-yellow);
				border-left: 4px solid var(--color-yellow);
				padding: 16px;
				margin-bottom: 20px;
			}
		`,
	],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class StepTeamOtherTrainingsComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.gdsdTeamApplicationService.otherTrainingHistoryFormGroup;

	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	@ViewChild('attachmentsRef') fileUploadComponent!: FileUploadComponent;
	@ViewChild('practiceLogAttachmentsRef') practiceLogFileUploadComponent!: FileUploadComponent;

	constructor(
		private dialog: MatDialog,
		private gdsdTeamApplicationService: GdsdTeamApplicationService
	) {}

	onRemoveOtherTrainingRow(index: number) {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this training?',
			actionText: 'Remove',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.gdsdTeamApplicationService.otherTrainingRowRemove(index);
				}
			});
	}

	onAddOtherTraining(): void {
		this.gdsdTeamApplicationService.otherTrainingRowAdd();
	}

	isAllowDelete(): boolean {
		return this.otherTrainingsArray.length > 1;
	}

	onFileUploaded(file: File): void {
		this.gdsdTeamApplicationService.fileUploaded(
			LicenceDocumentTypeCode.DogTrainingCurriculumCertificateSupportingDocument,
			file,
			this.attachments,
			this.fileUploadComponent
		);
	}

	onFileUploadedPracticeLog(file: File): void {
		this.gdsdTeamApplicationService.fileUploaded(
			LicenceDocumentTypeCode.GdsdPracticeHoursLog,
			file,
			this.practiceLogAttachments,
			this.practiceLogFileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.gdsdTeamApplicationService.fileRemoved();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	isUsePersonalDogTrainer(index: number): boolean {
		return this.gdsdTeamApplicationService.otherTrainingRowUsePersonalTraining(index);
	}

	get otherTrainingsArray(): FormArray {
		return <FormArray>this.form.get('otherTrainings');
	}
	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
	get practiceLogAttachments(): FormControl {
		return this.form.get('practiceLogAttachments') as FormControl;
	}
}
