#Installation
This application requires [node.js](http://nodejs.org/) to be installed.

Clone this repository.

Rename `config.example.js` to `config.js` and update it with your my511 token.

In your terminal, navigate to the `where_the_fudge_is_the_bus` folder and run:

`npm install`

`node server.js`

The server will then be live at [http://localhost:3000](http://localhost:3000).

The **data** folder contains the node script for converting stops.txt files into GeoJSON files to be uploaded to a CouchDB.

The **public** folder contains the public facing HTML5 website and all the client side javascript code.

**The License:**

Copyright (c) 2011 John M Mertens

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.