import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BooleanTypeCode } from 'src/app/api/models';
import { PoliceOfficerRoleCode, PoliceOfficerRoleTypes } from 'src/app/core/code-types/model-desc.models';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import {
	LicenceApplicationService,
	LicenceFormStepComponent,
	LicenceModelSubject,
} from '../licence-application.service';

@Component({
	selector: 'app-police-background',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title [title]="title" [subtitle]="subtitle"></app-step-title>
				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row" *ngIf="isViewOnlyPoliceOrPeaceOfficer; else NotViewOnly">
							<div class="col-12 text-center my-4">
								<div class="text-minor-heading mb-2">
									{{ policeOfficerSummaryText }}
									<button mat-mini-fab color="primary" class="ms-2" style="top: 5px;" (click)="onEditInformation()">
										<mat-icon>edit</mat-icon>
									</button>
								</div>
							</div>
						</div>

						<ng-template #NotViewOnly>
							<div class="row">
								<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
									<mat-radio-group aria-label="Select an option" formControlName="isPoliceOrPeaceOfficer">
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
										<mat-divider class="my-2"></mat-divider>
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
									</mat-radio-group>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(form.get('isPoliceOrPeaceOfficer')?.dirty || form.get('isPoliceOrPeaceOfficer')?.touched) &&
											form.get('isPoliceOrPeaceOfficer')?.invalid &&
											form.get('isPoliceOrPeaceOfficer')?.hasError('required')
										"
										>This is required</mat-error
									>
								</div>

								<div class="row my-4" *ngIf="isPoliceOrPeaceOfficer.value == booleanTypeCodes.Yes">
									<div class="offset-md-2 col-md-8 col-sm-12">
										<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
										<div class="text-minor-heading mb-2">Your Current Role</div>
										<div class="row mt-2">
											<div class="col-xl-6 col-lg-12 col-md-12 col-sm-12">
												<mat-form-field>
													<mat-select formControlName="officerRole">
														<mat-option *ngFor="let item of policeOfficerRoleTypes" [value]="item.code">
															{{ item.desc }}
														</mat-option>
													</mat-select>
													<mat-error *ngIf="form.get('officerRole')?.hasError('required')">This is required</mat-error>
												</mat-form-field>
											</div>
											<div
												class="col-xl-6 col-lg-12 col-md-12 col-sm-12"
												*ngIf="officerRole.value == policeOfficerRoleCodes.Other"
											>
												<mat-form-field>
													<mat-label>Describe Role</mat-label>
													<input
														matInput
														formControlName="otherOfficerRole"
														[errorStateMatcher]="matcher"
														maxlength="50"
													/>
													<mat-error *ngIf="form.get('otherOfficerRole')?.hasError('required')"
														>This is required</mat-error
													>
												</mat-form-field>
											</div>
										</div>
										<div class="row mt-2">
											<div class="col-12">
												<div class="text-minor-heading mb-2">
													Upload a letter of no conflict from your superior officer:
												</div>
												<p>
													The letter from your supervisor must confirm any access you have to justice, court or police
													information systems (PRIME/PIRS/PROS/CPIC or other police or corrections database). You cannot
													utilize information from these systems while acting in the capacity of a security worker. See
													Section 2.5.4 of the
													<a
														href="https://www2.gov.bc.ca/assets/gov/employment-business-and-economic-development/business-management/security-services/industry/legislation/licensingpolicy.pdf"
														target="_blank"
													>
														Security Licensing Process and Licence Conditions Policies</a
													>
													for more information.
												</p>

												<app-file-upload
													[maxNumberOfFiles]="1"
													[files]="letterOfNoConflictAttachments.value"
												></app-file-upload>
												<mat-error
													class="mat-option-error"
													*ngIf="
														(form.get('letterOfNoConflictAttachments')?.dirty ||
															form.get('letterOfNoConflictAttachments')?.touched) &&
														form.get('letterOfNoConflictAttachments')?.invalid &&
														form.get('letterOfNoConflictAttachments')?.hasError('required')
													"
													>This is required</mat-error
												>
											</div>
										</div>
									</div>
								</div>
							</div>
						</ng-template>
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class PoliceBackgroundComponent implements OnInit, OnDestroy, LicenceFormStepComponent {
	private licenceModelLoadedSubscription!: Subscription;

	isViewOnlyPoliceOrPeaceOfficer = false;

	booleanTypeCodes = BooleanTypeCode;
	policeOfficerRoleCodes = PoliceOfficerRoleCode;
	policeOfficerRoleTypes = PoliceOfficerRoleTypes;

	policeOfficerSummaryText = '';

	matcher = new FormErrorStateMatcher();
	title = '';
	subtitle = '';

	readonly title_confirm = 'Are you currently a Police Officer or Peace Officer?';
	readonly title_view = 'Confirm your Police Officer or Peace Officer information';
	readonly subtitle_auth_new =
		'A member of a police force as defined in the <i>British Columbia Police Act</i> may not hold a security worker licence.';
	readonly subtitle_unauth_renew_update = 'Update any information that has changed since your last application';

	form: FormGroup = this.licenceApplicationService.policeBackgroundFormGroup;
	//  this.formBuilder.group(
	// 	{
	// 		isPoliceOrPeaceOfficer: new FormControl(),
	// 		officerRole: new FormControl(),
	// 		otherOfficerRole: new FormControl(),
	// 		letterOfNoConflictAttachments: new FormControl(),
	// 	},
	// 	{
	// 		validators: [
	// 			FormGroupValidators.conditionalRequiredValidator(
	// 				'isPoliceOrPeaceOfficer',
	// 				(form) => !this.isViewOnlyPoliceOrPeaceOfficer
	// 			),
	// 			FormGroupValidators.conditionalDefaultRequiredValidator(
	// 				'officerRole',
	// 				(form) => form.get('isPoliceOrPeaceOfficer')?.value == BooleanTypeCode.Yes
	// 			),
	// 			FormGroupValidators.conditionalDefaultRequiredValidator(
	// 				'otherOfficerRole',
	// 				(form) => form.get('officerRole')?.value == PoliceOfficerRoleCode.Other
	// 			),
	// 			FormGroupValidators.conditionalDefaultRequiredValidator(
	// 				'letterOfNoConflictAttachments',
	// 				(form) => form.get('isPoliceOrPeaceOfficer')?.value == BooleanTypeCode.Yes
	// 			),
	// 		],
	// 	}
	// );

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private formBuilder: FormBuilder, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: LicenceModelSubject) => {
				console.log(
					'PoliceBackgroundComponent',
					loaded,
					this.licenceApplicationService.licenceModel.applicationTypeCode
				); //|| loaded.isSetFlags

				if (loaded.isLoaded) {
					// if (this.licenceApplicationService.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired) {
					this.title = this.title_confirm;
					this.subtitle = this.subtitle_auth_new;
					// } else {
					// 	this.title = this.title_view;
					// 	this.subtitle = this.subtitle_unauth_renew_update;
					// }

					// this.form.patchValue({
					// 	isPoliceOrPeaceOfficer: this.licenceApplicationService.licenceModel.isPoliceOrPeaceOfficer,
					// 	officerRole: this.licenceApplicationService.licenceModel.officerRole,
					// 	otherOfficerRole: this.licenceApplicationService.licenceModel.otherOfficerRole,
					// 	letterOfNoConflictAttachments: this.licenceApplicationService.licenceModel.letterOfNoConflictAttachments,
					// });

					// this.isViewOnlyPoliceOrPeaceOfficer =
					// 	this.licenceApplicationService.licenceModel.isViewOnlyPoliceOrPeaceOfficer ?? false;

					// if (this.isViewOnlyPoliceOrPeaceOfficer) {
					// 	if (this.licenceApplicationService.licenceModel.isPoliceOrPeaceOfficer == BooleanTypeCode.No) {
					// 		this.policeOfficerSummaryText = 'I am not a Police Officer or Peace Officer';
					// 	} else if (this.licenceApplicationService.licenceModel.isPoliceOrPeaceOfficer == BooleanTypeCode.Yes) {
					// 		if (this.licenceApplicationService.licenceModel.officerRole == PoliceOfficerRoleCode.Other) {
					// 			this.policeOfficerSummaryText = `I am a ${this.licenceApplicationService.licenceModel.otherOfficerRole}`;
					// 		} else {
					// 			const desc = PoliceOfficerRoleTypes.find(
					// 				(item) => item.code == this.licenceApplicationService.licenceModel.officerRole
					// 			)?.desc;
					// 			this.policeOfficerSummaryText = `I am a ${desc}`;
					// 		}
					// 	}
					// }
				}
			},
		});
	}

	ngOnDestroy() {
		this.licenceModelLoadedSubscription.unsubscribe();
	}

	onEditInformation(): void {
		this.isViewOnlyPoliceOrPeaceOfficer = false;
	}

	isFormValid(): boolean {
		const attachments =
			this.fileUploadComponent?.files && this.fileUploadComponent?.files.length > 0
				? this.fileUploadComponent.files
				: '';
		this.form.controls['letterOfNoConflictAttachments'].setValue(attachments);

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getDataToSave(): any {
		if (this.officerRole.value != PoliceOfficerRoleCode.Other) {
			this.form.patchValue({ otherOfficerRole: null });
		}
		return this.form.value;
	}

	get isPoliceOrPeaceOfficer(): FormControl {
		return this.form.get('isPoliceOrPeaceOfficer') as FormControl;
	}

	get officerRole(): FormControl {
		return this.form.get('officerRole') as FormControl;
	}

	get letterOfNoConflictAttachments(): FormControl {
		return this.form.get('letterOfNoConflictAttachments') as FormControl;
	}
}
