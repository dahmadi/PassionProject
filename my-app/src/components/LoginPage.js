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
    constructor(props) {
        super(props);

        let redirect_uri = "";
        if (process.env.NODE_ENV === 'production') {
            redirect_uri = 'http://localhost:3000';
        } else {
            redirect_uri = 'http://localhost:3000';
        }

        this.state = {
            client_id: "7501f8c6a720443b86aea58eb87b9749",
            redirect_uri: redirect_uri,
            scope: "user-top-read playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative",
            state: generateRandomString(16),
            access_token: null  // New state to store the access token
        };

        this.handleAuthClick = this.handleAuthClick.bind(this);
    }

    componentDidMount() {
        const body = document.querySelector("body");
        body.style.background = "#181818";

        // Check for access token in URL hash
        var params = this.getHashParams();
        if (params.access_token) {
            this.setState({ access_token: params.access_token });
        }
    }

    handleAuthClick(event) {
        const url = 'https://accounts.spotify.com/authorize';
        const params = new URLSearchParams({
            response_type: 'token',
            client_id: "7501f8c6a720443b86aea58eb87b9749",
            scope: this.state.scope,
            redirect_uri: this.state.redirect_uri,
            state: this.state.state,
        });

        const authUrl = `${url}?${params.toString()}`;
        window.location.href = authUrl;

        event.preventDefault();
    }

    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g, q = window.location.hash.substring(1);
        while ((e = r.exec(q)) !== null) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    render() {
        return (
            <div>
                <div className="header-container text-center" style={{ color: 'white' }}>
                    <p className="header-small">YOUR</p>
                    <h1 className="header">Spotify,<br />Wrapped</h1>
                </div>

                <div className="d-flex flex-column align-items-center fixed-bottom" style={{ marginBottom: '200px' }}>
                    <button onClick={this.handleAuthClick} className="btn btn-primary">Login with Spotify</button>
                </div>
            </div>
        );
    }
}

export default App;
