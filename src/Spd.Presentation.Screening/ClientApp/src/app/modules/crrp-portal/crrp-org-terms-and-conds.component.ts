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
							<div class="row mt-4">
								<div class="col-12">
									<div class="conditions px-3 mb-3">
										<p style="margin-top: .6rem;">
											<strong>
												Terms of Use for Authorized Contacts Accessing the Organization Online Service Portal
											</strong>
										</p>
										<p>
											In these Terms of Use, "you" or "your" includes the individual using or accessing the Organization
											Online Service Portal (the "Site").
										</p>
										<p>
											These Terms of Use are an agreement between you and His Majesty the King in Right of the Province
											of British Columbia, represented by the Minister of Public Safety and Solicitor General (the
											"Province") and they govern your use of the Site and, where applicable, any associated service
											("Associated Service" and, together with the Site, the "Services").
										</p>
										<p>
											By clicking the box to indicate that you accept these Terms of Use, and in consideration of your
											use of the Services, you agree, to the terms and conditions set out below.
										</p>
										<p>
											Your failure to abide by these Terms of Use may result in the suspension or cancellation of your
											use of or access to the Services. In addition, the Province reserves the right to pursue any
											remedy available at law or in equity.
										</p>
										<p>Please print a copy of these Terms of Use for your records.</p>

										<strong>Disclaimer:</strong>
										<ol>
											<li>
												THE SERVICES ARE PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND INCLUDING WARRANTY OF FITNESS
												FOR A PARTICULAR PURPOSE. USE OF THE SERVICES IS ENTIRELY AT YOUR OWN RISK, AND YOU WILL BE
												LIABLE FOR ANY FAILURE TO ABIDE BY THESE TERMS OF USE.
											</li>
											<li>
												WITHOUT LIMITING THE GENERAL NATURE OF THE FOREGOING, THE PROVINCE DOES NOT REPRESENT OR WARRANT
												THAT:
												<ol type="a">
													<li>
														THE ACCURACY, COMPLETENESS OR CURRENCY OF SERVICES OR ANY ASSOCIATED INFORMATION, OR THAT
														ANY ERRORS WILL BE CORRECTED.
													</li>
													<li>
														THE SERVICES WILL FUNCTION IN A TIMELY MANNER OR WILL BE AVAILABLE WITHOUT ERROR, FAILURE,
														OR INTERRUPTION; OR
													</li>
													<li>THE SERVICES WILL MEET YOUR EXPECTATIONS OR REQUIREMENTS.</li>
												</ol>
											</li>
											<li>The Province is not responsible for the content of the Payment Site as defined below.</li>
											<strong>Information Collection:</strong>
											<li>
												When you visit the Site or use the Services, certain types of information are automatically
												collected from you, by audit logs or cookies. This information is collected, used and disclosed
												in accordance with the Province’s
												<a href="https://www2.gov.bc.ca/gov/content/home/privacy" target="_blank">Privacy Policy</a>.
											</li>
											<li>
												The date and time of your acceptance of these Terms of Use will be logged. This will enable you
												to skip this step on future visits. However, if these Terms of Use are modified, they will be
												presented to you upon your next following visit, and you will need to accept the modified terms
												to continue to access the Services. Notwithstanding the foregoing, you are responsible for
												reviewing these Terms of Use on a regular basis to ensure that you are aware of any
												modifications that may have been made and your continued use of the Services constitutes your
												acceptance of any such modified Terms of Use.
											</li>
											<li>
												The information that you input on the Site may also be logged and attributed to you for
												verification purposes.
											</li>
											<strong>Authentication:</strong>
											<li>
												You are required to be a Profile Manager for your Organization’s Business BCeID account to
												login, access or use the Services.
											</li>
											<li>
												Each time you access the Site, you must be authenticated by following an external link to the
												BCeID site, following which you will be returned to, and allowed to access the Site.
											</li>
											<strong>Payment:</strong>
											<li>
												You will be required to access an external payment processing site (“Payment Site” or, as the
												context requires, “Associated Service”) in order to pay the criminal record check fee for
												individual applicants for whom payment is required.
											</li>
											<strong>Additional Terms and Personal Information Collection:</strong>
											<li>
												You may be required to accept additional terms and conditions in order to use or access an
												Associated Service, including the BCeID site, and/or the Payment Site, in which case your access
												to, and use of the services offered by, those Associated Services, including the BCeID site,
												and/ or the Payment Site, is governed by such additional terms.
											</li>
											<li>
												Additional personal information may be collected from you by the providers of the Associated
												Services in accordance with their terms and any associated privacy statement(s).
											</li>
											<strong>Warranty:</strong>
											<li>
												In accessing or using the Site, you represent and warrant that:
												<ol type="a">
													<li>You are at least 16 years of age; and</li>
													<li>
														You have the power and capacity to accept, execute and comply with these Terms of Use.
													</li>
												</ol>
											</li>
											<strong>Acceptable Use and Security:</strong>
											<li>
												You must not:
												<ol type="a">
													<li>
														use the Services for any unlawful or inappropriate purpose, including hacking, data mining
														or other intrusion activities.
													</li>
													<li>
														input or upload any information which contains computer viruses such asTrojan horses, worms,
														time bombs or other computer programming routines that may damage or interfere with the
														performance or function of the Services or any Associated Service.
													</li>
													<li>
														divulge, share, compromise or permit any other person to use your login and password to
														access the Services.
													</li>
													<li>
														take any action that might reasonably be construed as altering, destroying, defeating,
														compromising, or rendering ineffective the security related to the Site or any Associated
														Service, or being likely to affect other users of the Services.
													</li>
													<li>attempt to collect any information about other users of the Services; or</li>
													<li>
														decompile, disassemble, reverse engineer, or otherwise copy any source code associated with
														the Site or any Associated Service.
													</li>
												</ol>
											</li>
											<strong>Ownership and Non-permitted Uses:</strong>
											<li>
												You acknowledge and agree that at all times the Province and/or the providers of the Associated
												Services, or their respective licensors, are the owners of any software, hardware, servers,
												networks or other equipment used to provide the Services.
											</li>
											<li>
												You will not take any action that would be inconsistent with or infringe any proprietary or
												intellectual property rights of the Province, the providers of the Associated Services or their
												respective licensors, in any software, hardware, servers, networks or other equipment,
												documentation or other information used to provide the Services.
											</li>
											<li>
												You will not remove or alter any proprietary symbol or notice, including any copyright notice,
												trademark or logo displayed in connection with the Services.
											</li>
											<strong>Suspension or Cancellation of Services:</strong>
											<li>
												Your use of any of the Services may be suspended or cancelled at any time if:
												<ol type="a">
													<li>
														you fail to abide by these Terms of Use, or other terms and conditions that may be posted on
														any website used to access the Services; or
													</li>
													<li>
														the Province or the provider of any Associated Service deems such suspension or cancellation
														necessary for any good and valid reason
													</li>
												</ol>
											</li>
											<li>
												The Province and any provider of any Associated Service reserve the right, at any time, to:
												<ol type="a">
													<li>make changes to the Services;</li>
													<li>stop providing the Services; and</li>
													<li>modify these Terms of Use at any time, without notice being provided directly to you.</li>
												</ol>
											</li>
											<strong>Limitation of Liability:</strong>
											<li>
												In addition to the Province’s general
												<a href="https://www2.gov.bc.ca/gov/content/home/disclaimer" target="_blank"
													>Limitation of Liabilities</a
												>, you agree that under no circumstances will the Province or the provider of any Associated
												Service be liable to you or to any other individual or entity for any direct, indirect, special,
												incidental, consequential or other loss, claim, injury or damage, whether foreseeable or
												unforeseeable (including without limitation claims for damages for loss of profits or business
												opportunities, use of or inability to use the Services, interruptions, deletion or corruption of
												files, loss of programs or information, errors, defects or delays) arising out of or in any way
												connected with your or their access to or use of the Services or any failure by you or them to
												abide by these Terms of Use and whether based on contract, tort, strict liability or any other
												legal theory. The previous sentence will apply even if the Province or the provider of any
												Associated Service has been specifically advised of the possibility of any such loss, claim,
												injury or damage.
											</li>
											<strong>Enforceability and Jurisdiction:</strong>
											<li>
												If any term or provision of these Terms of Use is invalid, illegal, or unenforceable, all other
												terms and provisions of these Terms of Use will nonetheless remain in full force and effect.
											</li>
											<li>
												All access to the Site or use of any Services or Associated Service will be governed by, and
												construed and interpreted in accordance with, the laws applicable in the Province of British
												Columbia, Canada.
											</li>
											<li>
												You hereby consent to the exclusive jurisdiction and venue of the courts of the Province of
												British Columbia, sitting in Victoria, for the hearing of any matter relating to or arising from
												these Terms of Use and/or your access to the Site or use of the Services or any Associated
												Service.
											</li>
										</ol>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-12">
									<mat-checkbox formControlName="readTerms" (click)="onCheckboxChange()">
										I have read and accept the above terms of Use.
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
			li:not(:last-child) {
				margin-bottom: 1em;
			}

			.subheading {
				color: grey;
			}

			.conditions {
				border: 1px solid var(--color-grey-light);
				max-height: 400px;
				overflow-y: auto;
				box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
				font-size: smaller;
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

		await this.authProcessService.initializeCrrp(null, location.pathname);
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
