import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { GovernmentIssuedPhotoIdTypes } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { UtilService } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-form-gdsd-government-id',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row my-2">
				<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row my-2">
						<div class="col-lg-12 col-md-12">
							<mat-form-field>
								<mat-label>Type of Proof</mat-label>
								<mat-select
									formControlName="photoTypeCode"
									[errorStateMatcher]="matcher"
									(selectionChange)="onChangeProof($event)"
								>
									@for (item of governmentIssuedPhotoIdTypes; track item; let i = $index) {
										<mat-option [value]="item.code">
											{{ item.desc }}
										</mat-option>
									}
								</mat-select>
								<mat-hint>This ID can be from another country</mat-hint>
								@if (form.get('photoTypeCode')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
							</mat-form-field>
						</div>
						@if (photoTypeCode.value) {
							<div @showHideTriggerSlideAnimation>
								<div class="col-lg-6 col-md-12 mt-3">
									<mat-form-field>
										<mat-label>Document Expiry Date</mat-label>
										<input
											matInput
											type="text"
											formControlName="expiryDate"
											[mask]="dateMask"
											[showMaskTyped]="false"
											[errorStateMatcher]="matcher"
											(blur)="onValidateDate()"
											placeholder="YYYY-MM-DD"
											aria-label="Enter the date in the format: year dash month dash day."
										/>
										@if (expiryDate.hasError('required')) {
											<mat-error>This is required</mat-error>
										}
										@if (expiryDate.hasError('invalidDate')) {
											<mat-error>This date is invalid</mat-error>
										}
										@if (expiryDate.hasError('futureDate')) {
											<mat-error>This date cannot be in the future</mat-error>
										}
									</mat-form-field>
								</div>
								<div class="text-minor-heading mt-3 mb-2">Upload a photo of your ID</div>
								<app-file-upload
									(fileUploaded)="onFileUploaded($event)"
									(fileRemoved)="onFileRemoved()"
									[control]="attachments"
									[maxNumberOfFiles]="10"
									[files]="attachments.value"
									[previewImage]="true"
									ariaFileUploadLabel="Upload government photo ID"
								></app-file-upload>
								@if (
									(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
									form.get('attachments')?.invalid &&
									form.get('attachments')?.hasError('required')
								) {
									<mat-error>This is required</mat-error>
								}
							</div>
						}
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class FormGdsdGovermentPhotoIdComponent {
	governmentIssuedPhotoIdTypes = GovernmentIssuedPhotoIdTypes;

	matcher = new FormErrorStateMatcher();
	dateMask = SPD_CONSTANTS.date.dateMask;

	@Input() form!: FormGroup;

	@Output() fileRemoved = new EventEmitter<any>();
	@Output() fileUploaded = new EventEmitter<File>();

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private utilService: UtilService) {}

	onValidateDate(): void {
		const errorKey = this.utilService.getIsInputValidDate(this.expiryDate.value, false);
		if (errorKey) {
			this.expiryDate.setErrors({ [errorKey]: true });
		}
	}

	onFileUploaded(file: File): void {
		this.fileUploaded.emit(file);
	}

	onFileRemoved(): void {
		this.fileRemoved.emit();
	}

	onChangeProof(_event: MatSelectChange): void {
		this.attachments.setValue([]);
	}

	get photoTypeCode(): FormControl {
		return this.form.get('photoTypeCode') as FormControl;
	}
	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
	get expiryDate(): FormControl {
		return this.form.get('expiryDate') as FormControl;
	}
}
