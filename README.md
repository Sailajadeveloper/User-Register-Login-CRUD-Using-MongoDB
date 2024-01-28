Implemented the UserManagement Api's using Express with MongoDB.

Implemented the 'JWT' in login system for autheraisation. And secured the API's over the 'JWT' middelware.

Register & Login system with proper validation of email & password.
Hashed the password for security Purpose using 'bcrypt' Module.

Using latest version of MongoDB Driver as Mongoose V8.1.0

We cann't use callback while connecting to mongoDB with Mongoose > v6

/* Written the Code in both formates of sending response using common function and hardCode everytime for to show the variation. Using response->(ValidationController Responses) & responseObj->(MainController Responses) */

API EndPoints =>
. post('/register') -> User Registration with name, email, password, confirm_password
. post('/login')    -> User Login with email, password and generating JWT.
. get('/userslist') -> Getting List of all Users Data
. get('/users/:id') -> Getting a particular User Data
. post('/saveuser') -> To Update User Mobile based on the User Email 
. put('/users/:id)  -> To Update User Mobile based on the User ID from Params 
. delete('/users/:id') -> Deleting a particular User Document
