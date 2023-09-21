import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectOptions } from 'src/app/core/code-types/model-desc.models';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { LicenceFormStepComponent, SwlCategoryTypeCode } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-locksmith',
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
							<p>
								To qualify for a locksmith security worker licence, you must meet one of the following experience and
								training requirements. Whether a particular apprenticeship program or locksmithing course is approved by
								the registrar will be based on a review of program or course content, and training time for each
								component of the apprenticeship or course:
							</p>

							<form [formGroup]="form" novalidate>
								<mat-radio-group
									class="category-radio-group"
									aria-label="Select an option"
									formControlName="requirement"
								>
									<mat-radio-button class="radio-label" value="a">
										A Locksmith Certificate of Qualification
									</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" value="b">
										Two years experience of full-time employment as a locksmith under the supervision of a locksmith
										security worker licensee, and proof of successful completion of an approved apprenticeship program
									</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" value="c">
										Proof of successful completion of an approved locksmithing course, proof of experience in full-time
										employment as a locksmith under the supervision of a locksmith security worker licensee, and a
										letter of recommendation and certification from your employer indicating that you are qualified to
										perform the services of a locksmith unsupervised.
									</mat-radio-button>
								</mat-radio-group>

								<mat-divider class="my-3"></mat-divider>

								<div class="text-minor-heading fw-semibold mb-2" *ngIf="requirement.value == 'a'">
									Upload a copy of your certificate:
								</div>
								<div class="text-minor-heading fw-semibold mb-2" *ngIf="requirement.value == 'b'">
									Upload a letter of recommendation on company letterhead, and proof of successful completion of an
									approved apprenticeship program, other than that provided by the Industry Training Authority:
								</div>
								<div class="text-minor-heading fw-semibold mb-2" *ngIf="requirement.value == 'c'">
									Upload a letter of recommendation on company letterhead, proof of experience, and proof of successful
									completion of an approved course:
								</div>

								<ng-container *ngIf="requirement.value">
									<div class="my-4">
										<app-file-upload [maxNumberOfFiles]="10"></app-file-upload>
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
									<p>Accepted file formats: docx, doc, pdf, bmp, jpeg, jpg, tif, tiff, png, gif, html, htm</p>
									<p>File size maximum: 25MB per file</p>
								</ng-container>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.category-radio-group > .radio-label .mdc-label {
				font-size: initial;
				color: initial;
			}
		`,
	],
})
export class LicenceCategoryLocksmithComponent implements OnInit, LicenceFormStepComponent {
	form!: FormGroup;
	title = '';

	swlCategoryTypeCodes = SwlCategoryTypeCode;
	matcher = new FormErrorStateMatcher();

	@Input() option: SelectOptions | null = null;
	@Input() index: number = 0;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			requirement: new FormControl(null, [Validators.required]),
			attachments: new FormControl('', [Validators.required]),
		});

		this.title = `${this.option?.desc ?? ''}`;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}

	getDataToSave(): any {
		return { licenceCategoryLocksmith: { ...this.form.value } };
	}

	public get requirement(): FormControl {
		return this.form.get('requirement') as FormControl;
	}
}
