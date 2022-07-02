
# USER SIGNUP 
This endpoint signs in the user into the application and returns signin data 


###### ENDPOINT 
> /api/v1/signup


###### METHOD 
> POST 



###### REQUEST BODY 
```javascript 
{
	"firstname":"firstname",
	"lastname":"lastname",
	"email":"newUser@gmail.com",
	"password":"password"
}
```

###### RESPONSE CODES 

CODE | MEANING 
-----|-------- 
201  | User created and verification email sent 
400  | Bad request body 
500  | Server error 


### Sample Responses 

#### 201

```javascript 
{
	"success": true,
	"msg": " new user created, check email for verfication link "
}
```


#### 400 

```javascript 
{
	"success": false,
	"msg": " check request body "
}
```
    
    
####  500 
```javascript 
{
	"sucess": false,
	"msg": " Server encountered error while signing in user "
}
```


