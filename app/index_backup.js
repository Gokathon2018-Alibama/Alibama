const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

const Sequelize = require('sequelize')
const sequelize = new Sequelize('hellodb', 'admin', 'raspberrypi', {
  host: 'mydbinstance.clnimjh5ggdp.ap-southeast-1.rds.amazonaws.com',
  dialect: 'mysql',
});

const ImagePost = sequelize.define('image_post', {
  id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  username: Sequelize.STRING,
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  url: Sequelize.STRING,
})

ImagePost.sync({ alter: true })

app.use(cors())
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.json({
      message: "Hello! We're AUSG!",
  })
})

app.get('/images', function (req, res) {
  ImagePost.findAll()
      .then(function (result) {
          res.json(result)
      })
      .catch(function (error) {
          res.json(error)
      })
})

app.post('/images', function (req, res) {
  ImagePost.create({
      title: req.body.title,
      description: req.body.description,
      url: req.body.url,
  }).then(function () {
      res.json({
          message: 'success!',
      })
  }).catch(function (error) {
      res.json({
          message: 'failed!',
      })
      console.log(error)
  })
})  

////----------- 추가
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
  region: 'ap-southeast-1',
  signatureVersion: 'v4',
})
var counter = 0;
app.post('/generatePresignedUrl', function (req, res) {
    counter++;
  const key = `${counter}.jpg`
  const params = {
      Bucket: 'alibamabucket',
      Key: key,
      ACL: 'public-read',
  }
  const presignedUrl = s3.getSignedUrl('putObject', params)
  res.json({
      url: `https://s3-ap-southeast-1.amazonaws.com/${params.Bucket}/${key}`,
      presignedUrl,
  })
})

app.use(express.static('public'))

var PythonShell = require('python-shell');

var pyshell = new PythonShell('python_scripts/test.py');
 
// sends a message to the Python script via stdin
// pyshell.send('hello');
 
pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message);
});
 
// end the input stream and allow the process to exit
pyshell.end(function (err,code,signal) {
  if (err) throw err;
  console.log('The exit code was: ' + code);
  console.log('The exit signal was: ' + signal);
  console.log('finished alibama');
});

app.listen(3000)