import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OrgService } from 'src/app/api/services';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { CrrpaRoutes } from './crrpa-routing.module';

@Component({
	selector: 'app-org-access',
	template: `
		<div class="container">
			<section class="step-section my-4">
				<div class="row m-4">
					<div class="col-lg-8 mx-auto">
						<h2 class="mb-3">Criminal Record Check</h2>
						<p>
							In British Columbia, if you work or volunteer with, or have the potential for unsupervised access to
							children and/or vulnerable adults, you are required to complete a criminal record check.
						</p>
						<h3 class="subheading fw-normal my-3">How do I submit a CRC request online?</h3>
						<p>To submit an online request for a criminal record check, you must:</p>
						<ul>
							<li>Be at least 12 years of age as of today's date.</li>
							<li>Have an access code provided by your organization.</li>
							<li>
								Have your identity verified by using your
								<a href="https://www2.gov.bc.ca/gov/content/governments/government-id/bcservicescardapp" target="_blank"
									>BC Services Card</a
								>. If you don't have a BC Services Card or are unable to verify your identity through the app, your
								organization will verify your ID after you submit your criminal record check application.1-855-587-0185
							</li>
						</ul>
						<h3 class="subheading fw-normal my-3">Access code:</h3>
						<p>
							Enter the access code provided by your organization. An access code is required to proceed with the online
							submission.
						</p>
						<form [formGroup]="form" novalidate>
							<div class="row">
								<div class="col-xl-4 col-lg-5 col-md-6 col-sm-6">
									<mat-form-field>
										<input
											matInput
											formControlName="accessCode"
											oninput="this.value = this.value.toUpperCase()"
											placeholder="Enter your code here"
										/>
										<mat-error *ngIf="form.get('accessCode')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
									<mat-error class="mb-3" *ngIf="errorMessage">{{ errorMessage }}</mat-error>
								</div>
								<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6">
									<button mat-flat-button color="primary" class="large w-auto mx-2 my-2" (click)="onAccessCode()">
										Continue
									</button>
								</div>
							</div>
						</form>
						<h3 class="subheading fw-normal mb-3">Need help?</h3>
						<p>For applicants, contact your organization for your access code.</p>
						<p>
							For organizations, if you have a question about the online submission process or to register your
							organization, contact the Criminal Records Review Program (CRRP) at
							<a href="mailto:criminalrecords@gov.bc.ca">criminalrecords@gov.bc.ca</a> or by phone at 1-855-587-0185
							(option 2).
						</p>
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
export class OrgAccessComponent {
	form: FormGroup = this.formBuilder.group({
		accessCode: new FormControl('', [FormControlValidators.required]),
	});
	errorMessage: string | null = null;

	constructor(private router: Router, private formBuilder: FormBuilder, private orgService: OrgService) {}

	onAccessCode(): void {
		this.errorMessage = null;
		this.form.markAllAsTouched();

		if (!this.form.valid) {
			return;
		}

		this.orgService.apiOrgsAccessCodeAccessCodeGet$Response({ accessCode: this.form.value.accessCode }).subscribe({
			next: (resp) => {
				this.router.navigateByUrl(`/${CrrpaRoutes.MODULE_PATH}`, { state: { crcaOrgData: resp.body } });
			},
			error: (error) => {
				// only 404 will be here as an error
				this.errorMessage = 'This access code is not valid';
			},
		});
	}
}
