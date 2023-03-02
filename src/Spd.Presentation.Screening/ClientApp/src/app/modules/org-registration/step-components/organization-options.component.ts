import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmployerOrganizationTypeCode, RegistrationTypeCode, VolunteerOrganizationTypeCode } from 'src/app/api/models';
import { RegistrationFormStepComponent } from '../org-registration.component';

export class OrganizationOptionsModel {
	employeeOrganizationType: EmployerOrganizationTypeCode | null = null;
	volunteerOrganizationType: VolunteerOrganizationTypeCode | null = null;
}

@Component({
	selector: 'app-organization-options',
	template: `
		<div class="step">
			<div class="title mb-5">How would you best describe your organization?</div>
			<div class="">
				<div class="step-container row">
					<div class="col-md-8 col-sm-12 mx-auto">
						<div class="row">
							<ng-container *ngFor="let option of options; let i = index">
								<div
									class=" col-md-4 col-sm-6 mb-3"
									[ngClass]="registrationTypeCode == registrationTypeCodes.Employee ? 'col-lg-4' : 'col-lg-3'"
								>
									<div
										class="step-container__box"
										(click)="onDataChange(option.code)"
										[ngClass]="{ 'active-selection-border': currentOrganizationTypeCode == option.code }"
									>
										<ng-container *ngIf="option.showHelp; else noHelp">
											<div class="step-container__box__info">
												<mat-icon class="larger-icon" (click)="onViewHelp(option, $event)">close</mat-icon>
											</div>
											<div class="px-2 pb-3">
												{{ option.helpText }}
											</div>
										</ng-container>
										<ng-template #noHelp>
											<div class="step-container__box__info" style="height: 38px">
												<mat-icon class="larger-icon" *ngIf="option.helpText" (click)="onViewHelp(option, $event)"
													>help_outline</mat-icon
												>
											</div>

											<ng-container *ngIf="currentOrganizationTypeCode != option.code; else selectedIcon">
												<div class="card-icon-container d-none d-md-block">
													<img class="card-icon-container__icon" [src]="option.icon" />
												</div>
												<div class="px-2 pb-3">
													{{ option.text }}
												</div>
											</ng-container>

											<ng-template #selectedIcon>
												<div class="card-icon-container d-none d-md-block">
													<img class="card-icon-container__icon" [src]="option.selectedIcon" />
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
							<a (click)="onNoneApply()">None of these descriptions apply to my organization</a>
						</div>

						<mat-error style="text-align: center;" *ngIf="isDirtyAndInvalid">An option must be selected</mat-error>
					</div>
				</div>
			</div>
		</div>
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
	employeeOrganizationType: EmployerOrganizationTypeCode | null = null;
	volunteerOrganizationType: VolunteerOrganizationTypeCode | null = null;
	isDirtyAndInvalid = false;
	selectedIconImages = new Array();

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
			code: EmployerOrganizationTypeCode.Childcare,
			icon: '/assets/1a.png',
			selectedIcon: '/assets/1b.png',
			text: 'A childcare facility or daycare',
			showHelp: false,
			helpText: null,
		},
		{
			code: EmployerOrganizationTypeCode.Healthcare,
			icon: '/assets/2a.png',
			selectedIcon: '/assets/2b.png',
			text: 'A health board, hospital, or care facility',
			showHelp: false,
			helpText: null,
		},
		{
			code: EmployerOrganizationTypeCode.Education,
			icon: '/assets/6a.png',
			selectedIcon: '/assets/6b.png',
			text: 'A school board or education authority',
			showHelp: false,
			helpText: null,
		},
		{
			code: EmployerOrganizationTypeCode.Funding,
			icon: '/assets/8a.png',
			selectedIcon: '/assets/8b.png',
			text: 'An organization or person who receives ongoing provincial funding',
			showHelp: false,
			helpText:
				'Receives money every year from the provincial government to operate their organization (example: CLBC service providers)',
		},
		{
			code: EmployerOrganizationTypeCode.CrownCorp,
			icon: '/assets/3a.png',
			selectedIcon: '/assets/3b.png',
			text: 'A mainly government-owned corporation',
			showHelp: false,
			helpText:
				'Public sector organizations that report to the provincial government (examples: BC Housing, BC Transit)',
		},
		{
			code: EmployerOrganizationTypeCode.ProvGovt,
			icon: '/assets/4a.png',
			selectedIcon: '/assets/4b.png',
			text: 'A provincial government ministry or related agency',
			showHelp: false,
			helpText: 'Examples: Ministry of Children and Family Development, BC Corrections',
		},
		{
			code: EmployerOrganizationTypeCode.Registrant,
			icon: '/assets/5a.png',
			selectedIcon: '/assets/5b.png',
			text: 'A registered health professional or social worker',
			showHelp: false,
			helpText: null,
		},
		{
			code: EmployerOrganizationTypeCode.GovnBody,
			icon: '/assets/11a.png',
			selectedIcon: '/assets/11b.png',
			text: 'A governing body under the Health Professions Act or the Social Workers Act',
			showHelp: false,
			helpText:
				'A governing body in B.C. of a social work or health profession (examples: BC College of Social Workers, BC College of Nurses and Midwives)',
		},
		{
			code: EmployerOrganizationTypeCode.Appointed,
			icon: '/assets/9a.png',
			selectedIcon: '/assets/9b.png',
			text: 'An act- or minister-appointed board, commission, or council',
			showHelp: false,
			helpText:
				'Legislation or ministers occasionally appoint a board, commission, or council to perform a specific duty (examples: Police Boards or BC Ferries Commission)',
		},
	];

	options_vol = [
		{
			code: VolunteerOrganizationTypeCode.Registrant,
			icon: '/assets/5a.png',
			selectedIcon: '/assets/5b.png',
			text: 'A registered health professional or social worker',
			showHelp: false,
			helpText: null,
		},
		{
			code: VolunteerOrganizationTypeCode.NonProfit,
			icon: '/assets/7a.png',
			selectedIcon: '/assets/7b.png',
			text: 'A registered non profit organization',
			showHelp: false,
			helpText: null,
		},
		{
			code: VolunteerOrganizationTypeCode.Childcare,
			icon: '/assets/1a.png',
			selectedIcon: '/assets/1b.png',
			text: 'A childcare facility or daycare',
			showHelp: false,
			helpText: null,
		},
		{
			code: VolunteerOrganizationTypeCode.Healthcare,
			icon: '/assets/2a.png',
			selectedIcon: '/assets/2b.png',
			text: 'A health board, hospital or care facility',
			showHelp: false,
			helpText: null,
		},
		{
			code: VolunteerOrganizationTypeCode.Education,
			icon: '/assets/12a.png',
			selectedIcon: '/assets/12b.png',
			text: 'A school board or education authority',
			showHelp: false,
			helpText: null,
		},
		{
			code: VolunteerOrganizationTypeCode.ProvFunded,
			icon: '/assets/8a.png',
			selectedIcon: '/assets/8b.png',
			text: 'An organization or person who receives ongoing provincial funding',
			showHelp: false,
			helpText:
				'Receives money every year from the provincial government to operate their organization (example: CLBC service providers)',
		},
		{
			code: VolunteerOrganizationTypeCode.CrownCorp,
			icon: '/assets/3a.png',
			selectedIcon: '/assets/3b.png',
			text: 'A mainly government-owned corporation',
			showHelp: false,
			helpText:
				'Public sector organizations that report to the provincial government (examples: BC Housing, BC Transit)',
		},
		{
			code: VolunteerOrganizationTypeCode.ProvGovt,
			icon: '/assets/9a.png',
			selectedIcon: '/assets/9b.png',
			text: 'A provincial government ministry or related agency',
			showHelp: false,
			helpText: 'Examples: Ministry of Children and Family Development, BC Corrections',
		},
		{
			code: VolunteerOrganizationTypeCode.Municipality,
			icon: '/assets/10a.png',
			selectedIcon: '/assets/10b.png',
			text: 'A municipality',
			showHelp: false,
			helpText: null,
		},
		{
			code: VolunteerOrganizationTypeCode.PostSec,
			icon: '/assets/12a.png',
			selectedIcon: '/assets/12b.png',
			text: 'A post-secondary institution',
			showHelp: false,
			helpText: null,
		},
	];

	onDataChange(_val: EmployerOrganizationTypeCode | VolunteerOrganizationTypeCode) {
		this.employeeOrganizationType =
			this.registrationTypeCode == RegistrationTypeCode.Employee ? (_val as EmployerOrganizationTypeCode) : null;
		this.volunteerOrganizationType =
			this.registrationTypeCode == RegistrationTypeCode.Volunteer ? (_val as VolunteerOrganizationTypeCode) : null;

		const isValid = this.isFormValid();
		this.isDirtyAndInvalid = !isValid;
	}

	getDataToSave(): OrganizationOptionsModel {
		return {
			employeeOrganizationType: this.employeeOrganizationType,
			volunteerOrganizationType: this.volunteerOrganizationType,
		};
	}

	isFormValid(): boolean {
		let isValid = false;
		if (this.registrationTypeCode == RegistrationTypeCode.Employee) {
			isValid = this.employeeOrganizationType ? true : false;
		} else {
			isValid = this.volunteerOrganizationType ? true : false;
		}

		this.isDirtyAndInvalid = !isValid;
		return isValid;
	}

	clearCurrentData(): void {
		this.employeeOrganizationType = null;
		this.volunteerOrganizationType = null;
	}

	onViewHelp(option: any, event: any): void {
		option.showHelp = !option.showHelp;
		event.stopPropagation();
	}

	onNoneApply(): void {
		this.employeeOrganizationType = null;
		this.volunteerOrganizationType = null;

		this.noneApply.emit(true);
	}

	get currentOrganizationTypeCode(): string {
		return this.registrationTypeCode == RegistrationTypeCode.Employee
			? (this.employeeOrganizationType as string)
			: (this.volunteerOrganizationType as string);
	}
}
