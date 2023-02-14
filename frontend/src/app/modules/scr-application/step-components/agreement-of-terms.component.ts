import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ScreeningFormStepComponent } from '../scr-application.component';

@Component({
	selector: 'app-agreement-of-terms',
	template: `
		<section class="step-section pt-4 pb-5 px-3">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<div class="title mb-5">Review the following terms of agreement:</div>
					<div class="row">
						<div
							class="offset-md-2 col-md-8 col-sm-12 conditions px-3 mb-3"
							(scroll)="onScrollTermsAndConditions($event)"
						>
							<strong>TERMS AND CONDITIONS FOR EMPLOYERS THAT ENROL IN THE CRRP ONLINE SERVICE</strong><br /><br />
							<ul>
								<li>
									Upon completion of the Authorized Contact Consent To A Criminal Record Check Form, the CRRP will
									confirm enrollment of your organization in writing. If you have requested to enroll in the online
									service, your organization will be provided a unique link and access code. The access code must be
									provided to employees from an authorized contact.
								</li>
								<li>
									If your organization has volunteers covered under the Criminal Records Review Act and employees, you
									must enroll two separate profiles for the online service, one for “volunteers” and one for
									“employees”.
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
									processing fee which may be paid by credit card within the online service when submitting a request
									for a criminal record check.
								</li>
								<li>There is no fee for a volunteer or employee to request to share a criminal record check result.</li>
								<li>
									Individuals may request to share their results between one or more organizations registered with the
									CRRP.
								</li>
								<li>
									If the online service electronic identity verification fails for any reason, or the criminal record
									check or sharing request cannot be completed online, the organization must re-confirm the ID of the
									applicant in person (see ID verification requirements) and submit the paper consent form by fax,
									email, or mail to the CRRP.
								</li>
								<li>
									Should the Authorized Contact leave the organization, have a new Authorized Contact complete the
									Organizations Account Information Update process.
								</li>
								<li>
									Misuse of the CRRP online service or disregard for the terms and conditions may result in suspension
									or cancellation of services.
								</li>
							</ul>
						</div>
					</div>

					<div class="row" *ngIf="displayScrollToBottomMessage">
						<div class="offset-md-2 col-md-8 col-sm-12 p-0">
							<div class="alert alert-warning" role="alert">Please scroll to the bottom</div>
						</div>
					</div>

					<div class="row my-4">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-checkbox formControlName="agreeToCriminalCheck">
								I hereby consent to a criminal record check pursuant to the Criminal Records Review Act (CRRA) to
								determine whether I have a conviction or outstanding charge for any relevant or specified offence(s) as
								defined under that ACT (CRRA check). I hereby consent to a check of available law enforcement systems as
								further described below, including any local police records.
							</mat-checkbox>
							<mat-error
								*ngIf="
									(form.get('agreeToCriminalCheck')?.dirty || form.get('agreeToCriminalCheck')?.touched) &&
									form.get('agreeToCriminalCheck')?.invalid &&
									form.get('agreeToCriminalCheck')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>

					<div class="row my-4">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-checkbox formControlName="agreeToVulnerableSectorSearch">
								I hereby consent to a Vulnerable Sector search to check if I have been convicted if I have been
								convicted of and received a record suspension (formerly known as a pardon) for any sexual offences as
								per the Criminal Records Act.
							</mat-checkbox>
							<mat-error
								*ngIf="
									(form.get('agreeToVulnerableSectorSearch')?.dirty ||
										form.get('agreeToVulnerableSectorSearch')?.touched) &&
									form.get('agreeToVulnerableSectorSearch')?.invalid &&
									form.get('agreeToVulnerableSectorSearch')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [
		`
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
export class AgreementOfTermsComponent implements OnInit, ScreeningFormStepComponent {
	form!: FormGroup;
	hasScrolledToBottom = false;
	displayScrollToBottomMessage = false;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			agreeToCriminalCheck: new FormControl('', [Validators.required]),
			agreeToVulnerableSectorSearch: new FormControl('', [Validators.required]),
		});
	}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		this.displayScrollToBottomMessage = !this.hasScrolledToBottom;

		return this.form.valid && this.hasScrolledToBottom ? true : false;
	}

	onScrollTermsAndConditions(e: any) {
		this.displayScrollToBottomMessage = false;
		if (e.target.scrollHeight < e.target.scrollTop + e.target.offsetHeight) {
			this.hasScrolledToBottom = true;
		}
	}
}
