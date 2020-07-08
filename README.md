# Animega
---
##### Animega is a website where users can create and review anime shows that they watch.In order to review or add an anime show, you must have an account.
##### This project was created using Node.js, Express, MongoDB, and Bootstrap4. Passport.js was used to handle authentication.
---
# Features
- Users can create, edit, and remove anime entries.
- Users can review animes once, and edit or remove their review
- User profiles include more information on the user (full name, email, join date, profile picture), their animes, and the option to edit their profile or delete    their account.
- Search anime from the list by name.
# Run it locally
1. Install mongodb
2. Create a cloudinary account to get an API key and secret code

```
git clone https://github.com/sharad86/Animega.git
cd Animega
npm install
```
Create a .env file (or just export manually in the terminal) in the root of the project and add the following:  

```
DATABASEURL='<url>'
API_KEY=''<key>
API_SECRET='<secret>'
```

Run ```mongod``` in another terminal and ```node app.js``` in the terminal with the project.  

Then go to [localhost:3000](http://localhost:3000/).



