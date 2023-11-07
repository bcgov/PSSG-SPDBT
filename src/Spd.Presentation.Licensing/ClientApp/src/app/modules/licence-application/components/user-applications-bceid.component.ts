import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';

@Component({
	selector: 'app-user-applications-bceid',
	template: ` <router-outlet></router-outlet> `,
	styles: [],
})
export class UserApplicationsBceidComponent implements OnInit {
	constructor(private router: Router, private authProcessService: AuthProcessService) {}

	async ngOnInit(): Promise<void> {
		this.authProcessService.logoutBcsc();

		const nextRoute = await this.authProcessService.initializeLicencingBCeID();
		if (nextRoute) {
			await this.router.navigate([nextRoute]);
		}
	}
}
