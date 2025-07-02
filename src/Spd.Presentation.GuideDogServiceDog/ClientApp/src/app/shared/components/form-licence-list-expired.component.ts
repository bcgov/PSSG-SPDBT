/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MainLicenceResponse } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-form-licence-list-expired',
	template: `
		@if (expiredLicences.length > 0) {
		  <div class="mb-3">
		    <div class="text-minor-heading py-3">Expired {{ serviceLabelTitle }}</div>
		    @for (licence of expiredLicences; track licence; let i = $index) {
		      <div
		        class="summary-card-section summary-card-section__red mb-2 px-4 py-3"
		        >
		        <div class="row">
		          <div class="col-lg-2">
		            <div class="text-minor-heading">
		              {{ licence.serviceTypeCode | options: 'ServiceTypes' }}
		            </div>
		          </div>
		          <div class="col-lg-10">
		            <div class="row">
		              <div class="col-lg-3">
		                <div class="d-block text-muted mt-2 mt-lg-0">{{ serviceLabel }} Number</div>
		                <div class="text-data">{{ licence.licenceNumber }}</div>
		              </div>
		              <div class="col-lg-3">
		                <div class="d-block text-muted mt-2 mt-lg-0">{{ serviceLabel }} Term</div>
		                <div class="text-data">{{ licence.licenceTermCode | options: 'LicenceTermTypes' }}</div>
		              </div>
		              <div class="col-lg-3">
		                <div class="d-block text-muted mt-2 mt-lg-0">Expiry Date</div>
		                <div class="text-data">
		                  {{ licence.expiryDate | formatDate: formalDateFormat }}
		                </div>
		              </div>
		              <div class="col-lg-3 text-end">
		                <mat-chip-option [selectable]="false" class="licence-chip-option mat-chip-red">
		                  <mat-icon class="licence-chip-option-item">cancel</mat-icon>
		                  <span class="licence-chip-option-item ms-2 fs-5">Expired</span>
		                </mat-chip-option>
		              </div>
		            </div>
		            @if (licence.isExpiredLicenceRenewable) {
		              <div class="row mt-2">
		                <mat-divider class="my-2"></mat-divider>
		                <div class="col-lg-9">
		                  <div class="text-data fw-bold">
		                    An expired certificate can be renewed if it is within 6 months of the expiry date.
		                  </div>
		                </div>
		                <div class="col-lg-3 text-end">
		                  <button
		                    mat-flat-button
		                    color="primary"
		                    class="large my-2"
		                    aria-label="Renew the certificate"
		                    (click)="onRenew(licence)"
		                    >
		                    <mat-icon>restore</mat-icon>Renew
		                  </button>
		                </div>
		              </div>
		            }
		          </div>
		        </div>
		      </div>
		    }
		  </div>
		}
		`,
	styles: [
		`
			.licence-chip-option {
				height: 35px;
			}

			.licence-chip-option-item {
				vertical-align: text-bottom;
			}
		`,
	],
	standalone: false,
})
export class FormLicenceListExpiredComponent {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;

	serviceLabelTitle = 'Certificates';
	serviceLabel = 'Certificate';

	@Input() expiredLicences!: Array<MainLicenceResponse>;

	@Output() renewLicence: EventEmitter<MainLicenceResponse> = new EventEmitter();

	onRenew(licence: MainLicenceResponse): void {
		this.renewLicence.emit(licence);
	}
}
