import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';

@Component({
	selector: 'app-generic-uploads',
	template: `
		<app-dashboard-header subtitle="Criminal Record Checks"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-12">
					<h2 class="mb-2 fw-normal">Generic Uploads</h2>
					<ngx-dropzone
						#fileDropzone
						(change)="onUploadFile($event)"
						[multiple]="multiple"
						[maxFileSize]="maxFileSize"
						[disableClick]="disableClick"
						[expandable]="expandable"
						[accept]="accept"
						class="mt-4"
					>
						<ngx-dropzone-label>
							<div class="my-2">
								<div class="mt-4 mb-2">
									<mat-icon class="upload-file-icon">cloud_upload</mat-icon>
								</div>
								<div class="mb-4">
									<strong>Drag and Drop your file here or click to browse</strong>
								</div>
								<div class="fine-print mb-4">Text files ending in ".TSV” only</div>
							</div>
						</ngx-dropzone-label>

						<ngx-dropzone-preview
							class="preview"
							*ngFor="let f of form.get('files')?.value"
							[removable]="true"
							(removed)="onRemoveFile(f)"
						>
							<ngx-dropzone-label style="width: 100%;">
								<div class="row">
									<div class="col-12 d-flex p-0 fw-bold text-start" style="text-indent: 1em; color: black;">
										<img class="file-name-icon" src="/assets/tsv_file.png" />
										<div class="w-100" [ngClass]="showErrors ? 'file-upload-error' : 'file-upload-success'">
											{{ f.name }}
											<span *ngIf="showErrors">- Upload Failed</span>
											<span *ngIf="!showErrors">- Upload Succeeded</span>
										</div>
										<div style="text-align: center;">Click to upload another file</div>
									</div>
								</div>
							</ngx-dropzone-label>
						</ngx-dropzone-preview>
					</ngx-dropzone>
					<div class="col-md-12 col-sm-12 mt-4" *ngIf="showErrors">
						<div class="alert alert-danger d-flex align-items-center" role="alert">
							<mat-icon class="d-none d-md-block alert-icon me-2">warning</mat-icon>
							<div>Error on line 6: City Name cannot contain numbers</div>
						</div>
						<div class="alert alert-danger d-flex align-items-center">
							<mat-icon class="d-none d-md-block alert-icon me-2">warning</mat-icon>
							<div>Error on line 9: Postal Code min 5 characters, max 12 characters</div>
						</div>
					</div>
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-md-12 col-sm-12">
					<h3 class="fw-normal">Previous Uploads</h3>
					<mat-table matSort [dataSource]="dataSource" matSortActive="uploadedDateTime" matSortDirection="desc">
						<ng-container matColumnDef="uploadedDateTime">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Date/Time Uploaded</mat-header-cell>
							<mat-cell *matCellDef="let upload">
								<span class="mobile-label">Date/Time Uploaded:</span>
								{{ upload.uploadedDateTime | date : constants.date.dateTimeFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="uploadedBy">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Who Uploaded</mat-header-cell>
							<mat-cell *matCellDef="let upload">
								<span class="mobile-label">Who Uploaded:</span>
								{{ upload.uploadedBy }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="uploadedFileName">
							<mat-header-cell *matHeaderCellDef mat-sort-header>File Name</mat-header-cell>
							<mat-cell *matCellDef="let upload">
								<span class="mobile-label">File Name:</span>
								{{ upload.uploadedFileName }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="uploadedBatchNumber">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Batch Number</mat-header-cell>
							<mat-cell *matCellDef="let upload">
								<span class="mobile-label">Batch Number:</span>
								{{ upload.uploadedBatchNumber }}
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
						<mat-row *matRowDef="let row; columns: columns"></mat-row>
					</mat-table>
					<mat-paginator #paginator [length]="100" [pageSize]="10" aria-label="Select page"> </mat-paginator>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.file-name-icon {
				max-width: 3em;
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

			.preview {
				width: 100%;
				height: unset !important;
				min-height: unset !important;
				max-width: unset !important;
			}

			ngx-dropzone.expandable {
				min-height: unset;
			}

			.file-upload-error {
				border-bottom: 6px solid var(--color-red);
			}

			.file-upload-success {
				border-bottom: 6px solid var(--color-green);
			}
		`,
	],
})
export class GenericUploadsComponent implements OnInit, AfterViewInit {
	form: FormGroup = this.formBuilder.group({
		files: new FormControl('', [Validators.required]),
	});

	constants = SPD_CONSTANTS;
	dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
	columns!: string[];

	multiple: boolean = false;
	expandable: boolean = true;
	disableClick: boolean = false;
	maxFileSize: number = 104857600; // bytes
	accept = '.tsv';
	showErrors = false;
	// TODO remove temp code
	count = 0;

	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(private formBuilder: FormBuilder, private spinnerService: NgxSpinnerService) {}

	ngOnInit() {
		this.columns = ['uploadedDateTime', 'uploadedBy', 'uploadedFileName', 'uploadedBatchNumber'];
		this.dataSource.data = [
			{
				uploadedDateTime: '2023-01-14T00:13:05.865Z',
				uploadedBy: 'Joe Smith',
				uploadedFileName: 'test.tsv',
				uploadedBatchNumber: '10001-23',
			},
			{
				uploadedDateTime: '2023-02-04T00:10:05.865Z',
				uploadedBy: 'Anne Parker',
				uploadedFileName: 'one-two-three.tsv',
				uploadedBatchNumber: '10030-56',
			},
		];
	}

	ngAfterViewInit() {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
	}

	onUploadFile(evt: any) {
		this.spinnerService.show('loaderSpinner');

		setTimeout(() => {
			// const currentFiles = [...this.form.get('files')?.value];
			// currentFiles.push(...evt.addedFiles);
			// this.form.get('files')?.setValue(currentFiles);
			this.form.get('files')?.setValue(evt.addedFiles);
			this.spinnerService.hide('loaderSpinner');

			if (this.count % 2 == 0) this.showErrors = true;
			else this.showErrors = false;
			this.count++;

			const fileInfo = evt.addedFiles[0];
			if (fileInfo) {
				const currList = this.dataSource.data;

				this.dataSource.data = [
					{
						uploadedDateTime: new Date(),
						uploadedBy: 'CURRENT USER',
						uploadedFileName: fileInfo.name,
						uploadedBatchNumber: 'UNKNOWN',
					},
					...currList,
				];
			}
		}, 2000);
	}

	onRemoveFile(evt: any) {
		this.showErrors = false;
		// const currentFiles = this.form.get('files')?.value;
		// const currentFilesCopy = [...currentFiles];
		// currentFilesCopy.splice(currentFiles.indexOf(evt), 1);
		// this.form.get('files')?.setValue(currentFilesCopy);
		this.form.reset();
	}
}
