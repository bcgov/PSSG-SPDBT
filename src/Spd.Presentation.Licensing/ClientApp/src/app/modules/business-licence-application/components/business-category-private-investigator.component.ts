import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LicenceResponse, ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import {
	LookupByLicenceNumberDialogData,
	ModalLookupByLicenceNumberComponent,
} from '../../../shared/components/modal-lookup-by-licence-number.component';

@Component({
	selector: 'app-business-category-private-investigator',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row mt-3">
				<div class="col-lg-8 col-md-12 col-sm-12">
					<div class="text-minor-heading lh-base">
						To qualify for a private investigator business licence, you must have a manager with a valid security worker
						licence.
					</div>
				</div>
				<div class="col-lg-4 col-md-12 col-sm-12 text-end">
					<button
						mat-flat-button
						color="primary"
						class="large w-auto"
						aria-label="Search for manager"
						(click)="onLookupManager()"
					>
						Search for Manager
					</button>
				</div>

				<div class="mt-4">
					@if (managerLicenceId.value) {
						<app-alert type="success" icon="check_circle">
							<div class="row">
								<div class="col-lg-4 col-md-6 col-sm-12 mt-2 mt-lg-0">
									<div class="text-primary-color">Name</div>
									<div class="text-minor-heading">{{ managerLicenceHolderName.value }}</div>
								</div>
								<div class="col-lg-3 col-md-6 col-sm-12 mt-2 mt-lg-0">
									<div class="text-primary-color">Security Worker Licence Number</div>
									<div class="text-minor-heading">{{ managerLicenceNumber.value }}</div>
								</div>
								<div class="col-lg-3 col-md-6 col-sm-12 mt-2 mt-lg-0">
									<div class="text-primary-color">Expiry Date</div>
									<div class="text-minor-heading">
										{{ managerLicenceExpiryDate.value | formatDate: formalDateFormat }}
									</div>
								</div>
								<div class="col-lg-2 col-md-6 col-sm-12 mt-2 mt-lg-0">
									<div class="text-primary-color">Licence Status</div>
									<div class="text-minor-heading fw-bold">{{ managerLicenceStatusCode.value }}</div>
								</div>
							</div>
						</app-alert>
					} @else {
						<app-alert type="warning" icon="">Search for your manager's security worker licence.</app-alert>
					}

					@if (
						(form.get('managerLicenceId')?.dirty || form.get('managerLicenceId')?.touched) &&
						form.get('managerLicenceId')?.invalid &&
						form.get('managerLicenceId')?.hasError('required')
					) {
						<mat-error class="mat-option-error mb-4">A valid security worker licence must be selected</mat-error>
					}
				</div>
			</div>
		</form>
	`,
	styles: [],
	standalone: false,
})
export class BusinessCategoryPrivateInvestigatorComponent implements LicenceChildStepperStepComponent {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;

	form = this.businessApplicationService.categoryPrivateInvestigatorFormGroup;

	constructor(
		private dialog: MatDialog,
		private businessApplicationService: BusinessApplicationService
	) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onLookupManager(): void {
		const dialogOptions: LookupByLicenceNumberDialogData = {
			title: 'Add Manager with Security Worker Licence',
			isExpiredLicenceSearch: false,
			lookupServiceTypeCode: ServiceTypeCode.SecurityWorkerLicence,
			isLoggedIn: true,
		};
		this.dialog
			.open(ModalLookupByLicenceNumberComponent, {
				width: '800px',
				data: dialogOptions,
				autoFocus: true,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				const memberData: LicenceResponse = resp?.data;
				if (memberData) {
					this.form.patchValue({
						managerContactId: memberData.licenceHolderId,
						managerLicenceId: memberData.licenceId,
						managerLicenceHolderName: memberData.licenceHolderName,
						managerLicenceNumber: memberData.licenceNumber,
						managerLicenceExpiryDate: memberData.expiryDate,
						managerLicenceStatusCode: memberData.licenceStatusCode,
					});
				}
			});
	}

	get managerLicenceId(): FormControl {
		return this.form.get('managerLicenceId') as FormControl;
	}
	get managerLicenceHolderName(): FormControl {
		return this.form.get('managerLicenceHolderName') as FormControl;
	}
	get managerLicenceNumber(): FormControl {
		return this.form.get('managerLicenceNumber') as FormControl;
	}
	get managerLicenceExpiryDate(): FormControl {
		return this.form.get('managerLicenceExpiryDate') as FormControl;
	}
	get managerLicenceStatusCode(): FormControl {
		return this.form.get('managerLicenceStatusCode') as FormControl;
	}
}
