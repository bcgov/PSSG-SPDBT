import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmployeeOrganizationTypeCode, RegistrationTypeCode, VolunteerOrganizationTypeCode } from 'src/app/api/models';
import { RegistrationFormStepComponent } from '../org-registration.component';

export class OrganizationOptionsModel {
	employeeOrganizationTypeCode: EmployeeOrganizationTypeCode | null = null;
	volunteerOrganizationTypeCode: VolunteerOrganizationTypeCode | null = null;
}

@Component({
	selector: 'app-organization-options',
	template: `
		<section class="step-section p-4">
			<div class="step">
				<app-step-title title="How would you best describe your organization?"></app-step-title>
				<div class="">
					<div class="step-container row">
						<div class="col-lg-8 col-md-12 col-sm-12 mx-auto">
							<div class="row">
								<ng-container *ngFor="let option of options; let i = index">
									<div
										class="col-lg-4 col-md-4 col-sm-6 mb-3"
										[ngClass]="registrationTypeCode === registrationTypeCodes.Employee ? 'col-lg-4' : 'col-lg-3'"
									>
										<div
											tabindex="0"
											class="step-container__box"
											(click)="onDataChange(option.code)"
											(keydown)="onKeyDown($event, option.code)"
											[ngClass]="{ 'active-selection-border': currentOrganizationTypeCode === option.code }"
										>
											<ng-container *ngIf="option.showHelp; else noHelp">
												<div class="step-container__box__info">
													<mat-icon
														class="larger-icon"
														tabindex="0"
														(click)="onViewHelp(option, $event)"
														(keydown)="onKeyDownViewHelp(option, $event)"
														>close</mat-icon
													>
												</div>
												<div class="px-2 pb-3">
													{{ option.helpText }}
												</div>
											</ng-container>
											<ng-template #noHelp>
												<div class="step-container__box__info" style="height: 38px">
													<mat-icon
														class="larger-icon"
														*ngIf="option.helpText"
														tabindex="0"
														(click)="onViewHelp(option, $event)"
														(keydown)="onKeyDownViewHelp(option, $event)"
														>help_outline</mat-icon
													>
												</div>

												<ng-container *ngIf="currentOrganizationTypeCode !== option.code; else selectedIcon">
													<div class="card-icon-container d-none d-md-block">
														<img class="card-icon-container__icon" [src]="option.icon" [alt]="option.text" />
													</div>
													<div class="px-2 pb-3">
														{{ option.text }}
													</div>
												</ng-container>

												<ng-template #selectedIcon>
													<div class="card-icon-container d-none d-md-block">
														<img class="card-icon-container__icon" [src]="option.selectedIcon" [alt]="option.text" />
													</div>
													<div class="px-2 pb-3">
														{{ option.text }}
													</div>
												</ng-template>
											</ng-template>
										</div>
									</div>
								</ng-container>
							</div>

							<div class="none-apply">
								<a tabindex="0" (click)="onNoneApply()" (keydown)="onKeyDownNoneApply($event)"
									>None of these descriptions apply to my organization</a
								>
							</div>

							<mat-error class="mat-option-error" style="text-align: center;" *ngIf="isDirtyAndInvalid"
								>An option must be selected</mat-error
							>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.none-apply {
				text-align: center;
				color: var(--color-primary-light);
			}

			.card-icon-container {
				&__icon {
					max-width: 4em;
				}
			}

			.card-icon-container {
				display: block;
				text-align: center;
			}
		`,
	],
})
export class OrganizationOptionsComponent implements RegistrationFormStepComponent {
	employeeOrganizationTypeCode: EmployeeOrganizationTypeCode | null = null;
	volunteerOrganizationTypeCode: VolunteerOrganizationTypeCode | null = null;
	isDirtyAndInvalid = false;
	selectedIconImages: Array<any> = [];

	registrationTypeCodes = RegistrationTypeCode;

