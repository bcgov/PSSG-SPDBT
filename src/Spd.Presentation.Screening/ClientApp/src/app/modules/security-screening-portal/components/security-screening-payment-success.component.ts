import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicantUserInfo } from 'src/app/api/models';
import { ApplicantService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { SecurityScreeningRoutes } from '../security-screening-routing.module';

@Component({
	selector: 'app-security-screening-payment-success',
	template: `
		<app-payment-success
			[caseID]="data.caseID"
			[transactionOn]="data.transactionOn"
			[invoiceNo]="data.invoiceNo"
			[backRoute]="backRoute"
		></app-payment-success>
	`,
	styles: [],
})
export class SecurityScreeningPaymentSuccessComponent {
	backRoute = SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST);

	constructor(private route: ActivatedRoute, private router: Router, private applicantService: ApplicantService) {}

	data = {
		caseID: '',
		transactionOn: '',
		invoiceNo: '',
	};

	ngOnInit(): void {
		const id = this.route.snapshot.paramMap.get('id');
		if (!id) {
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		this.applicantService
			.apiApplicantsUserinfoGet()
			.pipe()
			.subscribe((res: ApplicantUserInfo) => {
				this.data = {
					caseID: 'CAS-TEST-H7V9J7965',
					transactionOn: '2023-07-05T14:38:13+00:00',
					invoiceNo: '333444',
				};
			});
	}
}
