
# GET PAYMENT LINKS 
This endpoint retrieves all the payment links created by a user 


###### ENDPOINT 
> /api/v1/paymentLink


###### METHOD 
> GET 


###### RESPONSE CODES 

CODE | MEANING 
-----|-------- 
200  | an array of payment links 
500  | Server error 


### Sample Responses 

#### 200

```javascript 
{
	"success": true,
	"msg": "payment links fetched ",
	"paymentLinks": [
		{
			"_id": "62bf8de2a934ebd6cc4a25a0",
			"name": "tea payment",
			"amount": 1000,
			"description": "This link is payment of our magic tea",
			"link": "http://localhost:3000/api/v1/payment/magicTea",
			"currency": "NGN",
			"createdOn": "2022-07-02T00:14:26.063Z"
		},
		{
			"_id": "62bf8de7a934ebd6cc4a25a2",
			"name": "teadfghjkl payment",
			"amount": 1000,
			"description": "This link is payment of our magic tea",
			"link": "http://localhost:3000/api/v1/payment/magicTea",
			"currency": "NGN",
			"createdOn": "2022-07-02T00:14:31.808Z"
		}
	]
}

```
    
 
    
####  500 
```javascript 
{
	"sucess": false,
	"msg": " Server encountered error while getting payment links "
}
```


