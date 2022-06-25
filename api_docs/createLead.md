
# CREATE LEAD 
This endpoint takes a user email and adds it to leads  


###### ENDPOINT 
> /api/v1/lead


###### METHOD 
> POST 



###### REQUEST BODY 
```javascript 
{
    "email":"user@gmail.com"
}
```

###### RESPONSE CODES 

CODE | MEANING 
-----|-------- 
200  | Lead created 
400  | check user email
500  | Server error 


### Sample Responses 

#### 200

```javascript 
{
	"success": true,
	"msg": " new lead created "
}
```


#### 400 


```javascript 
{
	"success": false,
	"msg": " check email "
}
```
    
    
####  500 
```javascript 
{
	"sucess": false,
	"msg": " server encountered error while creating lead"
}
```


