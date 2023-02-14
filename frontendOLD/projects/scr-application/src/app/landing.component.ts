import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-landing',
	template: `
		<section class="step-section mt-4 pt-2 pb-4">
			<div class="row mt-4">
				<div class="col-sm-12 offset-md-2 col-md-8 offset-lg-3 col-lg-6">
					<button mat-stroked-button color="primary" class="large mb-2" (click)="goToScreening()">
						Screening Application
					</button>
				</div>
			</div>

			<div class="row mt-4">
				<div class="offset-md-4 col-md-4 col-sm-12">
					<mat-radio-group [(ngModel)]="paymentBy">
						<mat-radio-button value="APP">
							<strong>Applicant Paying</strong>
						</mat-radio-button>
						<mat-divider class="my-3"></mat-divider>
						<mat-radio-button value="ORG">
							<strong>Organization Paying</strong>
						</mat-radio-button>
					</mat-radio-group>
				</div>
			</div>
		</section>

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
								<div class="mb-4">
									<strong>Drag and Drop your file here or click to browse</strong>
								</div>
								<span class="fine-print">Text files ending in ".TSV” only</span>
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
					<button mat-raised-button color="primary" class="mt-4" (click)="fileDropzone.showFileSelector()">
						Browse Your Computer
					</button>
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
		`,
	],
})
export class LandingComponent {
	paymentBy: string = 'APP';

	form: FormGroup = this.formBuilder.group({
		files: new FormControl('', [Validators.required]),
	});

	multiple: boolean = true;
	expandable: boolean = true;
	disableClick: boolean = false;
	maxFileSize: number = 104857600; // bytes
	accept = '.tsv';

	constructor(private router: Router, private formBuilder: FormBuilder) {}

	goToScreening(): void {
		this.router.navigateByUrl('/screening', { state: { paymentBy: this.paymentBy } });
	}

	onUploadFile(evt: any) {
		const currentFiles = [...this.form.get('files')?.value];
		currentFiles.push(...evt.addedFiles);
		this.form.get('files')?.setValue(currentFiles);
	}

	onRemoveFile(evt: any) {
		const currentFiles = this.form.get('files')?.value;
		const currentFilesCopy = [...currentFiles];
		currentFilesCopy.splice(currentFiles.indexOf(evt), 1);
		this.form.get('files')?.setValue(currentFilesCopy);
	}
}
