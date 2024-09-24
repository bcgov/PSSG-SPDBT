import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';

export enum DocumentTypeCode {
	Image = 'IMAGE',
	Pdf = 'PDF',
	Word = 'WORD',
}

export interface IconType {
	icon: string;
	label: string;
	color?: string;
}

export class FileUploadHelper {
	private static _FILE_ICONS: Record<DocumentTypeCode, IconType> = {
		PDF: { icon: 'picture_as_pdf', label: 'PDF' },
		WORD: { icon: 'article', label: 'Microsoft Word' },
		IMAGE: { icon: 'image', label: 'Image file' },
	};

	private static _MIME_TYPE_DOCUMENT_TYPE_MAP: Record<string, DocumentTypeCode> = {
		'application/pdf': DocumentTypeCode.Pdf,
		'application/msword': DocumentTypeCode.Word,
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document': DocumentTypeCode.Word,
		'image/bmp': DocumentTypeCode.Image,
		'image/gif': DocumentTypeCode.Image,
		'image/jpg': DocumentTypeCode.Image,
		'image/jpeg': DocumentTypeCode.Image,
		'image/png': DocumentTypeCode.Image,
		'image/tiff': DocumentTypeCode.Image,
	};

	public static getFileDocumentType(file: File): DocumentTypeCode;
	public static getFileDocumentType(fileMimeType: string): DocumentTypeCode;
	public static getFileDocumentType(file: File | string): DocumentTypeCode | null {
		if (typeof file === 'string') return this._MIME_TYPE_DOCUMENT_TYPE_MAP[file];
		else if (file?.type) return this._MIME_TYPE_DOCUMENT_TYPE_MAP[file.type];
		return null;
	}

	public static getFileIcon(file: File): IconType;
	public static getFileIcon(fileType: string): IconType;
	public static getFileIcon(documentType: DocumentTypeCode): IconType;
	public static getFileIcon(fileInfo: File | string | DocumentTypeCode): IconType {
		let fileType: DocumentTypeCode;
		if (typeof fileInfo === 'string' && Object.values(DocumentTypeCode).includes(fileInfo as DocumentTypeCode))
			fileType = fileInfo as DocumentTypeCode;
		else fileType = FileUploadHelper.getFileDocumentType(typeof fileInfo === 'string' ? fileInfo : fileInfo?.type);

		let fileIcon = { icon: 'insert-drive-file', label: 'File' };
		if (fileType) fileIcon = this._FILE_ICONS[fileType];

		return fileIcon;
	}
}

@Component({
	selector: 'app-file-upload',
	template: `
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
				<div>
					<mat-icon class="upload-file-icon">cloud_upload</mat-icon>
				</div>
				<div>
					<strong>Drag and Drop your file here or click to browse</strong>
				</div>
				<div class="fine-print mb-2" *ngIf="message">{{ message }}</div>
				<ng-container *ngTemplateOutlet="infoText"></ng-container>
			</ngx-dropzone-label>

			<ng-container *ngIf="files.length === 1">
				<ng-container *ngFor="let file of files">
					<ngx-dropzone-preview class="file-preview" [removable]="true" (removed)="onRemoveFile(file)">
						<ngx-dropzone-label>
							<mat-icon class="preview-icon">{{ getFileIcon(file).icon }}</mat-icon>
							<span>{{ file.name }} ({{ getFileSize(file.size) }} KB)</span>
						</ngx-dropzone-label>
					</ngx-dropzone-preview>

					<div class="text-center w-100 mx-4 mb-2">
						<ng-container *ngTemplateOutlet="infoText"></ng-container>
					</div>
				</ng-container>
			</ng-container>

			<ng-container *ngIf="files.length > 1">
				<div class="row">
					<ng-container *ngFor="let file of files">
						<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
							<ngx-dropzone-preview class="file-preview" [removable]="true" (removed)="onRemoveFile(file)">
								<ngx-dropzone-label>
									<mat-icon class="preview-icon">{{ getFileIcon(file).icon }}</mat-icon>
									<span>{{ file.name }} ({{ getFileSize(file.size) }} KB)</span>
								</ngx-dropzone-label>
							</ngx-dropzone-preview>
						</div>
					</ng-container>

					<div class="text-center w-100 mx-4 mb-2">
						<ng-container *ngTemplateOutlet="infoText"></ng-container>
					</div>
				</div>
			</ng-container>
		</ngx-dropzone>

		<button
			mat-stroked-button
			(click)="fileDropzone.showFileSelector()"
			*ngIf="maxNumberOfFiles > 1 && this.files.length < maxNumberOfFiles"
			class="large w-auto mt-2"
		>
			<mat-icon>file_open</mat-icon> Add file
		</button>

		<ng-template #infoText>
			<div class="mat-option-error" *ngIf="accept">Accepted file formats: {{ accept }}</div>
			<div class="mat-option-error" *ngIf="maxFileSizeMb">File size maximum: {{ maxFileSizeMb }} Mb</div>
			<div class="mat-option-error" *ngIf="maxNumberOfFiles > 1">Maximum number of files: {{ maxNumberOfFiles }}</div>
		</ng-template>
	`,
	styles: [
		`
			.upload-file-icon {
				color: var(--color-primary-light);
				font-size: 80px !important;
				height: 80px !important;
				width: 80px !important;
			}

			.file-preview {
				max-width: unset !important;
				height: unset !important;
				min-height: 90px !important;
			}

			.preview-icon {
				margin-right: 4px;
				vertical-align: bottom;
				color: #1288cc;
			}

			.fine-print {
				font-size: var(--font-size-small);
			}
		`,
	],
})
export class FileUploadComponent implements OnInit {
	files: Array<File> = [];
	multiple = false; // prevent multiple at one time

