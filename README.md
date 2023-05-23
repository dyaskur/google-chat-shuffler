# Google Chat RandomBot

#### Chat app that can be used to random google chat space member or anything else

[![StyleCI](https://github.styleci.io/repos/641918189/shield?branch=master)](https://styleci.io/repos/641918189)
[![Github Action](https://github.com/dyaskur/google-chat-shuffler/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/dyaskur/google-chat-shuffler/actions)
[![Scrutinizer Quality Score](https://scrutinizer-ci.com/g/dyaskur/google-chat-shuffler/badges/quality-score.png?s=4023c984fc1163a44f4220cd7d57406643ced9f2)](https://scrutinizer-ci.com/g/dyaskur/google-chat-shuffler/)
[![Coverage Status](https://coveralls.io/repos/github/dyaskur/google-chat-shuffler/badge.svg?branch=master)](https://coveralls.io/github/dyaskur/google-chat-shuffler)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-shuffler&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-shuffler)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-shuffler&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-shuffler)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-shuffler&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-shuffler)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-shuffler&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-shuffler)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-shuffler&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-shuffler)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-shuffler&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-shuffler)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-shuffler&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-shuffler)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-shuffler&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-shuffler)

#### Features:

- Quick shuffle the chat space members
- Unit Test (ready to TDD)
- No database needed
- Using google cloud task (AWS SQS equivalent)
- Shuffle from input
- Choose how many item will be showed (winner count)
- Random GPT, random anything using GPT prompt (e.g random number, quotes, places etc)

#### Roadmap:
- Make the app configurable (need a DB)
- Scheduler (example use case: send daily quote or motivation to google chat space)


#### Prerequisites:
- Minimum NodeJS 16 
- yarn (optional)
- Google Cloud project that enabled Cloud Function, Cloud Task, Google Chat API, etc or [click here](https://console.cloud.google.com/flows/enableapi?apiid=chat.googleapis.com,%20cloudbuild.googleapis.com,%20cloudfunctions.googleapis.com,%20pubsub.googleapis.com)
- Google Workspace account
- Google Cloud CLI ([how to install](https://cloud.google.com/sdk/docs/install))

#### How to install/deploy:
- run `yarn install` to install dependencies
- run `yarn test` to make sure no failing of functionality
- run `cp .env.yaml.examle .env.yaml` to copy [.env.yaml.example](.env.yaml.example) to `.env.yaml` 
- fill the value on `.env.yaml` file to correct config/environment
- run `gcloud config set functions/region <your-region>` with the same region in `.env.yaml`
- run `yarn deploy` to deploy

#### How to setup google chat app:

- In Google Cloud Console, search for "Google Chat API" and click Google Chat API.
- Click `Manage` button.
- Click Configuration and set up the Google Chat app:
  - In App name, enter the app name (e.g RandomBot Custom).
  - In Avatar URL, enter the logo(e.g https://developers.google.com/chat/images/quickstart-app-avatar.png) .
  - In Description, enter the app description.
  - Under Functionality, select Receive 1:1 messages, Join spaces and group conversations, and Log errors to Cloud Logging.
  - Under Connection settings, select App URL and paste the URL for the Cloud Function trigger into the box.
  - Under Permissions, select Specific people and groups in your domain and enter your email address.
- Click `Save` button. And done. You can use your app in google chat. Just search your app in "Find apps" menu
