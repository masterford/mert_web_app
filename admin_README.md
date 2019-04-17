localhost:3000/api: used for both adding new users to the database and adding new requests to the database (Note you cannot add a request for a certain user without having already signed that user up).

Example sign up user: localhost:3000/api?username=matteos&password=password1

Example add request: localhost:3000/api?type=MERT&date=05/04/2019&latitude=72.916&longitude=72.2&username=matteos&phoneNumber=2155302588

localhost:3000/all: Used to display all requests. If you click on status it redirects you to a page where you can update that request to Accepted or Completed and changes should update to the database (they still don't tho because of some bug). If you click on delete request it will delete it from the database.