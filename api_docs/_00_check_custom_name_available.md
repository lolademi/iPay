
# CHECK IF CUSTOM NAME TAKEN 
This endpoint checks if a custom link name is taken 


###### ENDPOINT 
> /api/v1/paymentLink/nameExists/:name 


###### METHOD 
> GET


###### RESPONSE CODES 

CODE | MEANING 
-----|-------- 
200  | name available 
400  | name taken  
500  | Server error 


### Sample Responses 

#### 201

```javascript 
{
	"success": true,
	"msg": " custom name available "
}
```


#### 400 

```javascript 
{
	"success": false,
	"msg": " custom name taken "
}
```
    
    
####  500 
```javascript 
{
	"sucess": false,
	"msg": " Server encountered error while checking if custom name taken "
}
```


