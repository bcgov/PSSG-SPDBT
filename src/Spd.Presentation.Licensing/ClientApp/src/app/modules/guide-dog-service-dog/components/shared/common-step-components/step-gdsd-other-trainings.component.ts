import { Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-gdsd-other-trainings',
	template: `
		<app-step-section
			title="Other Training"
			subtitle="If you did not attend a training school or formalized training program, list the informal training that have received."
		>
			<div [formGroup]="form">
				<div class="row my-2">
					<div class="col-xxl-11 col-xl-12 mx-auto">
						<ng-container
							formArrayName="otherTrainings"
							*ngFor="let group of otherTrainingsArray.controls; let i = index"
						>
							<div class="other-entry" [formGroupName]="i" @showHideTriggerSlideAnimation>
								<div class="row">
									<div class="col-12">
										<div class="fs-5 mb-2">Training Details</div>
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
											<mat-error *ngIf="group.get('trainingDetail')?.hasError('required')">
												This is required
											</mat-error>
										</mat-form-field>
									</div>
									<div class="col-12">
										<div class="fs-5 mt-3 mb-2">Did you use a personal dog trainer?</div>
										<mat-radio-group aria-label="Select an option" formControlName="usePersonalDogTrainer">
											<div class="d-flex justify-content-start">
												<mat-radio-button class="radio-label w-auto" [value]="booleanTypeCodes.No">No</mat-radio-button>
												<mat-radio-button class="radio-label w-auto" [value]="booleanTypeCodes.Yes"
													>Yes</mat-radio-button
												>
											</div>
										</mat-radio-group>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(group.get('usePersonalDogTrainer')?.dirty || group.get('usePersonalDogTrainer')?.touched) &&
												group.get('usePersonalDogTrainer')?.invalid &&
												group.get('usePersonalDogTrainer')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
								</div>
								<div class="row mt-3" *ngIf="isUsePersonalDogTrainer(i)" @showHideTriggerSlideAnimation>
									<div class="fs-5 mt-3 mb-2">Personal Trainer Information</div>
									<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12">
										<mat-form-field>
											<mat-label>Trainer Credentials</mat-label>
											<input
												matInput
												formControlName="dogTrainerCredential"
												[errorStateMatcher]="matcher"
												maxlength="100"
											/>
											<mat-error *ngIf="group.get('dogTrainerCredential')?.hasError('required')">
												This is required
											</mat-error>
										</mat-form-field>
									</div>
									<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12">
										<mat-form-field>
											<mat-label>Time Spent Training</mat-label>
											<input matInput formControlName="trainingTime" [errorStateMatcher]="matcher" maxlength="15" />
											<mat-error *ngIf="group.get('trainingTime')?.hasError('required')"> This is required </mat-error>
										</mat-form-field>
									</div>
									<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12">
										<mat-form-field>
											<mat-label>Trainer Given Name</mat-label>
											<input matInput formControlName="trainerGivenName" [errorStateMatcher]="matcher" maxlength="40" />
										</mat-form-field>
									</div>
									<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12">
										<mat-form-field>
											<mat-label>Trainer Surname</mat-label>
											<input matInput formControlName="trainerSurname" [errorStateMatcher]="matcher" maxlength="40" />
											<mat-error *ngIf="group.get('trainerSurname')?.hasError('required')">
												This is required
											</mat-error>
										</mat-form-field>
									</div>
									<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12">
										<mat-form-field>
											<mat-label>Trainer Phone Number</mat-label>
											<input
												matInput
												formControlName="trainerPhoneNumber"
												[errorStateMatcher]="matcher"
												maxlength="30"
											/>
											<mat-error *ngIf="group.get('trainerPhoneNumber')?.hasError('required')">
												This is required
											</mat-error>
										</mat-form-field>
									</div>
									<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12">
										<mat-form-field>
											<mat-label>Trainer Email Address</mat-label>
											<input
												matInput
												formControlName="trainerEmailAddress"
												[errorStateMatcher]="matcher"
												maxlength="75"
											/>
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
											<mat-error *ngIf="group.get('hoursPracticingSkill')?.hasError('required')">
												This is required
											</mat-error>
										</mat-form-field>
									</div>

									<div class="col-12 mt-3 mb-2">
										<div class="fs-5 mb-2">Upload log of practice hours</div>
										<app-file-upload
											(fileUploaded)="onFileUploaded($event, i)"
											(fileRemoved)="onFileRemoved()"
											[control]="attachmentsItemControl(i)"
											[maxNumberOfFiles]="10"
											#attachmentsRef
											[files]="attachmentsItemValue(i)"
										></app-file-upload>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(group.get('attachments')?.dirty || group.get('attachments')?.touched) &&
												group.get('attachments')?.invalid &&
												group.get('attachments')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
								</div>

								<div class="d-flex justify-content-end">
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
								</div>
							</div>
						</ng-container>

						<div class="d-flex justify-content-center">
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
export class StepGdsdOtherTrainingsComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.gdsdApplicationService.otherTrainingHistoryFormGroup;

	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private dialog: MatDialog,
		private gdsdApplicationService: GdsdApplicationService
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
					this.gdsdApplicationService.otherTrainingRowRemove(index);
				}
			});
	}

	onAddOtherTraining(): void {
		this.gdsdApplicationService.otherTrainingRowAdd();
	}

	onFileUploaded(_file: File, _index: number): void {
		this.gdsdApplicationService.hasValueChanged = true;
	}

	onFileRemoved(): void {
		this.gdsdApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	isUsePersonalDogTrainer(index: number): boolean {
		return this.gdsdApplicationService.otherTrainingRowUsePersonalTraining(index);
	}

	attachmentsItemControl(index: number): FormControl {
		return this.gdsdApplicationService.otherTrainingAttachmentsItemControl(index);
	}

	attachmentsItemValue(index: number): File[] {
		return this.gdsdApplicationService.otherTrainingAttachmentsItemValue(index);
	}

	get otherTrainingsArray(): FormArray {
		return <FormArray>this.form.get('otherTrainings');
	}
}
