import { Component } from '@angular/core';
import { RegistrationFormStepComponent } from '../registration.component';

export class VulnerableSectorQuestionModel {
	employeeInteractionFlag: string = '';
}

@Component({
	selector: 'app-vulnerable-sector-question',
	template: `
		<div class="step">
			<div class="title mb-5">Tell us a bit more about your employees:</div>
			<div class="step-container row">
				<div class="col-md-3 col-sm-6 mb-3">
					<div
						class="step-container__box"
						(click)="onDataChange('CHILDREN')"
						[ngClass]="{ 'active-selection': employeeInteractionFlag == 'CHILDREN' }"
					>
						<ng-container *ngIf="displayHelp1; else noHelp1">
							<div class="step-container__box__info">
								<mat-icon class="info-icon" (click)="onViewHelp1($event)">close</mat-icon>
							</div>
							<div class="px-2 pb-3">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
								dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
								ex ea commodo consequat.
							</div>
						</ng-container>
						<ng-template #noHelp1>
							<div class="step-container__box__info">
								<mat-icon class="info-icon" (click)="onViewHelp1($event)">help_outline</mat-icon>
							</div>
							<div class="px-2 pb-3">
								<div class="info-icon"><mat-icon>family_restroom</mat-icon></div>
								My employees work with <strong>children</strong>
							</div>
						</ng-template>
					</div>
				</div>
				<div class="col-md-3 col-sm-6 mb-3">
					<div
						class="step-container__box"
						(click)="onDataChange('ADULTS')"
						[ngClass]="{ 'active-selection': employeeInteractionFlag == 'ADULTS' }"
					>
						<ng-container *ngIf="displayHelp2; else noHelp2">
							<div class="step-container__box__info">
								<mat-icon class="info-icon" (click)="onViewHelp2($event)">close</mat-icon>
							</div>
							<div class="px-2 pb-3">
								Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
							</div>
						</ng-container>
						<ng-template #noHelp2>
							<div class="step-container__box__info">
								<mat-icon class="info-icon" (click)="onViewHelp2($event)">help_outline</mat-icon>
							</div>
							<div class="px-2 pb-3">
								<div class="info-icon"><mat-icon>elderly</mat-icon></div>
								My employees work with <strong>vulnerable adults</strong>
							</div>
						</ng-template>
					</div>
				</div>
				<div class="col-md-3 col-sm-6 mb-3">
					<div
						class="step-container__box px-2 pb-3"
						style="padding-top: 32px;"
						(click)="onDataChange('CHILDREN_ADULTS')"
						[ngClass]="{ 'active-selection': employeeInteractionFlag == 'CHILDREN_ADULTS' }"
					>
						<div class="info-icon"><mat-icon>diversity_3</mat-icon></div>
						My employees work with <strong>children and vulnerable adults</strong>
					</div>
				</div>
				<div class="col-md-3 col-sm-6 mb-3">
					<div
						class="step-container__box px-2 pb-3"
						style="padding-top: 32px;"
						(click)="onDataChange('NEITHER')"
						[ngClass]="{ 'active-selection': employeeInteractionFlag == 'NEITHER' }"
					>
						<div class="info-icon"><mat-icon>person_off</mat-icon></div>
						My employee <strong>do not work</strong> with children or vulnerable adults
					</div>
				</div>
			</div>
			<mat-error style="text-align: center;" *ngIf="isDirtyAndInvalid">An option must be selected</mat-error>
		</div>
	`,
	styles: [],
})
export class VulnerableSectorQuestionComponent implements RegistrationFormStepComponent {
	employeeInteractionFlag: string | null = null;
	isDirtyAndInvalid = false;
	displayHelp1 = false;
	displayHelp2 = false;

	onDataChange(_val: string) {
		this.employeeInteractionFlag = _val;
		const isValid = this.isFormValid();
		this.isDirtyAndInvalid = !isValid;
	}

	getDataToSave(): any {
		return { employeeInteractionFlag: this.employeeInteractionFlag };
	}

	isFormValid(): boolean {
		const isValid = this.employeeInteractionFlag ? true : false;
		this.isDirtyAndInvalid = !isValid;
		return isValid;
	}

	onViewHelp1(event: any): void {
		this.displayHelp1 = !this.displayHelp1;
		event.stopPropagation();
	}

	onViewHelp2(event: any): void {
		this.displayHelp2 = !this.displayHelp2;
		event.stopPropagation();
	}
}
