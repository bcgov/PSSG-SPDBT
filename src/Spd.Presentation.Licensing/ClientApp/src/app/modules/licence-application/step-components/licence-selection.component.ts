import { Component } from '@angular/core';
import { LicenceFormStepComponent } from '../licence-application.component';

export enum SwlTypeCode {
	SecurityBusinessLicense = 'SecurityBusinessLicense',
	SecurityWorkerLicense = 'SecurityWorkerLicense',
	ArmouredVehicleLicense = 'ArmouredVehicleLicense',
	BodyArmourLicense = 'BodyArmourLicense',
}

@Component({
	selector: 'app-licence-selection',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="What licence or permit are you applying for?"></app-step-title>

				<div class="step-container row">
					<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-3">
						<div
							class="step-container__box"
							(click)="onLicenseTypeChange(swlTypeCodes.SecurityBusinessLicense)"
							[ngClass]="{ 'active-selection-main': licenseTypeCode == swlTypeCodes.SecurityBusinessLicense }"
						>
							<div class="mb-4 mt-4 mt-md-0">
								<div class="box__image d-none d-md-block">
									<img class="box__image__item" src="/assets/security-business-licence.png" />
								</div>
								Security Business License
							</div>
						</div>
					</div>
					<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-3">
						<div
							class="step-container__box"
							(click)="onLicenseTypeChange(swlTypeCodes.SecurityWorkerLicense)"
							[ngClass]="{ 'active-selection-main': licenseTypeCode == swlTypeCodes.SecurityWorkerLicense }"
						>
							<div class="mb-4 mt-4 mt-md-0">
								<div class="box__image d-none d-md-block">
									<img class="box__image__item" src="/assets/security-worker-licence.png" />
								</div>
								Security Worker Licence
							</div>
						</div>
					</div>
					<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-3">
						<div
							class="step-container__box"
							(click)="onLicenseTypeChange(swlTypeCodes.ArmouredVehicleLicense)"
							[ngClass]="{ 'active-selection-main': licenseTypeCode == swlTypeCodes.ArmouredVehicleLicense }"
						>
							<div class="mb-4 mt-4 mt-md-0">
								<div class="box__image d-none d-md-block">
									<img class="box__image__item" src="/assets/armoured-vehicle.png" />
								</div>
								Permit to operate an armoured vehicle
							</div>
						</div>
					</div>
					<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-3">
						<div
							class="step-container__box"
							(click)="onLicenseTypeChange(swlTypeCodes.BodyArmourLicense)"
							[ngClass]="{ 'active-selection-main': licenseTypeCode == swlTypeCodes.BodyArmourLicense }"
						>
							<div class="mb-4 mt-4 mt-md-0">
								<div class="box__image d-none d-md-block">
									<img class="box__image__item" src="/assets/body-armour.png" />
								</div>
								Permit to possess body armour
							</div>
						</div>
					</div>
				</div>
				<!-- <mat-error class="mat-option-error" style="text-align: center;" *ngIf="isDirtyAndInvalid"
      >An option must be selected</mat-error
    > -->
			</div>
		</section>
	`,
	styles: [
		`
			.box {
				&__image {
					margin-top: 1em;
					margin-bottom: 1em;
					border-radius: 50%;
					font: 32px Arial, sans-serif;

					&__item {
						height: 3em;
						max-width: 4em;
					}
				}

				&__text {
					font-weight: 700;
					line-height: 1.5em;
				}
			}

			.icon-container {
				display: block;
				text-align: center;

				.mat-icon {
					color: var(--color-black);
					font-size: 50px !important;
					height: 50px !important;
					width: 50px !important;
				}
			}
		`,
	],
})
export class LicenceSelectionComponent implements LicenceFormStepComponent {
	licenseTypeCode: SwlTypeCode | null = SwlTypeCode.SecurityWorkerLicense;
	isDirtyAndInvalid = false;

	swlTypeCodes = SwlTypeCode;

	onLicenseTypeChange(_val: SwlTypeCode) {
		this.licenseTypeCode = _val;
		const isValid = this.isFormValid();
		this.isDirtyAndInvalid = !isValid;
	}

	isFormValid(): boolean {
		const isValid = !!this.licenseTypeCode;
		this.isDirtyAndInvalid = !isValid;
		return isValid;
	}

	getDataToSave(): any {
		return { licenseTypeCode: this.licenseTypeCode };
	}
}
