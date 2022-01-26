# React my photos

(Work in progress)

## Project goal

I am really interested in Metaverse. This project is a starting point for me to study every technology required for Metaverse.

## Background

I have been using Unity over one and a half year for developing a number of 3D simulation demos. I have also developed a Metaverse-like demo. But I will not use Unity for 3D world wide web development because of its heavy overhead.

[One sample 3D project "unity-sabae"](https://github.com/araobp/unity-sabae).

Once I tried to bulid WebGL version of the project above, but it took forever and it did not run on my smart phone very well.

Last year, I also studied low-code development platforms such as OutSystems or Mendix. I felt PaaSes are really nice for developing backend. This time I will use Heroku as a PaaS for the backend development.

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

First, I have just started studying React by reading this e-book:
https://www.amazon.co.jp/gp/product/B094Z1R281/ref=ppx_yo_dt_b_d_asin_title_o00?ie=UTF8&psc=1
