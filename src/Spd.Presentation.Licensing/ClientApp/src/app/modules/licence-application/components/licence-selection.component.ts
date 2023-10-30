import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkerLicenceTypeCode } from 'src/app/api/models';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-licence-selection',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="What licence or permit are you applying for?"></app-step-title>

				<div class="step-container mx-3" *ngIf="isImagesLoaded">
					<div class="row">
						<div class="col-xxl-9 col-xl-12 mx-auto">
							<div class="row">
								<!-- <div class="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-3">
										<div
											class="step-container__box step-container__box__fullheight"
											(click)="onLicenceTypeChange(workerLicenceTypeCodes.SecurityBusinessLicence)"
											[ngClass]="{ 'active-selection-main': workerLicenceTypeCode == workerLicenceTypeCodes.SecurityBusinessLicence }"
										>
											<div class="fs-4 mb-4 mt-4 mx-3 mt-md-0">
												<div class="box__image d-none d-md-block">
													<img class="box__image__item" [src]="image1" />
												</div>
												Security Business Licence
											</div>
										</div>
									</div> -->
								<div class="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-3">
									<div
										class="step-container__box step-container__box__fullheight"
										(click)="onLicenceTypeChange(workerLicenceTypeCodes.SecurityWorkerLicence)"
										[ngClass]="{
											'active-selection-main': workerLicenceTypeCode == workerLicenceTypeCodes.SecurityWorkerLicence
										}"
									>
										<div class="fs-4 mb-4 mt-4 mx-3 mt-md-0">
											<div class="box__image d-none d-md-block">
												<img class="box__image__item" [src]="image2" />
											</div>
											Security Worker Licence
										</div>
									</div>
								</div>
								<div class="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-3">
									<div
										class="step-container__box step-container__box__fullheight"
										(click)="onLicenceTypeChange(workerLicenceTypeCodes.ArmouredVehiclePermit)"
										[ngClass]="{
											'active-selection-main': workerLicenceTypeCode == workerLicenceTypeCodes.ArmouredVehiclePermit
										}"
									>
										<div class="fs-4 mb-4 mt-4 mx-3 mt-md-0">
											<div class="box__image d-none d-md-block">
												<img class="box__image__item" [src]="image3" />
											</div>
											Permit to operate an armoured vehicle
										</div>
									</div>
								</div>
								<div class="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-3">
									<div
										class="step-container__box step-container__box__fullheight"
										(click)="onLicenceTypeChange(workerLicenceTypeCodes.BodyArmourPermit)"
										[ngClass]="{
											'active-selection-main': workerLicenceTypeCode == workerLicenceTypeCodes.BodyArmourPermit
										}"
									>
										<div class="fs-4 mb-4 mt-4 mx-3 mt-md-0">
											<div class="box__image d-none d-md-block">
												<img class="box__image__item" [src]="image4" />
											</div>
											Permit to possess body armour
										</div>
									</div>
								</div>

								<mat-error class="mat-option-error" style="text-align: center;" *ngIf="isDirtyAndInvalid">
									An option must be selected
								</mat-error>
							</div>
						</div>
					</div>
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
						height: 3em;
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

	workerLicenceTypeCode: WorkerLicenceTypeCode | null = null;
	isDirtyAndInvalid = false;

	workerLicenceTypeCodes = WorkerLicenceTypeCode;

	imageLoadedCount = 0;
	isImagesLoaded = false;
	imagePaths = [this.image1, this.image2, this.image3, this.image4];

	form: FormGroup = this.licenceApplicationService.workerLicenceTypeFormGroup;

	constructor(private router: Router, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATIONS_IN_PROGRESS));
		}

		this.imagePaths.forEach((path) => {
			// Preload the 'icon' images
			const tmp = new Image();
			tmp.onload = () => {
				this.onImageLoaded();
			};
			tmp.src = path;
		});

		this.workerLicenceTypeCode = this.form.value.workerLicenceTypeCode;
	}

	onStepNext(): void {
		const isValid = this.isFormValid();

		if (isValid) {
			this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATION_TYPE));
		}
	}

	onLicenceTypeChange(_val: WorkerLicenceTypeCode) {
		this.form.patchValue({ workerLicenceTypeCode: _val });
		this.workerLicenceTypeCode = _val;

		this.isFormValid();
	}

	private isFormValid(): boolean {
		const isValid = this.form.valid;
		this.isDirtyAndInvalid = !isValid;
		return isValid;
	}

	private onImageLoaded() {
		this.imageLoadedCount++;
		if (this.imagePaths.length == this.imageLoadedCount) {
			this.isImagesLoaded = true;
		}
	}
}
