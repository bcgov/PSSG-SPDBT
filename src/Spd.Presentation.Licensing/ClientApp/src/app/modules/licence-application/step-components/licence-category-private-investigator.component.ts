import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';
import { SelectOptions } from 'src/app/core/code-types/model-desc.models';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-private-investigator',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<div class="step-container">
					<div class="row">
						<div class="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-9 col-lg-12">
							<div class="text-center">
								<mat-chip-option [selectable]="false" class="mat-chip-green me-3">
									Category #{{ index }}
								</mat-chip-option>
								<span class="title" style="position: relative; top: -5px;">{{ title }}</span>
							</div>

							<mat-divider class="mt-1 mb-2"></mat-divider>

							<div class="fs-5 mb-2">Proof of experience or training required</div>

							<form [formGroup]="form" novalidate>
								<div class="alert alert-category d-flex" role="alert">
									<div>
										<div class="fs-5 mb-2">Experience:</div>
										To qualify for a private investigator security worker licence, you must meet one of the following
										experience requirements:

										<mat-radio-group
											class="category-radio-group"
											aria-label="Select an option"
											formControlName="requirement"
										>
											<mat-radio-button class="radio-label" value="a">
												a) Two years of documented experience providing the services of a private investigator or
												private investigator under supervision, AND successful completion of recognized courses in
												evidence gathering and presentation and in the aspects of criminal and civil law that are
												relevant to the work of a private investigator in B.C.
												<mat-icon
													class="info-icon"
													matTooltip="You must prove that you have 2000 hours work experience ending no more than 5 years prior to the date of the application"
												>
													info
												</mat-icon>
											</mat-radio-button>
											<mat-divider class="my-2"></mat-divider>
											<mat-radio-button class="radio-label" value="b">
												b) Ten years of experience performing general police duties in a Canadian police force, AND
												proof of registration in the Private Security Training Network online course
												<i>Introduction to Private Investigation</i>.
												<mat-icon
													class="info-icon"
													matTooltip="Course and exam must be completed within the first year of licensing"
												>
													info
												</mat-icon>
											</mat-radio-button>
											<mat-divider class="my-2"></mat-divider>
											<mat-radio-button class="radio-label" value="c">
												c) Knowledge and experience equivalent to that which would be obtained under paragraph (a)
												above.
											</mat-radio-button>
										</mat-radio-group>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('requirement')?.dirty || form.get('requirement')?.touched) &&
												form.get('requirement')?.invalid &&
												form.get('requirement')?.hasError('required')
											"
											>An option must be selected</mat-error
										>
									</div>
								</div>

								<mat-divider class="my-3"></mat-divider>

								<ng-container *ngIf="requirement.value">
									<div class="text-minor-heading">
										<span *ngIf="requirement.value == 'a'">
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
										<span *ngIf="requirement.value == 'b'">
											Upload proof of registration in the Private Security Training Network online course Introduction
											to Private Investigation:
										</span>
										<span *ngIf="requirement.value == 'c'">
											Upload document(s) providing proof of relevant knowledge and experience:
										</span>
									</div>

									<div class="my-2">
										<app-file-upload [maxNumberOfFiles]="10" #attachments></app-file-upload>
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
									<div class="row" *ngIf="requirement.value == 'b'">
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
									</div>
								</ng-container>

								<div class="alert alert-category d-flex" role="alert">
									<div>
										<div class="fs-5 mb-2">Training:</div>
										You must meet one of the following training requirements:

										<mat-radio-group
											class="category-radio-group"
											aria-label="Select an option"
											formControlName="training"
										>
											<mat-radio-button class="radio-label" value="a">
												You must have completed a recognized training course
											</mat-radio-button>
											<mat-divider class="my-2"></mat-divider>
											<mat-radio-button class="radio-label" value="b">
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
												(form.get('training')?.dirty || form.get('training')?.touched) &&
												form.get('training')?.invalid &&
												form.get('training')?.hasError('required')
											"
											>An option must be selected</mat-error
										>
									</div>
								</div>

								<ng-container *ngIf="training.value">
									<div class="my-2">
										<div class="text-minor-heading mb-2">
											<span *ngIf="training.value == 'a'">Upload a copy of your course certificate:</span>
											<span *ngIf="training.value == 'b'"
												>Upload document(s) providing proof of course completion or equivalent knowledge:</span
											>
										</div>
										<app-file-upload [maxNumberOfFiles]="10" #trainingattachments></app-file-upload>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('trainingattachments')?.dirty || form.get('trainingattachments')?.touched) &&
												form.get('trainingattachments')?.invalid &&
												form.get('trainingattachments')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
								</ng-container>

								<mat-divider class="my-3"></mat-divider>

								<div class="alert alert-category d-flex" role="alert">
									<div>
										<div class="fs-5 mb-2">Do want to add Fire Investigator to this licence?</div>
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
											>An option must be selected</mat-error
										>
									</div>
								</div>

								<ng-container *ngIf="addFireInvestigator.value == booleanTypeCodes.Yes">
									<div class="fs-5 mb-2">Proof of experience or training required</div>

									<div class="alert alert-category d-flex" role="alert">
										<div>
											<div class="fs-5 mb-2">Experience:</div>
											To qualify for a fire investigator security worker licence, you must meet both of the following
											experience requirements:
											<ul>
												<li>
													JIBC Course in Fire Investigation from <i>Fire Cause & Origins</i> (or a similar course
													offered by another organization)
												</li>
												<li>Verification letter that you were investigating fires</li>
											</ul>
										</div>
									</div>

									<div class="my-2">
										<div class="text-minor-heading mb-2">Upload a copy of your course certificate:</div>
										<app-file-upload [maxNumberOfFiles]="10" #fireinvestigatorcertificateattachments></app-file-upload>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('fireinvestigatorcertificateattachments')?.dirty ||
													form.get('fireinvestigatorcertificateattachments')?.touched) &&
												form.get('fireinvestigatorcertificateattachments')?.invalid &&
												form.get('fireinvestigatorcertificateattachments')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
									<div class="my-2">
										<div class="text-minor-heading mb-2">Upload a verification letter:</div>
										<app-file-upload [maxNumberOfFiles]="10" #fireinvestigatorletterattachments></app-file-upload>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('fireinvestigatorletterattachments')?.dirty ||
													form.get('fireinvestigatorletterattachments')?.touched) &&
												form.get('fireinvestigatorletterattachments')?.invalid &&
												form.get('fireinvestigatorletterattachments')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
								</ng-container>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LicenceCategoryPrivateInvestigatorComponent implements OnInit, LicenceFormStepComponent {
	form!: FormGroup;
	matcher = new FormErrorStateMatcher();
	title = '';

	booleanTypeCodes = BooleanTypeCode;

	@Input() option: SelectOptions | null = null;
	@Input() index: number = 0;

	@ViewChild('attachments') fileUploadComponent1!: FileUploadComponent;
	@ViewChild('trainingattachments') fileUploadComponent2!: FileUploadComponent;
	@ViewChild('fireinvestigatorcertificateattachments') fileUploadComponent3!: FileUploadComponent;
	@ViewChild('fireinvestigatorletterattachments') fileUploadComponent4!: FileUploadComponent;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group(
			{
				requirement: new FormControl(null, [FormControlValidators.required]),
				training: new FormControl(null, [FormControlValidators.required]),
				documentExpiryDate: new FormControl(null),
				attachments: new FormControl('', [Validators.required]),
				trainingattachments: new FormControl('', [Validators.required]),
				fireinvestigatorcertificateattachments: new FormControl(''),
				fireinvestigatorletterattachments: new FormControl(''),
				addFireInvestigator: new FormControl('', [FormControlValidators.required]),
			},
			{
				validators: [
					FormGroupValidators.conditionalDefaultRequiredValidator(
						'documentExpiryDate',
						(form) => form.get('requirement')?.value == 'b'
					),
					FormGroupValidators.conditionalDefaultRequiredValidator(
						'fireinvestigatorcertificateattachments',
						(form) => form.get('addFireInvestigator')?.value == this.booleanTypeCodes.Yes
					),
					FormGroupValidators.conditionalDefaultRequiredValidator(
						'fireinvestigatorletterattachments',
						(form) => form.get('addFireInvestigator')?.value == this.booleanTypeCodes.Yes
					),
				],
			}
		);

		this.title = `${this.option?.desc ?? ''}`;
	}

	isFormValid(): boolean {
		const attachments1 =
			this.fileUploadComponent1?.files && this.fileUploadComponent1?.files.length > 0
				? this.fileUploadComponent1.files[0]
				: '';
		this.form.controls['attachments'].setValue(attachments1);

		const attachments2 =
			this.fileUploadComponent2?.files && this.fileUploadComponent2?.files.length > 0
				? this.fileUploadComponent2.files[0]
				: '';
		this.form.controls['trainingattachments'].setValue(attachments2);

		const attachments3 =
			this.fileUploadComponent3?.files && this.fileUploadComponent3?.files.length > 0
				? this.fileUploadComponent3.files[0]
				: '';
		this.form.controls['fireinvestigatorcertificateattachments'].setValue(attachments3);

		const attachments4 =
			this.fileUploadComponent4?.files && this.fileUploadComponent4?.files.length > 0
				? this.fileUploadComponent4.files[0]
				: '';
		this.form.controls['fireinvestigatorletterattachments'].setValue(attachments4);

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getDataToSave(): any {
		return { licenceCategoryPrivateInvestigatorUnderSupervision: { ...this.form.value } };
	}

	public get requirement(): FormControl {
		return this.form.get('requirement') as FormControl;
	}

	public get training(): FormControl {
		return this.form.get('training') as FormControl;
	}

	public get addFireInvestigator(): FormControl {
		return this.form.get('addFireInvestigator') as FormControl;
	}
}
