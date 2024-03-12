import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-step-worker-licence-type-authenticated',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="What licence or permit are you applying for?"></app-step-title>

				<div class="step-container mx-3" *ngIf="isImagesLoaded">
					<div class="row">
						<div class="col-xxl-9 col-xl-12 mx-auto">
							<div class="row">
								<div class="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-3">
									<div
										tabindex="0"
										class="step-container__box step-container__box__fullheight"
										(click)="onLicenceTypeChange(workerLicenceTypeCodes.SecurityWorkerLicence)"
										(keydown)="onKeydownLicenceTypeChange($event, workerLicenceTypeCodes.SecurityWorkerLicence)"
										[ngClass]="{
											'active-selection-main': workerLicenceTypeCode === workerLicenceTypeCodes.SecurityWorkerLicence
										}"
									>
										<div class="fs-5 mb-4 mt-4 mx-3 mt-md-0">
											<div class="box__image d-none d-md-block">
												<img class="box__image__item" [src]="image2" alt="Security Worker Licence" />
											</div>
											Security Worker Licence
										</div>
									</div>
								</div>
								<div class="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-3">
									<div
										tabindex="0"
										class="step-container__box step-container__box__fullheight"
										(click)="onLicenceTypeChange(workerLicenceTypeCodes.ArmouredVehiclePermit)"
										(keydown)="onKeydownLicenceTypeChange($event, workerLicenceTypeCodes.ArmouredVehiclePermit)"
										[ngClass]="{
											'active-selection-main': workerLicenceTypeCode === workerLicenceTypeCodes.ArmouredVehiclePermit
										}"
									>
										<div class="fs-5 mb-4 mt-4 mx-3 mt-md-0">
											<div class="box__image d-none d-md-block">
												<img class="box__image__item" [src]="image3" alt="Armoured Vehicle Permit" />
											</div>
											Permit to operate an armoured vehicle
										</div>
									</div>
								</div>
								<div class="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-3">
									<div
										tabindex="0"
										class="step-container__box step-container__box__fullheight"
										(click)="onLicenceTypeChange(workerLicenceTypeCodes.BodyArmourPermit)"
										(keydown)="onKeydownLicenceTypeChange($event, workerLicenceTypeCodes.BodyArmourPermit)"
										[ngClass]="{
											'active-selection-main': workerLicenceTypeCode === workerLicenceTypeCodes.BodyArmourPermit
										}"
									>
										<div class="fs-5 mb-4 mt-4 mx-3 mt-md-0">
											<div class="box__image d-none d-md-block">
												<img class="box__image__item" [src]="image4" alt="Body Armour Permit" />
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
			</div>
		</section>

		<div class="row mt-4">
			<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
				<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
			</div>
			<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
				<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext()">Next</button>
			</div>
		</div>
	`,
	styles: [
		`
			.box {
				&__image {
					margin-top: 1.5em;
					margin-bottom: 1.5em;
					font: 32px Arial, sans-serif;

					&__item {
						height: 3em;
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
export class StepWorkerLicenceTypeAuthenticatedComponent implements OnInit, LicenceChildStepperStepComponent {
	readonly image2 = '/assets/security-worker-licence.png';
	readonly image3 = '/assets/armoured-vehicle.png';
	readonly image4 = '/assets/body-armour.png';

	workerLicenceTypeCode: WorkerLicenceTypeCode | null = null;
	isDirtyAndInvalid = false;

	workerLicenceTypeCodes = WorkerLicenceTypeCode;

	imageLoadedCount = 0;
	isImagesLoaded = false;
	imagePaths = [this.image2, this.image3, this.image4];

	form: FormGroup = this.licenceApplicationService.workerLicenceTypeFormGroup;

	constructor(private router: Router, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		// TODO  If the licence holder has a SWL, they can add a new Body Armour and/or Armoured Vehicle permit
		// TODO If the licence holder has a Body Armour permit, they can add a new Armoured Vehicle permit and/or a security worker licence
		// TODO If the licence holder has an Armoured vehicle permit, they can add a new Body Armour permit and/or a security worker licence

		this.imagePaths.forEach((path) => {
			// Preload the 'icon' images
			const tmp = new Image();
			tmp.onload = () => {
				this.onImageLoaded();
			};
			tmp.src = path;
		});

		this.workerLicenceTypeCode = this.form?.value.workerLicenceTypeCode;
	}

	onLicenceTypeChange(_val: WorkerLicenceTypeCode) {
		// console.debug('onLicenceTypeChange', _val);
		this.form.patchValue({ workerLicenceTypeCode: _val });
		this.workerLicenceTypeCode = _val;

		// console.debug('onLicenceTypeChange', this.form.value);
		// console.debug('onLicenceTypeChange', this.licenceApplicationService.workerLicenceTypeFormGroup.value);
		// console.debug(
		// 	'onLicenceTypeChange licenceModelFormGroupAnonymous',
		// 	this.licenceApplicationService.licenceModelFormGroupAnonymous.value
		// );
		// console.debug(
		// 	'onLicenceTypeChange licenceModelFormGroup',
		// 	this.licenceApplicationService.licenceModelFormGroup.value
		// );
		this.isFormValid();
	}

	onKeydownLicenceTypeChange(event: KeyboardEvent, _val: WorkerLicenceTypeCode) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onLicenceTypeChange(_val);
	}

	isFormValid(): boolean {
		const isValid = this.form.valid;
		this.isDirtyAndInvalid = !isValid;
		return isValid;
	}

	onStepPrevious(): void {
		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
				LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
			)
		);
	}

	onStepNext(): void {
		if (this.isFormValid()) {
			this.router.navigateByUrl(
				LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
					LicenceApplicationRoutes.WORKER_LICENCE_APPLICATION_TYPE_AUTHENTICATED
				)
			);
		}
	}

	private onImageLoaded() {
		this.imageLoadedCount++;
		if (this.imagePaths.length == this.imageLoadedCount) {
			this.isImagesLoaded = true;
		}
	}
}
