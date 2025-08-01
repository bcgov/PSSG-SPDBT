import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LicenceResponse, ServiceTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { ModalLookupByLicenceNumberAccessCodeComponent } from './modal-lookup-by-licence-number-access-code.component';
import {
	LookupByLicenceNumberDialogData,
	ModalLookupByLicenceNumberComponent,
} from './modal-lookup-by-licence-number.component';

@Component({
	selector: 'app-form-expired-licence',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
					<mat-radio-group aria-label="Select an option" formControlName="hasExpiredLicence">
						<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
					</mat-radio-group>
					@if (
						(form.get('hasExpiredLicence')?.dirty || form.get('hasExpiredLicence')?.touched) &&
						form.get('hasExpiredLicence')?.invalid &&
						form.get('hasExpiredLicence')?.hasError('required')
					) {
						<mat-error class="mat-option-error">This is required</mat-error>
					}
				</div>
			</div>

			@if (hasExpiredLicence.value === booleanTypeCodes.Yes) {
				<div class="row mt-4" @showHideTriggerSlideAnimation>
					<div class="col-xxl-8 col-xl-10 col-lg-8 col-md-8 col-sm-12 mx-auto">
						<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
						<div class="row mb-3">
							<div class="col-md-6 col-sm-12 mx-auto">
								<button mat-flat-button color="primary" class="large w-auto" (click)="onLookup()">
									Search for your Expired {{ typeLabel }}
								</button>
								@if (
									(form.get('expiredLicenceId')?.dirty || form.get('expiredLicenceId')?.touched) &&
									form.get('expiredLicenceId')?.invalid &&
									form.get('expiredLicenceId')?.hasError('required')
								) {
									<mat-error class="mat-option-error mt-3">An expired {{ typeLabel }} must be selected</mat-error>
								}
							</div>
						</div>
						@if (expiredLicenceId.value) {
							<div class="my-2">
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
												{{ expiredLicenceExpiryDate.value | formatDate: formalDateFormat }}
											</div>
										</div>
										<div class="col-md-6 col-sm-12">
											<div class="d-block text-muted mt-2">Licence Status</div>
											<div class="text-data fw-bold">{{ expiredLicenceStatusCode.value }}</div>
										</div>
									</div>
								</app-alert>
							</div>
						}
					</div>
				</div>
			}
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class FormExpiredLicenceComponent implements OnInit {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;
	booleanTypeCodes = BooleanTypeCode;

	titleLabel!: string;
	typeLabel!: string;

	messageInfo: string | null = null;
	messageWarn: string | null = null;
	messageError: string | null = null;

	@Input() isLoggedIn!: boolean;
	@Input() form!: FormGroup;
	@Input() serviceTypeCode!: ServiceTypeCode;
	@Input() useSwlAnonymousNewAccessCode = false;

	constructor(
		private dialog: MatDialog,
		private optionsPipe: OptionsPipe,
		private commonApplicationService: CommonApplicationService,
		private workerApplicationService: WorkerApplicationService
	) {}

	ngOnInit(): void {
		this.titleLabel = this.optionsPipe.transform(this.serviceTypeCode, 'ServiceTypes');
		this.typeLabel = this.commonApplicationService.getLicenceTypeName(this.serviceTypeCode);
	}

	onLookup(): void {
		const dialogOptions: LookupByLicenceNumberDialogData = {
			title: `Search for a ${this.titleLabel}`,
			isExpiredLicenceSearch: true,
			lookupServiceTypeCode: this.serviceTypeCode,
			typeLabel: this.typeLabel,
			isLoggedIn: this.isLoggedIn,
		};

		if (this.useSwlAnonymousNewAccessCode) {
			this.dialog
				.open(ModalLookupByLicenceNumberAccessCodeComponent, {
					width: '800px',
					data: dialogOptions,
					autoFocus: true,
				})
				.afterClosed()
				.subscribe((resp: any) => {
					const licenceResponse: LicenceResponse | null = resp?.data;
					if (licenceResponse) {
						this.workerApplicationService
							.populateNewLicenceApplAccessCodeAnonymous(licenceResponse)
							.pipe()
							.subscribe((_resp: any) => {
								this.form.patchValue(
									{
										expiredLicenceId: licenceResponse.licenceId,
										expiredLicenceHolderName: licenceResponse.licenceHolderName,
										expiredLicenceNumber: licenceResponse.licenceNumber,
										expiredLicenceExpiryDate: licenceResponse.expiryDate,
										expiredLicenceStatusCode: licenceResponse.licenceStatusCode,
									},
									{ emitEvent: false }
								);
							});
					}
				});
			return;
		}

		this.dialog
			.open(ModalLookupByLicenceNumberComponent, {
				width: '800px',
				data: dialogOptions,
				autoFocus: true,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				const licenceResponse: LicenceResponse | null = resp?.data;
				if (licenceResponse) {
					this.form.patchValue(
						{
							expiredLicenceId: licenceResponse.licenceId,
							expiredLicenceHolderName: licenceResponse.licenceHolderName,
							expiredLicenceNumber: licenceResponse.licenceNumber,
							expiredLicenceExpiryDate: licenceResponse.expiryDate,
							expiredLicenceStatusCode: licenceResponse.licenceStatusCode,
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
