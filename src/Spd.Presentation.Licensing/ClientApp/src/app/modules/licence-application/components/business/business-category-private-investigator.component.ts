import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LicenceResponse, WorkerLicenceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { BusinessApplicationService } from '../../services/business-application.service';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';
import {
	LookupByLicenceNumberDialogData,
	ModalLookupByLicenceNumberComponent,
} from './modal-lookup-by-licence-number.component';

@Component({
	selector: 'app-business-category-private-investigator',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row mt-3">
				<div class="col-lg-8 col-md-12 col-sm-12">
					<div class="fs-5 lh-base">
						To qualify for a private investigator business licence, you must have a manager with a valid security worker
						licence
					</div>
				</div>
				<div class="col-lg-4 col-md-12 col-sm-12 text-end">
					<button mat-flat-button color="primary" class="large w-auto" (click)="onLookupManager()">
						Search for Manager
					</button>
				</div>

				<div class="mt-4">
					<ng-container *ngIf="managerLicenceId.value; else SearchForManager">
						<app-alert type="success" icon="check_circle">
							<div class="row">
								<div class="col-lg-4 col-md-6 col-sm-12 mt-2 mt-lg-0">
									<div class="text-primary-color">Name</div>
									<div class="text-primary-color fs-5">{{ managerLicenceHolderName.value }}</div>
								</div>
								<div class="col-lg-4 col-md-6 col-sm-12 mt-2 mt-lg-0">
									<div class="text-primary-color">Security Worker Licence Number</div>
									<div class="text-primary-color fs-5">{{ managerLicenceNumber.value }}</div>
								</div>
								<div class="col-lg-2 col-md-6 col-sm-12 mt-2 mt-lg-0">
									<div class="text-primary-color">Expiry Date</div>
									<div class="text-primary-color fs-5">
										{{ managerLicenceExpiryDate.value | formatDate : formalDateFormat }}
									</div>
								</div>
								<div class="col-lg-2 col-md-6 col-sm-12 mt-2 mt-lg-0">
									<div class="text-primary-color">Licence Status</div>
									<div class="text-primary-color fs-5 fw-bold">{{ managerLicenceStatusCode.value }}</div>
								</div>
							</div>
						</app-alert>
					</ng-container>
					<ng-template #SearchForManager>
						<app-alert type="warning" icon=""> Search for your manager's security worker licence </app-alert>
					</ng-template>

					<mat-error
						class="mat-option-error mb-4"
						*ngIf="
							(form.get('managerLicenceId')?.dirty || form.get('managerLicenceId')?.touched) &&
							form.get('managerLicenceId')?.invalid &&
							form.get('managerLicenceId')?.hasError('required')
						"
					>
						A valid security worker licence must be selected
					</mat-error>
				</div>
			</div>
		</form>
	`,
	styles: ``,
})
export class BusinessCategoryPrivateInvestigatorComponent implements LicenceChildStepperStepComponent {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;
	form = this.businessApplicationService.categoryPrivateInvestigatorFormGroup;

	matcher = new FormErrorStateMatcher();

	constructor(private dialog: MatDialog, private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onLookupManager(): void {
		const dialogOptions: LookupByLicenceNumberDialogData = {
			title: 'Add Manager with Security Worker Licence',
			isExpiredLicenceSearch: false,
			lookupWorkerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence,
		};
		this.dialog
			.open(ModalLookupByLicenceNumberComponent, {
				width: '800px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				const memberData: LicenceResponse = resp?.data;
				if (memberData) {
					this.form.patchValue(
						{
							managerContactId: memberData.licenceHolderId,
							managerLicenceId: memberData.licenceId,
							managerLicenceHolderName: memberData.licenceHolderName,
							managerLicenceNumber: memberData.licenceNumber,
							managerLicenceExpiryDate: memberData.expiryDate,
							managerLicenceStatusCode: memberData.licenceStatusCode,
						},
						{ emitEvent: false }
					);
				} else {
					this.form.patchValue(
						{
							managerContactId: null,
							managerLicenceId: null,
							managerLicenceHolderName: null,
							managerLicenceNumber: null,
							managerLicenceExpiryDate: null,
							managerLicenceStatusCode: null,
						},
						{ emitEvent: false }
					);
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
