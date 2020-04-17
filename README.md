# Browninglogic Radio

[![Build Status](https://toxicbard.visualstudio.com/Browninglogic%20Radio/_apis/build/status/Browninglogic%20Radio%20UI%20-%20YAML?branchName=master)](https://toxicbard.visualstudio.com/Browninglogic%20Radio/_build/latest?definitionId=4&branchName=master)
[![Coverage Status](https://coveralls.io/repos/github/pfbrowning/ng-radio/badge.svg?branch=master)](https://coveralls.io/github/pfbrowning/ng-radio?branch=master)

## Introduction
Browninglogic Radio is an internet radio app written as a Single-Page Application in Angular.  This is a hobby project that I work on in what little free time I have.  My motivation for this is primarily because I enjoy working with Angular and secondarily because I enjoy internet radio.

The in-progress demo version of the app can be accessed at [radio.browninglogic.com](http://radio.browninglogic.com).

## Current Features
* Display of the current "Now Playing" stream info as provided by [node-internet-radio](https://github.com/gabek/node-internet-radio) and fetched via [radio-metadata-api](https://github.com/pfbrowning/radio-metadata-api)
* Integration with the [Radio Browser API](http://www.radio-browser.info) as a backend data source to easily search for internet radio stations
* Support for opening and playing custom station URLs
* Sleep timer
* Experimental mobile browser keep-awake via [nosleep.js](https://github.com/richtr/NoSleep.js/)
* Responsive & mobile-friendly
* Logging to Azure Application Insights

## Planned Features
* Tagging of "Favorite" stations
* [HTML5 Notifications](https://developer.mozilla.org/en-US/docs/Web/API/notification)

## Supported URL Format
At its core, this application is basically a fancy frontend for the [HTML5 Audio Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio).  With this in mind, it's safe to say that any internet radio stream URL which a modern web browser can play directly should work in this app with no problem, and by extension if your browser can *not* play the stream directly then it won't work with this app either.  In other words, if you're having trouble playing a stream URL, your first troubleshooting step should be to paste the stream URL directly into your browser's address bar to see if your browser can handle it.

As a matter of practical application, there are a few points to keep in mind:
* The URL of the *.pls, *.m3u, etc files which are frequently distributed by internet radio stations will not work as Custom URLs.  However, if you open these files with the text editor of your choice, they should contain the proper stream URL which should work just fine (both directly in your browser and as a Custom URL in this app).
* Shoutcast station URLs are problematic in that depending on the way the URL is formatted they'll provide an HTML page, rather than the audio stream itself.  This is documented [here](https://stackoverflow.com/a/1759607), and the solution is to append `/;` to the end of the URL in order to explicitly tell Shoutcast to give you an audio stream.  For example, `http://79.111.119.111:9107` will return an HTML page and fail to play when provided as a Custom URL, but `http://79.111.119.111:9107/;` provides a proper audio stream.
* The former two points are important to keep in mind while using the [Radio Browser API](http://www.radio-browser.info) functionality.  This is a publicly accessible, publicly maintained database, thus many of the stations that it contains are either invalid or in an unsupported format.  In my usage of it I've found that most stations work properly, but there are many which are stored as Shoutcast stations without the trailing `/;`, *.pls files, or in various other invalid formats.

## Configuration
To get your own instance of this application configured and running locally, you'll obviously want to start by cloning the repo.  Then take a look at `src\assets\config\app.config.json`.  The application's configuration is defined here and loaded on bootstrap via Angular's [APP_INITIALIZER](https://davembush.github.io/where-to-store-angular-configurations/).  There are a few things that you'll need to set up and configure in `app.config.json` in order to get the app running.

### Metadata API
You'll need to configure your own instance of the [radio-metadata-api](https://github.com/pfbrowning/radio-metadata-api).  Follow the instructions to get it set up and running on `http://localhost:3000`.  Alternatively you can host it somewhere else and specify the alternate path in `app.config.json`.

### Azure Application Insights
If you want to log stuff to Azure Application Insights, then provide your instrumentation key in `app.config.json`.  Otherwise leave it as null: this is completely optional.

### Authentication
You'll need to configure your own Oauth 2.0 + OpenID Connect identity provider.  In addition, you'll need to use an Oauth 2.0 provider which issues a JWT-based access token (this is not mandated by the Oauth 2.0 spec, but it's a common implementation).  This is a requirement due to the upcoming "Favorites" functionality.  The quickest, easiest, and cheapest route would probably be to use an [Auth0](https://auth0.com/) free account.  A basic level of knowledge regarding authentication in Single Page Applications via OpenID Connect Implicit Flow is required.  I won't cover that here because it's outside of the scope of this readme, well-documented on the internet, and fairly easy to figure out.

Browninglogic Radio uses [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc) for authentication.  The `authConfig` section within `app.config.json` stores the `AuthConfig` object which is defined and documented by `angular-oauth2-oidc`.  For a standard simple OpenID Connect configuration it should be sufficient to specify your `issuer`, `redirectUri`, `clientId`, and `scope` within `authConfig` without having to make any modifications to `src\modules\core\authentication\services\authentication.service.ts`.

### Running the App
Once you've got the aforementioned dependencies configured, running, and in a happy state, simply install your dependencies and run the app as you would any Angular CLI app.  Assuming that you've already got npm and Angular CLI installed:
```bash
npm install
ng serve --open
```

## Backlog
* High Priority Chores & Bugs
  * Consolidate the 'display now playing title based on status' template logic into a component
* Features
  * Show stream info for favorites, search results, and suggested
  * Browser-based audio recording
  * Favorite station edits
  * Search by country and any other Radio Browser API criteria which makes sense
  * Favorite station tags
* Chores
  * Split "Now Playing" into its own root store slice
  * Show cursor pointer for now playing bottom toolbar
  * Show a loading spinner in place of the main app content while waiting for the config to load
  * Wait until after initial change detection to show notifications
  * Turn off sleep timer on audio pause
  * Flex styling of player bar: grow to take up available with for song & station title
  * Store only what we need in NGRX authentication store
  * Use PKCE authentication in place of implicit flow
  * Prevent accidental audio streaming through CORS proxy
  * Partition core/services directory
  * Either type for stream validator logic
  * Refactor selector import / export logic
  * Config observable
  * Minimum icon size
  * Fix warnings in tests
  * Package up reusable things and deploy to npm
    * setAltSrc
    * Either
  * Move build pipeline to Github actions
  * Socket.IO-based now playing listener / stream proxy
  * Improve test coverage