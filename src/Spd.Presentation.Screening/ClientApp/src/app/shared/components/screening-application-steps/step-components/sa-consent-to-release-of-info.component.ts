import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AppInviteOrgData, CrcFormStepComponent } from '../screening-application.model';

@Component({
	selector: 'app-sa-consent-to-release-of-info',
	template: `
		<section class="step-section p-3">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title title="Consent to a Criminal Record Check"></app-step-title>

					<ng-container *ngIf="orgData?.isCrrpa; else isPssoa">
						<div class="row">
							<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
								<mat-checkbox formControlName="agreeToCriminalCheck">
									I hereby consent to a criminal record check pursuant to the Criminal Records Review Act (CRRA) to
									determine whether I have a conviction or outstanding charge for any relevant or specified offence(s)
									as defined under that ACT (CRRA check). I hereby consent to a check of available law enforcement
									systems as further described below, including any local police records.
								</mat-checkbox>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('agreeToCriminalCheck')?.dirty || form.get('agreeToCriminalCheck')?.touched) &&
										form.get('agreeToCriminalCheck')?.invalid &&
										form.get('agreeToCriminalCheck')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>

						<div class="row">
							<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
								<mat-checkbox formControlName="agreeToVulnerableSectorSearch">
									I hereby consent to a Vulnerable Sector search to check if I have been convicted if I have been
									convicted of and received a record suspension (formerly known as a pardon) for any sexual offences as
									per the Criminal Records Act.
								</mat-checkbox>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('agreeToVulnerableSectorSearch')?.dirty ||
											form.get('agreeToVulnerableSectorSearch')?.touched) &&
										form.get('agreeToVulnerableSectorSearch')?.invalid &&
										form.get('agreeToVulnerableSectorSearch')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>
					</ng-container>

					<ng-template #isPssoa> isPssoa </ng-template>
				</div>
			</form>
		</section>
	`,
	styles: [
		`
			li:not(:last-child) {
				margin-bottom: 1em;
			}

			.conditions {
				border: 1px solid var(--color-grey-light);
				max-height: 300px;
				overflow-y: auto;
				box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
				font-size: smaller;
			}
		`,
	],
})
export class SaConsentToReleaseOfInfoComponent implements CrcFormStepComponent {
	@Input() orgData: AppInviteOrgData | null = null;
	@Input() resetRecaptcha: Subject<void> = new Subject<void>();

	form: FormGroup = this.formBuilder.group({
		agreeToCriminalCheck: new FormControl(null, [Validators.requiredTrue]),
		agreeToVulnerableSectorSearch: new FormControl(null, [Validators.requiredTrue]),
	});

	constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) {}

	getDataToSave(): any {
		return {
			...this.form.value,
		};
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
