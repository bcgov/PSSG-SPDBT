import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ServiceTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { OptionsPipe } from '../pipes/options.pipe';

@Component({
	selector: 'app-form-photograph-of-yourself-update',
	template: `
		<div [formGroup]="form" class="row">
			@if (!originalPhotoOfYourselfExpired) {
				@if (photographOfYourself) {
					<div class="d-flex justify-content-center">
						<div class="photo-of-yourself">
							<div class="text-minor-heading">Current photo</div>
							<img class="photo-of-yourself__item" [src]="photographOfYourself" alt="Photograph of yourself" />
						</div>
					</div>
				}
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
					<mat-radio-group aria-label="Select an option" formControlName="updatePhoto">
						<div class="d-flex justify-content-start">
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</div>
					</mat-radio-group>
					@if (
						(form.get('updatePhoto')?.dirty || form.get('updatePhoto')?.touched) &&
						form.get('updatePhoto')?.invalid &&
						form.get('updatePhoto')?.hasError('required')
					) {
						<mat-error>This is required</mat-error>
					}
				</div>
			}

			@if (isUpdatePhoto || originalPhotoOfYourselfExpired) {
				<div @showHideTriggerSlideAnimation>
					<div class="row my-2">
						<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
							<div class="mb-3">
								<app-alert type="info" icon="info">
									<p>
										Please upload a clear photo of your face, looking straight at the camera, with a plain, white
										background.
									</p>
									<p>
										We understand this may be difficult for some applicants. If you are not able to provide this type of
										photo, please contact us and we can help find another option.
									</p>
									Photo Guidelines:
									<ul class="mb-0">
										<li>Please use a clear, well-lit colour photo</li>
										<li>Make sure your full face is visible, without hats, sunglasses, or filterss</li>
										<li>Try to use a plain white background if possible</li>
									</ul>
								</app-alert>
							</div>
							@if (showPhotoOfYourselfExpired) {
								<app-alert type="danger" icon="dangerous">
									We require a new photo every 5 years. Please provide a new photo for your certificate.
								</app-alert>
							}
							<app-file-upload
								(fileRemoved)="onFileRemoved()"
								[control]="updateAttachments"
								[maxNumberOfFiles]="1"
								[files]="updateAttachments.value"
								[accept]="accept"
								[previewImage]="true"
								ariaFileUploadLabel="Upload photograph of yourself"
							></app-file-upload>
							@if (
								(form.get('updateAttachments')?.dirty || form.get('updateAttachments')?.touched) &&
								form.get('updateAttachments')?.invalid &&
								form.get('updateAttachments')?.hasError('required')
							) {
								<mat-error>This is required</mat-error>
							}
						</div>
					</div>
				</div>
			}
		</div>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class FormPhotographOfYourselfUpdateComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	accept = ['.jpeg', '.jpg', '.tif', '.tiff', '.png'].join(', ');
	serviceTypeDesc = 'certificate';
	showPhotoOfYourselfExpired = false;

	@Input() form!: FormGroup;
	@Input() originalPhotoOfYourselfExpired = false;
	@Input() photographOfYourself: string | ArrayBuffer | null = null;
	@Input() serviceTypeCode!: ServiceTypeCode;

	@Output() fileUploaded = new EventEmitter<File>();
	@Output() fileRemoved = new EventEmitter();

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private optionsPipe: OptionsPipe) {}

	ngOnInit(): void {
		this.serviceTypeDesc = this.optionsPipe.transform(this.serviceTypeCode, 'ServiceTypes').toLowerCase();
		this.showPhotoOfYourselfExpired = this.originalPhotoOfYourselfExpired && !!this.photographOfYourself;
	}

	onFileUploaded(file: File): void {
		this.fileUploaded.emit(file);
	}

	onFileRemoved(): void {
		this.fileRemoved.emit();
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
