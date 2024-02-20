import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-common-update-received-success',
	template: `
		<div class="row">
			<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
				<div class="row">
					<div class="col-6">
						<h2 class="fs-3 mt-0 mt-md-3">Update Received</h2>
					</div>

					<div class="no-print col-6">
						<div class="d-flex justify-content-end">
							<button mat-flat-button color="primary" class="large w-auto m-2" aria-label="Print" (click)="onPrint()">
								<mat-icon class="d-none d-md-block">print</mat-icon>Print
							</button>
						</div>
					</div>
				</div>
				<mat-divider class="mat-divider-main mb-3"></mat-divider>

				<div class="mt-4 text-center fs-5">
					Your update to your {{ serviceTypeCode | options : 'ServiceTypes' }} has been received.
				</div>

				<div class="my-4 text-center">We will contact you if we need more information.</div>

				<div class="row mb-3">
					<div class="col-md-6 col-sm-12 mt-2">
						<div class="d-block text-label text-md-end">Licence Term</div>
					</div>
					<div class="col-md-6 col-sm-12 mt-md-2">
						<div class="payment__text">{{ licenceTermCode | options : 'LicenceTermTypes' }}</div>
					</div>
					<div class="col-md-6 col-sm-12 mt-2">
						<div class="d-block text-label text-md-end">Update Fee</div>
					</div>
					<div class="col-md-6 col-sm-12 mt-md-2">
						<div class="payment__text">{{ 0 | currency : 'CAD' : 'symbol-narrow' : '1.0' }}</div>
					</div>
					<div class="col-md-6 col-sm-12 mt-2">
						<div class="d-block text-label text-md-end">Case ID</div>
					</div>
					<div class="col-md-6 col-sm-12 mt-md-2">
						<div class="payment__text">{{ caseNumber }}</div>
					</div>
				</div>

				<div class="d-flex justify-content-end">
					<button
						mat-stroked-button
						color="primary"
						class="large w-auto m-2"
						aria-label="Back"
						(click)="onBackToHome()"
					>
						<mat-icon>arrow_back</mat-icon>Back to Home
					</button>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			@media print {
				.no-print,
				.no-print * {
					display: none !important;
				}

				.print-only {
					display: block;
				}
			}
		`,
	],
})
export class CommonUpdateReceivedSuccessComponent implements OnInit {
	licenceModelData: any = {};

	isBackRoute = false;
	appConstants = SPD_CONSTANTS;
	applicationTypeCodes = ApplicationTypeCode;

	@Input() serviceTypeCode!: ServiceTypeCode;

	constructor(private licenceApplicationService: LicenceApplicationService, private router: Router) {}

	ngOnInit(): void {
		this.licenceModelData = { ...this.licenceApplicationService.licenceModelFormGroup.getRawValue() };

		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LOGIN_SELECTION));
		}
	}

	onPrint(): void {
		window.print();
	}

	onBackToHome(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LOGIN_SELECTION));
	}

	get licenceTermCode(): string {
		return this.licenceModelData.licenceTermData.licenceTermCode ?? '';
	}

	get caseNumber(): string {
		return this.licenceModelData.caseNumber ?? '';
	}
}
