import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-terms-text',
	template: `
		<div class="row">
			<div class="col-12">
				<div class="conditions px-3 mb-3" (scroll)="onScrollTermsAndConditions($event)">
					<p style="margin-top: .6rem;">
						<strong>Terms of Use for [Hiring Managers] Accessing the Organization Online Service Portal</strong>
					</p>
					<p>
						In these Terms of Use, "you" or "your" includes the hiring manager accessing or using the Organization
						Online Service Portal and the services offered within for the purpose of initiating the online criminal
						record check process for individual applicants (the "Site").
					</p>
					<p>
						These Terms of Use are an agreement between you and His Majesty the King in Right of the Province of British
						Columbia, represented by the Minister of Public Safety and Solicitor General (the "Province") and they
						govern your use of the Site.
					</p>
					<p>
						By clicking the box to indicate that you accept these Terms of Use, and in consideration of your use of the
						Site, you agree, to the terms and conditions set out below.
					</p>
					<p>
						Your failure to abide by these Terms of Use may result in the suspension or cancellation of your access to,
						or use of, the Site. In addition, the Province reserves the right to pursue any remedy available at law or
						in equity.
					</p>
					<p>Please print a copy of these Terms of Use for your records.</p>

					<ol>
						<strong class="terms-subtitle">Disclaimer:</strong>
						<li>
							THE SITE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND INCLUDING WARRANTY OF FITNESS FOR A PARTICULAR
							PURPOSE. USE OF THE SITE IS ENTIRELY AT YOUR OWN RISK, AND YOU WILL BE LIABLE FOR ANY FAILURE TO ABIDE BY
							THESE TERMS OF USE.
						</li>
						<li>
							WITHOUT LIMITING THE GENERAL NATURE OF THE FOREGOING, THE PROVINCE DOES NOT REPRESENT OR WARRANT THAT:
							<ol type="a">
								<li>
									THE ACCURACY, COMPLETENESS OR CURRENCY OF THE SITE OR ANY ASSOCIATED INFORMATION, OR THAT ANY ERRORS
									WILL BE CORRECTED.
								</li>
								<li>
									THE SITE WILL FUNCTION IN A TIMELY MANNER OR WILL BE AVAILABLE WITHOUT ERROR, FAILURE, OR
									INTERRUPTION; OR
								</li>
								<li>THE SITE WILL MEET YOUR EXPECTATIONS OR REQUIREMENTS.</li>
							</ol>
						</li>
						<strong class="terms-subtitle">Information Collection:</strong>
						<li>
							When you access or use the Site, certain types of information are automatically collected from you, by
							audit logs or cookies. This information is collected, used and disclosed in accordance with the Province’s
							<a href="https://www2.gov.bc.ca/gov/content/home/privacy" target="_blank">Privacy Policy</a>.
						</li>
						<li>
							The date and time of your acceptance of these Terms of Use will be logged. This will enable you to skip
							this step on future visits. However, if these Terms of Use are modified, they will be presented to you
							upon your next following visit, and you will need to accept the modified terms to continue to access the
							Site. Notwithstanding the foregoing, you are responsible for reviewing these Terms of Use on a regular
							basis to ensure that you are aware of any modifications that may have been made and your continued use of
							the Site constitutes your acceptance of any such modified Terms of Use.
						</li>
						<li>
							The information that you input on the Site may also be logged and attributed to you for verification
							purposes.
						</li>
						<strong class="terms-subtitle">Authentication:</strong>
						<li>You will be required to use your government IDIR to login, access or use the Site.</li>
						<li>You must be authenticated each time you access the Site.</li>
						<strong class="terms-subtitle">Warranty:</strong>
						<li>
							In accessing or using the Site, you represent and warrant that:
							<ol type="a">
								<li>You are at least 16 years of age; and</li>
								<li>You have the power and capacity to accept, execute and comply with these Terms of Use.</li>
							</ol>
						</li>
						<strong class="terms-subtitle">Acceptable Use and Security:</strong>
						<li>
							You must not:
							<ol type="a">
								<li>
									use the Site for any unlawful or inappropriate purpose, including hacking, data mining or other
									intrusion activities.
								</li>
								<li>
									input or upload any information which contains computer viruses such as Trojan horses, worms, time
									bombs or other computer programming routines that may damage or interfere with the performance or
									function of the Site.
								</li>
								<li>
									divulge, share, compromise or permit any other person to use your login and password to access the
									Site.
								</li>
								<li>
									take any action that might reasonably be construed as altering, destroying, defeating, compromising,
									or rendering ineffective the security related to the Site, or being likely to affect other users of
									the Site.
								</li>
								<li>attempt to collect any information about other users of the Site; or</li>
								<li>
									decompile, disassemble, reverse engineer, or otherwise copy any source code associated with the Site.
								</li>
							</ol>
						</li>
						<strong class="terms-subtitle">Ownership and Non-permitted Uses:</strong>
						<li>
							You acknowledge and agree that at all times the Province and its respective licensors are the owners of
							any software, hardware, servers, networks or other equipment used to make the Site available to you.
						</li>
						<li>
							You will not take any action that would be inconsistent with or infringe any proprietary or intellectual
							property rights of the Province, or its respective licensors, in any software, hardware, servers, networks
							or other equipment, documentation or other information used to make the Site available to you.
						</li>
						<li>
							You will not remove or alter any proprietary symbol or notice, including any copyright notice, trademark
							or logo displayed in connection with the Site.
						</li>
						<strong class="terms-subtitle">Suspension or Cancellation of Use of the Site:</strong>
						<li>
							Your use of the Site may be suspended or cancelled at any time if:
							<ol type="a">
								<li>the Province deems such suspension or cancellation necessary for any good and valid reason; or</li>
								<li>
									you fail to abide by these Terms of Use or other terms and conditions that may be posted on any
									website used to access the Site, or otherwise misuse the Site (collectively referred to as “Misuse”).
									<strong
										>Any Misuse will be reported to your organization for investigation and further action as deemed
										appropriate.</strong
									>
								</li>
							</ol>
						</li>
						<li>
							The Province reserves the right, at any time, to:
							<ol type="a">
								<li>make changes to the Site;</li>
								<li>stop making the Site available; and</li>
								<li>modify these Terms of Use at any time, without notice being provided directly to you.</li>
							</ol>
						</li>
						<strong class="terms-subtitle">Limitation of Liability:</strong>
						<li>
							In addition to the Province’s general
							<a href="https://www2.gov.bc.ca/gov/content/home/disclaimer" target="_blank">Limitation of Liabilities</a
							>, you agree that under no circumstances will the Province be liable to you or to any other individual or
							entity for any direct, indirect, special, incidental, consequential or other loss, claim, injury or
							damage, whether foreseeable or unforeseeable (including without limitation claims for damages for loss of
							profits or business opportunities, use of or inability to access or use the Site, interruptions, deletion
							or corruption of files, loss of programs or information, errors, defects or delays) arising out of or in
							any way connected with your or their access to or use of the Site or any failure by you or them to abide
							by these Terms of Use and whether based on contract, tort, strict liability or any other legal theory. The
							previous sentence will apply even if the Province has been specifically advised of the possibility of any
							such loss, claim, injury or damage.
						</li>
						<strong class="terms-subtitle">Enforceability and Jurisdiction:</strong>
						<li>
							If any term or provision of these Terms of Use is invalid, illegal, or unenforceable, all other terms and
							provisions of these Terms of Use will nonetheless remain in full force and effect.
						</li>
						<li>
							All access to, or use of, the Site will be governed by, and construed and interpreted in accordance with,
							the laws applicable in the Province of British Columbia, Canada.
						</li>
						<li>
							You hereby consent to the exclusive jurisdiction and venue of the courts of the Province of British
							Columbia, sitting in Victoria, for the hearing of any matter relating to or arising from these Terms of
							Use and/or your access to, or use of, the Site.
						</li>
					</ol>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.conditions {
				border: 1px solid var(--color-grey-light);
				max-height: 400px;
				overflow-y: auto;
				box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
			}
		`,
	],
})
export class TermsTextComponent {
	@Output() hasScrolledToBottom: EventEmitter<boolean> = new EventEmitter();

	onScrollTermsAndConditions(e: any) {
		if (e.target.scrollHeight < e.target.scrollTop + e.target.offsetHeight) {
			this.hasScrolledToBottom.emit(true);
		}
	}
}
