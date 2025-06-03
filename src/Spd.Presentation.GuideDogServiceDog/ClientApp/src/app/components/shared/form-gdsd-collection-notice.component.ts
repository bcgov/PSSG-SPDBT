import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-form-gdsd-collection-notice',
	template: `
		<app-alert type="success" icon="">
			<div class="mb-2">COLLECTION NOTICE</div>
			<p>
				The Security Programs Division will collect your personal information for the purpose of fulfilling the
				requirements of the <i>Guide Dog and Service Dog Act</i> and its Regulation in accordance with s. 26(c) and s.
				27 (1) (b) of the <i>Freedom of Information and Protection of Privacy Act</i> (FoIPPA). The use and disclosure
				of this information will comply with FoIPPA. If you have questions regarding the collection, use or disclosure
				of this information, please contact a Policy Analyst at
				<a aria-label="Send email to SPD Policy" href="mailto:SPD.Policy@gov.bc.ca" class="email-address-link"
					>SPD.Policy&#64;gov.bc.ca</a
				>
			</p>
		</app-alert>
	`,
	styles: [],
	standalone: false,
})
export class FormGdsdCollectionNoticeComponent {
	@Input() collectionNoticeActName = 'Security Services Act';
}
