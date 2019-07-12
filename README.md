# NgRadio

[![Build Status](https://toxicbard.visualstudio.com/Browninglogic%20Radio/_apis/build/status/Browninglogic%20Radio%20UI?branchName=master)](https://toxicbard.visualstudio.com/Browninglogic%20Radio/_build/latest?definitionId=2&branchName=master)

This is a work in progress, but when it's completed it will be a fully-functional internet radio player app.

The in-progress demo version of the app can be accessed at [radio.browninglogic.com](http://radio.browninglogic.com).

## Roadmap For 1.0.0
My priorities for continuing development are as follows, in order:
* Write a proper readme.
* Initial favorites functionality.
    * Write a RESTful favorites API in the latest .NET Core following best practices.
    * Implement favorites functionality in the UI.
* Show some love to the neglected [radio-metadata-api](https://github.com/pfbrowning/radio-metadata-api).
    * Lock down the API with bearer token authentication.
    * Implement some basic logging.
    * Write some basic unit tests.
  
## "Down the Road" Items
* Implement 'Tags' functionality in the favorites API
* Implement Immutable.js for the NowPlaying object and anything else throughout the app that would benefit from being immutable.
* Tune change detection.
* Implement NGRX for state management throughout the app.
* Minimize redundant API fetches by caching retrieved data which isn't expected to change frequently.
* Write a [Custom PrimeNG Theme](https://browninglogic.com/2018/11/30/92/) based on the default one, but with rounded borders for the toaster notification.
* Switch to and enforce HTTPS.
  * The challenge here is that the nature of internet radio is that many URLs and icons might be served from plain HTTP only, causing [mixed content woes](https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content)).  This will require some creativity.
  * My initial thoughts are that we'd either attempt to access the HTTPS version of provided HTTP URLs or simply enforce that all provided station & icon URLs be HTTPS.  The latter is preferable as a developer, but it would make the Radio Browser API functionality basically useless.
* Configure the app as an [Installable PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Installable_PWAs).
* Package up generic, reusable things individually and publish them to npm
    * setAltSrc function
    * ActivatedRouteStub class
