import { Component } from '@angular/core';
import { RegistrationFormStepComponent } from '../org-registration.component';

export class VulnerableSectorQuestionModel {
	employeeInteractionFlag: string = '';
}

@Component({
	selector: 'app-vulnerable-sector-question',
	template: `
		<div class="step">
			<div class="title mb-5">
				Tell us a bit more about your employees:
				<div class="title__sub-title mt-2">
					To “Works With” means to have direct or unsupervised access to children and/or vulnerable adults.
				</div>
			</div>
			<div class="step-container row">
				<div class="col-md-3 col-sm-6 mb-3">
					<div
						class="step-container__box"
						(click)="onDataChange('CHILDREN')"
						[ngClass]="{ 'active-selection-whole': employeeInteractionFlag == 'CHILDREN' }"
					>
						<ng-container *ngIf="displayHelp1; else noHelp1">
							<div class="step-container__box__info">
								<mat-icon class="larger-icon" (click)="onViewHelp1($event)">close</mat-icon>
							</div>
							<div class="px-2 pb-3">
								<!-- <div class="step-container__box__help-wrapper pb-2 px-2  pb-sm-4 px-sm-4"> -->
								<div class="step-container__box__help-title mb-2">What does child mean?</div>
								<p>A child is a person who is under the age of 19.</p>
							</div>
						</ng-container>
						<ng-template #noHelp1>
							<div class="step-container__box__info">
								<mat-icon class="larger-icon" (click)="onViewHelp1($event)">help_outline</mat-icon>
							</div>
							<div class="px-2 pb-3">
								<div class="icon-container"><mat-icon>family_restroom</mat-icon></div>
								My employees work with <strong>children</strong>
							</div>
						</ng-template>
					</div>
				</div>
				<div class="col-md-3 col-sm-6 mb-3">
					<div
						class="step-container__box"
						(click)="onDataChange('ADULTS')"
						[ngClass]="{ 'active-selection-whole': employeeInteractionFlag == 'ADULTS' }"
					>
						<ng-container *ngIf="displayHelp2; else noHelp2">
							<div class="step-container__box__info">
								<mat-icon class="larger-icon" (click)="onViewHelp2($event)">close</mat-icon>
							</div>
							<div class="px-2 pb-3">
								<div class="step-container__box__help-title mb-2">What does vulnerable adult mean?</div>
								<p>A vulnerable adult is a person 19 and over who receives healthcare services that are not acute.</p>
								<p>Acute means short-term treatment for a severe injury or illness.</p>
							</div>
						</ng-container>
						<ng-template #noHelp2>
							<div class="step-container__box__info">
								<mat-icon class="larger-icon" (click)="onViewHelp2($event)">help_outline</mat-icon>
							</div>
							<div class="px-2 pb-3">
								<div class="icon-container"><mat-icon>elderly</mat-icon></div>
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
						[ngClass]="{ 'active-selection-whole': employeeInteractionFlag == 'CHILDREN_ADULTS' }"
					>
						<div class="icon-container"><mat-icon>diversity_3</mat-icon></div>
						My employees work with <strong>children and vulnerable adults</strong>
					</div>
				</div>
				<div class="col-md-3 col-sm-6 mb-3">
					<div
						class="step-container__box px-2 pb-3"
						style="padding-top: 32px;"
						(click)="onDataChange('NEITHER')"
						[ngClass]="{ 'active-selection-whole': employeeInteractionFlag == 'NEITHER' }"
					>
						<div class="icon-container"><mat-icon>person_off</mat-icon></div>
						My employee <strong>do not work</strong> with children or vulnerable adults
					</div>
				</div>
			</div>
			<mat-error style="text-align: center;" *ngIf="isDirtyAndInvalid">An option must be selected</mat-error>
		</div>
	`,
	styles: [
		`
			.icon-container {
				display: block;
				text-align: center;

				.mat-icon {
					color: var(--color-black);
					font-size: 50px !important;
					height: 50px !important;
					width: 50px !important;
				}
			}
		`,
	],
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

	clearCurrentData(): void {
		this.employeeInteractionFlag = null;
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
