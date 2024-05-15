import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BizTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BusinessLicenceTypes } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { HotToastService } from '@ngneat/hot-toast';
import { LookupSwlDialogData, ModalLookupSwlComponent } from './modal-lookup-swl.component';

@Component({
	selector: 'app-common-business-information',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-lg-6 col-md-12">
					<div class="mb-3">
						<ng-container *ngIf="isBusinessLicenceSoleProprietor">
							<app-alert type="warning" icon="" [showBorder]="false">
								The name of your business must be your name, as it appears on your security worker licence
							</app-alert>
						</ng-container>
						<div class="text-primary-color fw-semibold">Legal Business Name</div>
						<div class="text-primary-color fs-5">{{ legalBusinessName.value | default }}</div>
					</div>
					<div class="mb-3">
						<div class="text-primary-color fw-semibold">
							Trade or 'Doing Business As' Name
							<mat-icon matTooltip="This is the name commonly used to refer to your business">info</mat-icon>
						</div>

						<ng-container *ngIf="isBizTradeNameReadonly.value; else EditBizTradeName">
							<div class="text-primary-color fs-5">{{ bizTradeName.value | default }}</div>
						</ng-container>
						<ng-template #EditBizTradeName>
							<mat-form-field>
								<input matInput formControlName="bizTradeName" [errorStateMatcher]="matcher" maxlength="160" />
							</mat-form-field>
						</ng-template>
					</div>
				</div>

				<div class="col-lg-6 col-md-12">
					<app-alert type="info" icon="" [showBorder]="false">
						If you are unsure of your business type, check your
						<a class="large" href="https://www.account.bcregistry.gov.bc.ca/decide-business" target="_blank"
							>BC Registries account</a
						>.
					</app-alert>
					<mat-form-field>
						<mat-label>Business Type</mat-label>
						<mat-select formControlName="bizTypeCode" [errorStateMatcher]="matcher">
							<mat-option *ngFor="let item of businessTypes; let i = index" [value]="item.code">
								{{ item.desc }}
							</mat-option>
						</mat-select>
						<mat-error *ngIf="form.get('bizTypeCode')?.hasError('required')">This is required</mat-error>
					</mat-form-field>
				</div>
			</div>

			<div *ngIf="isBusinessLicenceSoleProprietor" @showHideTriggerSlideAnimation>
				<mat-divider class="mat-divider-main my-3"></mat-divider>
				<div class="row mb-3">
					<div class="col-md-6 col-sm-12"><div class="text-minor-heading">Sole Proprietor</div></div>
					<div class="col-md-6 col-sm-12 text-end">
						<button mat-flat-button color="primary" class="large w-auto" (click)="onLookupSoleProprietor()">
							Search for Sole Proprietor
						</button>
					</div>
				</div>

				<div class="my-2">
					<app-alert type="success" icon="check_circle">
						<div class="row">
							<div class="col-md-3 col-sm-12">
								<div class="text-primary-color">Name</div>
								<div class="text-primary-color fs-5">Joe Smith</div>
							</div>
							<div class="col-md-3 col-sm-12">
								<div class="text-primary-color">Security Worker Licence Number</div>
								<div class="text-primary-color fs-5">76434</div>
							</div>
							<div class="col-md-3 col-sm-12">
								<div class="text-primary-color">Expiry Date</div>
								<div class="text-primary-color fs-5">Apr 25, 2025</div>
							</div>
							<div class="col-md-3 col-sm-12">
								<div class="text-primary-color">Licence Status</div>
								<div class="text-primary-color fs-5 fw-bold">Valid</div>
							</div>
						</div>
					</app-alert>

					<div class="row">
						<div class="col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Email Address</mat-label>
								<input
									matInput
									formControlName="soleProprietorSwlEmailAddress"
									[errorStateMatcher]="matcher"
									placeholder="name@domain.com"
									maxlength="75"
								/>
								<mat-error *ngIf="form.get('soleProprietorSwlEmailAddress')?.hasError('required')"
									>This is required</mat-error
								>
								<mat-error *ngIf="form.get('soleProprietorSwlEmailAddress')?.hasError('email')"
									>Must be a valid email address</mat-error
								>
							</mat-form-field>
						</div>

						<div class="col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Phone Number</mat-label>
								<input
									matInput
									formControlName="soleProprietorSwlPhoneNumber"
									[errorStateMatcher]="matcher"
									[mask]="phoneMask"
								/>
								<mat-error *ngIf="form.get('soleProprietorSwlPhoneNumber')?.hasError('required')"
									>This is required</mat-error
								>
								<mat-error *ngIf="form.get('soleProprietorSwlPhoneNumber')?.hasError('mask')"
									>This must be 10 digits</mat-error
								>
							</mat-form-field>
						</div>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class CommonBusinessInformationComponent implements LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	businessTypes = BusinessLicenceTypes;

	@Input() form!: FormGroup;
	@Input() isReadonly = false;

	constructor(private dialog: MatDialog, private hotToastService: HotToastService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();

		return this.form.valid;
	}

	onLookupSoleProprietor(): void {
		const dialogOptions: LookupSwlDialogData = {
			title: 'Add Sole Proprietor',
			subtitle: 'A sole proprietor must have a valid security worker licence',
		};
		this.dialog
			.open(ModalLookupSwlComponent, {
				width: '800px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				if (resp) {
					this.hotToastService.success('Sole Proprietor was successfully added');
				}
			});
	}

	get isBusinessLicenceSoleProprietor(): boolean {
		return (
			this.bizTypeCode.value === BizTypeCode.NonRegisteredSoleProprietor ||
			this.bizTypeCode.value === BizTypeCode.RegisteredSoleProprietor
		);
	}
	get legalBusinessName(): FormControl {
		return this.form.get('legalBusinessName') as FormControl;
	}
	get bizTradeName(): FormControl {
		return this.form.get('bizTradeName') as FormControl;
	}
	get isBizTradeNameReadonly(): FormControl {
		return this.form.get('isBizTradeNameReadonly') as FormControl;
	}
	get bizTypeCode(): FormControl {
		return this.form.get('bizTypeCode') as FormControl;
	}
}
