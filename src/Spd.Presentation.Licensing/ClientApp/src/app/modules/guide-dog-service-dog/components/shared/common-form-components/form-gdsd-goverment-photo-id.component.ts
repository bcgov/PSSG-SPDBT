import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { GovernmentIssuedPhotoIdTypes } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
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
									<mat-option *ngFor="let item of governmentIssuedPhotoIdTypes; let i = index" [value]="item.code">
										{{ item.desc }}
									</mat-option>
								</mat-select>
								<mat-hint>This ID can be from another country</mat-hint>
								<mat-error *ngIf="form.get('photoTypeCode')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
						<div *ngIf="photoTypeCode.value" @showHideTriggerSlideAnimation>
							<div class="col-lg-6 col-md-12">
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
									<mat-error *ngIf="form.get('expiryDate')?.hasError('required')"> This is required </mat-error>
									<mat-error *ngIf="form.get('expiryDate')?.hasError('matDatepickerMin')">
										Invalid expiry date
									</mat-error>
								</mat-form-field>
							</div>

							<div class="text-minor-heading mb-2">Upload a photo of your ID</div>
							<app-file-upload
								(fileUploaded)="onFileUploaded($event)"
								(fileRemoved)="onFileRemoved()"
								[control]="attachments"
								[maxNumberOfFiles]="10"
								[files]="attachments.value"
								[previewImage]="true"
							></app-file-upload>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
									form.get('attachments')?.invalid &&
									form.get('attachments')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class FormGdsdGovermentPhotoIdComponent implements LicenceChildStepperStepComponent {
	governmentIssuedPhotoIdTypes = GovernmentIssuedPhotoIdTypes;

	minDate = this.utilService.getDateMin();
	matcher = new FormErrorStateMatcher();

	@Input() form!: FormGroup;

	@Output() fileRemoved = new EventEmitter<any>();
	@Output() fileUploaded = new EventEmitter<File>();

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private utilService: UtilService) {}

	onFileUploaded(file: File): void {
		this.fileUploaded.emit(file);
	}

	onFileRemoved(): void {
		this.fileRemoved.emit();
	}

	onChangeProof(_event: MatSelectChange): void {
		this.attachments.setValue([]);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get photoTypeCode(): FormControl {
		return this.form.get('photoTypeCode') as FormControl;
	}
	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
