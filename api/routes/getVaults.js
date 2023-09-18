const express = require('express');
const router = express.Router();

const reports_model = require('../database/reports_model');
const vaults_model = require('../database/vaults_model');

router.post('/AllStrategyReports', function(req, res, next) {
	reports_model.getReports(req.body)
		.then(response => {
			res.status(200).send(response);
		})
		.catch(error => {
			res.status(500).send(error);
		});
});

router.get('/AllVaults', function(req, res, next) {
	console.log('all vaults requested')
	vaults_model.getVaults()
		.then(response => {
			console.log('returning', response)
			res.status(200).send(response);
		})
		.catch(error => {
			res.status(500).send(error);
		});
});

module.exports = router;