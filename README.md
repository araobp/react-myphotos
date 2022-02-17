# MY PHOTOS ON REACT (SPA and PWA)

This project is a master project of my "learning by doing" projects on web app:

- React (TypeScript): SPA and PWA
- Express (JavaScript): REST API server with Postgres SQL
- Spring Boot (Java): Non-SPA (classical) web app with Postgres SQL

## SPA and PWA

- This app runs on Windows, MacOS, Android and iOS.
- This app is dependent on a REST API server in my other project [express-myphotos](https://github.com/araobp/express-myphotos).

## Rough sketch of the app UI

<img src="./doc/rough_sketch.jpg" width=300px>

## Architecture

I have connected Heroku PaaS to both [react-myphotos](https://github.com/araobp/react-myphotos) and [express-myphotos](https://github.com/araobp/express-myphotos).

Heroku PaaS builds and deploys these projects automatically at every commit to GitHub.

```
 react-myphotos                    heroku-myphotos
[React web page] --- REST API --- [Express/Node.js]---[Postgres SQL]
- - - - - - - - -                 - - - - - - - - - - - - - - - - -
Static web server                         REST API service
hosted by Heroku                          hosted by Heroku
```

## Running the app locally

```
$ npm start
```

Note: enter "login", "password" and "BASE URL"(URL of the REST API server) on the Login page of the app for the first time.

## Relationship to my other project on GitHub

react-myphotos(frontend) --- REST API --- [express-myphotos](https://github.com/araobp/express-myphotos)

## Issues

### async/await in forEach

[Using async/await with a forEach loop](https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop)

### Leaflet

Loading marker images 

https://stackoverflow.com/questions/65758463/react-leaflet-marker-image-fails-to-load

Remove import "leaflet/dist/leaflet.css"; 

Go to public/index.html and include the CDN hosted leaflet.css:
```
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
  integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
  crossorigin=""/>
```

## References

- W3 schools: https://www.w3schools.com/
- React Tutorial: https://www.w3schools.com/REACT/default.asp
- react-html5-camera-photo: https://www.npmjs.com/package/react-html5-camera-photo
- react-icons: https://react-icons.github.io/react-icons/
- React buildpack for Heroku PaaS: https://github.com/mars/create-react-app-buildpack
    
