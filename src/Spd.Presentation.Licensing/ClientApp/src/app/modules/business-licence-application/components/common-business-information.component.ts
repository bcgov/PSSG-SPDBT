import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BizTypeCode, ServiceTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BusinessLicenceTypes, SelectOptions } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { HotToastService } from '@ngxpert/hot-toast';
import {
	LookupByLicenceNumberDialogData,
	ModalLookupByLicenceNumberComponent,
} from '../../../shared/components/modal-lookup-by-licence-number.component';
import { BusinessBcBranchesComponent } from './business-bc-branches.component';

@Component({
	selector: 'app-common-business-information',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-lg-6 col-md-12 my-auto" [ngClass]="isSoleProprietorCombinedFlow ? 'col-lg-12' : 'col-lg-6'">
					<ng-container *ngIf="isBusinessLicenceSoleProprietor">
						<app-alert type="info" icon="" [showBorder]="false">
							The name of your business must be your name, as it appears on your security worker licence.
						</app-alert>
					</ng-container>
					<ng-container *ngIf="!isBusinessLicenceSoleProprietor">
						<ng-container *ngTemplateOutlet="LegalBusinessName"></ng-container>
					</ng-container>
				</div>
				<div class="col-lg-6 col-md-12" *ngIf="!isSoleProprietorCombinedFlow">
					<app-alert type="info" icon="" [showBorder]="false">
						If you are unsure of your business type, check your
						<a class="large" href="https://www.account.bcregistry.gov.bc.ca/decide-business" target="_blank"
							>BC Registries account</a
						>.
					</app-alert>
				</div>

				<div class="col-lg-6 col-md-12">
					<ng-container *ngIf="isBusinessLicenceSoleProprietor">
						<ng-container *ngTemplateOutlet="LegalBusinessName"></ng-container>
					</ng-container>

					<div class="mb-3">
						<div class="text-primary-color fw-semibold">
							Trade or 'Doing Business As' Name
							<mat-icon matTooltip="This is the name commonly used to refer to your business">info</mat-icon>
						</div>
						<ng-container *ngIf="bizTradeNameReadonly; else EditBizTradeName">
							<div class="text-primary-color fs-5">{{ bizTradeName.value | default }}</div>
						</ng-container>
						<ng-template #EditBizTradeName>
							<mat-form-field>
								<input matInput formControlName="bizTradeName" [errorStateMatcher]="matcher" maxlength="160" />
								<mat-error *ngIf="form.get('bizTradeName')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</ng-template>
					</div>
				</div>

				<ng-template #LegalBusinessName>
					<div class="mb-3">
						<div class="text-primary-color fw-semibold">Legal Business Name</div>
						<div class="text-primary-color fs-5">{{ legalBusinessName.value | default }}</div>
					</div>
				</ng-template>

				<div class="col-lg-6 col-md-12">
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
					<div class="col-md-6 col-sm-12 text-end" *ngIf="!isReadonly && !isSoleProprietorCombinedFlow">
						<button
							mat-flat-button
							color="primary"
							class="large w-auto mt-2 mt-lg-0"
							(click)="onLookupSoleProprietor()"
						>
							Search for Sole Proprietor
						</button>
					</div>
				</div>

				<div class="my-2">
					<ng-container *ngIf="!isSoleProprietorCombinedFlow">
						<ng-container *ngIf="soleProprietorLicenceId.value; else SearchForSP">
							<app-alert type="success" icon="check_circle">
								<div class="row">
									<div class="col-lg-4 col-md-6 col-sm-12 mt-2 mt-lg-0">
										<div class="text-primary-color">Name</div>
										<div class="text-primary-color fs-5">{{ soleProprietorLicenceHolderName.value }}</div>
									</div>
									<div class="col-lg-4 col-md-6 col-sm-12 mt-2 mt-lg-0">
										<div class="text-primary-color">Security Worker Licence Number</div>
										<div class="text-primary-color fs-5">{{ soleProprietorLicenceNumber.value }}</div>
									</div>
									<div class="col-lg-2 col-md-6 col-sm-12 mt-2 mt-lg-0">
										<div class="text-primary-color">Expiry Date</div>
										<div class="text-primary-color fs-5">
											{{ soleProprietorLicenceExpiryDate.value | formatDate: formalDateFormat }}
										</div>
									</div>
									<div class="col-lg-2 col-md-6 col-sm-12 mt-2 mt-lg-0">
										<div class="text-primary-color">Licence Status</div>
										<div class="text-primary-color fs-5 fw-bold">
											{{ soleProprietorLicenceStatusCode.value }}
										</div>
									</div>
								</div>
							</app-alert>
						</ng-container>
						<ng-template #SearchForSP>
							<app-alert type="warning" icon="">
								Search for a sole proprietor with a valid security worker licence
							</app-alert>
						</ng-template>

						<mat-error
							class="mat-option-error mb-4"
							*ngIf="
								(form.get('soleProprietorLicenceId')?.dirty || form.get('soleProprietorLicenceId')?.touched) &&
								form.get('soleProprietorLicenceId')?.invalid &&
								form.get('soleProprietorLicenceId')?.hasError('required')
							"
						>
							A valid security worker licence must be selected
						</mat-error>

						<div
							class="col-12"
							*ngIf="
								(form.dirty || form.touched) &&
								form.invalid &&
								!form.get('soleProprietorLicenceId')?.hasError('required') &&
								form.hasError('licencemustbeactive')
							"
						>
							<app-alert type="danger" icon="error">
								<div>
									You must have a valid security worker licence to apply for a sole proprietor business licence.
								</div>
								<div class="mt-2">
									To renew your security worker licence, visit
									<a href="https://www.google.ca" target="_blank">Security worker licencing</a>. Once you have your
									renewed licence, return to complete your business licence application.
								</div>
							</app-alert>
						</div>
					</ng-container>

					<div class="row">
						<div class="col-md-7 col-sm-12">
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

						<div class="col-md-5 col-sm-12">
							<mat-form-field>
								<mat-label>Phone Number</mat-label>
								<input
									matInput
									formControlName="soleProprietorSwlPhoneNumber"
									[errorStateMatcher]="matcher"
									maxlength="30"
									appPhoneNumberTransform
								/>
								<mat-error *ngIf="form.get('soleProprietorSwlPhoneNumber')?.hasError('required')"
									>This is required</mat-error
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
export class CommonBusinessInformationComponent implements OnInit {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;

	matcher = new FormErrorStateMatcher();

	businessTypes = BusinessLicenceTypes;

	@Input() form!: FormGroup;
	@Input() isReadonly = true;
	@Input() isSoleProprietorCombinedFlow = false;

	@ViewChild(BusinessBcBranchesComponent) businessBcBranchesComponent!: BusinessBcBranchesComponent;

	constructor(
		private businessApplicationService: BusinessApplicationService,
		private dialog: MatDialog,
		private hotToastService: HotToastService
	) {}

	ngOnInit(): void {
		// Biz type can only be changed from sole proprietor to non-sole proprietor
		// so limit the dropdown values when a value has previously been selected
		// and the business is non-sole proprietor
		if (this.bizTypeCode.value && !this.isBusinessLicenceSoleProprietor) {
			this.businessTypes = BusinessLicenceTypes.filter(
				(item: SelectOptions) =>
					item.code === BizTypeCode.Corporation ||
					item.code === BizTypeCode.NonRegisteredPartnership ||
					item.code === BizTypeCode.RegisteredPartnership
			);
		}

		if (this.isReadonly || this.isSoleProprietorCombinedFlow) {
			this.bizTypeCode.disable({ emitEvent: false });
		} else {
			this.bizTypeCode.enable();
		}

		if (this.isReadonly) {
			this.soleProprietorSwlEmailAddress.disable({ emitEvent: false });
			this.soleProprietorSwlPhoneNumber.disable({ emitEvent: false });
		} else {
			this.soleProprietorSwlEmailAddress.enable();
			this.soleProprietorSwlPhoneNumber.enable();
		}
	}

	isFormValid(): boolean {
		return this.isFormGroupValid(this.form);
	}

	onLookupSoleProprietor(): void {
		const dialogOptions: LookupByLicenceNumberDialogData = {
			title: 'Select Sole Proprietor',
			subtitle: 'A sole proprietor must have a valid security worker licence',
			lookupServiceTypeCode: ServiceTypeCode.SecurityWorkerLicence,
			isExpiredLicenceSearch: false,
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
				if (resp?.data) {
					this.form.patchValue(
						{
							soleProprietorLicenceId: resp.data.licenceId,
							soleProprietorLicenceAppId: resp.data.licenceAppId,
							soleProprietorLicenceHolderName: resp.data.licenceHolderName,
							soleProprietorLicenceNumber: resp.data.licenceNumber,
							soleProprietorLicenceExpiryDate: resp.data.expiryDate,
							soleProprietorLicenceStatusCode: resp.data.licenceStatusCode,
						},
						{ emitEvent: false }
					);

					this.businessApplicationService
						.applyBusinessLicenceSoleProprietorSelection(resp.data.licenceAppId)
						.subscribe((_resp: any) => {
							this.hotToastService.success('A sole proprietor was successfully selected');
						});
				}
			});
	}

	private isFormGroupValid(form: FormGroup): boolean {
		form.markAllAsTouched();
		return form.valid;
	}

	get bizTradeNameReadonly(): boolean {
		return this.isReadonly || this.isSoleProprietorCombinedFlow || this.isBizTradeNameReadonly.value;
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
	get soleProprietorLicenceId(): FormControl {
		return this.form.get('soleProprietorLicenceId') as FormControl;
	}
	get soleProprietorLicenceHolderName(): FormControl {
		return this.form.get('soleProprietorLicenceHolderName') as FormControl;
	}
	get soleProprietorLicenceNumber(): FormControl {
		return this.form.get('soleProprietorLicenceNumber') as FormControl;
	}
	get soleProprietorLicenceExpiryDate(): FormControl {
		return this.form.get('soleProprietorLicenceExpiryDate') as FormControl;
	}
	get soleProprietorLicenceStatusCode(): FormControl {
		return this.form.get('soleProprietorLicenceStatusCode') as FormControl;
	}
	get soleProprietorSwlEmailAddress(): FormControl {
		return this.form.get('soleProprietorSwlEmailAddress') as FormControl;
	}
	get soleProprietorSwlPhoneNumber(): FormControl {
		return this.form.get('soleProprietorSwlPhoneNumber') as FormControl;
	}
}
