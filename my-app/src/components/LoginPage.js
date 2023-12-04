import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function generateRandomString(length) {
	let text = "";
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

// Define constants outside the component
const CLIENT_ID = "3496780736d74344a32f33454638b00a";
const REDIRECT_URI =
	process.env.NODE_ENV === "production" ? "http://localhost:3000/wrapped" : "http://localhost:3000/wrapped";
const SCOPE =
	"user-top-read playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative";

const LoginPage = () => {
	const [authState, setAuthState] = useState(generateRandomString(16));

	const handleAuthClick = (event) => {
		event.preventDefault();
		const url = new URL("https://accounts.spotify.com/authorize");
		url.searchParams.append("response_type", "token");
		url.searchParams.append("client_id", CLIENT_ID);
		url.searchParams.append("scope", SCOPE);
		url.searchParams.append("redirect_uri", REDIRECT_URI);
		url.searchParams.append("state", authState);

		window.location = url.toString();
	};

	return (
		<div>
			<div
				className=" text-center"
				style={{
					color: "white",
					background: "linear-gradient(135deg, #1DB954 0%, #1E3264 100%)",
					padding: "60px 20px",
					borderRadius: "15px",
					margin: "50px",
					boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
				}}
			>
				<p className="header-small" style={{ fontSize: "2em", fontWeight: "bold", marginBottom: "10px" }}>
					Your Year in Music
				</p>
				<h1 className="header" style={{ fontSize: "3.5em", fontWeight: "800", letterSpacing: "1px" }}>
					Spotify Wrapped
				</h1>
				<p style={{ fontSize: "1.25em", marginTop: "20px", maxWidth: "600px", margin: "20px auto" }}>
					Dive into your top songs, artists, and genres from the past year and share your musical journey with
					friends.
				</p>
			</div>
			<div className="align-items-center" style={{ position: "absolute", width: "100%", textAlign: "center" }}>
				<button
					onClick={handleAuthClick}
					className="btn"
					style={{
						background: "#1DB954",
						color: "white",
						padding: "15px 30px",
						fontSize: "1.2em",
						borderRadius: "25px",
						border: "none",
						transition: "background-color 0.3s, transform 0.3s",
						boxShadow: "0 2px 4px 0 rgba(0,0,0,0.3)",
					}}
				>
					Log in with Spotify
				</button>
				<p style={{ color: "gray", marginTop: "20px", fontSize: "1em" }}>
					Not a Spotify user yet?{" "}
					<a href="https://www.spotify.com/us/signup/" style={{ color: "#1DB954", textDecoration: "none" }}>
						Sign up here
					</a>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;