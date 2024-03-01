import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { LoginService } from '@app/api/services';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { AuthUserBcscService } from '@app/core/services/auth-user-bcsc.service';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { CommonTermsComponent } from '../shared/step-components/common-terms.component';

@Component({
	selector: 'app-worker-licence-first-time-user-selection',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="First Time User Selection"></app-step-title>

				<div class="row">
					<div class="col-xxl-9 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="fs-5 lh-base">We found existing records in our system with your name and date of birth.</div>
						<div class="mt-3 lh-base">If any one of these are you, select it to link it to your portal account:</div>
						<div class="row">
							<ng-container *ngFor="let option of options; let i = index">
								<div class="col-lg-4 col-md-6 col-sm-12 my-3">
									<div
										tabindex="0"
										class="user-option px-3 pb-3"
										(click)="onDataChange(option.id)"
										(keydown)="onKeyDown($event, option.id)"
										[ngClass]="{ 'active-selection-border': userOption === option.id }"
									>
										<div class="text-label d-block text-muted mt-0">Name</div>
										<div class="summary-text-data">{{ option.name }}</div>
										<div class="text-label d-block text-muted">Date of Birth</div>
										<div class="summary-text-data">
											{{ option.dateOfBirth | formatDate : constants.date.formalDateFormat }}
										</div>
										<div class="text-label d-block text-muted">Licence Number</div>
										<div class="summary-text-data">{{ option.licenceNumber }}</div>
										<div class="text-label d-block text-muted">Expiry Date</div>
										<div class="summary-text-data">
											{{ option.expiryDate | formatDate : constants.date.formalDateFormat }}
										</div>
									</div>
								</div>
							</ng-container>
							<mat-error class="mat-option-error" *ngIf="showValidationError"> A profile must be selected </mat-error>
						</div>
						<div class="row mt-4">
							<div class="col-xxl-4 col-xl-4 col-lg-5 col-md-6 col-sm-12 mb-2">
								<button mat-stroked-button color="primary" class="large" (click)="onContinue()">
									None of these are me
								</button>
							</div>
							<div class="offset-xxl-4 col-xxl-4 offset-xl-4 col-xl-4 offset-lg-2 col-lg-5 col-md-6 col-sm-12 mb-2">
								<button mat-flat-button color="primary" class="large" (click)="onLinkAndContinue()">
									Link and Continue
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.user-option {
				border-radius: 4px;
				border: 1px solid grey;
				box-shadow: 0 3px 1px -2px #0003, 0 2px 2px #00000024, 0 1px 5px #0000001f;
			}
		`,
	],
})
export class WorkerLicenceFirstTimeUserSelectionComponent implements LicenceChildStepperStepComponent {
	constants = SPD_CONSTANTS;
	userOption: string | null = null;
	showValidationError = false;

	options: Array<any> = [
		{
			id: '1',
			name: 'Joanna Anne Smith',
			dateOfBirth: '1991-08-15',
			licenceNumber: 'E1139967',
			expiryDate: '2015-08-15',
		},
		{
			id: '2',
			name: 'Joanna Rachel Smith',
			dateOfBirth: '1991-08-15',
			licenceNumber: 'E2239967',
			expiryDate: '2026-04-22',
		},
		{
			id: '3',
			name: 'Joanna Smith',
			dateOfBirth: '1991-08-15',
			licenceNumber: 'E4439967',
			expiryDate: '2030-11-05',
		},
	];

	@ViewChild(CommonTermsComponent) commonTermsComponent!: CommonTermsComponent;

	@Input() inWizard = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	applicationTypeCodes = ApplicationTypeCode;

	constructor(
		private router: Router,
		private loginService: LoginService,
		private authUserBcscService: AuthUserBcscService
	) {}

	isFormValid(): boolean {
		return this.commonTermsComponent.isFormValid();
	}

	onContinue(): void {
		this.showValidationError = false;
		this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated());
	}

	onLinkAndContinue(): void {
		if (!this.userOption) {
			this.showValidationError = true;
			return;
		}

		this.showValidationError = false;

		this.loginService
			.apiApplicantApplicantIdTermAgreeGet({
				applicantId: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			})
			.pipe()
			.subscribe((_resp: any) => {
				this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated());
			});
	}

	onDataChange(_val: string) {
		this.userOption = _val;
	}

	onKeyDown(event: KeyboardEvent, _val: string) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onDataChange(_val);
	}
}
