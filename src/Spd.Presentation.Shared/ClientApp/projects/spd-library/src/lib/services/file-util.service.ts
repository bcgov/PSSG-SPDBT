import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Document } from '@app/api/models';

export interface SpdFile extends File {
	name: string;
	documentUrlId?: string | null;
	lastModifiedDate?: string | null;
}

export type SortWeight = -1 | 0 | 1;

@Injectable({ providedIn: 'root' })
export class FileUtilService {
	downloadFile(headers: HttpHeaders, file: Blob): void {
		const fileName = this.getFileNameFromHeader(headers);

		if (file?.size > 0) {
			const url = window.URL.createObjectURL(file);
			const anchor = document.createElement('a');
			anchor.href = url;
			anchor.download = fileName;
			document.body.appendChild(anchor);
			anchor.click();
			document.body.removeChild(anchor);
		} else {
			console.error(`fileName ${fileName} is empty`);
		}
	}

	dummyFile(doc: Document): SpdFile {
		const b: SpdFile = new Blob(undefined, { type: doc.documentExtension ?? '' }) as SpdFile;
		b.documentUrlId = doc.documentUrlId;
		b.name = doc.documentName ?? '';
		return b;
	}

	getFileNameFromHeader(headers: HttpHeaders): string {
		let fileName = 'file-name';
		const contentDisposition = headers.get('Content-Disposition');
		if (contentDisposition) {
			const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
			const matches = fileNameRegex.exec(contentDisposition);
			if (matches != null && matches[1]) {
				fileName = matches[1].replace(/['"]/g, '');
			}
		}
		return fileName;
	}
}
