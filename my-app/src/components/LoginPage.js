import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button } from 'react-bootstrap';


function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

class App extends React.Component {
    constructor(props){
        super(props);

        let redirect_uri = ""
        if(process.env.NODE_ENV === 'production') {
            redirect_uri = 'http://localhost:3000'
        } else {
            redirect_uri = 'http://localhost:3000'
        }
        this.state = {
            client_id: "7501f8c6a720443b86aea58eb87b9749",
            redirect_uri: redirect_uri,
            scope: "user-top-read playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative",
            state: generateRandomString(16)
        }
        
        this.handleAuthClick = this.handleAuthClick.bind(this)
    }
    componentDidMount() {
        const body = document.querySelector("body")
        body.style.background = "#181818"
    }
    handleAuthClick(event) {
        var url = 'https://accounts.spotify.com/authorize';
            url += '?response_type=token';
            url += '&client_id=' + encodeURIComponent(this.state.client_id);
            url += '&scope=' + encodeURIComponent(this.state.scope);
            url += '&redirect_uri=' + encodeURIComponent(this.state.redirect_uri);
            url += '&state=' + encodeURIComponent(this.state.state);

        event.preventDefault();
        window.location = url 
    }
    render(){
      return(
          <div>
              <div className="header-container text-center" style={{ color: 'white' }}>
                  <p className="header-small">YOUR</p>
                  <h1 className="header">Spotify,<br/>Wrapped</h1>
              </div>
              <div className="d-flex flex-column align-items-center fixed-bottom" style={{ marginBottom: '200px' }}>
                  <button onClick={this.handleAuthClick} className="btn btn-primary">Login with Spotify</button>   
              </div>
              
          </div>
      )
  }
}

export default App;