# Browninglogic Radio
![Build Status](https://github.com/pfbrowning/ng-radio/workflows/Angular%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/pfbrowning/ng-radio/badge.svg?branch=master)](https://coveralls.io/github/pfbrowning/ng-radio?branch=master)

## Introduction
Browninglogic Radio is an internet radio app written as a Single-Page Application in Angular. This is a hobby project that I work on in what little free time I have. My motivation for this is primarily because I enjoy working with Angular and secondarily because I enjoy internet radio.

The in-progress demo version of the app can be accessed at [radio.browninglogic.com](https://radio.browninglogic.com).

## Current Features
- Display of the current "Now Playing" stream info as provided by [icy](https://www.npmjs.com/package/icy) via [radio-proxy](https://github.com/pfbrowning/radio-proxy)
- Integration with the [Radio Browser API](https://de1.api.radio-browser.info/) as a backend data source to easily search for internet radio stations
- Sleep timer
- Support for opening and playing custom station URLs
- Saving of "Favorite" stations
- Responsive & mobile-friendly
- Logging to Azure Application Insights

## Planned Features
- Support for playlist files (.pls, .m3u, etc)
- Require authentication only for the usage of "Favorites", rather than as a requirement to use the app at all.
- Tagging of "Favorite" stations
- [HTML5 Notifications](https://developer.mozilla.org/en-US/docs/Web/API/notification)

## Architecture
The application as a whole is composed of four main pieces: the [Angular frontend](https://github.com/pfbrowning/ng-radio), the [radio-proxy backend](https://github.com/pfbrowning/radio-proxy), the [image-proxy backend](https://github.com/pfbrowning/image-proxy), and an identity provider.
### Radio-Proxy Backend
Audio is proxied through a [backend](https://github.com/pfbrowning/radio-proxy) which passes the "now playing" metadata to the browser in real-time via Socket.IO.  This is necessary primarily because there's no straightforward, generic way to extract "now playing" metadata from an ICY stream directly from a web browser.

A secondary benefit of this approach is that it allows us to stream non-secure HTTP audio streams over a secure HTTPS connection, thus helping to mitigate mixed content concerns.
### Image-Proxy Backend
Cross-origin radio station icons are also proxied through a [backend](https://github.com/pfbrowning/image-proxy).  The purpose of this proxy is twofold: to allow us to access non-secure HTTP images over HTTPS, and to view the images without downloading cookies from the image domain.
### Identity Provider
Authentication is required to utilize the application for two reasons:
* To identify who the current user is in order to facilitate the "Favorite Stations" feature
* To ensure that users of my personal _hosted_ version of [radio-proxy](https://github.com/pfbrowning/radio-proxy) and [image-proxy](https://github.com/pfbrowning/image-proxy) are legitimate users of the Browninglogic Radio app, as opposed to using it for their own separate purposes and increasing my hosting bill.

As a future state I would like to modify the app such that authentication is required only for the "favorite stations" feature, but in order to do so I'll need to find a better solution to the second bullet point above first.

## Supported URL Format
The app should play any audio stream which can be played by [icy](https://www.npmjs.com/package/icy).

The URL of the *.pls, *.m3u, etc files which are frequently distributed by internet radio stations is not supported yet, but support for it is planned as a future feature.  If you want to play such stations, the best thing to do is to open the file in your favorite text editor in order to find the real stream URL inside.

## Configuration
To get your own instance of this application configured and running locally, you'll obviously want to start by cloning the repo. Then take a look at `src\assets\config\app.config.json`. There are a few things that you'll need to set up and configure in `app.config.json` in order to get the app running. You can also configure any settings that you want `gitignore`d in `local.config.json`: any config entries in local config will automatically override matching entries in app config.

### Radio Proxy
You'll need to configure your own instance of [radio-proxy](https://github.com/pfbrowning/radio-proxy). Follow the instructions to get it set up and running on `http://localhost:3000`. Alternatively you can host it somewhere else and specify the alternate path in `app.config.json`.

### Azure Application Insights
If you want diagnostic details logged to Azure Application Insights, then provide your instrumentation key in `app.config.json`. Otherwise leave it as null: this is completely optional.

### Authentication
You'll need to configure your own Oauth 2.0 + OpenID Connect identity provider. In addition, you'll need to use an Oauth 2.0 provider which issues a JWT-based access token (this is not mandated by the Oauth 2.0 spec, but it's a common implementation). This is required due to the "Favorites" functionality. The quickest, easiest, and cheapest route would probably be to use an [Auth0](https://auth0.com/) free account. A basic level of knowledge regarding authentication in Single Page Applications via OpenID Connect is required.

Browninglogic Radio uses [oidc-client-js](https://github.com/IdentityModel/oidc-client-js) for authentication. The `authConfig.userManager` section within `app.config.json` stores the `UserManagerSettings` object which is defined and documented by [oidc-client-js](https://github.com/IdentityModel/oidc-client-js/wiki). For a standard simple OpenID Connect configuration it should be sufficient to specify your `authority`, `client_id`, `redirect_uri` and `silent_redirect_uri` within `authConfig.userManager` without having to make any modifications to the underlying code.

Configuring a logout url is a bit more tricky because not all providers support the OpenID Connect standard End Session Endpoint. For example, IdentityServer4 does, but Auth0 doesn't. If the provider that you're using _does_ support the end session endpoint, then you can stop reading. I've implemented custom logout logic in order to support providers who do _not_ support the end session endpoint: in order to use this, just configure your non-standard logout url in `authConfig.logoutUrl`.

### Running the App

Once you've got the aforementioned dependencies configured, running, and in a happy state, simply install your dependencies and run the app as you would any Angular CLI app. Assuming that you've already got npm and Angular CLI installed:

```bash
npm install
ng serve --open
```

## Browser Support
Support for legacy browsers is not a concern at all in developing this application. I develop and test against Firefox and Chrome primarily, and I prefer using cutting edge native browser functionality when it's preferable to legacy alternatives.

## Backlog
- Chores
  - Upgrade to Angular 15
    - Upgrade NGRX
    - Update `@angular-eslint/schematics` to 15
    - Update PrimeNG
  - Upgrade to Angular 16
  - Upgrade to Angular 17
  - Remove 'mat-progress-buttons.  Find or write a better alternative to the mat spinner button package
  - Replace silent refresh with (hardened) refresh tokens
  - Write a strict CSP
  - Research BFF, token handler pattern, etc, to decide what to do about cross-site cookie blocking
  - Refactor deprecated Material components 
  - Add `npm audit` to build pipeline
  - Configure Storybook _or_ Angular Playground
  - Separate the models for current station, favorite station, and radio browser result
  - Change detection performance
    - Logging
    - Tuning
  - Set `strict` to `true` in `tsconfig.json` and fix the resulting errors.
    - Fix non-configurable errors
    - Enable strictPropertyInitialization
    - Enable noImplicitAny
  - Refactor LoggingService as desired
    - Genericize logging providers with a contract interface
    - Simplify logic
  - Investigate whether Websockets might be a better solution than Socket.IO
  - Upgrade Socket.IO client & server
  - App-wide code review & refactor based on things learned since writing what we have thus far
  - Improve test coverage
  - Finish [image-proxy](https://github.com/pfbrowning/image-proxy)
  - Finish [radio-proxy](https://github.com/pfbrowning/radio-proxy)
  - Research to decide whether to utilize NX
- Bugs
  - The main page fails to load when the radio browser API is down.
  - When you go from a station with an image to a station with no image, the image of the former is still displayed in the toolbar
  - Duplicate "Now Playing" toaster notifications
  - Silent refresh failures
- Features
  - "You have been listening to X station for Y minutes" logging
  - Show loading indicator for images
  - Non-logged-in experience: Require login only for favorites
  - Native app functionality: PWA or Electron
  - Browser-based audio recording
  - HTML5 Notifications
  - Favorite station tags