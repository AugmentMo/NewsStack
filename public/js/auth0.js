
const auth0Client = new auth0.WebAuth({
    domain: 'https://dev-5jwvrpxvncynkbsi.us.auth0.com',
    clientID: 'yJeGFMhKXrKQcXF2V9Wja7cyx7B0Mlg6',
    redirectUri: 'http://localhost:8080/',
    responseType: 'token id_token',
    scope: 'openid profile'
  });
  
  auth0Client.checkSession({}, (err, authResult) => {
    if (err) {
      console.error(err);
      return;
    }
  
      const accessToken = authResult.accessToken;
      console.log("accessToken", accessToken)
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8080/socket.io/?token=' + accessToken);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const socket = io('http://localhost:8080', { 
          transportOptions: {
            polling: {
              extraHeaders: {
                Authorization: 'Bearer ' + accessToken
              }
            }
          }
        });
        
        socket.on('connect', () => {
          console.log('Connected to socket server');
        });
  
        // Handle socket events here
      }
    };
    xhr.send();
  });
  