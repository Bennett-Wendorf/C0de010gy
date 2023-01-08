# Setup Instructions
## Part 1
The `lib/tokenSeeds.js` script can be used to generate the .env file needed for generating access and refresh tokens.

## Part 2
The `database/connection.json` file can be used to configure the database connection. It should look something like the following with all of the bracketed sections replaced in their entirety (including the brackets).
```json
{
    "host": "<IP or Hostname>",
    "user": "<DB Username>",
    "password": "<DB Password>",
    "database": "<Database Name>"
}
```