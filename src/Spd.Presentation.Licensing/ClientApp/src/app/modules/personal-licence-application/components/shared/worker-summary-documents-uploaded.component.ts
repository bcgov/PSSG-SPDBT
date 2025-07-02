import { Component, Input } from '@angular/core';
import { WorkerCategoryTypeCode } from '@app/api/models';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
    selector: 'app-worker-summary-document-uploaded',
    template: `
		@if (isAnyDocuments) {
		  <mat-divider class="mt-3 mb-2"></mat-divider>
		  <div class="text-minor-heading-small">Documents Uploaded</div>
		  <div class="row mt-0">
		    @if (showArmouredCarGuard) {
		      <div class="col-lg-6 col-md-12">
		        <div class="text-label d-block text-muted">
		          {{ categoryTypeCodes.ArmouredCarGuard | options: 'WorkerCategoryTypes' }} Documents
		        </div>
		        <div class="summary-text-data">
		          <ul class="m-0">
		            @for (doc of categoryArmouredCarGuardAttachments; track doc; let i = $index) {
		              <li>{{ doc.name }}</li>
		            }
		          </ul>
		        </div>
		      </div>
		    }
		    @if (showFireInvestigator) {
		      <div class="col-lg-6 col-md-12">
		        <div class="text-label d-block text-muted">
		          {{ categoryTypeCodes.FireInvestigator | options: 'WorkerCategoryTypes' }} Documents
		        </div>
		        <div class="summary-text-data">
		          <ul class="m-0">
		            @for (doc of categoryFireInvestigatorCertificateAttachments; track doc; let i = $index) {
		              <li>{{ doc.name }}</li>
		            }
		          </ul>
		          <ul class="m-0">
		            @for (doc of categoryFireInvestigatorLetterAttachments; track doc; let i = $index) {
		              <li>{{ doc.name }}</li>
		            }
		          </ul>
		        </div>
		      </div>
		    }
		    @if (showLocksmith) {
		      <div class="col-lg-6 col-md-12">
		        <div class="text-label d-block text-muted">
		          {{ categoryTypeCodes.Locksmith | options: 'WorkerCategoryTypes' }} Documents
		        </div>
		        <div class="summary-text-data">
		          <ul class="m-0">
		            @for (doc of categoryLocksmithAttachments; track doc; let i = $index) {
		              <li>{{ doc.name }}</li>
		            }
		          </ul>
		        </div>
		      </div>
		    }
		    @if (showPrivateInvestigator) {
		      <div class="col-lg-6 col-md-12">
		        <div class="text-label d-block text-muted">
		          {{ categoryTypeCodes.PrivateInvestigator | options: 'WorkerCategoryTypes' }}
		          Documents
		        </div>
		        <div class="summary-text-data">
		          <div class="summary-text-data">
		            <ul class="m-0">
		              @for (doc of categoryPrivateInvestigatorAttachments; track doc; let i = $index) {
		                <li>{{ doc.name }}</li>
		              }
		            </ul>
		            <ul class="m-0">
		              @for (doc of categoryPrivateInvestigatorTrainingAttachments; track doc; let i = $index) {
		                <li>{{ doc.name }}</li>
		              }
		            </ul>
		          </div>
		        </div>
		      </div>
		    }
		    @if (showPrivateInvestigatorUnderSupervision) {
		      <div class="col-lg-6 col-md-12">
		        <div class="text-label d-block text-muted">
		          {{ categoryTypeCodes.PrivateInvestigatorUnderSupervision | options: 'WorkerCategoryTypes' }}
		          Documents
		        </div>
		        <div class="summary-text-data">
		          <ul class="m-0">
		            @for (doc of categoryPrivateInvestigatorUnderSupervisionAttachments; track doc; let i = $index) {
		              <li>{{ doc.name }}</li>
		            }
		          </ul>
		        </div>
		      </div>
		    }
		    @if (showSecurityAlarmInstaller) {
		      <div class="col-lg-6 col-md-12">
		        <div class="text-label d-block text-muted">
		          {{ categoryTypeCodes.SecurityAlarmInstaller | options: 'WorkerCategoryTypes' }}
		          Documents
		        </div>
		        <div class="summary-text-data">
		          <ul class="m-0">
		            @for (doc of categorySecurityAlarmInstallerAttachments; track doc; let i = $index) {
		              <li>{{ doc.name }}</li>
		            }
		          </ul>
		        </div>
		      </div>
		    }
		    @if (showSecurityConsultant) {
		      <div class="col-lg-6 col-md-12">
		        <div class="text-label d-block text-muted">
		          {{ categoryTypeCodes.SecurityConsultant | options: 'WorkerCategoryTypes' }} Documents
		        </div>
		        <div class="summary-text-data">
		          <ul class="m-0">
		            @for (doc of categorySecurityConsultantAttachments; track doc; let i = $index) {
		              <li>{{ doc.name }}</li>
		            }
		          </ul>
		          <ul class="m-0">
		            @for (doc of categorySecurityConsultantResumeAttachments; track doc; let i = $index) {
		              <li>{{ doc.name }}</li>
		            }
		          </ul>
		        </div>
		      </div>
		    }
		    @if (showSecurityGuard) {
		      <div class="col-lg-6 col-md-12">
		        <div class="text-label d-block text-muted">
		          {{ categoryTypeCodes.SecurityGuard | options: 'WorkerCategoryTypes' }} Documents
		        </div>
		        <div class="summary-text-data">
		          <ul class="m-0">
		            @for (doc of categorySecurityGuardAttachments; track doc; let i = $index) {
		              <li>{{ doc.name }}</li>
		            }
		          </ul>
		        </div>
		      </div>
		    }
		  </div>
		}
		`,
    styles: [],
    standalone: false
})
export class WorkerSummaryDocumentsUploadedComponent {
	categoryTypeCodes = WorkerCategoryTypeCode;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	@Input() workerModelData: any;

