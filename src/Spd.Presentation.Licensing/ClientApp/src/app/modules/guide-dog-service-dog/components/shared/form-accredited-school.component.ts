import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { ConfigService, DogSchoolResponseExt } from '@app/core/services/config.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-form-accredited-school',
	template: `
		<div class="text-minor-heading lh-base my-2">{{ schoolLabel }}</div>
		<mat-form-field>
			<mat-label> School Name </mat-label>
			<mat-select
				[formControl]="accreditedSchoolIdControl"
				[errorStateMatcher]="matcher"
				(selectionChange)="onSchoolChange($event)"
			>
				<mat-select-trigger>
					{{ selectedSchool?.schoolName }}
				</mat-select-trigger>

				<mat-option *ngFor="let item of accreditedDogSchools; let i = index" [value]="item.schoolId">
					<div class="my-3">
						<div class="school-name">{{ item.schoolName }}</div>
						<div class="school-address">{{ item.schoolAddress }}</div>
					</div>
				</mat-option>
			</mat-select>
			<mat-error *ngIf="accreditedSchoolIdControl?.hasError('required')">This is required</mat-error>
		</mat-form-field>

		<ng-container *ngIf="!selectedSchool">
			<app-alert type="info" icon="info">
				If your school is not in the list, please contact the Security Licencing Unit at {{ spdPhoneNumber }} during
				regular office hours.
			</app-alert>
		</ng-container>
	`,
	styles: [
		`
			.school-name {
				color: var(--color-primary);
			}

			.school-address {
				color: var(--color-grey);
			}
		`,
	],
	standalone: false,
})
export class FormAccreditedSchoolComponent implements OnInit {
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;
	matcher = new FormErrorStateMatcher();

	@Input() schoolLabel = 'Your Assistance Dogs International or International Guide Dog Federation Accredited School';
	@Input() accreditedSchoolIdControl!: FormControl;
	@Input() accreditedSchoolNameControl!: FormControl;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	accreditedDogSchools = this.configService.accreditedDogSchools;

	constructor(private configService: ConfigService) {}

	ngOnInit(): void {
		if (this.isRenewal) {
			this.accreditedSchoolIdControl.disable({ emitEvent: false });
		} else {
			this.accreditedSchoolIdControl.enable({ emitEvent: false });
		}
	}

	get selectedSchool(): DogSchoolResponseExt | null | undefined {
		return this.accreditedSchoolIdControl.value
			? this.accreditedDogSchools?.find((school) => school.schoolId === this.accreditedSchoolIdControl.value)
			: null;
	}

	onSchoolChange(_event: MatSelectChange): void {
		this.accreditedSchoolNameControl.setValue(this.selectedSchool?.schoolName);
	}

	get isRenewal(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}
}
