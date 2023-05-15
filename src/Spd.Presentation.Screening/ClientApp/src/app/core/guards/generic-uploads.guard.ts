import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
	providedIn: 'root',
})
export class GenericUploadsGuard implements CanActivate {
	constructor(private router: Router, private authenticationService: AuthenticationService) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		const genericUploadEnabled = this.authenticationService.genericUploadEnabled;
		if (!genericUploadEnabled) {
			this.router.navigateByUrl(AppRoutes.appPath(AppRoutes.ACCESS_DENIED));
		}
		return genericUploadEnabled;
	}
}
