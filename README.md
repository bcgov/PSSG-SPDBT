# SPD Business Transformation Project

[![Lifecycle:Stable](https://img.shields.io/badge/Lifecycle-Stable-97ca00)](Redirect-URL)

## Summary

Transforming SPD operations by modernizing business processes and the case management system to improve service accessibility and user-experience for staff and the 350,000 citizens who access SPD services each year.

This site is built with a .NET Core OData service serving as the backend. The frontend is developed using Angular, while the database is managed through Microsoft Dynamics.

## Table of Contents

- [Env Links](#env-links)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Development - Strapi Localhost](#backend-development---strapi-localhost)
  - [Frontend development - Gatsby](#frontend-development---gatsby)
  - [Staff Portal development](#staff-portal-development)
- [Commit/branching](#commitbranching)
- [Application walkthrough](#application-walkthrough)
- [Communication Channels](#communication-channels)
- [Additional Documentation](#additional-documentation)
- [Deployment](#deployment)

## Env Links

The application can be accessed using the links below:

| Prod                                                                                          | Test                                                                                                                      | Dev                                                                                                                     | Staging                                                                                                                         | Training                                                                                                           |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [Screening Portal](https://justice.gov.bc.ca/screening/)                                      | [Test - Screening Portal](https://test-spd.apps.emerald.devops.gov.bc.ca/screening/)                                      | [Dev - Screening Portal](https://dev-spd.apps.emerald.devops.gov.bc.ca/screening/)                                      | [Staging - Screening Portal](https://staging-spd.apps.emerald.devops.gov.bc.ca/screening/)                                      | [Training - Screening Portal](https://spd-train.justice.gov.bc.ca/screening/)                                      |
| [Licensing Portal](https://justice.gov.bc.ca/security/)                                       | [Test - Licensing Portal](https://test-spd.apps.emerald.devops.gov.bc.ca/security/)                                       | [Dev - Licensing Portal](https://dev-spd.apps.emerald.devops.gov.bc.ca/security/)                                       | [Staging - Licensing Portal](https://staging-spd.apps.emerald.devops.gov.bc.ca/security/)                                       | [Training - Licensing Portal](https://training-spd.apps.emerald.devops.gov.bc.ca/security/)                        |
| [GDSD Portal](https://justice.gov.bc.ca/guide-dog-service-dog/)                               | [Test - GDSD Portal](https://test-spd.apps.emerald.devops.gov.bc.ca/guide-dog-service-dog/)                               | [Dev - GDSD Portal](https://dev-spd.apps.emerald.devops.gov.bc.ca/guide-dog-service-dog/)                               | [Staging - GDSD Portal](https://staging-spd.apps.emerald.devops.gov.bc.ca/guide-dog-service-dog/)                               | [Training - GDSD Portal](https://training-spd.apps.emerald.devops.gov.bc.ca/guide-dog-service-dog/)                |
| Dynamics Helper API - Not Accessible                                                          | Test - Dynamics Helper API - Not Accessible                                                                               | [Dev - API Docs](<(https://dev-spd-dynamics-helper.apps.emerald.devops.gov.bc.ca/swagger/index.html)>)                  | Staging - Dynamics Helper API - Not Accessible                                                                                  | Training - Dynamics Helper API - Not Accessible                                                                    |
| [Screening Applicant Portal](https://justice.gov.bc.ca/screening/security-screening/crc-list) | [Test - Screening Applicant Portal](https://test-spd.apps.emerald.devops.gov.bc.ca/screening/security-screening/crc-list) | [Dev - Screening Applicant Portal](https://dev-spd.apps.emerald.devops.gov.bc.ca/screening/security-screening/crc-list) | [Staging - Screening Applicant Portal](https://staging-spd.apps.emerald.devops.gov.bc.ca/screening/security-screening/crc-list) | [Training - Screening Applicant Portal](https://spd-train.justice.gov.bc.ca/screening/security-screening/crc-list) |

## Getting Started

Running a local environment allows users to quickly see changes without waiting for a full build (10+ minutes). The local environment setup described below uses Gatsby JS to render the site frontend locally, and you can choose to set up a local Strapi CMS instance or use an external Strapi CMS instance (TEST or PROD) as the datasource.

IMPORTANT: this process is not currently working on Windows without virtualisation. It is known to work on OS X, and inside a Linux container running in VMWare Player.

### Prerequisites

1.  Ensure you have a command-line shell (like PowerShell, iTerm or the terminal integrated with Visual Studio Code) and Node JS 18 installed.

2.  If you're running Strapi locally, you'll need to have [Docker](https://www.docker.com) installed.

3.  Create a fork of the repo from https://github.com/bcgov/bcparks.ca
4.  Clone your forked git repository into a local directory

### Backend Development - Strapi Localhost

- [Strapi setup instructions](src/cms/README.md)

### Frontend development - Gatsby

- [Gatsby setup instructions](src/gatsby/README.md)

### Staff Portal development

- [Staff portal setup instructions](src/admin/README.md)

## Commit/branching

Each developer should create a feature branch for work on their forked repo that relates to the associated JIRA issue. (example: `username/bcparks.ca/CM-123-brief-description`

Ensure you've added the upstream repo on your local:
`git remote add upstream git@github.com:bcgov/bcparks.ca.git`

Prior to creating a PR, it's good practice to sync your fork with the upstream repo. `git checkout main` and then `git pull upstream main` followed by checking out your branch and then running `git rebase main`

Alternatively, you could do this in GitHub, and use the 'Sync fork' button in your forked repo, and then pull it into your local.

## Application walkthrough

For detailed instructions on how to perform common tasks in the CMS, contact [Leah Wilcock](mailto:Leah.Wilcock@gov.bc.ca), Manager of Information Services.

## Communication Channels

Most communications are handled through the BC Parks Service Transformation Microsoft Teams instance. Please reach out to your Project Manager for access.

## Additional Documentation

Coming soon.

## Deployment

For deployment and content sync information, contact [Leah Wilcock](mailto:Leah.Wilcock@gov.bc.ca), Manager of Information Services.

# PSSG-SPDBT

## front-end commands

refer to \src\Spd.Presentation.Screening\ClientApp\package.json

### reinstall npm

```
npm install
```

### start local app

```
npm run startlocal
```

### regenerate api

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