	@Input() message = '';
	@Input() expandable = true;
	@Input() disableClick = false;
	@Input() isReadOnly = false;
	@Input() maxNumberOfFiles: number = SPD_CONSTANTS.document.maxNumberOfFiles; // 0 or any number less than 0 means unlimited files
	@Input() accept: string = SPD_CONSTANTS.document.acceptedFileTypes.join(', '); // Files types to accept

	@Output() uploadedFile = new EventEmitter<any>();
	@Output() removeFile = new EventEmitter<any>();

	maxFileSize: number = SPD_CONSTANTS.document.maxFileSize; // bytes
	maxFileSizeMb: number = SPD_CONSTANTS.document.maxFileSizeInMb; // mb

	constructor(private hotToastService: HotToastService) {}

	ngOnInit(): void {
		if (this.maxNumberOfFiles > SPD_CONSTANTS.document.maxNumberOfFiles) {
			this.maxNumberOfFiles = SPD_CONSTANTS.document.maxNumberOfFiles;
		}
	}

	onUploadFile(evt: any) {
		if (this.maxNumberOfFiles == 1) {
			this.files = [];
		}

		if (this.maxNumberOfFiles !== 0 && this.files.length >= this.maxNumberOfFiles) {
			this.hotToastService.error(`You are only allowed to upload a maximum of ${this.maxNumberOfFiles} files`);
			return;
		}

		// We can only upload one file at a time (multiple is set to false above), so the array of added/rejected files
		// will only contain at most one element

		// check if the file has already been uploaded
		if (evt.addedFiles.length > 0) {
			let dupFile: File | undefined = undefined;

			const addedFile = evt.addedFiles[0];
			dupFile = this.files?.find((item) => item.name == addedFile.name);

			if (dupFile) {
				this.hotToastService.error('A file with the same name has already been uploaded');
				return;
			}

			this.files.push(...evt.addedFiles);
			this.uploadedFile.emit(evt.addedFiles);
		}

		if (evt.rejectedFiles.length > 0) {
			const rejectedFile = evt.rejectedFiles[0];
			let reason = 'This file cannot be uploaded.';
			if (rejectedFile.reason == 'size') {
				reason = 'This file cannot be uploaded. The file size is too large.';
			} else if (rejectedFile.reason == 'no_multiple') {
				reason = 'Only one file was uploaded. Files must be uploaded one at a time.';
			}

			this.hotToastService.error(`${reason}`);
		}
	}

	onRemoveFile(evt: any) {
		const currentFiles = [...this.files];
		this.removeFile.emit(this.files.indexOf(evt));
		currentFiles.splice(this.files.indexOf(evt), 1);

		this.files = currentFiles;
	}

	removeAllFiles(): void {
		this.files = [];
	}

	getFileType(file: File): DocumentTypeCode {
		return FileUploadHelper.getFileDocumentType(file);
	}

	getFileIcon(file: File): IconType {
		return FileUploadHelper.getFileIcon(file);
	}

	getFileSize(size: number) {
		size = size / 1000;

		if (size < 1) return 'Less than 1';
		else return size;
	}
}
