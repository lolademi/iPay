
# VERIFY EMAIL 
This endpoints checks the user verification code and 
verifies the user if verification code correct 


###### ENDPOINT 
> /api/v1/verifyEmail/:verificationCode


###### METHOD 
> GET


###### RESPONSE CODES 

CODE | MEANING 
-----|-------- 
200  | Email verified
400  | Invalid verification code
500  | Server error  


### Sample Responses 

#### 200

```javascript 
{
	"success": true,
	"msg": " email verified "
}
```

#### 400 

```javascript 
{
	"success": false,
	"msg": " Invalid verification link "
}
```
    
####  500 
```javascript 
{
	"sucess": false,
	"msg": " Server encountered error during email verification "
}
```


