# SPD Business Transformation Project

[![Lifecycle:Stable](https://img.shields.io/badge/Lifecycle-Stable-97ca00)](Redirect-URL)

## Summary

Transforming SPD operations by modernizing business processes and the case management system to improve service accessibility and user-experience for staff and the 350,000 citizens who access SPD services each year.

This site is built with a .NET Core OData service serving as the backend. The frontend is developed using Angular, while the database is managed through Microsoft Dynamics.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Development](#backend-development)
  - [Frontend development - Angular](#frontend-development---angular)
- [Commit/branching](#commitbranching)
- [Application walkthrough](#application-walkthrough)
- [Usage](#usage)
- [Communication Channels](#communication-channels)
- [Additional Documentation](#additional-documentation)
- [Deployment](#deployment)

## Getting Started

### Prerequisites

1.  Visual Studio 2022 with .net 8.0 installed
2.  OData Connected Service 2022+ installed to visual studio as extension
3.  Angular 20 installed
4.  Create a fork of the repo from https://github.com/bcgov/PSSG-SPDBT
5.  Clone your forked git repository into a local directory

### Backend Development

    .NET 8.0 + OData Connected Service
    Open Spd.sln with Visual Studio and rebuild all

### Frontend development - Angular

refer to \src\Spd.Presentation.Screening\ClientApp\package.json

#### reinstall npm

```
npm install
```

#### start local app

```
npm run startlocal
```

#### regenerate api

```
npm run gen-api-all-local
```

if there is compiling error, we can reinstall npm.
Please delete package-lock.json and node_modules, then reinstall node modules with command

```
npm install
```

or

```
npm install --force
```

## Commit/branching

Each developer should create a feature branch for work on their forked repo that relates to the associated JIRA issue. (example: `username/SPDBT-1121`

## Application walkthrough

- ### Screening Portals:

  This portal is designed for criminal record checks (CRC), this portal offers multiple access points:

  - Organization Portal: Allows organizations to issue CRC invitations and manage both CRC applications and portal users.

  - IDIR User Access: Enables IDIR users to log in, issue CRC invitations, and manage CRC cases as RSA users.

  - Public Applicant Portal: Lets applicants view and manage their own CRC cases.

  - for specific info, please refer to [Security Screening - CRRP & PSSO Requirements](https://wiki.justice.gov.bc.ca/wiki/spaces/SPDBT/pages/78291639/Security+Screening+-+CRRP+PSSO)

- ### Licensing Portals:

  This portal is designed to support both individuals and security businesses in applying for the appropriate security licences. It provides multiple access points:

  - Business Portal: Enables security businesses to new, renew, replace, and update their business licences.

  - Individual Portal: Allows individuals to apply new, renew, replace, and update their Security Worker licences, as well as Armoured Vehicle and Body Armour permits.

  - for specific info, please refer to [Security Service - Licensing Requirements](https://wiki.justice.gov.bc.ca/wiki/spaces/SPDBT/pages/78287703/Security+Services+-+Licensing)

- ### MDRA Portal:

  This portal is designed to support Metal dealers and recyclers to register as a Metal Recycling Dealer

  - for specific info, please refer to [MDRA - Requirements](https://wiki.justice.gov.bc.ca/wiki/spaces/SPDBT/pages/78284549/Metal+Dealers+Program)

- ### GDSD Portal:

  This portal is designed to support guide and service dogs and their handlers, dog trainer, retired dog to get certified.

  - for specific info, please refer to [Guide Dog Service Dog Requirements](https://wiki.justice.gov.bc.ca/wiki/spaces/SPDBT/pages/78329681/Guide+Dogs+Service+Dogs)

- ### Dynamics Helper API:

  This is internal API mainly for dynamics to use.

  - provide File storage api to access s3
  - provide API to generate invitation
  - provide refund, invoice payment api
  - provide API to print with BCMP
  - provide API to support schedule job

## Usage

The application can be accessed using the links below:

| Prod                                                                                                     | Test                                                                                                                                 | Dev                                                                                                                                | Staging                                                                                                                                    | Training                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| [Screening Main Portal](https://justice.gov.bc.ca/screening/)                                            | [Test - Screening Portal](https://test-spd.apps.emerald.devops.gov.bc.ca/screening/)                                                 | [Dev - Screening Portal](https://dev-spd.apps.emerald.devops.gov.bc.ca/screening/)                                                 | [Staging - Screening Portal](https://staging-spd.apps.emerald.devops.gov.bc.ca/screening/)                                                 | [Training - Screening Portal](https://spd-train.justice.gov.bc.ca/screening/)                                                                |
| [Screening Applicant Portal](https://justice.gov.bc.ca/screening/security-screening/crc-list)            | [Test - Screening Applicant Portal](https://test-spd.apps.emerald.devops.gov.bc.ca/screening/security-screening/crc-list)            | [Dev - Screening Applicant Portal](https://dev-spd.apps.emerald.devops.gov.bc.ca/screening/security-screening/crc-list)            | [Staging - Screening Applicant Portal](https://staging-spd.apps.emerald.devops.gov.bc.ca/screening/security-screening/crc-list)            | [Training - Screening Applicant Portal](https://spd-train.justice.gov.bc.ca/screening/security-screening/crc-list)                           |
| [Screening Direct CRC Portal](https://justice.gov.bc.ca/screening/crrpa/org-access)                      | [Test - Screening Direct CRC Portal](https://test-spd.apps.emerald.devops.gov.bc.ca/screening/crrpa/org-access)                      | [Dev - Screening Direct CRC Portal](https://dev-spd.apps.emerald.devops.gov.bc.ca/screening/crrpa/org-access)                      | [Staging - Screening Direct CRC Portal](https://staging-spd.apps.emerald.devops.gov.bc.ca/screening/crrpa/org-access)                      | [Training - Screening Direct CRC Portal](https://spd-train.justice.gov.bc.ca/screening/crrpa/org-access)                                     |
| [Licensing Portal](https://justice.gov.bc.ca/security/)                                                  | [Test - Licensing Portal](https://test-spd.apps.emerald.devops.gov.bc.ca/security/)                                                  | [Dev - Licensing Portal](https://dev-spd.apps.emerald.devops.gov.bc.ca/security/)                                                  | [Staging - Licensing Portal](https://staging-spd.apps.emerald.devops.gov.bc.ca/security/)                                                  | [Training - Licensing Portal](https://training-spd.apps.emerald.devops.gov.bc.ca/security/)                                                  |
| [Licensing Verification Portal](https://justice.gov.bc.ca/security/security-licence-status-verification) | [Test - Licensing Verification Portal](https://test-spd.apps.emerald.devops.gov.bc.ca/security/security-licence-status-verification) | [Dev - Licensing Verification Portal](https://dev-spd.apps.emerald.devops.gov.bc.ca/security/security-licence-status-verification) | [Staging - Licensing Verification Portal](https://staging-spd.apps.emerald.devops.gov.bc.ca/security/security-licence-status-verification) | [Training - Licensing Verification Portal](https://training-spd.apps.emerald.devops.gov.bc.ca/security/security-licence-status-verification) |
| [MDRA Portal](https://justice.gov.bc.ca/security/metal-dealers-and-recyclers)                            | [Test - MDRA Portal](https://test-spd.apps.emerald.devops.gov.bc.ca/security/metal-dealers-and-recyclers)                            | [Dev - Licensing Portal](https://dev-spd.apps.emerald.devops.gov.bc.ca/security/metal-dealers-and-recyclers)                       | [Staging - MDRA Portal](https://staging-spd.apps.emerald.devops.gov.bc.ca/security/metal-dealers-and-recyclers)                            | [Training - MDRA Portal](https://training-spd.apps.emerald.devops.gov.bc.ca/security/metal-dealers-and-recyclers)                            |
| [GDSD Portal](https://justice.gov.bc.ca/guide-dog-service-dog/)                                          | [Test - GDSD Portal](https://test-spd.apps.emerald.devops.gov.bc.ca/guide-dog-service-dog/)                                          | [Dev - MDRA Portal](https://dev-spd.apps.emerald.devops.gov.bc.ca/guide-dog-service-dog/)                                          | [Staging - GDSD Portal](https://staging-spd.apps.emerald.devops.gov.bc.ca/guide-dog-service-dog/)                                          | [Training - GDSD Portal](https://training-spd.apps.emerald.devops.gov.bc.ca/guide-dog-service-dog/)                                          |
| Dynamics Helper API - Not Accessible                                                                     | Test - Dynamics Helper API - Not Accessible                                                                                          | [Dev - API Docs](<(https://dev-spd-dynamics-helper.apps.emerald.devops.gov.bc.ca/swagger/index.html)>)                             | Staging - Dynamics Helper API - Not Accessible                                                                                             | Training - Dynamics Helper API - Not Accessible                                                                                              |

## Configuration

- For Screening, Licensing and GDSD portal, we support Maintenance Mode.
  Set MaintenanceMode to true, then user only see maintenance page.

```
 "MaintenanceMode": false,
```

- For licensing, we support one bceid has multiple business accounts. So for licensing prod, we need to set

```
"OneOrgGuidHasOneBizLicencePortal": true,
```

## Additional Documentation

Please refer to [SPD Business Transformation Project](https://wiki.justice.gov.bc.ca/wiki/spaces/SPDBT/overview) for requirements, project milestones and technical design.

## Deployment

For deployment and content sync information, contact [James Bradbury](mailto:james.bradbury@gov.bc.ca)

## Contributing

Contributions are welcome! Please fork the repo and submit a pull request.

## Credits

Thanks to all contributors ( Carol Carpenter, Peggy Zhang, and Yossi Tamari etc.) and third-party libraries.
