const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const PythonShell = require('python-shell');

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
var counter = 6;
app.post('/generatePresignedUrl', function (req, res) {
	counter++;
	console.log("counter"+counter);
	const key = counter+'.jpg'
	const params = {
		Bucket: 'alibamabucket',
		Key: key,
		ACL: 'public-read',
	}
	const presignedUrl = s3.getSignedUrl('putObject', params)
	res.json({
		url: 'https://s3-ap-southeast-1.amazonaws.com/${params.Bucket}/${key}',
		presignedUrl,
	})
	if(counter>6){

		var options = {
			pythonPath: 'python3',
		};	

		PythonShell.run('python_scripts/alibama_15.py', options, function (err, results) {
			if (err) 
				throw err;
			// Results is an array consisting of messages collected during execution
			console.log('results: %j', results);
			var exec = require('child_process').exec,
			child;

			//child = exec('images/result.jpg',
			//	function (error, stdout, stderr) {
			//		console.log('Image opened');
			//		if (error !== null) {
			//			console.log('exec error: ' + error);
			//		}
			//	});
		});
		counter = 0;
	}
});

app.use(express.static('public'))

function swipe() {
	var largeImage = document.getElementById('images/result.jpg');
	largeImage.style.display = 'block';
	largeImage.style.width=420+"px";
	largeImage.style.height=315+"px";
	var url=largeImage.getAttribute('src');
	window.open(url,'Image','width=largeImage.stylewidth,height=largeImage.style.height,resizable=1');
}


app.listen(3000)

// var options = {
// 			pythonPath: 'python',
// 		};	

// 		PythonShell.run('python_scripts/alibama_15.py', options, function (err, results) {
// 			if (err) 
// 				throw err;
// 			// Results is an array consisting of messages collected during execution
// 			console.log('results: %j', results);
// 			var exec = require('child_process').exec,
// 			child;

// 			child = exec('images/result.jpg',
// 				function (error, stdout, stderr) {
// 					console.log('Image opened');
// 					if (error !== null) {
// 						console.log('exec error: ' + error);
// 					}
// 				});
// 		});