import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrgService } from 'src/app/api/services';
import { CrcRoutes } from './crc-routing.module';

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
							children and/or vulnerable adults, you are required to complete a criminal record check. This portal
							enables you to easily apply for a criminal record check under the Criminal Records Review Act.
						</p>
						<h3 class="fw-normal my-3">How do I submit a CRC request online?</h3>
						<p>To submit an online request for a criminal record check, you must:</p>
						<ul>
							<li>Be at least 12 years of age as of today's date.</li>
							<li>Have an access code provided by your organization.</li>
							<li>
								Have your identity verified by using your BC Services Card. The BC Services Card provides secure access
								to government online services.
							</li>
							<li>
								If you do not have a BC Services Card or if you live otuside the province, please contact your
								organization for a manual consent form.
							</li>
						</ul>
						<h3 class="fw-normal my-3">I'm ready</h3>
						<p>
							Enter the access code provided by your organization. An Access code is required to proceed with the online
							submission
						</p>
						<form [formGroup]="form" novalidate>
							<div class="row">
								<div class="col-lg-4 col-sm-6">
									<mat-form-field>
										<mat-label>Access Code</mat-label>
										<input matInput formControlName="accessCode" oninput="this.value = this.value.toUpperCase()" />
										<mat-error *ngIf="form.get('accessCode')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
									<mat-error class="mb-3" *ngIf="errorMessage">{{ errorMessage }}</mat-error>
								</div>
								<div class="col-lg-4 col-sm-6">
									<button mat-flat-button color="primary" class="large w-auto mx-2" (click)="onAccessCode()">
										Continue
									</button>
								</div>
							</div>
						</form>
						<h3 class="fw-normal mb-3">I need more information</h3>
						<ul>
							<li>
								I'm an employee or a volunteer and I want to know why I need to apply for a criminal record check.
							</li>
							<li>
								I'm an authorized contact who is reponsible for the facilitating the criminal record check for my
								organization.
							</li>
							<li>
								I'm an employer organization and I want to learn about registering with the Criminal Records Review
								Program (CRRP).
							</li>
							<li>I'm a volunteer organization and I want to register with the CRRP.</li>
						</ul>
					</div>
				</div>
			</section>
		</div>
	`,
	styles: [],
})
export class OrgAccessComponent {
	form: FormGroup = this.formBuilder.group({
		accessCode: new FormControl('', [Validators.required]),
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
				this.router.navigateByUrl(`/${CrcRoutes.MODULE_PATH}`, { state: { crcaOrgData: resp.body } });
			},
			error: (error) => {
				// only 404 will be here as an error
				this.errorMessage = 'This access code is not valid';
			},
		});
	}
}
