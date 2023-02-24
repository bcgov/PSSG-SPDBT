import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { APP_CONSTANTS } from 'src/app/material.module';

@Component({
	selector: 'app-generic-upload',
	template: `
		<div class="row">
			<div class="col-sm-12">
				<h2 class="mx-2" style="font-weight: 300;">Organization Name</h2>
				<div class="mx-2" style="font-weight: 300;">Security Screening Portal</div>
			</div>
		</div>
		<section class="step-section mt-4">
			<div class="row m-4">
				<div class="col-sm-12">
					<h2 class="mb-2" style="font-weight: 400;">Generic Upload</h2>
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
							class="preview"
							*ngFor="let f of form.get('files')?.value"
							[removable]="true"
							(removed)="onRemoveFile(f)"
						>
							<ngx-dropzone-label style="width: 100%;">
								<div class="row">
									<div class="col-12 p-0" style="text-align: start; text-indent: 1em; color: black; font-weight: 600;">
										<img class="file-name-icon" src="/assets/tsv_file.png" />
										{{ f.name }}
									</div>
									<div class="offset-md-1 col-md-10 col-sm-12 mt-2" *ngIf="showErrors">
										<div class="alert alert-danger alert-layout w-100">
											<mat-icon class="d-none d-md-block alert-icon">warning</mat-icon>
											<div>Error on line 1 - 'dateOfBirth'</div>
										</div>
										<div class="alert alert-danger alert-layout w-100">
											<mat-icon class="d-none d-md-block alert-icon">warning</mat-icon>
											<div>Error on line 12 - 'province'</div>
										</div>
										<div class="alert alert-success alert-layout w-100">
											<mat-icon class="d-none d-md-block alert-icon">information</mat-icon>
											<div>File was successfully uploaded</div>
										</div>
									</div>
								</div>
							</ngx-dropzone-label>
						</ngx-dropzone-preview>
					</ngx-dropzone>
				</div>
				<div class="col-md-3 col-sm-12">
					<button mat-stroked-button color="primary" class="mt-2" (click)="fileDropzone.showFileSelector()">
						Browse Your Computer
					</button>
				</div>
			</div>
		</section>
		<!-- <div class="row" *ngIf="showErrors">
      <div class="offset-md-1 col-md-8 col-sm-12">
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
    </div> -->

		<section class="step-section mt-4">
			<div class="row m-4">
				<div class="col-md-12 col-sm-12">
					<h3 style="font-weight: 400;">Previous Uploads</h3>
					<mat-table matSort [dataSource]="dataSource" class="isMobile">
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
					<mat-paginator
						#paginator
						[length]="100"
						[pageSize]="10"
						[pageSizeOptions]="[5, 10, 25, 100]"
						aria-label="Select page"
					>
					</mat-paginator>
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

			.preview {
				width: 100%;
				height: unset !important;
				max-width: unset !important;
			}
		`,
	],
})
export class GenericUploadComponent implements OnInit, AfterViewInit {
	form: FormGroup = this.formBuilder.group({
		files: new FormControl('', [Validators.required]),
	});

	constants = APP_CONSTANTS;
	dataSource!: MatTableDataSource<any>;
	columns!: string[];

	multiple: boolean = false;
	expandable: boolean = true;
	disableClick: boolean = false;
	maxFileSize: number = 104857600; // bytes
	accept = '.tsv';
	showErrors = false;

	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(private formBuilder: FormBuilder, private spinnerService: NgxSpinnerService) {}

	ngOnInit() {
		this.columns = ['uploadedDateTime', 'uploadedBy', 'uploadedFileName', 'uploadedBatchNumber'];
		this.dataSource = new MatTableDataSource<any>([]);
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
			{
				uploadedDateTime: '2023-03-24T00:15:05.865Z',
				uploadedBy: 'Peter Parker',
				uploadedFileName: 'four-five.tsv',
				uploadedBatchNumber: '10400-99',
			},
			{
				uploadedDateTime: '2023-01-14T00:13:05.865Z',
				uploadedBy: 'Mark Smith',
				uploadedFileName: 'test.tsv',
				uploadedBatchNumber: '10001-23',
			},
			{
				uploadedDateTime: '2023-02-04T00:10:05.865Z',
				uploadedBy: 'Tim Parker',
				uploadedFileName: 'one-two-three.tsv',
				uploadedBatchNumber: '10030-56',
			},
			{
				uploadedDateTime: '2023-03-24T00:15:05.865Z',
				uploadedBy: 'Alex Parker',
				uploadedFileName: 'four-five.tsv',
				uploadedBatchNumber: '10400-99',
			},
			{
				uploadedDateTime: '2023-01-14T00:13:05.865Z',
				uploadedBy: 'Jim Smith',
				uploadedFileName: 'test.tsv',
				uploadedBatchNumber: '10001-23',
			},
			{
				uploadedDateTime: '2023-02-04T00:10:05.865Z',
				uploadedBy: 'Ben Parker',
				uploadedFileName: 'one-two-three.tsv',
				uploadedBatchNumber: '10030-56',
			},
			{
				uploadedDateTime: '2023-03-24T00:15:05.865Z',
				uploadedBy: 'Cam Parker',
				uploadedFileName: 'four-five.tsv',
				uploadedBatchNumber: '10400-99',
			},
			{
				uploadedDateTime: '2022-01-14T00:13:05.865Z',
				uploadedBy: 'Paul Smith',
				uploadedFileName: 'test.tsv',
				uploadedBatchNumber: '10001-23',
			},
			{
				uploadedDateTime: '2022-02-04T00:10:05.865Z',
				uploadedBy: 'Cindy Parker',
				uploadedFileName: 'one-two-three.tsv',
				uploadedBatchNumber: '10030-56',
			},
			{
				uploadedDateTime: '2022-03-24T00:15:05.865Z',
				uploadedBy: 'Dave Parker',
				uploadedFileName: 'four-five.tsv',
				uploadedBatchNumber: '10400-99',
			},
		];
	}

	pageSizes = [3, 5, 7];

	ngAfterViewInit() {
		this.sort.sort({ id: 'uploadedDateTime', start: 'desc' } as MatSortable);
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
			this.showErrors = true;

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