	private _registrationTypeCode: RegistrationTypeCode | null = null;
	@Input() set registrationTypeCode(value: RegistrationTypeCode | null) {
		// Preload the 'selectedIcon' images... prevents flicker when you click on card.
		this._registrationTypeCode = value;
		if (value == RegistrationTypeCode.Employee) {
			this.options = this.options_emp;
			this.options_emp.forEach((opt) => {
				const tmp = new Image();
				tmp.src = opt.selectedIcon;
				this.selectedIconImages.push(tmp);
			});
		} else {
			this.options = this.options_vol;
			this.options_vol.forEach((opt) => {
				const tmp = new Image();
				tmp.src = opt.selectedIcon;
				this.selectedIconImages.push(tmp);
			});
		}
	}
	get registrationTypeCode(): RegistrationTypeCode | null {
		return this._registrationTypeCode;
	}

	@Output() noneApply: EventEmitter<boolean> = new EventEmitter<boolean>();

	options: Array<any> = [];

	options_emp = [
		{
			code: EmployeeOrganizationTypeCode.Childcare,
			icon: './assets/org-types/1a.png',
			selectedIcon: './assets/org-types/1b.png',
			text: 'A childcare facility or daycare',
			showHelp: false,
			helpText: null,
		},
		{
			code: EmployeeOrganizationTypeCode.Healthcare,
			icon: './assets/org-types/2a.png',
			selectedIcon: './assets/org-types/2b.png',
			text: 'A health board, hospital, or care facility',
			showHelp: false,
			helpText: null,
		},
		{
			code: EmployeeOrganizationTypeCode.Education,
			icon: './assets/org-types/6a.png',
			selectedIcon: './assets/org-types/6b.png',
			text: 'A school board or education authority',
			showHelp: false,
			helpText: null,
		},
		{
			code: EmployeeOrganizationTypeCode.Funding,
			icon: './assets/org-types/8a.png',
			selectedIcon: './assets/org-types/8b.png',
			text: 'An organization or person who receives ongoing provincial funding',
			showHelp: false,
			helpText:
				'Receives money every year from the provincial government to operate their organization (example: CLBC service providers)',
		},
		{
			code: EmployeeOrganizationTypeCode.CrownCorp,
			icon: './assets/org-types/3a.png',
			selectedIcon: './assets/org-types/3b.png',
			text: 'A mainly government-owned corporation',
			showHelp: false,
			helpText:
				'Public sector organizations that report to the provincial government (examples: BC Housing, BC Transit)',
		},
		{
			code: EmployeeOrganizationTypeCode.ProvGovt,
			icon: './assets/org-types/4a.png',
			selectedIcon: './assets/org-types/4b.png',
			text: 'A provincial government ministry or related agency',
			showHelp: false,
			helpText: 'Examples: Ministry of Children and Family Development, BC Corrections',
		},
		{
			code: EmployeeOrganizationTypeCode.Registrant,
			icon: './assets/org-types/5a.png',
			selectedIcon: './assets/org-types/5b.png',
			text: 'A registered health professional or social worker',
			showHelp: false,
			helpText: null,
		},
		{
			code: EmployeeOrganizationTypeCode.GovnBody,
			icon: './assets/org-types/11a.png',
			selectedIcon: './assets/org-types/11b.png',
			text: 'A governing body under the Health Professions Act or the Social Workers Act',
			showHelp: false,
			helpText:
				'A governing body in B.C. of a social work or health profession (examples: BC College of Social Workers, BC College of Nurses and Midwives)',
		},
		{
			code: EmployeeOrganizationTypeCode.Appointed,
			icon: './assets/org-types/9a.png',
			selectedIcon: './assets/org-types/9b.png',
			text: 'An act- or minister-appointed board, commission, or council',
			showHelp: false,
			helpText:
				'Legislation or ministers occasionally appoint a board, commission, or council to perform a specific duty (examples: Police Boards or BC Ferries Commission)',
		},
	];

