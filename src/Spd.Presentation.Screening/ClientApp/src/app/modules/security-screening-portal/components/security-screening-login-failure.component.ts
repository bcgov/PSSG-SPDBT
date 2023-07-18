import { Component } from '@angular/core';

@Component({
	selector: 'app-security-screening-login-failure',
	template: `
		<div class="d-flex justify-content-center">
			<div class="fail-image text-center">
				<img class="fail-image__item" src="/assets/login-no-identity.png" />
			</div>
		</div>

		<div class="row">
			<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12 mt-4 text-center">
				<div class="fw-normal fs-3">We’re sorry, we are unable to find your information in our records.</div>
			</div>
		</div>

		<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12">
			<div class="lead fs-5 mt-4">
				If you have not yet submitted a criminal record check application, please contact your organization to initiate
				the process.
			</div>
			<div class="lead fs-5 my-4">
				If you submitted a criminal record check application using your BC Services Card, please reach out to our client
				services team at <a href="mailto:criminalrecords@gov.bc.ca">criminalrecords@gov.bc.ca</a> or 1-855-587-0185
				(option 2) for further assistance.
			</div>
		</div>
	`,
	styles: [
		`
			.fail-image {
				max-height: 8em;
				border-radius: 50%;
				width: 400px;
				background: var(--color-grey-lighter);
				font: 32px Arial, sans-serif;

				&__item {
					margin-top: 15px;
					height: 5em;
				}
			}

			.text {
				font-weight: 700;
				line-height: 1.5em;
			}
		`,
	],
})
export class SecurityScreeningLoginFailureComponent {}
