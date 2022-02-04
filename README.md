# MY PHOTOS ON REACT

My React exercises

(Work in progress)

## Rough sketch of the app UI

<img src="./doc/rough_sketch.jpg" width=300px>

## Relationship to my other project on GitHub

react-myphotos(frontend) --- REST API --- [heroku-myphotos](https://github.com/araobp/heroku-myphotos)

```
REST API

BaseURL: https://myphotos1088001.herokuapp.com

*** CREATE A RECORD ***
POST /records
{
    "place": "string",
    "memo": "string",
    "latitude": "number",
    "longitude": "number"
}

Its response
{
    "id": "integer"
}

*** UPDATE A RECORD ***
PUT /records/:id
{
    "place": "string",
    "memo": "string",
    "latitude": "number",
    "longitude": "number"
}

*** GET A LIST OF RECORDS ***
GET /records
[{"id": "number", 
  "record":
    {
        "datetime": "string",
        "place": "string",
        "memo": "string",
        "latitude": "number",
        "longitude": "number"
    }
}]

*** GET A RECORD ***
GET /records/:id
{
    "datetime: "string",
    "place": "string",
    "memo": "string",
    "latitude": "number",
    "longitude": "number"
}

*** PUT AN IMAGE ***
PUT /photos/:id
Binary data

*** GET A THUMBNAIL ***
GET /photos/:id/thumbnail
Binary data

*** GET AN IMAGE ***
GET /photos/:id/image
Binary data

*** DELETE A RECORD ***
DELETE /records/:id

*** DELETE RECORDS ***
DELETE /records

Its associated photo is also deleted.

```

## Running the app locally

```
$ npm start
```

Or start a HTTPS server,
```
$ HTTPS=true npm start
```

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
