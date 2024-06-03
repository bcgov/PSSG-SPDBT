import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { AuthUserIdirService } from 'src/app/core/services/auth-user-idir.service';
import { UtilService } from 'src/app/core/services/util.service';
import { PssoRoutes } from './psso-routing.module';

@Component({
	selector: 'app-psso-terms-and-conds',

	template: `
		<div class="container" *ngIf="isAuthenticated | async">
			<section class="step-section my-4">
				<div class="row m-4">
					<div class="col-lg-10 mx-auto">
						<h2>Terms and Conditions</h2>

						<p class="mb-4">Read, download, and accept the Terms of Use to continue.</p>

						<form [formGroup]="form" novalidate>
							<app-terms-text (hasScrolledToBottom)="onHasScrolledToBottom()"></app-terms-text>

							<div class="row" *ngIf="displayValidationErrors && !hasScrolledToBottom">
								<div class="col-12 p-0">
									<div class="alert alert-warning" role="alert">Please scroll to the bottom</div>
								</div>
							</div>

							<div class="row">
								<div class="col-12">
									<mat-checkbox formControlName="check1" (click)="onCheckboxChange()">
										I understand that if I change positions within my organization, I may only retain access to, or use
										of, the Site in relation to the criminal record checks I have initiated in my capacity as hiring
										manager. I further understand that my access to the Site will end immediately if I leave my
										organization.
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
										download="Psso-pe-crc-org-terms-and-conditions"
										[href]="pssoTerms"
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
					</div>
				</div>
			</section>
		</div>
	`,
	styles: [
		`
			.subheading {
				color: grey;
			}
		`,
	],
})
export class PssoTermsAndCondsComponent implements OnInit {
	pssoTerms = SPD_CONSTANTS.files.pssoFirstTimeTerms;
	isAuthenticated = this.authProcessService.waitUntilAuthentication$;

	hasScrolledToBottom = false;
	displayValidationErrors = false;

	form: FormGroup = this.formBuilder.group({
		check1: new FormControl(null, [Validators.requiredTrue]),
		readTerms: new FormControl(null, [Validators.requiredTrue]),
		dateSigned: new FormControl({ value: null, disabled: true }),
	});

	constructor(
		private formBuilder: FormBuilder,
		protected authUserService: AuthUserIdirService,
		private authProcessService: AuthProcessService,
		private utilService: UtilService,
		private router: Router
	) {}

	ngOnInit(): void {
		if (!this.authUserService.idirUserWhoamiProfile) {
			// Force login
			this.router.navigateByUrl(PssoRoutes.path(PssoRoutes.SCREENING_STATUSES));
		}
	}

	onCheckboxChange(): void {
		const data = this.form.value;
		if (this.hasScrolledToBottom && data.check1 && data.readTerms) {
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
			this.router.navigateByUrl(PssoRoutes.path(PssoRoutes.SCREENING_STATUSES));
		}
	}
}
