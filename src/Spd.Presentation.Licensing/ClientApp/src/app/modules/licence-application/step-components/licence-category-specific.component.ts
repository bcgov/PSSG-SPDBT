import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectOptions } from 'src/app/core/code-types/model-desc.models';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { SwlCategoryTypeCode } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-specific',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<div class="step-container">
					<div class="row">
						<div class="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-9 col-lg-12">
							<div class="text-center">
								<mat-chip-option [selectable]="false" class="mat-chip-green me-3"> {{ index }} </mat-chip-option>
								<span class="title" style="position: relative; top: -5px;">{{ title }}</span>
							</div>

							<mat-divider class="mt-1 mb-4"></mat-divider>

							<div [ngSwitch]="option?.code">
								<div *ngSwitchCase="swlCategoryTypeCodes.ArmouredCarGuard">
									<ng-container *ngTemplateOutlet="ArmouredCarGuard"></ng-container>
								</div>
								<div *ngSwitchCase="swlCategoryTypeCodes.BodyArmourSales">
									<ng-container *ngTemplateOutlet="BodyArmourSales"></ng-container>
								</div>
								<div *ngSwitchCase="swlCategoryTypeCodes.ClosedCircuitTelevisionInstaller">
									<ng-container *ngTemplateOutlet="ClosedCircuitTelevisionInstaller"></ng-container>
								</div>
								<div *ngSwitchCase="swlCategoryTypeCodes.ElectronicLockingDeviceInstaller">
									<ng-container *ngTemplateOutlet="ElectronicLockingDeviceInstaller"></ng-container>
								</div>
								<div *ngSwitchCase="swlCategoryTypeCodes.FireInvestigator">
									<ng-container *ngTemplateOutlet="FireInvestigator"></ng-container>
								</div>
								<div *ngSwitchCase="swlCategoryTypeCodes.Locksmith">
									<ng-container *ngTemplateOutlet="Locksmith"></ng-container>
								</div>
								<div *ngSwitchCase="swlCategoryTypeCodes.LocksmithUnderSupervision">
									<ng-container *ngTemplateOutlet="LocksmithUnderSupervision"></ng-container>
								</div>
								<div *ngSwitchCase="swlCategoryTypeCodes.PrivateInvestigator">
									<ng-container *ngTemplateOutlet="PrivateInvestigator"></ng-container>
								</div>
								<div *ngSwitchCase="swlCategoryTypeCodes.PrivateInvestigatorUnderSupervision">
									<ng-container *ngTemplateOutlet="PrivateInvestigatorUnderSupervision"></ng-container>
								</div>
								<div *ngSwitchCase="swlCategoryTypeCodes.SecurityAlarmInstallerUnderSupervision">
									<ng-container *ngTemplateOutlet="SecurityAlarmInstallerUnderSupervision"></ng-container>
								</div>
								<div *ngSwitchCase="swlCategoryTypeCodes.SecurityAlarmInstaller">
									<ng-container *ngTemplateOutlet="SecurityAlarmInstaller"></ng-container>
								</div>
								<div *ngSwitchCase="swlCategoryTypeCodes.SecurityAlarmMonitor">
									<ng-container *ngTemplateOutlet="SecurityAlarmMonitor"></ng-container>
								</div>
								<div *ngSwitchCase="swlCategoryTypeCodes.SecurityAlarmResponse">
									<ng-container *ngTemplateOutlet="SecurityAlarmResponse"></ng-container>
								</div>
								<div *ngSwitchCase="swlCategoryTypeCodes.SecurityAlarmSales">
									<ng-container *ngTemplateOutlet="SecurityAlarmSales"></ng-container>
								</div>
								<div *ngSwitchCase="swlCategoryTypeCodes.SecurityConsultant">
									<ng-container *ngTemplateOutlet="SecurityConsultant"></ng-container>
								</div>
								<div *ngSwitchCase="swlCategoryTypeCodes.SecurityGuard">
									<ng-container *ngTemplateOutlet="SecurityGuard"></ng-container>
								</div>
								<div *ngSwitchCase="swlCategoryTypeCodes.SecurityGuardUnderSupervision">
									<ng-container *ngTemplateOutlet="SecurityGuardUnderSupervision"></ng-container>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<ng-template #ArmouredCarGuard>
			<div class="fs-5 fw-semibold mb-4">Authorization to Carry Certificate required</div>
			<p>
				Armoured car guards carry firearms, which requires a firearm licence and an Authorization to Carry (ATC)
				certificate. You must get this licence and ATC before you can apply to be an armoured car guard. More
				information is available from the
				<a href="https://www.rcmp-grc.gc.ca/en/firearms/authorization-carry" target="_blank">RCMP</a>.
			</p>

			<form [formGroup]="form" novalidate>
				<div class="text-minor-heading fw-semibold mb-2" *ngIf="requirement.value == 'b'; else uploadcopy">
					Upload your valid Authorization to Carry certificate:
				</div>
				<ng-template #uploadcopy>
					<div class="text-minor-heading fw-semibold mb-2">Upload a copy of your certificate:</div>
				</ng-template>
				<div class="my-4">
					<app-file-upload [maxNumberOfFiles]="10"></app-file-upload>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
							form.get('attachments')?.invalid &&
							form.get('attachments')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
				<p>Accepted file formats: docx, doc, pdf, bmp, jpeg, jpg, tif, tiff, png, gif, html, htm</p>
				<p>File size maximum: 25MB per file</p>

				<div class="row">
					<div class="col-lg-4 col-md-12 col-sm-12">
						<mat-form-field>
							<mat-label>Document Expiry Date</mat-label>
							<input
								matInput
								[matDatepicker]="picker"
								formControlName="documentExpiryDate"
								[errorStateMatcher]="matcher"
							/>
							<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
							<mat-datepicker #picker startView="multi-year"></mat-datepicker>
							<mat-error *ngIf="form.get('documentExpiryDate')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>
			</form>
		</ng-template>

		<ng-template #BodyArmourSales> BODY_ARMOUR_SALES </ng-template>

		<ng-template #ClosedCircuitTelevisionInstaller> CLOSED_CIRCUIT </ng-template>

		<ng-template #ElectronicLockingDeviceInstaller> ELECTRONIC_LOCKING </ng-template>

		<ng-template #FireInvestigator> FIRE_INVESTIGATOR </ng-template>

		<ng-template #Locksmith> LOCKSMITH </ng-template>

		<ng-template #LocksmithUnderSupervision> LOCKSMITH_UNDER_SUP </ng-template>

		<ng-template #PrivateInvestigator> PI </ng-template>

		<ng-template #PrivateInvestigatorUnderSupervision> PI_UNDER_SUP </ng-template>

		<ng-template #SecurityAlarmInstallerUnderSupervision> SA_INSTALLER_UNDER_SUP </ng-template>

		<ng-template #SecurityAlarmInstaller> SA_INSTALLER </ng-template>

		<ng-template #SecurityAlarmMonitor> SA_MONITOR </ng-template>

		<ng-template #SecurityAlarmResponse> SA_RESPONSE </ng-template>

		<ng-template #SecurityAlarmSales> SA_SALES </ng-template>

		<ng-template #SecurityConsultant> SECURITY_CONSULTANT </ng-template>

		<ng-template #SecurityGuard>
			<div class="fs-5 fw-semibold mb-4">Proof of experience or training required</div>
			<div class="fw-semibold mb-2">Experience:</div>
			<p>
				To qualify for a security guard security worker licence, you must meet one of the following training or
				experience requirements:
			</p>

			<form [formGroup]="form" novalidate>
				<mat-radio-group class="category-radio-group" aria-label="Select an option" formControlName="requirement">
					<mat-radio-button class="radio-label" value="a">
						Basic Security Training Certificate issued by the Justice Institute of British Columbia (JIBC)
					</mat-radio-button>
					<mat-divider class="my-2"></mat-divider>
					<mat-radio-button class="radio-label" value="b">
						Proof of training or experience providing general duties as a Canadian police officer, correctional officer,
						sheriff, auxiliary, reserve, or border service officer
					</mat-radio-button>
					<mat-divider class="my-2"></mat-divider>
					<mat-radio-button class="radio-label" value="c">
						Certificate equivalent to the Basic Security Training course offered by JIBC
					</mat-radio-button>
				</mat-radio-group>

				<mat-divider class="my-3"></mat-divider>

				<ng-container *ngIf="requirement.value">
					<div class="text-minor-heading fw-semibold mb-2" *ngIf="requirement.value == 'b'; else uploadcopy">
						Upload a training certificate or reference letter from your employment supervisor or human resources office:
					</div>
					<ng-template #uploadcopy>
						<div class="text-minor-heading fw-semibold mb-2">Upload a copy of your certificate:</div>
					</ng-template>
					<div class="my-4">
						<app-file-upload [maxNumberOfFiles]="10"></app-file-upload>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
								form.get('attachments')?.invalid &&
								form.get('attachments')?.hasError('required')
							"
							>This is required</mat-error
						>
					</div>
					<p>Accepted file formats: docx, doc, pdf, bmp, jpeg, jpg, tif, tiff, png, gif, html, htm</p>
					<p>File size maximum: 25MB per file</p>
				</ng-container>
			</form>
		</ng-template>

		<ng-template #SecurityGuardUnderSupervision> SECURITY_GUARD_UNDER_SUP </ng-template>
	`,
	styles: [
		`
			.category-radio-group > .radio-label .mdc-label {
				font-size: initial;
				color: initial;
			}

			/* .title {
				font-size: 1.7em;
				font-weight: 400;
				text-align: center;
				color: var(--color-primary);
			} */
		`,
	],
	encapsulation: ViewEncapsulation.None,
})
export class LicenceCategorySpecificComponent implements OnInit {
	form!: FormGroup;
	title = '';

	swlCategoryTypeCodes = SwlCategoryTypeCode;
	matcher = new FormErrorStateMatcher();

	@Input() option: SelectOptions | null = null;
	@Input() index: number = 0;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			requirement: new FormControl(null, [Validators.required]),
			documentExpiryDate: new FormControl(null, [Validators.required]),
			attachments: new FormControl('', [Validators.required]),
		});

		this.title = `${this.option?.desc ?? ''}`;
	}

	public get requirement(): FormControl {
		return this.form.get('requirement') as FormControl;
	}
}
