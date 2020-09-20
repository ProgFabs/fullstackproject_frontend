import React, { useState, useEffect } from "react";
import FilterModal from "./FilterModal";
import NewPlaylistModal from "./NewPlaylistModal"
import FloatingMusicPlayer from "./FloatingMusicPlayer";
import HomeNavBar from "../HomeNavBar";

import { useHistory } from "react-router-dom"
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import axios from "axios";
import styled from "styled-components";

import ReactPlayer from "react-player";
import ReactAudioPlayer from "react-audio-player";

const MainContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  background-color: #f2f7fd;

  @media (min-width: 320px) {
    width: 100vw;
  }

  @media (min-width: 768px) {
    max-width: 768px;
  }

  @media (min-width: 1024px) {
    max-width: 100%;
    height: 100%;
    width: 100%;
  }
`;

const HeaderWrapper = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 320px) {
    width: 90%;
  }

  @media (min-width: 1024px) {
    width: 50%;
  }
`;

const MusicHeader = styled.div`
  background-color: #fff;
  margin-bottom: 16px;
  width: 50%;
  height: 20%;
  box-shadow: 0 0 1.25rem 0 rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-around;
  cursor: pointer;

  @media (min-width: 320px) {
    width: 90%;
    font-size: 0.8em;
  }

  @media (min-width: 375px) {
    font-size: 0.9em;
    width: 90%;
  }

  @media (min-width: 411px) {
    font-size: 1em;
  }

  @media (min-width: 768px) {
    font-size: 1.25em;
  }

  @media (min-width: 1024px) {
    width: 50%;
    font-size: 1em;
  }
`;

const PlaylistTitle = styled.p`
  color: #116dee;
  font-size: 1.5rem;
  width: 25%;

  @media (min-width: 320px) {
    font-size: 1.25rem;
  }

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
`;

const ViewMore = styled.p`
  width: 25%;
  text-decoration: underline;
`;

const PlaylistSubtitle = styled.p`
  width: 45%;
`;

export const IconsWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  width: 10%;

  @media (min-width: 320px) {
    width: 15%;
  }

  @media (min-width: 768px) {
    width: 5%;
  }

  @media (min-width: 1024px) {
    width: 10%;
  }
`

const baseUrl = "http://ec2-34-204-93-195.compute-1.amazonaws.com:3000";

const PlaylistsPage = () => {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([])
  const [token, setToken] = useState(null);
  const [songModal, setSongModal] = useState(false);
  const [renderedList, setRenderedList] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [newPlaylistModal, setNewPlaylistModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState("");
  const [currentPlayingSong, setCurrentPlayingSong] = useState("");
  const [currentPlayingFile, setCurrentPlayingFile] = useState("");
  const [currentVolume, setCurrentVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [currentPausedSong, setCurrentPausedSong] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const [orderBy, setOrderBy] = useState("");
  const [musicGenre, setMusicGenre] = useState("");

  const history = useHistory();
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setToken(token);

    if (!token) {
      history.push("/login");
    } else {
      getPlaylists();
    }
  }, [token, playlists]);

  const axiosConfig = {
    headers: {
      auth: token,
    },
  };


  const handleSongModal = (song) => {
    setSongModal(true);
    setSelectedSong(song);
  };

  const handleNewPlaylistModal = () => {
    setNewPlaylistModal(true);
  };


  const handleFilterModal = () => {
    setFilterModal(true);
  };

  const handleMusicPlayer = (song) => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setCurrentPausedSong(song);
    } else if (isPlaying) {
      setCurrentPausedSong("");
    }

    if (song.file !== currentPlayingSong.file) {
      setCurrentPlayingSong("");
    }

    if (song.file.includes("youtu")) {
      setCurrentPlayingSong(song);
    } else {
      const newSongFile = `http://30a23c945efd.ngrok.io/${song.file}.mp3`;
      song.file = newSongFile;
      setCurrentPlayingSong(song);
    }
  };

  const handleSongVolume = (volume) => {
    if (currentVolume <= 0.9) {
      if (volume === "up") {
        let newVolume = currentVolume + 0.1;
        setCurrentVolume(newVolume);
      }
    }
    if (currentVolume >= 0.1) {
      if (volume === "down") {
        let newVolume = currentVolume - 0.1;
        setCurrentVolume(newVolume);
      }
    }
  };

  const getPlaylists = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/playlist/`, axiosConfig
      );
      console.log(response)
      setPlaylists(response.data.playlists);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const handleProgress = (progress) => {
    console.log("onProgress", progress);
    setProgress(progress.playedSeconds.toFixed());
  };

  const goToPlaylistDetails = (id) => {
    history.push(`/playlists/${id}`)
  }

  const setURLQuery = (genre, order) => {
    setOrderBy(order);
    setMusicGenre(genre);
    console.log("MUDEI");
    console.log("NOVO GÊNERO", genre);
    console.log("NOVA ORDEM", order);
  };

  const refreshPage = () => {
      getPlaylists();
  }

  return (
    <>
      <HomeNavBar />
      <MainContainer>
        <HeaderWrapper>
          <Typography variant="h5"> Mostrando todas as playlists </Typography>
          <Button
            variant="contained"
            size="large"
            style={{
              backgroundColor: "#116dee",
              color: "#FFF",
              fontWeight: "bold",
              height: "100%",
              width: "25%",
              borderRadius: 30,
            }}
            onClick={() => handleNewPlaylistModal()}
          >
            Criar nova playlist
          </Button>
          <Button
            variant="contained"
            size="large"
            style={{
              backgroundColor: "#116dee",
              color: "#FFF",
              fontWeight: "bold",
              height: "100%",
              width: "25%",
              borderRadius: 30,
            }}
            onClick={() => handleFilterModal()}
          >
            Filtrar
          </Button>
        </HeaderWrapper>
        {playlists.map((playlist) => {
          return (
            <>
              <MusicHeader>
                <PlaylistTitle>{playlist.title}</PlaylistTitle>
                <PlaylistSubtitle>{playlist.subtitle}</PlaylistSubtitle>
                <ViewMore onClick={() => goToPlaylistDetails(playlist.id)}>
                  Ir para músicas da playlist
                </ViewMore>
              </MusicHeader>
            </>
          );
        })}
        <FilterModal
          open={filterModal}
          onClose={() => setFilterModal(false)}
          setURLQuery={setURLQuery}
        />
        <NewPlaylistModal
          open={newPlaylistModal}
          onClose={() => setNewPlaylistModal(false)}
          refreshPage={refreshPage}
        />
      </MainContainer>
    </>
  );
};

export default PlaylistsPage;
