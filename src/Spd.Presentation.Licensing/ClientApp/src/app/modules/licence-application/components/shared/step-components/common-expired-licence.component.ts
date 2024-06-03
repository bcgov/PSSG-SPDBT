import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import {
	LookupByLicenceNumberDialogData,
	ModalLookupByLicenceNumberComponent,
} from '../../business/modal-lookup-by-licence-number.component';

@Component({
	selector: 'app-common-expired-licence',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
					<mat-radio-group aria-label="Select an option" formControlName="hasExpiredLicence">
						<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
					</mat-radio-group>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('hasExpiredLicence')?.dirty || form.get('hasExpiredLicence')?.touched) &&
							form.get('hasExpiredLicence')?.invalid &&
							form.get('hasExpiredLicence')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div>

			<div class="row mt-4" *ngIf="hasExpiredLicence.value === booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
				<div class="col-xxl-8 col-xl-10 col-lg-8 col-md-8 col-sm-12 mx-auto">
					<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

					<div class="row mb-3">
						<div class="col-md-6 col-sm-12 mx-auto">
							<button mat-flat-button color="primary" class="large w-auto" (click)="onLookup()">
								Search for your Expired Licence
							</button>
						</div>
					</div>

					<div class="my-2">
						<ng-container *ngIf="expiredLicenceId.value; else SearchForLicence">
							<app-alert type="success" icon="check_circle">
								<div class="row">
									<div class="col-md-6 col-sm-12">
										<div class="d-block text-muted mt-2">Name</div>
										<div class="text-data">{{ expiredLicenceHolderName.value }}</div>
									</div>
									<div class="col-md-6 col-sm-12">
										<div class="d-block text-muted mt-2">{{ titleLabel }} Number</div>
										<div class="text-data">{{ expiredLicenceNumber.value }}</div>
									</div>
									<div class="col-md-6 col-sm-12">
										<div class="d-block text-muted mt-2">Expiry Date</div>
										<div class="text-data">
											{{ expiredLicenceExpiryDate.value | formatDate : constants.date.formalDateFormat }}
										</div>
									</div>
									<div class="col-md-6 col-sm-12">
										<div class="d-block text-muted mt-2">Licence Status</div>
										<div class="text-data fw-bold">{{ expiredLicenceStatusCode.value }}</div>
									</div>
								</div>
							</app-alert>
						</ng-container>
						<ng-template #SearchForLicence>
							<app-alert type="warning" icon=""> Search for the associated expired licence </app-alert>
						</ng-template>

						<mat-error
							class="mat-option-error mb-4"
							*ngIf="
								(form.get('expiredLicenceId')?.dirty || form.get('expiredLicenceId')?.touched) &&
								form.get('expiredLicenceId')?.invalid &&
								form.get('expiredLicenceId')?.hasError('required')
							"
						>
							An expired licence must be selected
						</mat-error>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class CommonExpiredLicenceComponent implements OnInit {
	booleanTypeCodes = BooleanTypeCode;
	constants = SPD_CONSTANTS;

	titleLabel!: string;

	messageInfo: string | null = null;
	messageWarn: string | null = null;
	messageError: string | null = null;

	matcher = new FormErrorStateMatcher();

	@Input() isLoggedIn!: boolean;
	@Input() form!: FormGroup;
	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;

	constructor(private dialog: MatDialog, private optionsPipe: OptionsPipe) {}

	ngOnInit(): void {
		this.titleLabel = this.optionsPipe.transform(this.workerLicenceTypeCode, 'WorkerLicenceTypes');
	}

	onLookup(): void {
		const dialogOptions: LookupByLicenceNumberDialogData = {
			title: `Search for a ${this.titleLabel}`,
			isExpiredLicenceSearch: true,
			lookupWorkerLicenceTypeCode: this.workerLicenceTypeCode,
			isLoggedIn: this.isLoggedIn,
		};
		this.dialog
			.open(ModalLookupByLicenceNumberComponent, {
				width: '800px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				if (resp?.data) {
					this.form.patchValue(
						{
							expiredLicenceId: resp.data.licenceId,
							expiredLicenceHolderName: resp.data.licenceHolderName,
							expiredLicenceNumber: resp.data.licenceNumber,
							expiredLicenceExpiryDate: resp.data.expiryDate,
							expiredLicenceStatusCode: resp.data.licenceStatusCode,
						},
						{ emitEvent: false }
					);
				} else {
					this.form.patchValue(
						{
							expiredLicenceId: null,
							expiredLicenceHolderName: null,
							expiredLicenceNumber: null,
							expiredLicenceExpiryDate: null,
							expiredLicenceStatusCode: null,
						},
						{ emitEvent: false }
					);
				}
			});
	}

	get hasExpiredLicence(): FormControl {
		return this.form.get('hasExpiredLicence') as FormControl;
	}
	get expiredLicenceId(): FormControl {
		return this.form.get('expiredLicenceId') as FormControl;
	}
	get expiredLicenceHolderName(): FormControl {
		return this.form.get('expiredLicenceHolderName') as FormControl;
	}
	get expiredLicenceNumber(): FormControl {
		return this.form.get('expiredLicenceNumber') as FormControl;
	}
	get expiredLicenceExpiryDate(): FormControl {
		return this.form.get('expiredLicenceExpiryDate') as FormControl;
	}
	get expiredLicenceStatusCode(): FormControl {
		return this.form.get('expiredLicenceStatusCode') as FormControl;
	}
}
