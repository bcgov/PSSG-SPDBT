import { Component, EventEmitter, Input, OnInit, Output, SecurityContext } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { HotToastService } from '@ngneat/hot-toast';

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
		pdf: DocumentTypeCode.Pdf,
		'application/msword': DocumentTypeCode.Word,
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document': DocumentTypeCode.Word,
		doc: DocumentTypeCode.Word,
		docx: DocumentTypeCode.Word,
		'image/bmp': DocumentTypeCode.Image,
		'image/gif': DocumentTypeCode.Image,
		'image/jpg': DocumentTypeCode.Image,
		'image/jpeg': DocumentTypeCode.Image,
		'image/png': DocumentTypeCode.Image,
		'image/tiff': DocumentTypeCode.Image,
		bmp: DocumentTypeCode.Image,
		gif: DocumentTypeCode.Image,
		jpg: DocumentTypeCode.Image,
		jpeg: DocumentTypeCode.Image,
		png: DocumentTypeCode.Image,
		tiff: DocumentTypeCode.Image,
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
		if (typeof fileInfo === 'string' && Object.values(DocumentTypeCode).includes(fileInfo as DocumentTypeCode)) {
			fileType = fileInfo as DocumentTypeCode;
		} else {
			fileType = FileUploadHelper.getFileDocumentType(typeof fileInfo === 'string' ? fileInfo : fileInfo?.type);
		}

		let fileIcon = { icon: 'insert_drive_file', label: 'File' };
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
			[disabled]="disabled"
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

			<ng-container *ngIf="files && files.length > 0">
				<div class="row">
					<ng-container *ngFor="let file of files; let i = index">
						<div class="col-lg-6 col-md-12 col-sm-12">
							<ngx-dropzone-preview class="file-preview" [removable]="true" (removed)="onRemoveFile(file)">
								<ngx-dropzone-label>
									<mat-icon class="preview-icon">{{ getFileIcon(file).icon }}</mat-icon>
									<span>{{ file.name }} </span>
									<div class="image-preview-container" *ngIf="getPreviewImage(i)">
										<img class="image-preview-container__image" [src]="getPreviewImage(i)" alt="Image preview" />
									</div>
									<!-- ({{ getFileSize(file.size) }} KB) -->
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
			<div class="mat-option-hint mx-2" *ngIf="accept">Accepted file formats: {{ accept }}</div>
			<div class="mat-option-hint" *ngIf="maxFileSizeMb">File size maximum: {{ maxFileSizeMb }} Mb</div>
			<div class="mat-option-hint">Maximum number of files: {{ maxNumberOfFiles }}</div>
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

			.image-preview-container {
				&__image {
					max-height: 200px;
					max-width: 200px;
				}
			}
		`,
	],
})
export class FileUploadComponent implements OnInit {
	multiple = false; // prevent multiple at one time

	@Input() control!: FormControl;

	@Input() message = '';
	@Input() expandable = true;
	@Input() disableClick = false;
	@Input() isReadonly = false;
	@Input() disabled = false;
	@Input() previewImage = false;
	@Input() files: Array<File> = [];
	@Input() maxNumberOfFiles: number = SPD_CONSTANTS.document.maxNumberOfFiles; // 0 or any number less than 0 means unlimited files
	@Input() accept: string = SPD_CONSTANTS.document.acceptedFileTypes.join(', '); // Files types to accept

	@Output() fileRemoved = new EventEmitter<any>();
	@Output() fileUploaded = new EventEmitter<File>();

	maxFileSize: number = SPD_CONSTANTS.document.maxFileSize; // bytes
	maxFileSizeMb: number = SPD_CONSTANTS.document.maxFileSizeInMb; // mb

	imagePreviews: Array<string | null> = [];

	constructor(private hotToastService: HotToastService, private domSanitizer: DomSanitizer) {}

	ngOnInit(): void {
		if (!this.files) {
			this.files = []; // default to empty array;
		}

		if (this.maxNumberOfFiles > SPD_CONSTANTS.document.maxNumberOfFiles) {
			this.maxNumberOfFiles = SPD_CONSTANTS.document.maxNumberOfFiles;
		}
	}

	onUploadFile(evt: any) {
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

			// BUG: for some reason the file uploader will not allow deletion of files that contain multiple periods
			// for example: filename.gov.bc.ca.docx
			// Block the uploading of these files for now. Hopefully newer version will fix this.
			const numberOfPeriods = addedFile.name.match(/\./g)?.length ?? 0;

			if (numberOfPeriods > 1) {
				this.hotToastService.error(
					'A file name cannot contain multiple periods. Please rename this file and try again.'
				);
				return;
			}

			dupFile = this.files ? this.files.find((item) => item.name == addedFile.name) : undefined;

			if (dupFile) {
				this.hotToastService.error('A file with the same name has already been uploaded');
				return;
			}

			this.files.push(...evt.addedFiles);
			this.filesUpdated();

			this.onFileUploaded(addedFile);
			return;
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
		this.removeFailedFile(evt);
		this.fileRemoved.emit();
	}

	onFileUploaded(addedFile: File): void {
		this.fileUploaded.emit(addedFile);
	}

	getFileType(file: File): DocumentTypeCode {
		return FileUploadHelper.getFileDocumentType(file);
	}

	getFileIcon(file: File): IconType {
		return FileUploadHelper.getFileIcon(file);
	}

	// getFileSize(size: number) {
	// 	size = size / 1000;

	// 	if (size < 1) return 'Less than 1';
	// 	else return size;
	// }

	getPreviewImage(index: number): string | null {
		if (!this.previewImage) return null;

		if (this.imagePreviews[index]) {
			return this.imagePreviews[index];
		}

		const file = this.files[index];
		if (FileUploadHelper.getFileDocumentType(file) != DocumentTypeCode.Image || file.size === 0) return null;

		const objectUrl = URL.createObjectURL(file);
		const previewFile = this.domSanitizer.sanitize(
			SecurityContext.RESOURCE_URL,
			this.domSanitizer.bypassSecurityTrustResourceUrl(objectUrl)
		);

		this.imagePreviews[index] = previewFile;
		return this.imagePreviews[index];
	}

	removeFailedFile(file: File) {
		const removeFileIndex = this.files.indexOf(file);

		this.imagePreviews.splice(removeFileIndex, 1);
		this.files.splice(removeFileIndex, 1);
		this.filesUpdated();
	}

	private filesUpdated(): void {
		const files = this.files && this.files.length > 0 ? this.files : [];
		this.control.setValue(files);
	}
}
