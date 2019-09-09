const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

// get home
server.get('/', (req, res) => {
  res.send('<h3>DB Helpers with knex</h3>');
});

// get accounts
server.get('/api/accounts', (req, res) => {
  db('accounts')
    .select('*')
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(err => {
      res.json(err);
    });
});

// get specific account
server.get('/api/accounts/:id', validateId, (req, res) => {
  const { id } = req.params;
  res.status(200).json(req.account);
});

// middleware
function validateId(req, res, next) {
  const { id } = req.params;
  db('accounts')
    .where({ id })
    .first()
    .then(account => {
      if (account) {
        req.account = account;
        next();
      } else {
        res
          .status(404)
          .json({ error: 'There is no account with the specified id' });
      }
    });
}

module.exports = server;
