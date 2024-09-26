import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicantListResponse, ApplicationTypeCode } from '@app/api/models';
import { ApplicantProfileService } from '@app/api/services';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { CommonSwlPermitTermsComponent } from '@app/modules/personal-licence-application/components/shared/common-step-components/common-swl-permit-terms.component';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';

@Component({
	selector: 'app-licence-first-time-user-selection',
	template: `
		<section class="step-section" *ngIf="options">
			<div class="step">
				<app-step-title title="First Time User Selection"></app-step-title>

				<div class="row">
					<div class="col-xxl-9 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="fs-5 lh-base">We found {{ infoLine1 }} in our system with your name and date of birth.</div>
						<div class="mt-3 lh-base">If {{ infoLine2 }}, select it to link it to your portal account:</div>
						<div class="row">
							<ng-container *ngFor="let option of options; let i = index">
								<div class="col-lg-4 col-md-6 col-sm-12 my-3">
									<div
										tabindex="0"
										class="user-option px-3 pb-3"
										(click)="onDataChange(option.licenceNumber!)"
										(keydown)="onKeyDown($event, option.licenceNumber!)"
										[ngClass]="{ 'active-selection-border': selectedLicenceNumber === option.licenceNumber }"
									>
										<div class="text-label d-block text-muted mt-0">Name</div>
										<div class="summary-text-data">{{ getFullName(option) }}</div>
										<div class="text-label d-block text-muted">Date of Birth</div>
										<div class="summary-text-data">
											{{ option.birthDate | formatDate : constants.date.formalDateFormat }}
										</div>
										<div class="text-label d-block text-muted">Licence Number</div>
										<div class="summary-text-data">{{ option.licenceNumber }}</div>
										<div class="text-label d-block text-muted">Expiry Date</div>
										<div class="summary-text-data">
											{{ option.licenceExpiryDate | formatDate : constants.date.formalDateFormat }}
										</div>
									</div>
								</div>
							</ng-container>
							<mat-error class="mat-option-error" *ngIf="showValidationError"> A profile must be selected </mat-error>
						</div>
						<div class="row mt-4">
							<div class="col-xxl-4 col-xl-4 col-lg-5 col-md-6 col-sm-12 mb-2">
								<button mat-stroked-button color="primary" class="large" (click)="onContinue()">
									{{ noneButtonLabel }}
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
export class LicenceFirstTimeUserSelectionComponent implements OnInit, LicenceChildStepperStepComponent {
	constants = SPD_CONSTANTS;
	selectedLicenceNumber: string | null = null;
	showValidationError = false;

	infoLine1 = '';
	infoLine2 = '';
	noneButtonLabel = '';

	options: Array<ApplicantListResponse> | null = null;

	@ViewChild(CommonSwlPermitTermsComponent) commonTermsComponent!: CommonSwlPermitTermsComponent;

	@Input() isWizard = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private applicantProfileService: ApplicantProfileService
	) {}

	ngOnInit(): void {
		this.applicantProfileService
			.apiApplicantSearchGet()
			.pipe()
			.subscribe((resp: Array<ApplicantListResponse>) => {
				if (!resp || resp.length === 0) {
					this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated());
					return;
				} else if (resp.length === 1) {
					this.infoLine1 = 'an existing record';
					this.infoLine2 = 'this is you';
					this.noneButtonLabel = 'This is not me';
				} else {
					this.infoLine1 = 'existing records';
					this.infoLine2 = 'any one of these are you';
					this.noneButtonLabel = 'None of these are me';
				}

				this.options = resp;
			});
	}

	isFormValid(): boolean {
		return this.commonTermsComponent.isFormValid();
	}

	onContinue(): void {
		this.showValidationError = false;
		this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated());
	}

	onLinkAndContinue(): void {
		this.showValidationError = !this.selectedLicenceNumber;
		if (this.showValidationError) {
			return;
		}

		this.router.navigateByUrl(
			PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
				PersonalLicenceApplicationRoutes.LICENCE_LINK
			),
			{ state: { licenceNumber: this.selectedLicenceNumber } }
		);
	}

	onDataChange(_val: string) {
		this.selectedLicenceNumber = _val;
	}

	onKeyDown(event: KeyboardEvent, _val: string) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onDataChange(_val);
	}

	getFullName(_val: ApplicantListResponse): string {
		return this.utilService.getFullNameWithMiddle(_val.firstName, _val.middleName1, _val.middleName2, _val.lastName);
	}
}
