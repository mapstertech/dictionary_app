## start server
npm run server-dev

## seed database
cd server 
npx knex migrate:latest
npx knex seed:run

## ENDPOINTS
- for most endpoints you need to send token in the body or as an authorization header
- if sending a body include the Content-type: application/json header
```
fetch(URL, {
	method: 'POST',
	headers: {
		'Content-type': 'application/json',
	},
	body: {
		...params,
		token: accessToken
	}
})
```
or 
```
fetch(URL, {
	method: 'POST',
	headers: {
		'Content-type': 'application/json',
		'Authorization': `Bearer: ${accessToken}`
	}
})
```

### /api
GET /api/words
- returns JSON array of words

POST /api/words
- create words
```
{
	"words": [
		{
			"word": "blah blah pain",
			"meaning": "sdalkndappad",
			"audio": null,
			"images": "https://i0.wp.com/butterwithasideofbread.com/wp-content/uploads/2012/07/Easiest-Best-Homemade-Bread.BSB_.IMG_6014.jpg?fit=775%2C517&ssl=1",
			"grammar": "noun"
		},
		{
			"word": "blah blah fromage",
			"meaning": "sdalkndappad",
			"audio": null,
			"images": "https://cdn.shopify.com/s/files/1/0150/0232/products/Pearl_Valley_Swiss_Slices_36762caf-0757-45d2-91f0-424bcacc9892_large.jpg?v=1534871055",
			"grammar": "noun"
		},
	]
}
```

PATCH /api/words
- update words
```
{
	"words": [
		{
			"word": "blah blah pain",
			"meaning": "sdalkndappad",
			"audio": null,
			"images": "https://i0.wp.com/butterwithasideofbread.com/wp-content/uploads/2012/07/Easiest-Best-Homemade-Bread.BSB_.IMG_6014.jpg?fit=775%2C517&ssl=1",
			"grammar": "noun"
		},
		{
			"word": "blah blah fromage",
			"meaning": "sdalkndappad",
			"audio": null,
			"images": "https://cdn.shopify.com/s/files/1/0150/0232/products/Pearl_Valley_Swiss_Slices_36762caf-0757-45d2-91f0-424bcacc9892_large.jpg?v=1534871055",
			"grammar": "noun"
		},
	]
}
```

POST /api/users
- create user
```
{
	"email": "keanov@gmail.com",
	"password": "testpass1"
}
```

PATCH /api/users
- update user email
```
{
	"users": [
		{
			"id": 1,
			"email": "keano@gmail.com"
		},
				{
			"id": 2,
			"email": "keano@hooray.com"
		}
	]
}
```

DELETE /api/words
- send word_id[]
```
{
	"words": [
		1,
		2,
	]
}
```

DELETE /api/users
- send user_id[]
```
{
	"users": [
		3,
		4
	]
}
```

### /auth

GET /auth/reset_password?token=<token>
- kind of a duplicate, this one simply validates a token
- returns 200 if validated

POST /auth/login
```
{
	"email": "general@mapster.com",
	"password": "bananas"
}
```

POST /auth/reset_password
- Sends an email to the address with a reset password link
- token valid for one hour
```
{
	"email": "keanov@gmail.com"
}
```

PATCH /auth/update_password_with_email
- if the token and email match, reset the password with "password"
```
{
	"email": "general@mapster.com",
	"password": "bananas",
	"token": "ced911a0a86039b8d93626ee6f9ed8aa53c45093"
}
```