	options_vol = [
		{
			code: VolunteerOrganizationTypeCode.NonProfit,
			icon: './assets/org-types/7a.png',
			selectedIcon: './assets/org-types/7b.png',
			text: 'A registered non profit organization',
			showHelp: false,
			helpText: null,
		},
		{
			code: VolunteerOrganizationTypeCode.Education,
			icon: './assets/org-types/12a.png',
			selectedIcon: './assets/org-types/12b.png',
			text: 'A school board or education authority',
			showHelp: false,
			helpText: null,
		},
		{
			code: VolunteerOrganizationTypeCode.Childcare,
			icon: './assets/org-types/1a.png',
			selectedIcon: './assets/org-types/1b.png',
			text: 'A childcare facility or daycare',
			showHelp: false,
			helpText: null,
		},
		{
			code: VolunteerOrganizationTypeCode.Healthcare,
			icon: './assets/org-types/2a.png',
			selectedIcon: './assets/org-types/2b.png',
			text: 'A health board, hospital or care facility',
			showHelp: false,
			helpText: null,
		},
		{
			code: VolunteerOrganizationTypeCode.Registrant,
			icon: './assets/org-types/5a.png',
			selectedIcon: './assets/org-types/5b.png',
			text: 'A registered health professional or social worker',
			showHelp: false,
			helpText: null,
		},
		{
			code: VolunteerOrganizationTypeCode.ProvFunded,
			icon: './assets/org-types/8a.png',
			selectedIcon: './assets/org-types/8b.png',
			text: 'An organization or person who receives ongoing provincial funding',
			showHelp: false,
			helpText:
				'Receives money every year from the provincial government to operate their organization (example: CLBC service providers)',
		},
		{
			code: VolunteerOrganizationTypeCode.CrownCorp,
			icon: './assets/org-types/3a.png',
			selectedIcon: './assets/org-types/3b.png',
			text: 'A mainly government-owned corporation',
			showHelp: false,
			helpText:
				'Public sector organizations that report to the provincial government (examples: BC Housing, BC Transit)',
		},
		{
			code: VolunteerOrganizationTypeCode.ProvGovt,
			icon: './assets/org-types/9a.png',
			selectedIcon: './assets/org-types/9b.png',
			text: 'A provincial government ministry or related agency',
			showHelp: false,
			helpText: 'Examples: Ministry of Children and Family Development, BC Corrections',
		},
		{
			code: VolunteerOrganizationTypeCode.Municipality,
			icon: './assets/org-types/10a.png',
			selectedIcon: './assets/org-types/10b.png',
			text: 'A municipality',
			showHelp: false,
			helpText: null,
		},
		{
			code: VolunteerOrganizationTypeCode.PostSec,
			icon: './assets/org-types/12a.png',
			selectedIcon: './assets/org-types/12b.png',
			text: 'A post-secondary institution',
			showHelp: false,
			helpText: null,
		},
	];

	onDataChange(_val: EmployeeOrganizationTypeCode | VolunteerOrganizationTypeCode) {
		this.employeeOrganizationTypeCode =
			this.registrationTypeCode == RegistrationTypeCode.Employee ? (_val as EmployeeOrganizationTypeCode) : null;
		this.volunteerOrganizationTypeCode =
			this.registrationTypeCode == RegistrationTypeCode.Volunteer ? (_val as VolunteerOrganizationTypeCode) : null;

		const isValid = this.isFormValid();
		this.isDirtyAndInvalid = !isValid;
	}

	onKeyDown(event: KeyboardEvent, _val: EmployeeOrganizationTypeCode | VolunteerOrganizationTypeCode) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onDataChange(_val);
	}

	getDataToSave(): OrganizationOptionsModel {
		return {
			employeeOrganizationTypeCode: this.employeeOrganizationTypeCode,
			volunteerOrganizationTypeCode: this.volunteerOrganizationTypeCode,
		};
	}

	isFormValid(): boolean {
		let isValid = false;
		if (this.registrationTypeCode == RegistrationTypeCode.Employee) {
			isValid = !!this.employeeOrganizationTypeCode;
		} else {
			isValid = !!this.volunteerOrganizationTypeCode;
		}

		this.isDirtyAndInvalid = !isValid;
		return isValid;
	}

	clearCurrentData(): void {
		this.employeeOrganizationTypeCode = null;
		this.volunteerOrganizationTypeCode = null;
	}

	onViewHelp(option: any, event: any): void {
		option.showHelp = !option.showHelp;
		event.stopPropagation();
	}

	onKeyDownViewHelp(option: any, event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onViewHelp(option, event);
	}

	onNoneApply(): void {
		this.employeeOrganizationTypeCode = null;
		this.volunteerOrganizationTypeCode = null;

		this.noneApply.emit(true);
	}

	onKeyDownNoneApply(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onNoneApply();
	}

	get currentOrganizationTypeCode(): string {
		return this.registrationTypeCode == RegistrationTypeCode.Employee
			? (this.employeeOrganizationTypeCode as string)
			: (this.volunteerOrganizationTypeCode as string);
	}
}
