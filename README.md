# school

Teachers need a system where they can perform administrative functions for their students. Teachers and students are identified by their email addresses.

## Hosted API

[http://ec2-54-254-210-97.ap-southeast-1.compute.amazonaws.com](http://ec2-54-254-210-97.ap-southeast-1.compute.amazonaws.com)

\*_No data initially. Can use `/api/register` to create teacher and student records first before testing other API._

## Running locally

### Pre-requisites

- Node.js
- MySQL

### Steps

- `git clone https://github.com/4wangyu/school.git`
- `cd school`
- `npm install`
- Update `host, port, username, password, database` fields in the `ormconfig.json` to use your own database instance.
- Run `npm start` to start the server on port `3001`. The database tables will be auto-populated.

## Running unit tests

- Run `npm test` under project directory

## Credits

- [TypeORM](https://github.com/typeorm/typeorm)
- [Express](https://expressjs.com/)
- [Jest](https://jestjs.io/)
- [express-validator](https://express-validator.github.io/)
