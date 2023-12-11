import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-step-consent-and-declaration',
	template: `
		<section class="step-section">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title title="Consent and Declaration"></app-step-title>
					<div class="row">
						<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12 conditions px-3 mb-3">
							<br />
							<ul>
								<li>
									I hereby consent to the Registrar carrying out a criminal record check, police information check and
									correctional services information check on me and to use the copy of my fingerprints for that purpose.
									This consent will remain in effect for the duration of the period for which the licence is valid.
								</li>
								<li>
									I hereby authorize the release to the Registrar any documents in the custody of the police,
									corrections, the court, and crown counsel relating to these checks.
								</li>
								<li>
									I hereby consent to my licence information (i.e., licence number and licence status) being available
									for viewing
								</li>
							</ul>
						</div>
					</div>

					<div class="row">
						<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
							<mat-checkbox formControlName="readTerms" (click)="onCheckboxChange()">
								I HEREBY CERTIFY THAT I have read and understand all portions of this application form and the
								information set out by me in this application is true and correct to the best of my knowledge and
								belief. I have read and understand the Security Services Act and Regulations; and I am aware of and
								understand the conditions that will be placed on me as a licensee
							</mat-checkbox>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('readTerms')?.dirty || form.get('readTerms')?.touched) &&
									form.get('readTerms')?.invalid &&
									form.get('readTerms')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>

					<div class="row mt-4">
						<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
							<mat-form-field class="w-auto">
								<mat-label>Date Signed</mat-label>
								<input matInput formControlName="dateSigned" />
								<mat-error *ngIf="form.get('dateSigned')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [
		`
			li:not(:last-child) {
				margin-bottom: 1em;
			}

			.conditions {
				border: 1px solid var(--color-grey-light);
				max-height: 300px;
				overflow-y: auto;
				box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
				font-size: smaller;
			}
		`,
	],
})
export class StepConsentAndDeclarationComponent {
	form: FormGroup = this.formBuilder.group({
		readTerms: new FormControl(null, [Validators.requiredTrue]),
		dateSigned: new FormControl({ value: null, disabled: true }),
	});

	constructor(private formBuilder: FormBuilder, private utilService: UtilService) {}

	onCheckboxChange(): void {
		const data = this.form.value;
		if (data.readTerms) {
			this.form.controls['dateSigned'].setValue(this.utilService.getDateString(new Date()));
		} else {
			this.form.controls['dateSigned'].setValue('');
		}
	}
}
