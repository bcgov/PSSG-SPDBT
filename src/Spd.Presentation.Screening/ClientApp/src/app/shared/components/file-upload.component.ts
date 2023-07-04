import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
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
				<div class="my-2">
					<div class="mt-4 mb-2">
						<mat-icon class="upload-file-icon">cloud_upload</mat-icon>
					</div>
					<div class="mb-4">
						<strong>Drag and Drop your file here or click to browse</strong>
					</div>
					<div class="fine-print mb-4">{{ message }}</div>
				</div>
			</ngx-dropzone-label>

			<div *ngIf="files.length > 0" fxLayout="row wrap">
				<ng-container *ngFor="let file of files">
					<ngx-dropzone-preview class="file-preview" [removable]="true" (removed)="onRemoveFile(file)">
						<ngx-dropzone-label fxLayout="row" fxLayout="start center">
							<mat-icon class="preview-icon">{{ getFileIcon(file).icon }}</mat-icon>
							<span>{{ file.name }} ({{ getFileSize(file.size) }} KB)</span>
						</ngx-dropzone-label>
					</ngx-dropzone-preview>
				</ng-container>
			</div>
		</ngx-dropzone>
		<!-- <button mat-stroked-button (click)="fileDropzone.showFileSelector()" class="large w-auto mt-2">
			<mat-icon>file_open</mat-icon> Add file
		</button> -->
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
export class FileUploadComponent {
	files: Array<File> = [];

	@Input() message: string = '';
	@Input() multiple: boolean = false;
	@Input() expandable: boolean = true;
	@Input() disableClick: boolean = false;
	@Input() isReadOnly: boolean = false;
	@Input() maxNumberOfFiles: number = SPD_CONSTANTS.document.maxNumberOfFiles; // 0 or any number less than 0 means unlimited files
	@Input() accept: string = SPD_CONSTANTS.document.acceptedFileTypes.join(', '); // Files types to accept

	@Output() uploadedFile = new EventEmitter<any>();
	@Output() removeFile = new EventEmitter<any>();

	maxFileSize: number = SPD_CONSTANTS.document.maxFileSize; // bytes

	constructor(private dialog: MatDialog, private hotToastService: HotToastService) {}

	onUploadFile(evt: any) {
		if (this.maxNumberOfFiles == 1) {
			this.files = [];
		}

		if (this.maxNumberOfFiles !== 0 && this.files.length >= this.maxNumberOfFiles) {
			this.hotToastService.warning(`You are only allowed to upload a maximum of ${this.maxNumberOfFiles} files`);
			return;
		}

		if (evt.addedFiles.length > 0) {
			this.files.push(...evt.addedFiles);

			this.uploadedFile.emit(evt.addedFiles);
		}

		if (evt.rejectedFiles.length > 0) {
			let text =
				evt.rejectedFiles.length == 1
					? 'This file cannot be uploaded:<br/><ul>'
					: 'These files cannot be uploaded:<br/><ul>';

			if (evt.rejectedFiles.length == 1) {
				const rejectedFile = evt.rejectedFiles[0];
				text += '<li>File Name: ' + rejectedFile.name + '</li><li>Reason: ' + rejectedFile.reason + '</li>';
			} else {
				evt.rejectedFiles.forEach((element: any) => {
					text += '<li>File Name: ' + element.name + ', Reason: ' + element.reason + '</li>';
				});
			}
			text += '</ul>';

			const data: DialogOptions = {
				icon: 'error',
				title: 'Error',
				message: text,
				cancelText: 'Close',
			};

			this.dialog.open(DialogComponent, { data }).afterClosed().subscribe();
		}
	}

	onRemoveFile(evt: any) {
		let currentFiles = [...this.files];
		this.removeFile.emit(this.files.indexOf(evt));
		currentFiles.splice(this.files.indexOf(evt));

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
