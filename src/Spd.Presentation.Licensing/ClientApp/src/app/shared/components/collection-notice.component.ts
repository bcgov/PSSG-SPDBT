import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-collection-notice',
	template: `
		<app-alert type="info" icon="" [showBorder]="false">
			<div class="mb-2">COLLECTION NOTICE</div>
			All information regarding this application is collected under the <i>{{ collectionNoticeActName }}</i> and its
			Regulation and will be used for that purpose. The use of this information will comply with the
			<i>Freedom of Information</i> and <i>Privacy Act</i> and the federal <i>Privacy Act</i>. If you have any questions
			regarding the collection or use of this information, please contact
			<a href="mailto:securitylicensing@gov.bc.ca" class="email-address-link">securitylicensing&#64;gov.bc.ca</a>
		</app-alert>
	`,
	styles: [],
})
export class CollectionNoticeComponent {
	@Input() collectionNoticeActName = 'Security Services Act';
}
