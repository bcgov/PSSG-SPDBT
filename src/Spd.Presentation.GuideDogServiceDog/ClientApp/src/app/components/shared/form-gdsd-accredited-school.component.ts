import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { ConfigService, DogSchoolResponseExt } from '@app/core/services/config.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';

@Component({
	selector: 'app-form-gdsd-accredited-school',
	template: `
		<div class="text-minor-heading lh-base my-2">{{ schoolLabel }}</div>
		<mat-form-field>
		  <mat-label>School Name</mat-label>
		  <input matInput [formControl]="accreditedSchoolIdControl" [matAutocomplete]="auto" (blur)="onSchoolIdBlur()" />
		  <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn">
		    @for (field of filteredOptions | async; track field) {
		      <mat-option [value]="field.schoolId">
		        <div class="school-name mt-2">{{ field.schoolName }}</div>
		        <div class="school-address mb-2">{{ field.schoolAddress }}</div>
		      </mat-option>
		    }
		  </mat-autocomplete>
		  @if (!isRenewal) {
		    <mat-icon style="padding: 16px 8px 0 0;" matSuffix>search</mat-icon>
		  }
		  @if (!isRenewal) {
		    <mat-hint> Start typing name of school or address </mat-hint>
		  }
		  @if (accreditedSchoolIdControl?.hasError('required')) {
		    <mat-error> This is required </mat-error>
		  }
		</mat-form-field>
		
		@if (!isRenewal) {
		  <div class="mt-4">
		    <app-alert type="info" icon="info">
		      If your school is not in the list, please contact the Security Licencing Unit at {{ spdPhoneNumber }} during
		      regular office hours.
		    </app-alert>
		  </div>
		}
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
export class FormGdsdAccreditedSchoolComponent implements OnInit {
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;
	matcher = new FormErrorStateMatcher();

	@Input() schoolLabel = 'Your Assistance Dogs International or International Guide Dog Federation Accredited School';
	@Input() accreditedSchoolIdControl!: FormControl;
	@Input() accreditedSchoolNameControl!: FormControl;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	accreditedDogSchools = this.configService.accreditedDogSchools;
	filteredOptions!: Observable<DogSchoolResponseExt[]>;

	constructor(private configService: ConfigService) {}

	ngOnInit(): void {
		if (this.isRenewal) {
			this.accreditedSchoolIdControl.disable({ emitEvent: false });
		} else {
			this.accreditedSchoolIdControl.enable({ emitEvent: false });
		}

		this.filteredOptions = this.accreditedSchoolIdControl.valueChanges.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			map((value) => {
				const searchValue =
					typeof value === 'number' || typeof value === 'string' ? this.getName(value) || value : value;
				return this._filterAccreditedSchool(searchValue?.toString());
			})
		);
	}

	onSchoolIdBlur(): void {
		const inputText = this.displayFn(this.accreditedSchoolIdControl.value)?.trim();
		const matchedSchool = this.accreditedDogSchools?.find(
			(s) => s.schoolName?.toLowerCase() === inputText.toLowerCase()
		);
		if (matchedSchool) {
			this.accreditedSchoolIdControl.setValue(matchedSchool.schoolId);
			this.accreditedSchoolNameControl.setValue(matchedSchool.schoolName);
		} else {
			this.accreditedSchoolIdControl.setValue(null);
			this.accreditedSchoolNameControl.setValue(null);
		}
	}

	getName(id: number | string): string {
		if (typeof id !== 'number' && typeof id !== 'string') return '';

		const match = this.accreditedDogSchools?.find((o) => o.schoolId == id);
		return match ? match.schoolName! : '';
	}

	displayFn = (id: number): string => {
		return this.getName(id);
	};

	private _filterAccreditedSchool(value: string): DogSchoolResponseExt[] {
		if (!value) {
			return this.accreditedDogSchools!;
		}

		const filterValue = value.toLowerCase();
		return (
			this.accreditedDogSchools?.filter(
				(option: DogSchoolResponseExt) =>
					option.schoolName?.toLowerCase().includes(filterValue) ||
					option.schoolAddress?.toLowerCase().includes(filterValue)
			) ?? []
		);
	}

	get isRenewal(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}
}
