# Browninglogic Radio

[![Build Status](https://toxicbard.visualstudio.com/Browninglogic%20Radio/_apis/build/status/Browninglogic%20Radio%20UI?branchName=master)](https://toxicbard.visualstudio.com/Browninglogic%20Radio/_build/latest?definitionId=2&branchName=master)
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
* Persistent "Favorites" functionality
* Tagging of "Favorite" stations
* [HTML5 Notifications](https://developer.mozilla.org/en-US/docs/Web/API/notification)
* [Installable Progressive Web App](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Installable_PWAs)

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
* Chores
  * Implement NGRX for state management throughout the app.
  * Remove appInit action once config service is working with NGRX
  * Restructure modules so that related functionality is together, regardless of whether it relates to NGRX
  * Log Page Views & Initial App load
  * Pass bearer token via HTTP_INTERCEPTOR
  * Refactor the core site layout to use vertical flexbox rather than using a fixed-position div for the center content area
  * Migrate build from classic Azure DevOps to YAML build
  * Configure SCSS imports to use TS path rather than relative path
  * Optimize bundle size
  * Package up reusable things and deploy to npm
  * Revisit nosleep.js: Switch to an alternative (such as [this](https://github.com/madeInLagny/mil-no-sleep)) if it still appears to be a dead project by then.
  * Determine whether it's appropriate to remove Material and go entirely to PrimeNG
  * Switch to and enforce HTTPS.
    * The challenge here is that the nature of internet radio is that many URLs and icons might be served from plain HTTP only, causing [mixed content woes](https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content)).  This will require some creativity.
    * My initial thoughts are that we'd either attempt to access the HTTPS version of provided HTTP URLs or simply enforce that all provided station & icon URLs be HTTPS.  The latter is preferable as a developer, but it would make the Radio Browser API functionality basically useless.
* Bugs
  * Fall back gracefully when Radio Browser API is down
  * Improve handling of mobile input on search
* Features
  * Investigate alternatives to interval-based polling for "Now Playing" stream info
    * [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
    * [Service Worker](https://github.com/cryptiksouls/icecast-shoutcast-metadata-grabber)
    * [icecast.js](https://www.npmjs.com/package/icecast.js)
    * [Socket.IO](https://www.npmjs.com/package/socket.io)
    * Long-polling based streamInfoChange API logic
  * Implement a non-logged-in experience such that login is optional and a non-authenticated user can still listen to the radio, but they just can't use favorites or get now-playing info.
  * Favorite station edits
  * Favorite station tags
  * Browser-based audio recording
  * Use HTML5 notifications for consenting users, and fall back to PrimeNG toast for non-consenting users
  * Come up with a better user experience for Shoutcast urls which lack the trailing `/;` and for invalid URLs in general.
  * Support pls & similar files by fetching and reading the file itself to find a valid URL
  * Show "Now Playing" stream info for "Suggested", "Favorites", and search results
  * Search by country and any other Radio Browser API criteria which makes sense
  * Configure the app as an [Installable PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Installable_PWAs).