import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
	selector: 'app-dashboard',
	template: `
		<section class="step-section mt-4 pt-2 pb-4">
			<div class="row mt-4">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<div class="mb-2">
						<strong>File Uploader Prototype</strong>
					</div>
					<ngx-dropzone
						#fileDropzone
						(change)="onUploadFile($event)"
						[multiple]="multiple"
						[maxFileSize]="maxFileSize"
						[disableClick]="disableClick"
						[expandable]="expandable"
						[accept]="accept"
					>
						<ngx-dropzone-label>
							<div class="my-2">
								<div class="mt-4 mb-2">
									<mat-icon class="upload-file-icon">upload_file</mat-icon>
								</div>
								<div class="mb-4">
									<strong>Drag and Drop your file here or click to browse</strong>
								</div>
								<div class="fine-print mb-4">Text files ending in ".TSV” only</div>
							</div>
						</ngx-dropzone-label>

						<ngx-dropzone-preview
							*ngFor="let f of form.get('files')?.value"
							[removable]="true"
							(removed)="onRemoveFile(f)"
						>
							<ngx-dropzone-label>
								<div class="row align-items-left">
									<div class="col-4 p-0"><img class="file-name-icon" src="/assets/tsv_file.png" /></div>
									<div class="col-8 p-0 file-name-text">
										{{ f.name }}
									</div>
								</div>
							</ngx-dropzone-label>
						</ngx-dropzone-preview>
					</ngx-dropzone>
				</div>
			</div>

			<div class="row">
				<div class="offset-md-2 col-md-3 col-sm-12">
					<button mat-raised-button color="primary" class="mt-2" (click)="fileDropzone.showFileSelector()">
						Browse Your Computer
					</button>
				</div>
			</div>

			<div class="row" *ngIf="showErrors">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<div class="mt-2">
						<div class="alert alert-danger align-items-center alert-layout w-100">
							<mat-icon class="d-none d-md-block alert-icon">warning</mat-icon>
							<div>Error on line 1 - 'dateOfBirth'</div>
						</div>
						<div class="alert alert-danger align-items-center alert-layout w-100">
							<mat-icon class="d-none d-md-block alert-icon">warning</mat-icon>
							<div>Error on line 12 - 'province'</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.file-name-icon {
				max-width: 3em;
			}

			.file-name-text {
				padding-left: 1em !important;
				text-align: left;
				text-indent: -1em;
			}

			.fine-print {
				font-size: var(--font-size-small);
			}

			.upload-file-icon {
				color: var(--color-primary-light);
				font-size: 80px !important;
				height: 80px !important;
				width: 80px !important;
			}

			.alert-layout {
				display: inline-flex;
				gap: 1em;
			}
		`,
	],
})
export class DashboardComponent {
	form: FormGroup = this.formBuilder.group({
		files: new FormControl('', [Validators.required]),
	});

	multiple: boolean = false;
	expandable: boolean = true;
	disableClick: boolean = false;
	maxFileSize: number = 104857600; // bytes
	accept = '.tsv';
	showErrors = false;

	constructor(private formBuilder: FormBuilder, private spinnerService: NgxSpinnerService) {}

	onUploadFile(evt: any) {
		this.spinnerService.show('loaderSpinner');

		setTimeout(() => {
			const currentFiles = [...this.form.get('files')?.value];
			currentFiles.push(...evt.addedFiles);
			this.form.get('files')?.setValue(currentFiles);
			this.spinnerService.hide('loaderSpinner');
			this.showErrors = true;
		}, 2000);
	}

	onRemoveFile(evt: any) {
		this.showErrors = false;
		const currentFiles = this.form.get('files')?.value;
		const currentFilesCopy = [...currentFiles];
		currentFilesCopy.splice(currentFiles.indexOf(evt), 1);
		this.form.get('files')?.setValue(currentFilesCopy);
	}
}
