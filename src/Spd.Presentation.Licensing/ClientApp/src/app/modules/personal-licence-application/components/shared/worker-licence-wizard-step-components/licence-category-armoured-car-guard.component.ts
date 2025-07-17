import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-licence-category-armoured-car-guard',
	template: `
		<div class="text-minor-heading mb-2">Authorization to Carry Certificate required</div>
		<div class="alert alert-category d-flex" role="alert">
			<div>
				Armoured car guards carry firearms, which requires a firearm licence and an Authorization to Carry (ATC)
				certificate. You must get this licence and ATC before you can apply to be an armoured car guard. More
				information is available from the
				<a aria-label="Navigate to RCMP site" [href]="rcmpUrl" target="_blank">RCMP</a>.
			</div>
		</div>

		<form [formGroup]="form" novalidate>
			<div class="text-minor-heading">Upload your valid Authorization to Carry certificate</div>
			<div class="my-2">
				<app-file-upload
					(fileUploaded)="onFileUploaded($event)"
					(fileRemoved)="onFileRemoved()"
					[maxNumberOfFiles]="10"
					[control]="attachments"
					[files]="attachments.value"
				></app-file-upload>
				@if (
					(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
					form.get('attachments')?.invalid &&
					form.get('attachments')?.hasError('required')
				) {
					<mat-error class="mat-option-error">This is required</mat-error>
				}
			</div>

			<div class="row">
				<div class="col-lg-4 col-md-12 col-sm-12">
					<mat-form-field>
						<mat-label>Document Expiry Date</mat-label>
						<input
							matInput
							[matDatepicker]="picker"
							formControlName="expiryDate"
							[min]="minDate"
							[errorStateMatcher]="matcher"
						/>
						<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
						<mat-datepicker #picker startView="multi-year"></mat-datepicker>
						@if (form.get('expiryDate')?.hasError('required')) {
							<mat-error>This is required</mat-error>
						}
						@if (form.get('expiryDate')?.hasError('matDatepickerMin')) {
							<mat-error>Invalid expiry date</mat-error>
						}
					</mat-form-field>
				</div>
			</div>
		</form>
	`,
	styles: [],
	standalone: false,
})
export class LicenceCategoryArmouredCarGuardComponent implements LicenceChildStepperStepComponent {
	rcmpUrl = SPD_CONSTANTS.urls.rcmpUrl;

	form: FormGroup = this.workerApplicationService.categoryArmouredCarGuardFormGroup;

	minDate = this.utilService.getDateMin();
	matcher = new FormErrorStateMatcher();

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private utilService: UtilService,
		private workerApplicationService: WorkerApplicationService
	) {}

	onFileUploaded(file: File): void {
		this.workerApplicationService.hasValueChanged = true;

		if (!this.workerApplicationService.isAutoSave()) {
			return;
		}

		this.workerApplicationService
			.addUploadDocument(LicenceDocumentTypeCode.CategoryArmouredCarGuardAuthorizationToCarryCertificate, file)
			.subscribe({
				next: (resp: any) => {
					const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
					matchingFile.documentUrlId = resp.body[0].documentUrlId;
				},
				error: (error: any) => {
					console.log('An error occurred during file upload', error);

					this.fileUploadComponent.removeFailedFile(file);
				},
			});
	}

	onFileRemoved(): void {
		this.workerApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	public get requirement(): FormControl {
		return this.form.get('requirement') as FormControl;
	}

	public get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
