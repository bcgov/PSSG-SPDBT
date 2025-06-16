import { Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import moment from 'moment';

@Component({
	selector: 'app-step-team-school-trainings',
	template: `
		<app-step-section heading="Training schools" subheading="List the formal training that have received.">
			<form [formGroup]="form" novalidate>
				<div class="row my-2">
					<div class="col-xxl-11 col-xl-12 mx-auto">
						<section formArrayName="schoolTrainings" *ngFor="let group of schoolTrainingsArray.controls; let i = index">
							<div class="school-entry" [formGroupName]="i" @showHideTriggerSlideAnimation>
								<div class="row">
									<div class="text-minor-heading mb-2">Training School Name</div>
									<div class="col-12">
										<mat-form-field>
											<mat-label>Business Name</mat-label>
											<input matInput formControlName="trainingBizName" [errorStateMatcher]="matcher" maxlength="500" />
											<mat-error *ngIf="group.get('trainingBizName')?.hasError('required')">
												This is required
											</mat-error>
										</mat-form-field>
									</div>
								</div>

								<div class="text-minor-heading mb-2">Mailing Address</div>
								<app-form-address [form]="getSchoolTrainingFormGroup(i)" [isWideView]="true"></app-form-address>

								<div class="row">
									<div class="text-minor-heading my-2">Training School Contact Information</div>

									<div
										class="mt-3"
										*ngIf="(group.dirty || group.touched) && group.invalid && group.hasError('daterange')"
									>
										<app-alert type="danger" icon="dangerous">
											Training Start Date must be on or before the Training End Date
										</app-alert>
									</div>

									<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Contact Given Name</mat-label>
											<input matInput formControlName="contactGivenName" [errorStateMatcher]="matcher" maxlength="40" />
										</mat-form-field>
									</div>
									<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Contact Surname</mat-label>
											<input matInput formControlName="contactSurname" [errorStateMatcher]="matcher" maxlength="40" />
											<mat-error *ngIf="group.get('contactSurname')?.hasError('required')">
												This is required
											</mat-error>
										</mat-form-field>
									</div>
									<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Contact Phone Number</mat-label>
											<input
												matInput
												formControlName="contactPhoneNumber"
												[mask]="phoneMask"
												[showMaskTyped]="false"
												[errorStateMatcher]="matcher"
											/>
											<mat-error *ngIf="group.get('contactPhoneNumber')?.hasError('required')"
												>This is required</mat-error
											>
										</mat-form-field>
									</div>
									<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Contact Email Address <span class="optional-label">(optional)</span></mat-label>
											<input
												matInput
												formControlName="contactEmailAddress"
												[errorStateMatcher]="matcher"
												placeholder="name@domain.com"
												maxlength="75"
											/>
											<mat-error *ngIf="group.get('contactEmailAddress')?.hasError('email')">
												Must be a valid email address
											</mat-error>
										</mat-form-field>
									</div>

									<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Training Start Date</mat-label>
											<input
												matInput
												[matDatepicker]="picker1"
												formControlName="trainingStartDate"
												[max]="maxDate"
												[min]="minDate"
												[errorStateMatcher]="matcher"
											/>
											<mat-datepicker-toggle matIconSuffix [for]="picker1"></mat-datepicker-toggle>
											<mat-datepicker #picker1 startView="multi-year"></mat-datepicker>
											<mat-error *ngIf="group.get('trainingStartDate')?.hasError('required')"
												>This is required</mat-error
											>
											<mat-error *ngIf="group.get('trainingStartDate')?.hasError('matDatepickerMin')">
												Invalid date of birth
											</mat-error>
											<mat-error *ngIf="group.get('trainingStartDate')?.hasError('matDatepickerMax')">
												This must be on or before {{ maxDate | formatDate }}
											</mat-error>
										</mat-form-field>
									</div>
									<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Training End Date</mat-label>
											<input
												matInput
												[matDatepicker]="picker2"
												formControlName="trainingEndDate"
												[max]="maxDate"
												[min]="minDate"
												[errorStateMatcher]="matcher"
											/>
											<mat-datepicker-toggle matIconSuffix [for]="picker2"></mat-datepicker-toggle>
											<mat-datepicker #picker2 startView="multi-year"></mat-datepicker>
											<mat-error *ngIf="group.get('trainingEndDate')?.hasError('required')">This is required</mat-error>
											<mat-error *ngIf="group.get('trainingEndDate')?.hasError('matDatepickerMin')">
												Invalid date of birth
											</mat-error>
											<mat-error *ngIf="group.get('trainingEndDate')?.hasError('matDatepickerMax')">
												This must be on or before {{ maxDate | formatDate }}
											</mat-error>
										</mat-form-field>
									</div>
									<div class="col-xxl-8 col-xl-6 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Program Name</mat-label>
											<input matInput formControlName="trainingName" [errorStateMatcher]="matcher" maxlength="100" />
											<mat-hint>Name and/or type of training program</mat-hint>
											<mat-error *ngIf="group.get('trainingName')?.hasError('required')"> This is required </mat-error>
										</mat-form-field>
									</div>
									<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Number of Hours</mat-label>
											<input
												matInput
												formControlName="totalTrainingHours"
												[errorStateMatcher]="matcher"
												mask="separator.2"
												thousandSeparator=","
												maxlength="10"
											/>
											<mat-hint>Total number of training hours</mat-hint>
											<mat-error *ngIf="group.get('totalTrainingHours')?.hasError('required')">
												This is required
											</mat-error>
											<mat-error *ngIf="group.get('totalTrainingHours')?.hasError('mask')">
												This must be a decimal
											</mat-error>
										</mat-form-field>
									</div>
									<div class="col-12">
										<div class="text-minor-heading mt-3 mb-2">What did you and your dog learn to do?</div>
										<mat-form-field>
											<mat-label>Curriculum Description</mat-label>
											<textarea
												matInput
												aria-label="Curriculum Description"
												formControlName="whatLearned"
												style="min-height: 80px"
												[errorStateMatcher]="matcher"
												maxlength="1000"
											></textarea>
											<mat-hint>Maximum 1000 characters</mat-hint>
											<mat-error *ngIf="group.get('whatLearned')?.hasError('required')"> This is required </mat-error>
										</mat-form-field>
									</div>
								</div>

								<div class="mt-3 d-flex justify-content-end">
									<button
										mat-flat-button
										type="button"
										color="primary"
										class="large w-auto"
										aria-label="Remove this training"
										(click)="onRemoveSchoolTrainingRow(i)"
										*ngIf="isAllowDelete()"
									>
										Remove this Training School
									</button>
								</div>
							</div>
						</section>

						<div class="mb-4 d-flex justify-content-center">
							<button
								mat-flat-button
								type="button"
								color="primary"
								class="large w-auto mt-2 mt-md-0"
								(click)="onAddSchoolTraining()"
							>
								Add Another Training School
							</button>
						</div>

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
								[files]="attachments.value"
								ariaFileUploadLabel="Upload supporting training documentation"
							></app-file-upload>
						</div>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [
		`
			.school-entry {
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
export class StepTeamSchoolTrainingsComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.gdsdTeamApplicationService.schoolTrainingHistoryFormGroup;

	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();
	maxDate = moment();
	minDate = this.utilService.getDateMin();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private dialog: MatDialog,
		private utilService: UtilService,
		private gdsdTeamApplicationService: GdsdTeamApplicationService
	) {}

	onRemoveSchoolTrainingRow(index: number) {
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
					this.gdsdTeamApplicationService.schoolTrainingRowRemove(index);
				}
			});
	}

	onAddSchoolTraining(): void {
		this.gdsdTeamApplicationService.schoolTrainingRowAdd();
	}

	isAllowDelete(): boolean {
		return this.schoolTrainingsArray.length > 1;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFileUploaded(file: File): void {
		this.gdsdTeamApplicationService.fileUploaded(
			LicenceDocumentTypeCode.DogTrainingCurriculumCertificateSupportingDocument,
			file,
			this.attachments,
			this.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.gdsdTeamApplicationService.fileRemoved();
	}

	getSchoolTrainingFormGroup(index: number): FormGroup {
		return this.gdsdTeamApplicationService.getSchoolTrainingFormGroup(index);
	}

	get schoolTrainingsArray(): FormArray {
		return <FormArray>this.form.get('schoolTrainings');
	}
	public get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
