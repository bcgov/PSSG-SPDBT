import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class UtilService {
	getFullName(firstName: string | null, lastName: string | null): string {
		return `${firstName ?? ''} ${lastName ?? ''}`;
	}

	getDecodedAccessToken(token: string): any {
		try {
			return jwt_decode(token);
		} catch (Error) {
			return null;
		}
	}
}
