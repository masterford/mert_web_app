<!-- This is views/showAnimals.ejs -->
var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static('files'));

<p>Here are the animals you like:
<a href='/public/form.html'>Back to form</a>
