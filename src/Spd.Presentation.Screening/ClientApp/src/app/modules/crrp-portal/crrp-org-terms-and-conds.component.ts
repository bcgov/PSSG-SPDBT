import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { UtilService } from 'src/app/core/services/util.service';
import { CrrpRoutes } from './crrp-routing.module';

@Component({
	selector: 'app-crrp-org-terms-and-conds',
	template: `
		<div class="container" *ngIf="isAuthenticated | async">
			<section class="step-section my-4">
				<div class="row m-4">
					<div class="col-lg-8 mx-auto">
						<h2>{{ authUserService.bceidUserInfoProfile?.orgName }}</h2>

						<h3 class="subheading fw-normal my-3">Terms and Conditions</h3>
						<p>Read, download, and accept the Terms of Use to continue.</p>
						<form [formGroup]="form" novalidate>
							<app-terms-text></app-terms-text>
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
								<h3 class="subheading fw-normal my-3">
									Terms and Conditions for use of the Organization’s Online Service Portal (the “Site”) in an Authorized
									Contact Role:
								</h3>
								<div class="col-12">
									<mat-checkbox formControlName="check1" (click)="onCheckboxChange()">
										I understand that as an Authorized Contact, and on behalf of the Organization I represent, I am
										responsible for facilitating the criminal record check process for individuals working with or
										applying to work with children and/or vulnerable adults.
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
										I understand that as an Authorized Contact, and on behalf of the Organization I represent, I am
										responsible for verifying and confirming the identity of every applicant who submits a consent to a
										criminal record check manually or via webform.
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
										I understand that as an Authorized Contact, and on behalf of the Organization I represent, I am
										responsible for retaining all originally signed criminal record check consent forms that are
										submitted manually, for a minimum of 5 (five) years after their submission. The Criminal Records
										Review Program may request a copy of the signed consent form(s) at any time.
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
										I understand that should I leave the Organization I represent, my access to the Site as an
										Authorized Contact is immediately terminated.
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
										I understand that my misuse of the Site, or disregard for any of these Terms and Conditions, may
										result in suspension or cancellation of any or all services available to theOrganization I
										represent.
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
									<mat-form-field class="w-auto" style="background-color: var(--color-grey-lightest);">
										<mat-label>Date Signed</mat-label>
										<input matInput formControlName="dateSigned" />
										<mat-error *ngIf="form.get('dateSigned')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>
							</div>

							<div class="row">
								<div class="col-12">
									<button
										mat-flat-button
										color="primary"
										class="large w-auto  float-end mx-2 my-2"
										(click)="onContinue()"
									>
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
export class CrrpOrgTermsAndCondsComponent implements OnInit {
	isAuthenticated = this.authProcessService.waitUntilAuthentication$;
	invitationId: string | null = null;

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
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		protected authUserService: AuthUserBceidService,
		private authProcessService: AuthProcessService,
		private utilService: UtilService,
		private router: Router
	) {}

	async ngOnInit(): Promise<void> {
		this.invitationId = this.route.snapshot.paramMap.get('id');
		if (!this.invitationId) {
			console.debug('CrrpOrgTermsAndCondsComponent - missing invitation id');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		await this.authProcessService.initializeCrrpUserInvitation(location.pathname);
	}

	onCheckboxChange(): void {
		const data = this.form.value;
		if (data.readTerms && data.check1 && data.check2 && data.check3 && data.check4 && data.check5) {
			this.form.controls['dateSigned'].setValue(this.utilService.getDateString(new Date()));
		} else {
			this.form.controls['dateSigned'].setValue('');
		}
	}

	onContinue(): void {
		this.form.markAllAsTouched();
		if (this.form.valid) {
			const url = `${CrrpRoutes.path(CrrpRoutes.INVITATION_ACCEPT)}/${this.invitationId}`;
			this.router.navigate([url]);
		}
	}
}
