
# /contactUs
This endpoint takes a contact details and message   


###### ENDPOINT 
> /api/v1/contactUs


###### METHOD 
> POST 



###### REQUEST BODY 
```javascript 
{
	"firstname":"firstname",
	"email":"useris@gmail.com"
}
```

###### RESPONSE CODES 

CODE | MEANING 
-----|-------- 
201  | contact form created 
400  | check user request body 
500  | Server error 


### Sample Responses 

#### 201

```javascript 
{
	"success": true,
	"msg": " contact us document created "
}
```


#### 400 


```javascript 
{
	"success": false,
	"msg": " check request body and try again "
}
```
    
    
####  500 
```javascript 
{
	"sucess": false,
	"msg": " server encountered error while creating contact us document "
}
```


