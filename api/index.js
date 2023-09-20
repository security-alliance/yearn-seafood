const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
const getVaultsRouter = require('./routes/getVaults');
const githubRouter = require('./routes/github');
const visionRouter = require('./routes/vision');
const tenderlyRouter = require('./routes/tenderly');
const abiRouter = require('./routes/abi');
const tradeablesRouter = require('./routes/tradeables');
const programsRouter = require('./routes/programs');

app.use('/seafood/api/getVaults', getVaultsRouter);
app.use('/seafood/api/github', githubRouter);
app.use('/seafood/api/vision', visionRouter);
app.use('/seafood/api/tenderly', tenderlyRouter);
app.use('/seafood/api/abi', abiRouter);
app.use('/seafood/api/tradeables', tradeablesRouter);
app.use('/seafood/api/programs', programsRouter);

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));