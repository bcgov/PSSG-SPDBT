import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApplicationTypeCode } from 'src/app/api/models';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { GenderTypes } from 'src/app/core/code-types/model-desc.models';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { LicenceChildStepperStepComponent } from '../../../services/licence-application.helper';
import { LicenceApplicationService } from '../../../services/licence-application.service';

@Component({
	selector: 'app-step-personal-information-anonymous',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Renewal">
					<app-renewal-alert></app-renewal-alert>
				</ng-container>

				<app-step-title title="Your personal information"></app-step-title>

				<form [formGroup]="form" novalidate>
					<div class="step-container">
						<div class="row">
							<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
								<div class="row">
									<!-- <div class="w-100">
									<mat-checkbox formControlName="oneLegalName"> I have one legal name </mat-checkbox>
								</div> -->
									<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.New; else IsRenewal">
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Given Name <span class="optional-label">(optional)</span></mat-label>
												<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
											</mat-form-field>
										</div>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
												<input matInput formControlName="middleName1" maxlength="40" />
											</mat-form-field>
										</div>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
												<input matInput formControlName="middleName2" maxlength="40" />
											</mat-form-field>
										</div>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Surname</mat-label>
												<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
												<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
											</mat-form-field>
										</div>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Date of Birth</mat-label>
												<input
													matInput
													[matDatepicker]="picker"
													formControlName="dateOfBirth"
													[max]="maxBirthDate"
													[errorStateMatcher]="matcher"
												/>
												<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
												<mat-datepicker #picker startView="multi-year"></mat-datepicker>
												<mat-error *ngIf="form.get('dateOfBirth')?.hasError('required')">This is required</mat-error>
											</mat-form-field>
										</div>
									</ng-container>

									<ng-template #IsRenewal>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Given Name <span class="optional-label">(optional)</span></mat-label>
												<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
											</mat-form-field>
										</div>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
												<input matInput formControlName="middleName1" maxlength="40" />
											</mat-form-field>
										</div>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
												<input matInput formControlName="middleName2" maxlength="40" />
											</mat-form-field>
										</div>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Surname</mat-label>
												<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
												<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
											</mat-form-field>
										</div>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Date of Birth</mat-label>
												<input
													matInput
													[matDatepicker]="picker"
													formControlName="dateOfBirth"
													[max]="maxBirthDate"
													[errorStateMatcher]="matcher"
												/>
												<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
												<mat-datepicker #picker startView="multi-year"></mat-datepicker>
												<mat-error *ngIf="form.get('dateOfBirth')?.hasError('required')">This is required</mat-error>
											</mat-form-field>
										</div>
									</ng-template>

									<div class="col-xl-6 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Sex</mat-label>
											<mat-select formControlName="genderCode" [errorStateMatcher]="matcher">
												<mat-option *ngFor="let gdr of genderTypes" [value]="gdr.code">
													{{ gdr.desc }}
												</mat-option>
											</mat-select>
											<mat-error *ngIf="form.get('genderCode')?.hasError('required')">This is required</mat-error>
										</mat-form-field>
									</div>
								</div>

								<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Renewal">
									<mat-checkbox formControlName="isNeedProofOfLegalNameChange">
										<span class="checklist-label">Update information</span>
									</mat-checkbox>
								</ng-container>
							</div>
						</div>
						<div class="row mt-2" *ngIf="isNeedProofOfLegalNameChange.value" @showHideTriggerSlideAnimation>
							<div class="offset-md-2 col-md-8 col-sm-12">
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

								<div class="row">
									<div class="col-xl-6 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>New Given Name <span class="optional-label">(optional)</span></mat-label>
											<input matInput formControlName="newGivenName" [errorStateMatcher]="matcher" maxlength="40" />
										</mat-form-field>
									</div>
									<div class="col-xl-6 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>New Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
											<input matInput formControlName="newMiddleName1" maxlength="40" />
										</mat-form-field>
									</div>
									<div class="col-xl-6 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>New Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
											<input matInput formControlName="newMiddleName2" maxlength="40" />
										</mat-form-field>
									</div>
									<div class="col-xl-6 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>New Surname</mat-label>
											<input matInput formControlName="newSurname" [errorStateMatcher]="matcher" maxlength="40" />
											<mat-error *ngIf="form.get('newSurname')?.hasError('required')"> This is required </mat-error>
										</mat-form-field>
									</div>

									<div class="col-xl-6 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Sex</mat-label>
											<mat-select formControlName="newGenderCode" [errorStateMatcher]="matcher">
												<mat-option *ngFor="let gdr of genderTypes" [value]="gdr.code">
													{{ gdr.desc }}
												</mat-option>
											</mat-select>
											<mat-error *ngIf="form.get('newGenderCode')?.hasError('required')">This is required</mat-error>
										</mat-form-field>
									</div>
								</div>

								<div class="text-minor-heading fw-normal mb-2">Upload your proof of legal name change:</div>
								<app-file-upload
									(fileRemoved)="onFileRemoved()"
									[control]="attachments"
									[maxNumberOfFiles]="10"
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
			</div>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class StepPersonalInformationAnonymousComponent implements OnInit, OnDestroy, LicenceChildStepperStepComponent {
	genderTypes = GenderTypes;
	applicationTypeCodes = ApplicationTypeCode;
	matcher = new FormErrorStateMatcher();

	maxBirthDate = this.utilService.getBirthDateMax();
	isLoggedIn = false;

	authenticationSubscription!: Subscription;
	form: FormGroup = this.licenceApplicationService.personalInformationFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(
		private utilService: UtilService,
		private authProcessService: AuthProcessService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		this.authenticationSubscription = this.authProcessService.waitUntilAuthentication$.subscribe(
			(isLoggedIn: boolean) => {
				this.isLoggedIn = isLoggedIn;
				if (isLoggedIn) {
					this.disableData();
				}
			}
		);

		if (this.applicationTypeCode === ApplicationTypeCode.Renewal) {
			this.disableData(true);
		}
	}

	ngOnDestroy() {
		if (this.authenticationSubscription) this.authenticationSubscription.unsubscribe();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFileRemoved(): void {
		this.licenceApplicationService.hasValueChanged = true;
	}

	private disableData(isAllData: boolean | undefined = false): void {
		this.surname.disable({ emitEvent: false });
		this.givenName.disable({ emitEvent: false });
		this.middleName1.disable({ emitEvent: false });
		this.middleName2.disable({ emitEvent: false });
		this.dateOfBirth.disable({ emitEvent: false });

		if (isAllData) {
			this.genderCode.disable({ emitEvent: false });
		}
	}

	get surname(): FormControl {
		return this.form.get('surname') as FormControl;
	}

	get givenName(): FormControl {
		return this.form.get('givenName') as FormControl;
	}

	get middleName1(): FormControl {
		return this.form.get('middleName1') as FormControl;
	}

	get middleName2(): FormControl {
		return this.form.get('middleName2') as FormControl;
	}

	get dateOfBirth(): FormControl {
		return this.form.get('dateOfBirth') as FormControl;
	}

	get genderCode(): FormControl {
		return this.form.get('genderCode') as FormControl;
	}

	get isNeedProofOfLegalNameChange(): FormControl {
		return this.form.get('isNeedProofOfLegalNameChange') as FormControl;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
