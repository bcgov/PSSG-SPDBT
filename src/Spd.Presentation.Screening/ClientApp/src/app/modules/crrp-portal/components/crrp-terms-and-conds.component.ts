import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrgUserResponse } from 'src/app/api/models';
import { OrgUserService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routes';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { UtilService } from 'src/app/core/services/util.service';
import { CrrpRoutes } from '../crrp-routes';

@Component({
	selector: 'app-crrp-terms-and-conds',
	template: `
		<div class="container">
			<section class="step-section my-4">
				<div class="row m-4">
					<div class="col-lg-10 mx-auto">
						<h2>Terms and Conditions</h2>
						<p class="mb-4">Read, download, and accept the Terms of Use to continue.</p>
						<form [formGroup]="form" novalidate>
							<app-terms-text (hasScrolledToBottom)="onHasScrolledToBottom()"></app-terms-text>

							@if (displayValidationErrors && !hasScrolledToBottom) {
								<app-alert type="danger">Please scroll to the bottom</app-alert>
							}

							<div class="row">
								<div class="col-12">
									<mat-checkbox formControlName="readTerms" (click)="onCheckboxChange()">
										I have read and accept the above Terms of Use.
									</mat-checkbox>
									@if (
										(form.get('readTerms')?.dirty || form.get('readTerms')?.touched) &&
										form.get('readTerms')?.invalid &&
										form.get('readTerms')?.hasError('required')
									) {
										<mat-error class="mat-option-error">This is required</mat-error>
									}
								</div>
								<div class="subheading fs-5 my-3">
									Terms and Conditions for use of the Organization’s Online Service Portal (the “Site”) in an Authorized
									Contact Role:
								</div>
								<div class="col-12">
									<mat-checkbox formControlName="check1" (click)="onCheckboxChange()">
										I understand that as an Authorized Contact, and on behalf of the Organization I represent, I am
										responsible for facilitating the criminal record check process for individuals working with or
										applying to work with children and/or vulnerable adults.
									</mat-checkbox>
									@if (
										(form.get('check1')?.dirty || form.get('check1')?.touched) &&
										form.get('check1')?.invalid &&
										form.get('check1')?.hasError('required')
									) {
										<mat-error class="mat-option-error">This is required</mat-error>
									}
								</div>
								<div class="col-12">
									<mat-checkbox formControlName="check2" (click)="onCheckboxChange()">
										I understand that as an Authorized Contact, and on behalf of the Organization I represent, I am
										responsible for verifying and confirming the identity of every applicant who submits a consent to a
										criminal record check manually or via webform.
									</mat-checkbox>
									@if (
										(form.get('check2')?.dirty || form.get('check2')?.touched) &&
										form.get('check2')?.invalid &&
										form.get('check2')?.hasError('required')
									) {
										<mat-error class="mat-option-error">This is required</mat-error>
									}
								</div>
								<div class="col-12">
									<mat-checkbox formControlName="check3" (click)="onCheckboxChange()">
										I understand that as an Authorized Contact, and on behalf of the Organization I represent, I am
										responsible for retaining all originally signed criminal record check consent forms that are
										submitted manually, for a minimum of 5 (five) years after their submission. The Criminal Records
										Review Program may request a copy of the signed consent form(s) at any time.
									</mat-checkbox>
									@if (
										(form.get('check3')?.dirty || form.get('check3')?.touched) &&
										form.get('check3')?.invalid &&
										form.get('check3')?.hasError('required')
									) {
										<mat-error class="mat-option-error">This is required</mat-error>
									}
								</div>
								<div class="col-12">
									<mat-checkbox formControlName="check4" (click)="onCheckboxChange()">
										I understand that should I leave the Organization I represent, my access to the Site as an
										Authorized Contact is immediately terminated.
									</mat-checkbox>
									@if (
										(form.get('check4')?.dirty || form.get('check4')?.touched) &&
										form.get('check4')?.invalid &&
										form.get('check4')?.hasError('required')
									) {
										<mat-error class="mat-option-error">This is required</mat-error>
									}
								</div>
								<div class="col-12">
									<mat-checkbox formControlName="check5" (click)="onCheckboxChange()">
										I understand that my misuse of the Site, or disregard for any of these Terms and Conditions, may
										result in suspension or cancellation of any or all services available to theOrganization I
										represent.
									</mat-checkbox>
									@if (
										(form.get('check5')?.dirty || form.get('check5')?.touched) &&
										form.get('check5')?.invalid &&
										form.get('check5')?.hasError('required')
									) {
										<mat-error class="mat-option-error">This is required</mat-error>
									}
								</div>
								<div class="col-12 mt-4">
									<mat-form-field class="w-auto" style="background-color: unset;">
										<mat-label>Date Signed</mat-label>
										<input matInput formControlName="dateSigned" />
										@if (form.get('dateSigned')?.hasError('required')) {
											<mat-error>This is required</mat-error>
										}
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
					</div>
				</div>
			</section>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class CrrpTermsAndCondsComponent implements OnInit {
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

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private orgUserService: OrgUserService,
		private authProcessService: AuthProcessService,
		private authUserService: AuthUserBceidService,
		private utilService: UtilService,
	) {}

	ngOnInit(): void {
		const isLoggedIn = this.authProcessService.getCurrentWaitUntilAuthenticatedValue();
		if (!isLoggedIn) {
			this.router.navigate([AppRoutes.LANDING]);
		}
	}

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

		if (!isValid) return;

		// Sets the isFirstTimeLogin to false
		this.orgUserService
			.apiOrgsOrgIdUsersUserIdGet({
				orgId: this.authUserService.bceidUserInfoProfile?.orgId!,
				userId: this.authUserService.bceidUserInfoProfile?.userId!,
			})
			.pipe()
			.subscribe((_resp: OrgUserResponse) => {
				const nextRoute = CrrpRoutes.path(CrrpRoutes.HOME);
				const defaultOrgId = this.authUserService.bceidUserOrgProfile?.id;
				this.router.navigate([nextRoute], { queryParams: { orgId: defaultOrgId } });
			});
	}
}
