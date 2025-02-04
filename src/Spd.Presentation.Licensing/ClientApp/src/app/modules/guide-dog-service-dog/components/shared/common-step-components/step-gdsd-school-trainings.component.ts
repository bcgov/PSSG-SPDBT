import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import moment from 'moment';

@Component({
	selector: 'app-step-gdsd-school-trainings',
	template: `
		<app-step-section title="Training Schools" subtitle="List the formal training that have received.">
			<form [formGroup]="form" novalidate>
				<div class="row my-2">
					<div class="col-xxl-11 col-xl-12 mx-auto">
						<ng-container
							formArrayName="schoolTrainings"
							*ngFor="let group of schoolTrainingsArray.controls; let i = index"
						>
							<div class="school-entry" [formGroupName]="i" @showHideTriggerSlideAnimation>
								<div class="row">
									<div class="fs-5 mb-2">Training School Name</div>
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

								<div class="fs-5 mb-2">Mailing Address</div>
								<app-form-address [form]="getSchoolTrainingFormGroup(i)" [isWideView]="true"></app-form-address>

								<div class="row">
									<div class="fs-5 my-2">Training School Contact Information</div>
									<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Contact Given Name <span class="optional-label">(optional)</span></mat-label>
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
												[errorStateMatcher]="matcher"
												maxlength="30"
												appPhoneNumberTransform
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
												formControlName="trainingDateFrom"
												[max]="maxDate"
												[min]="minDate"
												[errorStateMatcher]="matcher"
											/>
											<mat-datepicker-toggle matIconSuffix [for]="picker1"></mat-datepicker-toggle>
											<mat-datepicker #picker1 startView="multi-year"></mat-datepicker>
											<mat-error *ngIf="group.get('trainingDateFrom')?.hasError('required')"
												>This is required</mat-error
											>
											<mat-error *ngIf="group.get('trainingDateFrom')?.hasError('matDatepickerMin')">
												Invalid date of birth
											</mat-error>
											<mat-error *ngIf="group.get('trainingDateFrom')?.hasError('matDatepickerMax')">
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
												formControlName="trainingDateTo"
												[max]="maxDate"
												[min]="minDate"
												[errorStateMatcher]="matcher"
											/>
											<mat-datepicker-toggle matIconSuffix [for]="picker2"></mat-datepicker-toggle>
											<mat-datepicker #picker2 startView="multi-year"></mat-datepicker>
											<mat-error *ngIf="group.get('trainingDateTo')?.hasError('required')">This is required</mat-error>
											<mat-error *ngIf="group.get('trainingDateTo')?.hasError('matDatepickerMin')">
												Invalid date of birth
											</mat-error>
											<mat-error *ngIf="group.get('trainingDateTo')?.hasError('matDatepickerMax')">
												This must be on or before {{ maxDate | formatDate }}
											</mat-error>
										</mat-form-field>
									</div>
									<div class="col-xxl-8 col-xl-6 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Program Name</mat-label>
											<input
												matInput
												formControlName="nameOfTrainingProgram"
												[errorStateMatcher]="matcher"
												maxlength="100"
											/>
											<mat-hint>Name and/or type of training program</mat-hint>
											<mat-error *ngIf="group.get('nameOfTrainingProgram')?.hasError('required')">
												This is required
											</mat-error>
										</mat-form-field>
									</div>
									<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Number of Hours</mat-label>
											<input
												matInput
												formControlName="hoursOfTraining"
												[errorStateMatcher]="matcher"
												mask="separator.2"
												thousandSeparator=","
												maxlength="10"
											/>
											<mat-hint>Total number of training hours</mat-hint>
											<mat-error *ngIf="group.get('hoursOfTraining')?.hasError('required')">
												This is required
											</mat-error>
											<mat-error *ngIf="group.get('hoursOfTraining')?.hasError('mask')">
												This must be a decimal
											</mat-error>
										</mat-form-field>
									</div>
									<div class="col-12">
										<div class="fs-5 mt-3 mb-2">What did you and your dog learn to do?</div>
										<mat-form-field>
											<mat-label>Curriculum Description</mat-label>
											<textarea
												matInput
												aria-label="Curriculum Description"
												formControlName="learnedDesc"
												style="min-height: 80px"
												[errorStateMatcher]="matcher"
												maxlength="1000"
											></textarea>
											<mat-hint>Maximum 1000 characters</mat-hint>
											<mat-error *ngIf="group.get('learnedDesc')?.hasError('required')"> This is required </mat-error>
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
						</ng-container>

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

						<div class="fs-5">
							Upload any supporting documentation that is appropriate (e.g. curriculum document, certificate, etc.)
						</div>
						<div class="mt-2">
							<app-file-upload
								(fileUploaded)="onFileUploaded($event)"
								(fileRemoved)="onFileRemoved()"
								[maxNumberOfFiles]="10"
								[control]="attachments"
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
export class StepGdsdSchoolTrainingsComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.gdsdApplicationService.schoolTrainingHistoryFormGroup;

	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();
	maxDate = moment();
	minDate = this.utilService.getDateMin();

	constructor(
		private dialog: MatDialog,
		private utilService: UtilService,
		private gdsdApplicationService: GdsdApplicationService
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
					this.gdsdApplicationService.schoolTrainingRowRemove(index);
				}
			});
	}

	onAddSchoolTraining(): void {
		this.gdsdApplicationService.schoolTrainingRowAdd();
	}

	isAllowDelete(): boolean {
		return this.schoolTrainingsArray.length > 1;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFileUploaded(_file: File): void {
		this.gdsdApplicationService.hasValueChanged = true;
	}

	onFileRemoved(): void {
		this.gdsdApplicationService.hasValueChanged = true;
	}

	getSchoolTrainingFormGroup(index: number): FormGroup {
		return this.gdsdApplicationService.getSchoolTrainingFormGroup(index);
	}

	get schoolTrainingsArray(): FormArray {
		return <FormArray>this.form.get('schoolTrainings');
	}
	public get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
