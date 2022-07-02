
# USER SIGNUP 
This endpoint signs gets a particular payment link created by a usr 


###### ENDPOINT 
> /api/v1/paymentLink/:_id


###### METHOD 
> GET


###### RESPONSE CODES 

CODE | MEANING 
-----|-------- 
200 | payment link details 
500  | Server error 


### Sample Responses 

#### 200

```javascript 
{
	"success": true,
	"msg": " payment link retrieved ",
	"paymentLink": {
		"_id": "62bf8de0a934ebd6cc4a259e",
		"name": "tea payment",
		"amount": 1000,
		"description": "This link is payment of our magic tea",
		"link": "http://localhost:3000/api/v1/payment/magicTea",
		"currency": "NGN"
	}
}
```

    
####  500 
```javascript 
{
	"sucess": false,
	"msg": " Server encountered error while getting payment link "
}
```