	get isAnyDocuments(): boolean {
		return this.workerApplicationService.getSummaryisAnyDocuments(this.workerModelData);
	}

	get showArmouredCarGuard(): boolean {
		return this.workerApplicationService.getSummaryshowArmouredCarGuard(this.workerModelData);
	}
	get showFireInvestigator(): boolean {
		return this.workerApplicationService.getSummaryshowFireInvestigator(this.workerModelData);
	}
	get showLocksmith(): boolean {
		return this.workerApplicationService.getSummaryshowLocksmith(this.workerModelData);
	}
	get showPrivateInvestigator(): boolean {
		return this.workerApplicationService.getSummaryshowPrivateInvestigator(this.workerModelData);
	}
	get showPrivateInvestigatorUnderSupervision(): boolean {
		return this.workerApplicationService.getSummaryshowPrivateInvestigatorUnderSupervision(this.workerModelData);
	}
	get showSecurityAlarmInstaller(): boolean {
		return this.workerApplicationService.getSummaryshowSecurityAlarmInstaller(this.workerModelData);
	}
	get showSecurityConsultant(): boolean {
		return this.workerApplicationService.getSummaryshowSecurityConsultant(this.workerModelData);
	}
	get showSecurityGuard(): boolean {
		return this.workerApplicationService.getSummaryshowSecurityGuard(this.workerModelData);
	}
	get categoryArmouredCarGuardAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryArmouredCarGuardAttachments(this.workerModelData);
	}
	get categoryFireInvestigatorCertificateAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryFireInvestigatorCertificateAttachments(this.workerModelData);
	}
	get categoryFireInvestigatorLetterAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryFireInvestigatorLetterAttachments(this.workerModelData);
	}
	get categoryLocksmithAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryLocksmithAttachments(this.workerModelData);
	}
	get categorySecurityGuardAttachments(): File[] {
		return this.workerApplicationService.getSummarycategorySecurityGuardAttachments(this.workerModelData);
	}
	get categorySecurityConsultantAttachments(): File[] {
		return this.workerApplicationService.getSummarycategorySecurityConsultantAttachments(this.workerModelData);
	}
	get categorySecurityConsultantResumeAttachments(): File[] {
		return this.workerApplicationService.getSummarycategorySecurityConsultantResumeAttachments(this.workerModelData);
	}
	get categorySecurityAlarmInstallerAttachments(): File[] {
		return this.workerApplicationService.getSummarycategorySecurityAlarmInstallerAttachments(this.workerModelData);
	}
	get categoryPrivateInvestigatorAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryPrivateInvestigatorAttachments(this.workerModelData);
	}
	get categoryPrivateInvestigatorTrainingAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryPrivateInvestigatorTrainingAttachments(this.workerModelData);
	}
	get categoryPrivateInvestigatorFireCertificateAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryPrivateInvestigatorFireCertificateAttachments(
			this.workerModelData
		);
	}
	get categoryPrivateInvestigatorFireLetterAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryPrivateInvestigatorFireLetterAttachments(
			this.workerModelData
		);
	}
	get categoryPrivateInvestigatorUnderSupervisionAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryPrivateInvestigatorUnderSupervisionAttachments(
			this.workerModelData
		);
	}
}
