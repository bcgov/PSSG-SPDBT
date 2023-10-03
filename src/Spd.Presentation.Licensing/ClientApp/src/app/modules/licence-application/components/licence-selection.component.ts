import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwlTypeCode } from 'src/app/core/code-types/model-desc.models';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-licence-selection',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="What licence or permit are you applying for?"></app-step-title>

				<div class="step-container" *ngIf="isImagesLoaded">
					<div class="row">
						<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-3">
							<div
								class="step-container__box step-container__box__fullheight"
								(click)="onLicenceTypeChange(swlTypeCodes.SecurityBusinessLicence)"
								[ngClass]="{ 'active-selection-main': licenceTypeCode == swlTypeCodes.SecurityBusinessLicence }"
							>
								<div class="mb-4 mt-4 mt-md-0">
									<div class="box__image d-none d-md-block">
										<img class="box__image__item" [src]="image1" />
									</div>
									Security Business Licence
								</div>
							</div>
						</div>
						<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-3">
							<div
								class="step-container__box step-container__box__fullheight"
								(click)="onLicenceTypeChange(swlTypeCodes.SecurityWorkerLicence)"
								[ngClass]="{ 'active-selection-main': licenceTypeCode == swlTypeCodes.SecurityWorkerLicence }"
							>
								<div class="mb-4 mt-4 mt-md-0">
									<div class="box__image d-none d-md-block">
										<img class="box__image__item" [src]="image2" />
									</div>
									Security Worker Licence
								</div>
							</div>
						</div>
						<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-3">
							<div
								class="step-container__box step-container__box__fullheight"
								(click)="onLicenceTypeChange(swlTypeCodes.ArmouredVehicleLicence)"
								[ngClass]="{ 'active-selection-main': licenceTypeCode == swlTypeCodes.ArmouredVehicleLicence }"
							>
								<div class="mb-4 mt-4 mt-md-0">
									<div class="box__image d-none d-md-block">
										<img class="box__image__item" [src]="image3" />
									</div>
									<span class="px-2">Permit to operate an armoured vehicle</span>
								</div>
							</div>
						</div>
						<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-3">
							<div
								class="step-container__box step-container__box__fullheight"
								(click)="onLicenceTypeChange(swlTypeCodes.BodyArmourLicence)"
								[ngClass]="{ 'active-selection-main': licenceTypeCode == swlTypeCodes.BodyArmourLicence }"
							>
								<div class="mb-4 mt-4 mt-md-0">
									<div class="box__image d-none d-md-block">
										<img class="box__image__item" [src]="image4" />
									</div>
									<span class="px-2">Permit to possess body armour</span>
								</div>
							</div>
						</div>
					</div>
					<mat-error class="mat-option-error" style="text-align: center;" *ngIf="isDirtyAndInvalid">
						An option must be selected
					</mat-error>
				</div>

				<div class="row mt-4">
					<div class="col-lg-3 col-md-4 col-sm-6 mx-auto">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext()">Next</button>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.box {
				&__image {
					margin-top: 1.5em;
					margin-bottom: 1.5em;
					border-radius: 50%;
					font: 32px Arial, sans-serif;

					&__item {
						height: 2.5em;
						/* max-width: 4em; */
					}
				}

				&__text {
					font-weight: 700;
					line-height: 1.5em;
				}
			}
		`,
	],
})
export class LicenceSelectionComponent implements OnInit {
	readonly image1 = '/assets/security-business-licence.png';
	readonly image2 = '/assets/security-worker-licence.png';
	readonly image3 = '/assets/armoured-vehicle.png';
	readonly image4 = '/assets/body-armour.png';

	licenceTypeCode: SwlTypeCode | null = null;
	isDirtyAndInvalid = false;

	swlTypeCodes = SwlTypeCode;

	imageLoadedCount = 0;
	isImagesLoaded = false;
	imagePaths = [this.image1, this.image2, this.image3, this.image4];

	constructor(private router: Router, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: boolean) => {
				if (loaded) {
					this.licenceTypeCode = this.licenceApplicationService.licenceModel.licenceTypeCode;
				}
			},
		});

		this.imagePaths.forEach((path) => {
			// Preload the 'icon' images
			const tmp = new Image();
			tmp.onload = () => {
				this.onImageLoaded();
			};
			tmp.src = path;
		});
	}

	onStepNext(): void {
		if (this.isFormValid()) {
			this.licenceApplicationService.licenceModel.licenceTypeCode = this.licenceTypeCode;
			this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LICENCE_TYPE));
		}
	}

	onLicenceTypeChange(_val: SwlTypeCode) {
		this.licenceTypeCode = _val;
		const isValid = this.isFormValid();
		this.isDirtyAndInvalid = !isValid;
	}

	isFormValid(): boolean {
		const isValid = !!this.licenceTypeCode;
		this.isDirtyAndInvalid = !isValid;
		return isValid;
	}

	// getDataToSave(): any {
	// 	return { licenceTypeCode: this.licenceTypeCode };
	// }

	private onImageLoaded() {
		this.imageLoadedCount++;
		if (this.imagePaths.length == this.imageLoadedCount) {
			this.isImagesLoaded = true;
		}
	}
}
