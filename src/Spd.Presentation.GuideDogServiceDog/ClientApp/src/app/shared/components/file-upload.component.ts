import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SecurityContext, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { UtilService } from '@app/core/services/util.service';
import { DialogComponent, DialogOptions } from './dialog.component';

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
		<div class="dropzone" appFileDragDrop (filesChangeEmitter)="onFileDragDropChange($event)">
		  @if (files && files.length > 0) {
		    <div class="row my-2">
		      @for (file of files; track file; let i = $index) {
		        <div class="col-lg-6 col-md-12 col-sm-12">
		          <div class="file-preview" (removed)="onRemoveFile(file)">
		            <div style="text-align: center;z-index: 10;margin: 10px auto;">
		              <mat-icon class="preview-icon">{{ getFileIcon(file).icon }}</mat-icon>
		              <span>{{ file.name }} </span>
		              @if (getPreviewImage(i)) {
		                <div class="image-preview-container">
		                  <img class="image-preview-container__image" [src]="getPreviewImage(i)" alt="Image preview" />
		                </div>
		              }
		            </div>
		            <div style="position: absolute; top: 5px; right: 5px; cursor: pointer;">
		              <mat-icon
		                tabindex="0"
		                (click)="onRemoveFile(file)"
		                (keydown)="onRemoveFileKeyDown($event, file)"
		                aria-label="Remove this file"
		                role="button"
		                >cancel</mat-icon
		                >
		              </div>
		            </div>
		          </div>
		        }
		      </div>
		    }
		    <label
		      class="dropzone-area"
		      [for]="id"
		      tabindex="0"
		      [attr.aria-label]="ariaFileUploadLabel"
		      (keydown)="onAddFileKeyDown($event)"
		      role="button"
		      >
		      <div><mat-icon class="upload-file-icon">cloud_upload</mat-icon></div>
		      <div class="fw-bold m-2">Drag and Drop your file here or click to browse</div>
		      @if (message) {
		        <div class="fine-print m-2">{{ message }}</div>
		      }
		
		      @if (accept) {
		        <div class="mat-option-hint mx-2">Accepted file formats: {{ accept }}</div>
		      }
		      @if (maxFileSizeMb) {
		        <div class="mat-option-hint">File size maximum: {{ maxFileSizeMb }} Mb</div>
		      }
		      <div class="mat-option-hint pb-2">Maximum number of files: {{ maxNumberOfFiles }}</div>
		
		      <input
		        type="file"
		        #fileInput
		        [id]="id"
		        (change)="onFileAddChange($event)"
		        (click)="fileInput.value = ''"
		        [multiple]="false"
		        [hidden]="true"
		        [accept]="accept"
		        role="button"
		        />
		      </label>
		    </div>
		    <div aria-live="polite" class="mt-2" role="status">
		      {{ uploadStatusMessage }}
		    </div>
		`,
	styles: [
		`
			.file-preview {
				background-image: linear-gradient(to top, #ededed, #efefef, #f1f1f1, #f4f4f4, #f6f6f6);
				align-items: center;
				border-radius: 5px;
				display: flex;
				justify-content: center;
				margin: 10px;
				padding: 0px 20px;
				position: relative;
			}

			.file-preview:hover {
				background-image: linear-gradient(to top, #e3e3e3, #ebeaea, #e8e7e7, #ebeaea, #f4f4f4);
				outline: 0;
			}

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

			.dropzone-area {
				width: 100%;
				text-align: center !important;
				cursor: pointer;
			}

			.dropzone-area:hover {
				background-color: #f8f8f8;
				outline: 0;
			}
		`,
	],
	standalone: false,
})
export class FileUploadComponent implements OnInit {
	@Input() control!: FormControl;
	@Input() message = '';
	@Input() previewImage = false;
	@Input() files: Array<File> = [];
	@Input() maxNumberOfFiles: number = SPD_CONSTANTS.document.maxNumberOfFiles; // 0 or any number less than 0 means unlimited files
	@Input() accept: string = SPD_CONSTANTS.document.acceptedFileTypes.join(', '); // Default file types to accept
	@Input() ariaFileUploadLabel = 'Upload a file';

	@Output() fileRemoved = new EventEmitter<any>();
	@Output() fileUploaded = new EventEmitter<File>();

	@ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

	id!: string;
	maxFileSize: number = SPD_CONSTANTS.document.maxFileSize; // bytes
	maxFileSizeMb: number = SPD_CONSTANTS.document.maxFileSizeInMb; // mb

	imagePreviews: Array<string | null> = [];

	uploadStatusMessage = '';

	constructor(
		private utilService: UtilService,
		private dialog: MatDialog,
		private domSanitizer: DomSanitizer,
		private applicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.id = this.applicationService.getUniqueId();

		if (this.maxNumberOfFiles > SPD_CONSTANTS.document.maxNumberOfFiles) {
			this.maxNumberOfFiles = SPD_CONSTANTS.document.maxNumberOfFiles;
		}
	}

	onFileDragDropChange(newFile: File) {
		this.addFile(newFile);
	}

	onFileAddChange(event: any) {
		const newFile = event.target.files[0];

		this.addFile(newFile);
	}

	private addFile(newFile: File) {
		if (this.maxNumberOfFiles !== 0 && this.getNumberOfFiles() >= this.maxNumberOfFiles) {
			this.utilService.dialogError('The maximum number of files has been reached.');
			return;
		}

		if (!this.files) {
			this.files = []; // default to empty array;
		}

		const isFoundIndex = this.files.findIndex((item: File) => item.name === newFile.name);
		if (isFoundIndex >= 0) {
			this.utilService.dialogError('A file with the same name has already been uploaded.');
			return;
		}

		if (!this.isAccepted(newFile, this.accept)) {
			this.utilService.dialogError('A file of this type cannot be uploaded.');
			return;
		}

		if (this.maxFileSize && newFile.size > this.maxFileSize) {
			this.utilService.dialogError('A file of this size cannot be uploaded.');
			return;
		}

		// For some reason the file uploader will not allow deletion of files that contain multiple periods
		// for example: filename.gov.bc.ca.docx ... Block the uploading of these files.
		const numberOfPeriods = newFile.name.match(/\./g)?.length ?? 0;

		if (numberOfPeriods > 1) {
			this.utilService.dialogError('A file name cannot contain multiple periods. Rename this file and try again.');
			return;
		}

		if (newFile) {
			this.files.push(newFile);
			this.filesUpdated();

			this.uploadStatusMessage = ''; // Clear first to trigger screen reader reliably
			setTimeout(() => {
				this.uploadStatusMessage = 'File uploaded successfully';
			}, 100); // Small delay helps ensure the change is recognized

			this.fileUploaded.emit(newFile);
		}
	}

	onRemoveFile(file: File) {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this file?',
			actionText: 'Remove',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.removeFailedFile(file);
					this.fileRemoved.emit();
				}
			});
	}

	onRemoveFileKeyDown(event: KeyboardEvent, file: File) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault(); // Prevent space from scrolling
			this.onRemoveFile(file);
		}
	}

	onAddFileKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault(); // Prevent space from scrolling
			this.fileInputRef.nativeElement.click(); // Trigger the file input
		}
	}

	getPreviewImage(index: number): string | null {
		if (!this.previewImage) return null;

		if (this.imagePreviews[index]) {
			return this.imagePreviews[index];
		}

		const file = this.files[index];
		if (FileUploadHelper.getFileDocumentType(file) != DocumentTypeCode.Image || file.size === 0) return null;

		const objectUrl = URL.createObjectURL(file);

		if (!this.isValidObjectUrl(objectUrl)) {
			return null;
		}

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

		this.uploadStatusMessage = ''; // Clear first to trigger screen reader reliably
		setTimeout(() => {
			this.uploadStatusMessage = 'File successfully removed';
		}, 100); // Small delay helps ensure the change is recognized
	}

	getFileIcon(file: File): IconType {
		return FileUploadHelper.getFileIcon(file);
	}

	getNumberOfFiles(): number {
		return this.files?.length ?? 0;
	}

	// getFileType(file: File): DocumentTypeCode {
	// 	return FileUploadHelper.getFileDocumentType(file);
	// }

	// getFileSize(size: number) {
	// 	size = size / 1000;

	// 	if (size < 1) return 'Less than 1';
	// 	else return size;
	// }

	private isAccepted(file: File, accept: string): boolean {
		if (accept === '*') {
			return true;
		}

		const acceptFiletypes = accept.split(',').map((it) => it.toLowerCase().trim());
		const filetype = file.type.toLowerCase();
		const filename = file.name.toLowerCase();

		const matchedFileType = acceptFiletypes.find((acceptFiletype: string) => {
			// check for wildcard mimetype (e.g. image/*)
			if (acceptFiletype.endsWith('/*')) {
				return filetype.split('/')[0] === acceptFiletype.split('/')[0];
			}

			// check for file extension (e.g. .csv)
			if (acceptFiletype.startsWith('.')) {
				return filename.endsWith(acceptFiletype);
			}

			// check for exact mimetype match (e.g. image/jpeg)
			return acceptFiletype == filetype;
		});

		return !!matchedFileType;
	}

	private filesUpdated(): void {
		const files = this.files && this.files.length > 0 ? this.files : [];
		this.control.setValue(files);
	}

	private isValidObjectUrl(objectUrl: string): boolean {
		const allowedDomains = ['localhost', 'gov.bc.ca'];
		try {
			// objectUrl starts with 'blob:' - find the start of the url
			const index = objectUrl.indexOf('http');
			const url = objectUrl.substring(index);
			const parsedUrl = new URL(url);
			return allowedDomains.some((domain) => parsedUrl.hostname.endsWith(domain));
		} catch {
			return false; // Invalid URL format
		}
	}
}
