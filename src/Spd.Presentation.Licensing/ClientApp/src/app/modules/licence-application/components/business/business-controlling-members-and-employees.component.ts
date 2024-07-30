import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { BusinessApplicationService } from '../../services/business-application.service';
import { CommonControllingMembersComponent } from './common-controlling-members.component';
import { CommonEmployeesComponent } from './common-employees.component';

@Component({
	selector: 'app-business-controlling-members-and-employees',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Controlling Members & Employees</h2>
						</div>

						<div class="col-xl-6 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end">
								<!-- <button TODO remove button?
									mat-stroked-button
									color="primary"
									class="large w-auto mb-3"
									aria-label="Back"
									(click)="onCancel()"
								>
									<mat-icon>arrow_back</mat-icon>Back
								</button> -->
							</div>
						</div>
						<div class="col-12 mb-3">
							<p>
								Your business must have valid security worker licence holders in B.C. that support the various licence
								categories the business wishes to be licensed for. If your controlling members don't meet this
								requirement, add employees who do.
							</p>

							<p>
								If your controlling members or your employees, who are licence holders for the business, change during
								the business licence term, update their information here.
							</p>
						</div>
					</div>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<app-common-controlling-members [defaultExpanded]="true"></app-common-controlling-members>

					<div class="mt-3">
						<app-common-employees [defaultExpanded]="true"></app-common-employees>
					</div>
				</div>
			</div>
		</section>

		<app-wizard-outside-footer
			nextButtonLabel="Save"
			(nextStepperStep)="onSave()"
			(cancel)="onCancel()"
		></app-wizard-outside-footer>
	`,
	styles: [],
})
export class BusinessControllingMembersAndEmployeesComponent {
	@ViewChild(CommonControllingMembersComponent) controllingMembersComponent!: CommonControllingMembersComponent;
	@ViewChild(CommonEmployeesComponent) employeesComponent!: CommonEmployeesComponent;

	constructor(
		private router: Router,
		private hotToastService: HotToastService,
		private businessApplicationService: BusinessApplicationService
	) {}

	onSave(): void {
		const valid1 = this.controllingMembersComponent.isFormValid();
		const valid2 = this.employeesComponent.isFormValid();
		if (!valid1 || !valid2) return;

		this.businessApplicationService.submitControllingMembersAndEmployees().subscribe({
			next: (_resp: any) => {
				this.hotToastService.success('Your controlling members & employees has been successfully updated');
				this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessApplications());
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	onCancel(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessApplications());
	}
}
