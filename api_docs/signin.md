
# SIGNIN   USER 
This endpoint signs in the user into the application and returns signin data 


###### ENDPOINT 
> /api/v1/signin 


###### METHOD 
> POST 



###### REQUEST BODY 
```javascript 
{
    "email":"user@gmail.com",
    "password":"password"
}
```

###### RESPONSE CODES 

CODE | MEANING 
-----|-------- 
200  | User found and logged in 
400  | User email or password in correct 
500  | Server error 


### Sample Responses 

#### 200

```javascript 
    {
	"success": true,
	"msg": "user successfully authorized",
	"userData": 
	{
		"accessToken": "long_token_here",
		"firstname": "firstname",
		"lastname": "lastname",
		"email": "esavwede84@gmail.com",
		"emailVerified": true,
		"_id": "62af5d5f60efcbaa9e50f213"
	}
}
```


#### 400 


```javascript 
{
	"success": false,
	"msg": "check email and try again"
}
```
    
    
####  500 
```javascript 
{
	"sucess": false,
	"msg": " Server encountered error while signing in user "
}
```


