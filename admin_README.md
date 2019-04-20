localhost:3000/api: used for both adding new users to the database and adding new requests to the database (Note you cannot add a request for a certain user without having already signed that user up).

Example sign up user: https://mert-app.herokuapp.com/api?username=matteos&password=password1

Example add request: https://mert-app.herokuapp.com/api?type=MERT&date=05/04/2019&latitude=72.916&longitude=72.2&username=matteos&phoneNumber=2155302588

Check request status: https://mert-app.herokuapp.com/api/check_status?id=0

Remove request status: https://mert-app.herokuapp.com/api/remove?id=0

All police requests: https://mert-app.herokuapp.com/api/find_police