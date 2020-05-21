# the-last-dragon-server
Node.js server backend for the The Last Dragon website

Hosted on Heroku, includes:
* user login/register (authentication)
  * bcrypt password hashing
* postgreSQL database integration for storage of user credentials etc.
* jwt token authorisation (access token & refresh token) for access to gated/protected routes.
* email verification service (confirmation email sent to user upon registration, requiring verification of email to continue accessing gated routes).
