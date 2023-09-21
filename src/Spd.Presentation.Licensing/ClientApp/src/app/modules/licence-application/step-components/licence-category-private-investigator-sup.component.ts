import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectOptions } from 'src/app/core/code-types/model-desc.models';
import { LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-private-investigator-sup',
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
							<div class="mb-2">Experience:</div>
							<p>
								To qualify for a private investigator under supervision licence, you must meet one of the following
								experience requirements:
							</p>

							<form [formGroup]="form" novalidate>
								<mat-radio-group
									class="category-radio-group"
									aria-label="Select an option"
									formControlName="requirement"
								>
									<mat-radio-button class="radio-label" value="a">
										Successful completion of the Private Security Training Network (PSTnetwork) online course
										<i>Introduction to Private Investigation</i> and proof of final exam completion
									</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" value="b">
										Completion of courses or demonstrated knowledge in the areas of:
										<ul>
											<li>Criminal law</li>
										</ul>
									</mat-radio-button>
								</mat-radio-group>

								<mat-divider class="my-3"></mat-divider>

								<div class="text-minor-heading fw-semibold mb-2" *ngIf="requirement.value == 'a'">
									Upload proof of course and exam completion:
								</div>
								<div class="text-minor-heading fw-semibold mb-2" *ngIf="requirement.value == 'b'">
									Upload document(s) providing proof of course completion or equivalent knowledge:
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
	styles: [],
})
export class LicenceCategoryPrivateInvestigatorSupComponent implements OnInit, LicenceFormStepComponent {
	form!: FormGroup;
	title = '';

	@Input() option: SelectOptions | null = null;
	@Input() index: number = 0;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			requirement: new FormControl(null, [Validators.required]),
			documentExpiryDate: new FormControl(null, [Validators.required]),
			attachments: new FormControl('', [Validators.required]),
		});

		this.title = `${this.option?.desc ?? ''}`;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}

	getDataToSave(): any {
		return { licenceCategoryPrivateInvestigatorUnderSupervision: { ...this.form.value } };
	}

	public get requirement(): FormControl {
		return this.form.get('requirement') as FormControl;
	}
}
