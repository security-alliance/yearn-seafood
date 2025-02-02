var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var getVaultsRouter = require('./routes/getVaults');
var githubRouter = require('./routes/github');
var visionRouter = require('./routes/vision');
var tenderlyRouter = require('./routes/tenderly');
var abiRouter = require('./routes/abi');
var tradeablesRouter = require('./routes/tradeables');
var programsRouter = require('./routes/programs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/seafood/api/', indexRouter);
app.use('/seafood/api/getVaults', getVaultsRouter);
app.use('/seafood/api/github', githubRouter);
app.use('/seafood/api/vision', visionRouter);
app.use('/seafood/api/tenderly', tenderlyRouter);
app.use('/seafood/api/abi', abiRouter);
app.use('/seafood/api/tradeables', tradeablesRouter);
app.use('/seafood/api/programs', programsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
