import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { ModalFingerprintTearOffComponent } from '@app/shared/components/modal-fingerprint-tear-off.component';

@Component({
	selector: 'app-common-fingerprints',
	template: `
		<div class="row">
			<div class="offset-md-2 col-md-8 col-sm-12">
				<app-alert type="info" icon="">
					<div class="d-flex">
						<div>
							Scan or take a photo of the tear-off section on page 2 of the
							<a
								aria-label="Request for Fingerprinting form"
								download="Request For Fingerprinting Form"
								[href]="downloadFilePath"
								>Request for Fingerprinting form</a
							>
							form.
						</div>
						<div class="ms-auto">
							<button
								mat-icon-button
								color="primary"
								(click)="onShowSampleTearOffModal()"
								aria-label="View sample fingerprint tear-off section"
							>
								<mat-icon>info</mat-icon>
							</button>
						</div>
					</div>
				</app-alert>
			</div>
		</div>
		<div class="row mt-2">
			<div class="offset-md-2 col-md-8 col-sm-12">
				<form [formGroup]="form" novalidate>
					<div class="text-minor-heading mb-2">Upload your document</div>
					<app-file-upload
						(fileUploaded)="onFileUploaded($event)"
						(fileRemoved)="onFileRemoved()"
						[control]="attachments"
						[maxNumberOfFiles]="10"
						[files]="attachments.value"
					></app-file-upload>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
							form.get('attachments')?.invalid &&
							form.get('attachments')?.hasError('required')
						"
						>Your fingerprints must be taken to continue to verify your identity.<br /><br />
						Download the
						<a
							aria-label="Request for Fingerprinting form"
							download="Request For Fingerprinting Form"
							[href]="downloadFilePath"
							>Request for Fingerprinting form</a
						>
						form, take it to a fingerprinting agency (such as your local police department), and complete this
						application when you have documentation.
					</mat-error>
				</form>
			</div>
		</div>
	`,
	styles: [],
})
export class CommonFingerprintsComponent {
	downloadFilePath = SPD_CONSTANTS.files.requestForFingerprintingForm;

	@Input() form!: FormGroup;

	@Output() fileUploaded = new EventEmitter<File>();
	@Output() fileRemoved = new EventEmitter();

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private dialog: MatDialog) {}

	onFileUploaded(file: File): void {
		this.fileUploaded.emit(file);
	}

	onFileRemoved(): void {
		this.fileRemoved.emit();
	}

	onShowSampleTearOffModal(): void {
		this.dialog.open(ModalFingerprintTearOffComponent, {
			autoFocus: true,
		});
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
