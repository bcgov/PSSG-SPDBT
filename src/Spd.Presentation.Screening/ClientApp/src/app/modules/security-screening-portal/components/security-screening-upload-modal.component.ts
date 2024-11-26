import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileTypeCode } from 'src/app/api/models';
import { ApplicantService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';

export interface CrcUploadDialogData {
	applicationId: string;
	fileType: FileTypeCode;
}

@Component({
	selector: 'app-security-screening-upload-modal',
	template: `
		<div mat-dialog-title>Upload Additional Document</div>
		<mat-dialog-content class="mb-2">
			<div class="row">
				<div class="col-12">
					<app-file-upload
						accept=".doc,.docx,.pdf"
						[maxNumberOfFiles]="maxNumberOfFiles"
						[control]="attachments"
						[files]="attachments.value"
					></app-file-upload>
				</div>
			</div>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close class="large" color="primary">Cancel</button>
				</div>
				<div class="offset-md-4 col-md-4 col-sm-12 mb-2">
					<button mat-flat-button color="primary" class="large" (click)="onSave()">Upload</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
})
export class SecurityScreeningUploadModalComponent implements OnInit {
	maxNumberOfFiles = 1;

	form: FormGroup = this.formBuilder.group({
		attachments: new FormControl([]),
	});

	constructor(
		private formBuilder: FormBuilder,
		private applicantService: ApplicantService,
		private dialogRef: MatDialogRef<SecurityScreeningUploadModalComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: CrcUploadDialogData,
	) {}

	ngOnInit(): void {
		if (!this.dialogData.applicationId) {
			console.error('applicationId was not passed to CrcUploadModalComponent');
			this.dialogRef.close();
		}

		this.maxNumberOfFiles =
			this.dialogData.fileType == FileTypeCode.ApplicantInformation ? SPD_CONSTANTS.document.maxNumberOfFiles : 1;
	}

	onSave(): void {
		const body = {
			Files: this.attachments.value,
			FileType: this.dialogData.fileType,
		};
		this.applicantService
			.apiApplicantsScreeningsApplicationIdFilesPost({
				applicationId: this.dialogData.applicationId,
				body,
			})
			.pipe()
			.subscribe((_resp) => {
				this.dialogRef.close({
					success: true,
				});
			});
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
