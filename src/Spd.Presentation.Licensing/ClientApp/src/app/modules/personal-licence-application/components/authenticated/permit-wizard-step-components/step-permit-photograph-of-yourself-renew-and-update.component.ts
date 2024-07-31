import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { CommonPhotographOfYourselfComponent } from '@app/modules/personal-licence-application/components/shared/common-step-components/common-photograph-of-yourself.component';
import { PermitApplicationService } from '@app/modules/personal-licence-application/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-permit-photograph-of-yourself-renew-and-update',
	template: `
		<app-step-section [title]="title">
			<div [formGroup]="form" class="row">
				<ng-container *ngIf="!originalPhotoOfYourselfExpired">
					<div class="d-flex justify-content-center" *ngIf="photographOfYourself">
						<div class="photo-of-yourself">
							<div class="fs-5">Current photo</div>
							<img class="photo-of-yourself__item" [src]="photographOfYourself" alt="Photograph of yourself" />
						</div>
					</div>

					<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<mat-radio-group aria-label="Select an option" formControlName="updatePhoto">
							<div class="d-flex justify-content-start">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</div>
						</mat-radio-group>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('updatePhoto')?.dirty || form.get('updatePhoto')?.touched) &&
								form.get('updatePhoto')?.invalid &&
								form.get('updatePhoto')?.hasError('required')
							"
							>This is required</mat-error
						>
					</div>
				</ng-container>

				<ng-container *ngIf="isUpdatePhoto || originalPhotoOfYourselfExpired">
					<div class="row my-2">
						<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
							<app-alert type="warning" icon="warning">
								Uploading a photo that is dissimilar from your submitted government-issued photo ID will delay your
								application's processing time.
							</app-alert>

							<app-alert type="danger" icon="error" *ngIf="originalPhotoOfYourselfExpired">
								We require a new photo every 5 years. Please provide a new photo for your {{ label }}
							</app-alert>

							<app-file-upload
								(fileRemoved)="onFileRemoved()"
								[control]="updateAttachments"
								[maxNumberOfFiles]="1"
								[files]="updateAttachments.value"
								[accept]="accept"
								[previewImage]="true"
							></app-file-upload>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('updateAttachments')?.dirty || form.get('updateAttachments')?.touched) &&
									form.get('updateAttachments')?.invalid &&
									form.get('updateAttachments')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>
				</ng-container>
			</div>
		</app-step-section>
	`,
	styles: [],
})
export class StepPermitPhotographOfYourselfRenewAndUpdateComponent implements OnInit, LicenceChildStepperStepComponent {
	accept = ['.jpeg', '.jpg', '.tif', '.tiff', '.png'].join(', ');
	booleanTypeCodes = BooleanTypeCode;
	originalPhotoOfYourselfExpired = false;

	title = '';

	@Input() form!: FormGroup;
	@Input() label = 'licence'; // licence or permit
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	photographOfYourself = this.permitApplicationService.photographOfYourself;

	@ViewChild(CommonPhotographOfYourselfComponent)
	commonPhotographOfYourselfComponent!: CommonPhotographOfYourselfComponent;

	constructor(private permitApplicationService: PermitApplicationService) {}

	ngOnInit(): void {
		this.originalPhotoOfYourselfExpired = this.permitApplicationService.permitModelFormGroup.get(
			'originalLicenceData.originalPhotoOfYourselfExpired'
		)?.value;

		if (!this.originalPhotoOfYourselfExpired) {
			this.title = 'Do you want to update your photo?';
		} else {
			this.title = 'Upload a photo of yourself';
		}
	}

	onFileRemoved(): void {
		this.permitApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isUpdatePhoto(): boolean {
		return this.updatePhoto.value === BooleanTypeCode.Yes;
	}
	get updatePhoto(): FormControl {
		return this.form.get('updatePhoto') as FormControl;
	}
	get updateAttachments(): FormControl {
		return this.form.get('updateAttachments') as FormControl;
	}
}
