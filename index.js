const express = require('express');
const app = express();
const path = require('path')
const elastic  = require('elasticsearch');
const Engine = require('./engine');
const ejs = require('ejs');
const parser = require('body-parser')


global.client = new elastic.Client({
  host: 'localhost:9200'
})


//
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public'))); 

// inject routes
app.use(parser.urlencoded({extended: false}));
app.use(parser.json())
app.use('/', require('./routes'));
app.use('/api', require('./routes/users'));

app.listen(4040, () => {
  console.log('server listening on port %s ',process.env.PORT || 4040);
  console.log("existig indices in elastic search");
  Engine.indices()
})
