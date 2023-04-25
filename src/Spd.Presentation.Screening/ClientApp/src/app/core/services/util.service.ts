import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class UtilService {
	readonly ORG_REG_STATE_KEY = 'state';

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

	setOrgRegState(data: any): void {
		sessionStorage.setItem(this.ORG_REG_STATE_KEY, data);
	}

	getOrgRegState(): any {
		return sessionStorage.getItem(this.ORG_REG_STATE_KEY);
	}

	clearOrgRegState(): void {
		sessionStorage.removeItem(this.ORG_REG_STATE_KEY);
	}
}
