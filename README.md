# StudioBlog
A clone of tamproduction.com wedding studio website with Blog management.

#### Feature:
- CRUD Blogs, Users.
- JWT Authentication: Sign in, Sign up.
- Search, Filters blogs, Comment ...

#### Setup environment variable
- Front-End .env
```.env
REACT_APP_BASE_URL=<Your nodejs application url path>
```
- Back-End .env
```.env
MONGO_URL=<MongoDB connection string>
DATABASE_NAME=<MongoDB database name>
FRONT_URL=<Your front-end url path>
API_KEY=<Google API Key> "Youtube Data API, Places API"
SECRET_KEY=<Your secret key>
SECRET_REFRESH_KEY=<Your refresh key>
```
[Google API](https://cloud.google.com)

#### Commands
- Use `npm install` to install and then `npm start` to start for both
