import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UtilService } from '@app/core/services/util.service';

@Component({
	selector: 'app-common-terms',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<button mat-flat-button color="primary" class="large w-auto m-2" aria-label="Download Terms of Use">
						<mat-icon class="d-none d-md-block">file_download</mat-icon>Download Terms of Use
					</button>

					<div class="conditions px-3 mb-3" (scroll)="onScrollTermsAndConditions($event)">
						<strong>TERMS AND CONDITIONS FOR EMPLOYERS THAT ENROL IN THE CRRP ONLINE SERVICE</strong><br /><br />
						<ul>
							<li>
								Upon completion of the Authorized Contact Consent To A Criminal Record Check Form, the CRRP will confirm
								enrollment of your organization in writing. If you have requested to enroll in the online service, your
								organization will be provided a unique link and access code. The access code must be provided to
								employees from an authorized contact.
							</li>
							<li>
								If your organization has volunteers covered under the Criminal Records Review Act and employees, you
								must enroll two separate profiles for the online service, one for “volunteers” and one for “employees”.
							</li>
							<li>
								If you enroll to conduct checks and sharing requests for volunteers, you must not utilize your unique
								link to the online service for employees and vice versa, if you enroll to conduct checks and sharing
								requests for employees, you must not utilize your unique link to the online service for volunteers.
							</li>
							<li>
								Upon confirmation of enrollment into the online service, your organization will direct employees as
								appropriate to the CRRP online service via the unique website link reserved for employees.
							</li>
							<li>
								The online service is offered to volunteers free of charge. For all other individuals, there is a $28
								processing fee which may be paid by credit card within the online service when submitting a request for
								a criminal record check.
							</li>
							<li>There is no fee for a volunteer or employee to request to share a criminal record check result.</li>
							<li>
								Individuals may request to share their results between one or more organizations registered with the
								CRRP.
							</li>
							<li>
								If the online service electronic identity verification fails for any reason, or the criminal record
								check or sharing request cannot be completed online, the organization must re-confirm the ID of the
								applicant in person (see ID verification requirements) and submit the paper consent form by fax, email,
								or mail to the CRRP.
							</li>
							<li>
								Should the Authorized Contact leave the organization, have a new Authorized Contact complete the
								Organizations Account Information Update process.
							</li>
							<li>
								Misuse of the CRRP online service or disregard for the terms and conditions may result in suspension or
								cancellation of services.
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="row" *ngIf="displayValidationErrors && !hasScrolledToBottom">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<div class="alert alert-warning" role="alert">Please scroll to the bottom</div>
				</div>
			</div>

			<div class="row mt-2">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<mat-checkbox formControlName="agreeToTermsAndConditions" (click)="onCheckboxChange()">
						I have read and accept the above Terms of Use
					</mat-checkbox>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('agreeToTermsAndConditions')?.dirty || form.get('agreeToTermsAndConditions')?.touched) &&
							form.get('agreeToTermsAndConditions')?.invalid &&
							form.get('agreeToTermsAndConditions')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>

				<div class="offset-md-2 col-md-8 col-sm-12 mt-3">
					<mat-form-field class="w-auto">
						<mat-label>Date Signed</mat-label>
						<input matInput formControlName="dateSigned" />
						<mat-error *ngIf="form.get('dateSigned')?.hasError('required')">This is required</mat-error>
					</mat-form-field>
				</div>
			</div>
		</form>
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
export class CommonTermsComponent {
	hasScrolledToBottom = false;
	displayValidationErrors = false;

	@Input() form!: FormGroup;

	constructor(private utilService: UtilService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		this.displayValidationErrors = !this.hasScrolledToBottom;

		console.log(this.form.valid, this.hasScrolledToBottom);
		return this.form.valid && this.hasScrolledToBottom;
	}

	onScrollTermsAndConditions(e: any) {
		if (e.target.scrollHeight < e.target.scrollTop + e.target.offsetHeight) {
			this.hasScrolledToBottom = true;
			this.setFormValid();
		}
	}

	onCheckboxChange(): void {
		this.setFormValid();
	}

	private setFormValid(): void {
		if (!this.hasScrolledToBottom) {
			return;
		}

		const data = this.form.value;
		if (data.agreeToTermsAndConditions) {
			this.form.controls['dateSigned'].setValue(this.utilService.getDateString(new Date()));
		} else {
			this.form.controls['dateSigned'].setValue('');
		}
	}
}
