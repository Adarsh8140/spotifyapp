/* Older version of Spotify */
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";
// import {
//   Button,
//   Container,
//   Form,
//   Col,
//   Row,
//   Navbar,
//   Card,
//   Spinner,
// } from "react-bootstrap";
// import { useState } from "react";
// function App() {
//   const [keyword, setKeyword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [tracks, setTracks] = useState([]);
//   const getTracks = async () => {
//     setIsLoading(true);
//     let data = await fetch(
//       `https://v1.nocodeapi.com/adarsh0003/spotify/RgkBojAzkQThIgRR/search?q=${keyword}&type=track`
//     );
//     ("https://v1.nocodeapi.com/adarsh0003/spotify/RgkBojAzkQThIgRR/recentlyPlayed");
//     // `https://v1.nocodeapi.com/adarsh0003/spotify/RgkBojAzkQThIgRR/search?q=${keyword==""?"trending":keyword}&type=track`
//     let convertedData = await data.json();
//     console.log(convertedData.tracks.items);
//     setTracks(convertedData.tracks.items);
//     setIsLoading(false);
//   };
//   return (
//     <>
//       <Navbar expand="lg" className="bg-body-tertiary">
//         <Container fluid>
//           <Navbar.Brand href="/">A-Music</Navbar.Brand>
//           <Navbar.Collapse id="navbarScroll">
//             <Form className="d-flex justify-content-center Searchbtn">
//               <Form.Control
//                 value={keyword}
//                 onChange={(event) => {
//                   setKeyword(event.target.value);
//                 }}
//                 type="search"
//                 placeholder="Search"
//                 className="me-2"
//                 aria-label="Search"
//               />
//               <Button onClick={getTracks} variant="outline-success ">
//                 Search
//               </Button>
//             </Form>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>
//       <Container fluid className="section-container">
//         <Row className="row-container">
//           <Col className="col1-container">
//             <img src="hero.jpg" alt="" />
//           </Col>
//         </Row>
//       </Container>

//       <div className="container">
//         <div className={`row ${isLoading ? "" : "d-none"}`}>
//           <div className="col-12 py-5 text-center">
//             <Spinner animation="border" role="status">
//               <span className="visually-hidden ">Loading...</span>
//             </Spinner>
//           </div>
//         </div>
//         <div className={`row ${keyword === "" ? "" : "d-none"}`}>
//           <div className="col-12 py-5 text-center">
//             <h1>A-music</h1>
//           </div>
//         </div>
//         <div className="row">
//           {tracks.map((element) => {
//             return (
//               <>
//                 <div key={element.id} className="col-lg-3 col-md-6 py-2">
//                   <Card>
//                     <Card.Img variant="top" src={element.album.images[1].url} />
//                     <Card.Body>
//                       <Card.Title>{element.name}</Card.Title>
//                       <Card.Text>
//                         <span>Artist: {element.artists[0].name}</span>
//                       </Card.Text>{" "}
//                       <Card.Text>
//                         <span>Released : {element.album.release_date}</span>
//                       </Card.Text>
//                       <audio
//                         src={element.preview_url}
//                         controls
//                         className="w-100"
//                       ></audio>
//                     </Card.Body>
//                   </Card>
//                 </div>
//               </>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useContext, useEffect, useState } from "react";
import Card from "./components/Card";
import CreatePlaylist from "./components/CreatePlaylist";
import { initializePlaylist } from "./initialize";
import Navbar from "./components/NavigationBar";
import { MusicContext } from "./Context";

function App() {
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("");
  const [tracks, setTracks] = useState([]);
  const [token, setToken] = useState(null);

  const musicContext = useContext(MusicContext);
  const isLoading = musicContext.isLoading;
  const setIsLoading = musicContext.setIsLoading;
  const setLikedMusic = musicContext.setLikedMusic;
  const setpinnedMusic = musicContext.setPinnedMusic;
  const resultOffset = musicContext.resultOffset;
  const setResultOffset = musicContext.setResultOffset;

  const fetchMusicData = async () => {
    setTracks([]);
    window.scrollTo(0, 0);
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${keyword}&type=track&offset=${resultOffset}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch music data");
      }

      const jsonData = await response.json();

      setTracks(jsonData.tracks.items);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setResultOffset(0);
      fetchMusicData();
    }
  };

  useEffect(() => {
    initializePlaylist();

    // current client credentials will be deleted in few days
    const fetchToken = async () => {
      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials&client_id=a77073181b7d48eb90003e3bb94ff88a&client_secret=68790982a0554d1a83427e061e371507",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const jsonData = await response.json();
        setToken(jsonData.access_token);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchToken();
    setLikedMusic(JSON.parse(localStorage.getItem("likedMusic")));
    setpinnedMusic(JSON.parse(localStorage.getItem("pinnedMusic")));
  }, [setIsLoading, setLikedMusic, setpinnedMusic]);

  return (
    <>
      <Navbar
        keyword={keyword}
        setKeyword={setKeyword}
        handleKeyPress={handleKeyPress}
        fetchMusicData={fetchMusicData}
      />

      <div className="container">
        <div className={`row ${isLoading ? "" : "d-none"}`}>
          <div className="col-12 py-5 text-center">
            <div
              className="spinner-border"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        <div className="row">
          {tracks.map((element) => {
            return <Card key={element.id} element={element} />;
          })}
        </div>
        <div className="row" hidden={tracks.length === 0}>
          <div className="col">
            <button
              onClick={() => {
                setResultOffset((previous) => previous - 20);
                fetchMusicData();
              }}
              className="btn btn-outline-success w-100"
              disabled={resultOffset === 0}
            >
              Previous Next Page: {resultOffset / 20}
            </button>
          </div>
          <div className="col">
            <button
              onClick={() => {
                setResultOffset((previous) => previous + 20);
                fetchMusicData();
              }}
              className="btn btn-outline-success w-100"
            >
              Next Page: {resultOffset / 20 + 2}
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h4 className="text-center text-danger py-2">{message}</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12 py-5 text-center">
            <h1>
              <i class="bi bi-music-note-beamed mx-3"></i> MusicBox
            </h1>
            <h3 className="py-5">Discover music in 30 seconds</h3>
            <div>
              <a
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-dark"
                href="https://github.com/Adarsh8140/spotifyapp"
              >
                <i className="bi bi-github mx-2"></i>Github
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade position-absolute"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <CreatePlaylist />
      </div>
    </>
  );
}

export default App;
