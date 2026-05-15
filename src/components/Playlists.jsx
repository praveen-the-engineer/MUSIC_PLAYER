import { useState } from "react";
import { useMusic } from "../contexts/MusicContext";

export const Playlists = () => {
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [showDropDown, setShowDropDown] = useState(false);

    const {
        playlists = [], // ✅ safe fallback
        createPlaylist,
        allSongs = [], // ✅ safe fallback
        addSongToPlaylist,
        currentTrackIndex,
        handlePlaying,
        deletePlaylist
    } = useMusic();

    // ✅ Safe filtering
    const filteredSongs = allSongs.filter((song) => {
        const matches =
            song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchQuery.toLowerCase());

        const isAlreadyInPlaylist = selectedPlaylist?.songs?.some(
            (playlistSong) => playlistSong.id === song.id
        );

        return matches && !isAlreadyInPlaylist;
    });

    const handleCreatePlaylist = () => {
        if (newPlaylistName.trim()) {
            createPlaylist(newPlaylistName.trim());
            setNewPlaylistName("");
        }
    };

    const handleAddSong = (song) => {
        if (selectedPlaylist) {
            addSongToPlaylist(selectedPlaylist.id, song);
            setSearchQuery("");
            setShowDropDown(false);
        }
    };

    const handlePlayFromPlaylist = (song) => {
        const globalIndex = allSongs.findIndex((s) => s.id === song.id);
        handlePlaying(song, globalIndex);
    };

    const deletePlaylistConfirmation = (playlist) => {
        if (window.confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
            deletePlaylist(playlist.id);
        }
    };

    return (
        <div className="playlists">
            <h2>Playlists</h2>

            {/* CREATE PLAYLIST */}
            <div className="create-playlist">
                <h3>Create New Playlists</h3>
                <div className="playlist-form">
                    <input
                        type="text"
                        placeholder="Playlist name..."
                        className="playlist-input"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                    />
                    <button className="create-btn" onClick={handleCreatePlaylist}>
                        Create
                    </button>
                </div>
            </div>

            {/* PLAYLIST LIST */}
            <div className="playlist-list">
                {!Array.isArray(playlists) || playlists.length === 0 ? (
                    <p className="empty-message">No Playlists created yet</p>
                ) : (
                    playlists.map((playlist) => (
                        <div className="playlist-item" key={playlist.id}>
                            
                            {/* HEADER */}
                            <div className="playlist-header">
                                <h3>{playlist.name}</h3>
                                <button
                                    className="delete-playlist-btn"
                                    onClick={() => deletePlaylistConfirmation(playlist)}
                                >
                                    Delete
                                </button>
                            </div>

                            {/* ADD SONG */}
                            <div className="add-song-section">
                                <div className="search-container">
                                    <input
                                        type="text"
                                        placeholder="Search songs..."
                                        value={
                                            selectedPlaylist?.id === playlist.id
                                                ? searchQuery
                                                : ""
                                        }
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setSelectedPlaylist(playlist);
                                            setShowDropDown(e.target.value.length > 0);
                                        }}
                                        onFocus={(e) => {
                                            setSelectedPlaylist(playlist);
                                            setShowDropDown(e.target.value.length > 0);
                                        }}
                                        className="song-search-input"
                                    />

                                    {selectedPlaylist?.id === playlist.id &&
                                        showDropDown && (
                                            <div className="song-dropdown">
                                                {filteredSongs.length === 0 ? (
                                                    <div className="dropdown-item">
                                                        No songs found
                                                    </div>
                                                ) : (
                                                    filteredSongs.slice(0, 5).map((song) => (
                                                        <div
                                                            key={song.id}
                                                            className="dropdown-item"
                                                            onClick={() => handleAddSong(song)}
                                                        >
                                                            <span>{song.title}</span> -{" "}
                                                            <span>{song.artist}</span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* SONG LIST */}
                            <div className="playlist-songs">
                                {!playlist.songs || playlist.songs.length === 0 ? (
                                    <p className="empty-playlist">
                                        No songs in this playlist
                                    </p>
                                ) : (
                                    playlist.songs.map((song) => (
                                        <div
                                            key={song.id}
                                            className={`playlist-song ${
                                                currentTrackIndex ===
                                                allSongs.findIndex((s) => s.id === song.id)
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() => handlePlayFromPlaylist(song)}
                                        >
                                            <div className="song-info">
                                                <span>{song.title}</span>
                                                <span>{song.artist}</span>
                                            </div>
                                            <span>{song.duration}</span>
                                        </div>
                                    ))
                                )}
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};