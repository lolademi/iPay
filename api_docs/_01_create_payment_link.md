# Create Payment Link 

This endpoint is for creation of a payment link 

###### ENDPOINT

> /api/v1/paymentLink


###### METHOD
> POST


###### REQUEST BODY 
```javascript 
{
    "name":"tea payment",
    "amount":"1000",
    "description":"This link is payment of our magic tea",
    "currency":"NGN",
    "redirect_url":"https://www.google.com",
    "custom_name":"magicTea"
}
``` 


###### RESPONSE    CODES 

CODE  |  MEANING 
------|---------
201   | payment link created 
400   | bad request body 
500   | server error 




###### SAMPLE RESPONSES 

#### 201 
```javascript 
{
	"success": true,
	"msg": " payment link created ",
	"paymentLink": {
		"merchant_id": "62bf86bd489569c1ee8ca0e3",
		"name": "tea payment",
		"amount": 1000,
		"description": "This link is payment of our magic tea",
		"link": "http://localhost:3000/api/v1/payment/magicTea",
		"currency": "NGN",
		"redirect_url": "https://www.google.com",
		"paymentCount": 0,
		"link_id": "magicTea",
		"_id": "62bf8c99a934ebd6cc4a259a",
		"createdOn": "2022-07-02T00:08:57.175Z",
		"__v": 0
	}
}
``` 

#### 400 
```javascript 
``` 

#### 500 
```javascript 
{
    "success": false, 
    "msg":" Server encountered error while creating payment link"
}
``` 