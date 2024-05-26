import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-crrp-terms-and-conds',
	template: `
		<form [formGroup]="form" novalidate>
			<app-terms-text (hasScrolledToBottom)="onHasScrolledToBottom()"></app-terms-text>

			<div class="row" *ngIf="displayValidationErrors && !hasScrolledToBottom">
				<div class="col-12 p-0">
					<div class="alert alert-warning" role="alert">Please scroll to the bottom</div>
				</div>
			</div>

			<div class="row">
				<div class="col-12">
					<mat-checkbox formControlName="readTerms" (click)="onCheckboxChange()">
						I have read and accept the above Terms of Use.
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
				<div class="subheading fs-5 my-3">
					Terms and Conditions for use of the Organization’s Online Service Portal (the “Site”) in an Authorized Contact
					Role:
				</div>
				<div class="col-12">
					<mat-checkbox formControlName="check1" (click)="onCheckboxChange()">
						I understand that as an Authorized Contact, and on behalf of the Organization I represent, I am responsible
						for facilitating the criminal record check process for individuals working with or applying to work with
						children and/or vulnerable adults.
					</mat-checkbox>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('check1')?.dirty || form.get('check1')?.touched) &&
							form.get('check1')?.invalid &&
							form.get('check1')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
				<div class="col-12">
					<mat-checkbox formControlName="check2" (click)="onCheckboxChange()">
						I understand that as an Authorized Contact, and on behalf of the Organization I represent, I am responsible
						for verifying and confirming the identity of every applicant who submits a consent to a criminal record
						check manually or via webform.
					</mat-checkbox>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('check2')?.dirty || form.get('check2')?.touched) &&
							form.get('check2')?.invalid &&
							form.get('check2')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
				<div class="col-12">
					<mat-checkbox formControlName="check3" (click)="onCheckboxChange()">
						I understand that as an Authorized Contact, and on behalf of the Organization I represent, I am responsible
						for retaining all originally signed criminal record check consent forms that are submitted manually, for a
						minimum of 5 (five) years after their submission. The Criminal Records Review Program may request a copy of
						the signed consent form(s) at any time.
					</mat-checkbox>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('check3')?.dirty || form.get('check3')?.touched) &&
							form.get('check3')?.invalid &&
							form.get('check3')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
				<div class="col-12">
					<mat-checkbox formControlName="check4" (click)="onCheckboxChange()">
						I understand that should I leave the Organization I represent, my access to the Site as an Authorized
						Contact is immediately terminated.
					</mat-checkbox>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('check4')?.dirty || form.get('check4')?.touched) &&
							form.get('check4')?.invalid &&
							form.get('check4')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
				<div class="col-12">
					<mat-checkbox formControlName="check5" (click)="onCheckboxChange()">
						I understand that my misuse of the Site, or disregard for any of these Terms and Conditions, may result in
						suspension or cancellation of any or all services available to theOrganization I represent.
					</mat-checkbox>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('check5')?.dirty || form.get('check5')?.touched) &&
							form.get('check5')?.invalid &&
							form.get('check5')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
				<div class="col-12 mt-4">
					<mat-form-field class="w-auto" style="background-color: unset;">
						<mat-label>Date Signed</mat-label>
						<input matInput formControlName="dateSigned" />
						<mat-error *ngIf="form.get('dateSigned')?.hasError('required')">This is required</mat-error>
					</mat-form-field>
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-6">
					<a
						mat-stroked-button
						color="primary"
						class="large w-auto"
						aria-label="Download Terms of Use"
						download="Crrp-terms-and-conditions"
						[href]="crrpTerms"
					>
						<mat-icon>file_download</mat-icon>Terms of Use
					</a>
				</div>
				<div class="col-6">
					<button mat-flat-button color="primary" class="large w-auto float-end" (click)="onContinue()">
						Continue
					</button>
				</div>
			</div>
		</form>
	`,
	styles: [
		`
			.subheading {
				color: grey;
			}
		`,
	],
})
export class CrrpTermsAndCondsComponent {
	crrpTerms = SPD_CONSTANTS.files.crrpTerms;
	hasScrolledToBottom = false;
	displayValidationErrors = false;

	form: FormGroup = this.formBuilder.group({
		readTerms: new FormControl(null, [Validators.requiredTrue]),
		check1: new FormControl(null, [Validators.requiredTrue]),
		check2: new FormControl(null, [Validators.requiredTrue]),
		check3: new FormControl(null, [Validators.requiredTrue]),
		check4: new FormControl(null, [Validators.requiredTrue]),
		check5: new FormControl(null, [Validators.requiredTrue]),
		dateSigned: new FormControl({ value: null, disabled: true }),
	});

	@Output() isSuccess: EventEmitter<boolean> = new EventEmitter();

	constructor(private formBuilder: FormBuilder, private utilService: UtilService) {}

	onCheckboxChange(): void {
		const data = this.form.value;
		if (
			this.hasScrolledToBottom &&
			data.readTerms &&
			data.check1 &&
			data.check2 &&
			data.check3 &&
			data.check4 &&
			data.check5
		) {
			this.form.controls['dateSigned'].setValue(this.utilService.getDateString(new Date()));
		} else {
			this.form.controls['dateSigned'].setValue('');
		}
	}

	onHasScrolledToBottom(): void {
		this.hasScrolledToBottom = true;
		this.onCheckboxChange();
	}

	onContinue(): void {
		this.form.markAllAsTouched();

		this.displayValidationErrors = !this.hasScrolledToBottom;
		const isValid = this.form.valid && this.hasScrolledToBottom;

		if (isValid) {
			this.isSuccess.emit(true);
		}
	}
}
