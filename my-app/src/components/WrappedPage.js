import React, { useState, useEffect, useCallback } from "react";

const WrappedPage = () => {
	const accessToken = new URLSearchParams(window.location.hash.substring(1)).get("access_token");
	const [userData, setUserData] = useState({});
	const [data, setData] = useState({
		short_term: { tracks: [], artists: [], genres: new Map() },
		medium_term: { tracks: [], artists: [], genres: new Map() },
		long_term: { tracks: [], artists: [], genres: new Map() },
	});
	const [selectedTerm, setSelectedTerm] = useState("short_term");

	const terms = ["short_term", "medium_term", "long_term"];

	// General async helper function to Fetch data from the Spotify API - supply endpoint to get data from and also retry 3 times waiting 30 seconds in between if ratelimit is hit
	const fetchData = useCallback(
		async (url, retryCount = 0) => {
			const response = await fetch(url, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			//handle errors if response is not a success
			if (!response.ok) {
				if (response.status === 401) {
					window.location.href = "/login"; // Redirect to login if token is invalid
				} else if (response.status === 429 && retryCount < 3) {
					// Retry up to 3 times
					const retryAfter = response.headers.get("Retry-After") || 30; // Use 30 seconds if header is missing
					console.log(`Rate limit hit, retrying in ${retryAfter} seconds...`);
					await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
					return fetchData(url, retryCount + 1); // Recursive retry call
				}
				throw new Error("Fetch error");
			}

			return response.json();
		},
		[accessToken]
	);

	// Update top items and genres for a term
	const updateTermData = useCallback(
		async (term) => {
			try {
				//execute async fetchData functions in parallel and waits until all of the requests are returned so that all data is in sync
				const [tracks, artists] = await Promise.all([
					fetchData(`https://api.spotify.com/v1/me/top/tracks?time_range=${term}&limit=50`),
					fetchData(`https://api.spotify.com/v1/me/top/artists?time_range=${term}&limit=50`),
				]);

				//get information of all most listened to artistis, speficially their generes
				const genres = new Map();
				await Promise.all(
					artists.items.map(async (artist) => {
						const artistData = await fetchData(`https://api.spotify.com/v1/artists/${artist.id}`);
						artistData.genres.forEach((genre) => {
							genres.set(genre, (genres.get(genre) || 0) + 1);
						});
					})
				);

				//update data state using spread operator for the term we fetched data for
				setData((prevData) => ({
					...prevData,
					[term]: { tracks: tracks.items, artists: artists.items, genres },
				}));
			} catch (error) {
				console.error(`Error updating data for term ${term}:`, error);
			}
		},
		[fetchData]
	);

	// Fetch user data and term data on mount
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const user = await fetchData(`https://api.spotify.com/v1/me`);
				setUserData(user);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchUserData();
		terms.forEach(updateTermData);
	}, [fetchData, updateTermData]);

	const currentData = data[selectedTerm];
	const currentGenres = Array.from(currentData.genres)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([genre, count], index) => `${index + 1}. ${genre}`);

	const currentTracks = currentData.tracks.slice(0, 20);
	const currentArtists = currentData.artists.slice(0, 20);

	// Mapping terms to more user-friendly labels
	const timeRangeDisplay = {
		short_term: "Last month",
		medium_term: "Last 6 months",
		long_term: "All time",
	};

	return (
		<div className="container mt-5 p-3 rounded" style={{ backgroundColor: "#191414" }}>
			<div className="row text-white g-4">
				<div className="col-md-4">
					<div className="p-3 bg-dark bg-opacity-50 rounded">
						<h2 className="text-success">Top Tracks</h2>
						<div className="overflow-auto" style={{ maxHeight: "400px" }}>
							<ul className="list-group">
								{currentTracks.map((track, index) => (
									<li key={index} className="list-group-item bg-transparent text-white border-0 mb-2">
										<img
											src={track.album.images[0].url}
											alt={track.name}
											className="img-fluid rounded me-2"
											style={{ width: "50px", height: "50px" }}
										/>
										<strong>{track.name}</strong> <br />
										<small>{track.artists.map((artist) => artist.name).join(", ")}</small>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="p-3 bg-dark bg-opacity-50 rounded">
						<h2 className="text-success">Top Artists</h2>
						<div className="overflow-auto" style={{ maxHeight: "400px" }}>
							<ul className="list-group">
								{currentArtists.map((artist, index) => (
									<li key={index} className="list-group-item bg-transparent text-white border-0 mb-2">
										<img
											src={artist.images[0].url}
											alt={artist.name}
											className="img-fluid rounded me-2"
											style={{ width: "50px", height: "50px" }}
										/>
										{artist.name}
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="p-3 bg-dark bg-opacity-50 rounded">
						<h2 className="text-success">Top Genres</h2>
						<ul className="list-group">
							{currentGenres.map((genre, index) => (
								<li key={index} className="list-group-item bg-transparent text-white border-0 mb-2">
									{genre}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
			<div className="my-4 d-flex justify-content-center">
				{terms.map((term) => (
					<button key={term} className="btn btn-success me-2" onClick={() => setSelectedTerm(term)}>
						Show {timeRangeDisplay[term]}
					</button>
				))}
			</div>
			<div className="text-center text-success mt-3">
				<p>YOUR SPOTIFY WRAPPED</p>
			</div>
		</div>
	);
};

export default WrappedPage;
