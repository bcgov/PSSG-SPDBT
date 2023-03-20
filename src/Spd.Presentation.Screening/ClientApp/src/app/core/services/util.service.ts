import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilService {
	getFullName(firstName: string | null, lastName: string | null): string {
		return `${firstName ?? ''} ${lastName ?? ''}`;
	}
}
