# [NewsStack.info](https://newsstack.info) – Curate news stacks that matter to you.


Follow the topics and headlines that really interest you and track them all in one view!


<img src="https://github-production-user-asset-6210df.s3.amazonaws.com/62531877/253735973-3fa99beb-6187-45e9-a54d-f4933a988168.png" alt= “” width="800px" href="https://newsstack.info">
Website: https://newsstack.info

## Supported News Platforms

1. ✅ Google News (RSS Feed)
2. ❌ Twitter (coming soon⌛️)
3. ❌ Reddit (coming soon⌛️)
4. ❌ Google Scholar (coming soon⌛️)
5. ❌ Semantic Scholar (coming soon⌛️)

## Next Up

1. ~~Switch to HTTPS/SSL~~
2. ~~Auth0 implementation – user profile accessible via any device (in progress)~~
3. ~~More dynamic content loading – Speed up loading news~~
4. Implement caching of news data – Speed up loading news 
5. ~~Add Search String Tipps – Show users how to use the search string effectively~~
6. ~~Add onboarding feature – 3 steps user guide~~
7. Add new news platforms

## Run your own NewsStack server locally

1. Clone the repository ```git clone https://github.com/AugmentMo/NewsStack.git```
2. Navigate into the repository folder ```cd NewsStack/```
3. Install all dependencies ```npm install```
4. Start the server ```npm start```
5. Visit ```http://localhost:80/``` using your webbrowser

Thats it. This will run a lean version without Auth0, https, mixpanel and mongodb to save your newsstack user data.

## Configuring Additional Features

### Set up MongoDB
The NewsStack server will by default try to connect to a MongoDB server at ```mongodb://localhost:27017```
to save newsstack user data. If you have no MongoDB server running, your NewsStack server will not allow to work with newsstack user data and e.g. someones configured stacks will only be saved in the local browser storage (which is not suitable for longterm and cross-browser usage).

To set up up a mongodb server for your system please refer to:

https://www.mongodb.com/docs/manual/installation/#mongodb-installation-tutorials

### Setting up Environment Variables File (for using Auth0, https, or Mixpanel)
You can configure additional features such as using Auth0, https, mixpanel and the mongodb address.
For this you need to create a environment variable ```.env``` in your repository directory.

#### Example .env file content

```
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_DOMAIN=https://dev-1234567890.us.auth0.com
AUTH0_BASE_URL=https://yourwebserver.com/
MIXPANEL_TOKEN=
MONGODB_URI=mongodb://localhost:27017
SSL_KEY_FILEPATH=/app/sslcerts/privkey.pem
SSL_CERT_FILEPATH=/app/sslcerts/fullchain.pem
```
These environment variables will be automatically loaded when starting your server.
As soon as the variables are defined, your server will try to use the corresponding features. 
