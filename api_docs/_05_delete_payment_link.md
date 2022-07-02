
# DELETE PAYMENT LINK 
This endpoint to delete payment link 


###### ENDPOINT 
> /api/v1/paymentLink/:_id


###### METHOD 
> DELETE 


###### RESPONSE CODES 

CODE | MEANING 
-----|-------- 
200  | payment link deleted 
500  | Server error 


### Sample Responses 

#### 200

```javascript 
{
	"success": true,
	"msg": "payment linked deleted "
}
```
    
####  500 
```javascript 
{
	"sucess": false,
	"msg": " Server encountered error while deleting payment link"
}
```


