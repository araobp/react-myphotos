# MY PHOTOS ON REACT

(Work in progress)

## Project goal

I am really interested in Metaverse. This project is a starting point for me to study every technology required for Metaverse.

## Sub-projects

(Work in progress)

- [My photos](/myphotos): React SPA for managing photo images on Postgres SQL on Heroku PaaS.
- [My 3D models](/three): Three.js app for displaying my original 3D models made with Blender.

## Relationship to my other project on GitHub

react-myphotos(frontend) --- REST API --- [heroku-myphotos(backend, private project at the moment)](https://github.com/araobp/heroku-myphotos)

```
REST API

BaseURL: https://myphotos1088001.herokuapp.com

*** CREATE A RECORD ***
POST /records
{
    "place": "string",
    "memo": "string",
    "format": "string"
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
    "format": "string"
}

*** GET A LIST OF RECORDS ***
GET /records
[{"id": "number", 
  "record":
    {
        "datetime": "string",
        "place": "string",
        "memo": "string",
        "format": "string"
    }
}]

*** GET A RECORD ***
GET /records/:id
{
    "datetime: "string",
    "place": "string",
    "memo": "string",
    "format": "string"
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

## Project plan

1. Study React basics
2. Study Heroku basics
3. Develop Photo app with React
4. Develop REST API services on Heroku
5. Integrate them
6. Migrate from js version to ts version

Then, I am going to study three.js and WebRTC for 2D & 3D world wide web.

## References

React Tutorial: https://www.w3schools.com/REACT/default.asp
