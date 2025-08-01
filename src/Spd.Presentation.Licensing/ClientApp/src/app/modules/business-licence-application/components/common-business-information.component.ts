import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BizTypeCode, LicenceResponse, ServiceTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BusinessLicenceTypes, SelectOptions } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { UtilService } from '@app/core/services/util.service';
import {
	LookupByLicenceNumberDialogData,
	ModalLookupByLicenceNumberComponent,
} from '@app/shared/components/modal-lookup-by-licence-number.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { BusinessBcBranchesComponent } from './business-bc-branches.component';

@Component({
	selector: 'app-common-business-information',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-lg-6 col-md-12 my-auto" [ngClass]="isSoleProprietorCombinedFlow ? 'col-lg-12' : 'col-lg-6'">
					@if (isBusinessLicenceSoleProprietor) {
						<app-alert type="info" icon="" [showBorder]="false">
							If you are a Sole Proprietor, you must have a Security Worker Licence. Your business name must exactly
							match the name you used on your Security Worker Licence.
						</app-alert>
					}
					@if (!isBusinessLicenceSoleProprietor) {
						<ng-container *ngTemplateOutlet="LegalBusinessName"></ng-container>
					}
				</div>
				@if (!isSoleProprietorCombinedFlow) {
					<div class="col-lg-6 col-md-12">
						<app-alert type="info" icon="" [showBorder]="false">
							Check your <a class="large" [href]="bcRegistriesAccountUrl" target="_blank">BC Registries account</a> if
							you don’t know your business type.
						</app-alert>
					</div>
				}

				<div class="col-lg-6 col-md-12">
					@if (isBusinessLicenceSoleProprietor) {
						<ng-container *ngTemplateOutlet="LegalBusinessName"></ng-container>
					}

					<div class="mb-3">
						<div class="text-primary-color fw-semibold">
							Trade or 'Doing Business As' Name
							<mat-icon matTooltip="This is the name commonly used to refer to your business">info</mat-icon>
						</div>
						@if (bizTradeNameReadonly) {
							<div class="text-minor-heading">{{ bizTradeName.value | default }}</div>
						} @else {
							<mat-form-field>
								<input matInput formControlName="bizTradeName" [errorStateMatcher]="matcher" maxlength="160" />
								@if (form.get('bizTradeName')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
							</mat-form-field>
						}
					</div>
				</div>

				<ng-template #LegalBusinessName>
					<div class="mb-3">
						<div class="text-primary-color fw-semibold">Legal Business Name</div>
						<div class="text-minor-heading">{{ legalBusinessName.value | default }}</div>
					</div>
				</ng-template>

				<div class="col-lg-6 col-md-12">
					<mat-form-field>
						<mat-label>Business Type</mat-label>
						<mat-select formControlName="bizTypeCode" [errorStateMatcher]="matcher">
							@for (item of businessTypes; track item; let i = $index) {
								<mat-option [value]="item.code">{{ item.desc }}</mat-option>
							}
						</mat-select>
						@if (form.get('bizTypeCode')?.hasError('required')) {
							<mat-error>This is required</mat-error>
						}
					</mat-form-field>
				</div>
			</div>

			@if (isBusinessLicenceSoleProprietor) {
				<div @showHideTriggerSlideAnimation>
					<mat-divider class="mat-divider-main my-3"></mat-divider>
					<div class="row mb-3">
						<div class="col-md-6 col-sm-12"><div class="text-minor-heading">Sole Proprietor</div></div>
						@if (!isReadonly && !isSoleProprietorCombinedFlow) {
							<div class="col-md-6 col-sm-12 text-end">
								<button
									mat-flat-button
									color="primary"
									class="large w-auto mt-2 mt-lg-0"
									aria-label="Search for the sole proprietor"
									(click)="onLookupSoleProprietor()"
								>
									Search for Sole Proprietor
								</button>
							</div>
						}
					</div>
					<div class="my-2">
						@if (!isSoleProprietorCombinedFlow) {
							@if (soleProprietorLicenceId.value) {
								<app-alert type="success" icon="check_circle">
									<div class="row">
										<div class="col-lg-4 col-md-6 col-sm-12 mt-2 mt-lg-0">
											<div class="text-primary-color">Name</div>
											<div class="text-minor-heading">{{ soleProprietorLicenceHolderName.value }}</div>
										</div>
										<div class="col-lg-4 col-md-6 col-sm-12 mt-2 mt-lg-0">
											<div class="text-primary-color">Security Worker Licence Number</div>
											<div class="text-minor-heading">{{ soleProprietorLicenceNumber.value }}</div>
										</div>
										<div class="col-lg-2 col-md-6 col-sm-12 mt-2 mt-lg-0">
											<div class="text-primary-color">Expiry Date</div>
											<div class="text-minor-heading">
												{{ soleProprietorLicenceExpiryDate.value | formatDate: formalDateFormat }}
											</div>
										</div>
										<div class="col-lg-2 col-md-6 col-sm-12 mt-2 mt-lg-0">
											<div class="text-primary-color">Licence Status</div>
											<div class="text-minor-heading fw-bold">
												{{ soleProprietorLicenceStatusCode.value }}
											</div>
										</div>
									</div>
								</app-alert>
							} @else {
								<app-alert type="warning" icon="">
									Search for a sole proprietor with a valid security worker licence.
								</app-alert>
							}
							@if (
								(form.get('soleProprietorLicenceId')?.dirty || form.get('soleProprietorLicenceId')?.touched) &&
								form.get('soleProprietorLicenceId')?.invalid &&
								form.get('soleProprietorLicenceId')?.hasError('required')
							) {
								<mat-error class="mat-option-error mb-4"
									>You must have a valid security worker licence to apply for a sole proprietor business
									licence.</mat-error
								>
							}
							@if (
								(form.dirty || form.touched) &&
								form.invalid &&
								!form.get('soleProprietorLicenceId')?.hasError('required') &&
								form.hasError('licencemustbeactive')
							) {
								<div class="col-12">
									<app-alert type="danger" icon="dangerous">
										<div>
											You must have a valid security worker licence to apply for a sole proprietor business licence.
										</div>
										<div class="mt-2">
											To renew your security worker licence, visit
											<a href="https://prod-spd-licensing-portal.apps.emerald.devops.gov.bc.ca/" target="_blank"
												>Security worker licencing</a
											>. Once you have your renewed licence, return to complete your business licence application.
										</div>
									</app-alert>
								</div>
							}
						}
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
									@if (form.get('soleProprietorSwlEmailAddress')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
									@if (form.get('soleProprietorSwlEmailAddress')?.hasError('email')) {
										<mat-error>Must be a valid email address</mat-error>
									}
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
									@if (form.get('soleProprietorSwlPhoneNumber')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
								</mat-form-field>
							</div>
						</div>
					</div>
				</div>
			}
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class CommonBusinessInformationComponent implements OnInit {
	bcRegistriesAccountUrl = SPD_CONSTANTS.urls.bcRegistriesAccountUrl;
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
		private utilService: UtilService
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
				const lookupData: LicenceResponse | null = resp?.data;
				if (lookupData) {
					this.form.patchValue({
						soleProprietorLicenceId: lookupData.licenceId,
						soleProprietorLicenceHolderName: lookupData.licenceHolderName,
						soleProprietorLicenceNumber: lookupData.licenceNumber,
						soleProprietorLicenceExpiryDate: lookupData.expiryDate,
						soleProprietorLicenceStatusCode: lookupData.licenceStatusCode,
					});

					this.businessApplicationService
						.applyBusinessLicenceSoleProprietorSelection(lookupData)
						.subscribe((_resp: any) => {
							this.utilService.toasterSuccess('A sole proprietor was successfully selected');
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
