import { createContext, useState, useContext, useEffect } from "react";

const MusicContext = createContext();

const songs = [
    { id: 1, title: "Keep You Away", artist: "EchoBR", url: "/songs/Keep You Away.wav", duration: "4:32" },
    { id: 2, title: "Breaching", artist: "EchoBR", url: "/songs/Breaching.wav", duration: "3:45" },
    { id: 3, title: "Forgotten Memories", artist: "EchoBR", url: "/songs/Forgotten Memories.wav", duration: "3:12" },
    { id: 4, title: "Nothing You Really Want", artist: "EchoBR", url: "/songs/nothing you really want.wav", duration: "2:58" },
    { id: 5, title: "Glacier Blue", artist: "EchoBR", url: "/songs/Glacier Blue.wav", duration: "3:28" },
    { id: 6, title: "In Love", artist: "EchoBR", url: "/songs/In Love.wav", duration: "3:15" },
    { id: 7, title: "Lemon Balm", artist: "EchoBR", url: "/songs/Lemon Balm.wav", duration: "3:42" },
    { id: 8, title: "Momentary Bliss", artist: "EchoBR", url: "/songs/Momentary Bliss.wav", duration: "2:45" },
];

export const MusicProvider = ({ children }) => {

    const [allSongs] = useState(songs);
    const [currentTrack, setCurrentTrack] = useState(songs[0]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);

    // ✅ Playlist state
    const [playlists, setPlaylists] = useState([]);

    // ✅ Load playlists from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("musicPlayerPlaylists");
        if (saved) {
            try {
                setPlaylists(JSON.parse(saved));
            } catch {
                setPlaylists([]);
            }
        }
    }, []);

    // ✅ Save playlists to localStorage
    useEffect(() => {
        if (playlists.length > 0) {
            localStorage.setItem("musicPlayerPlaylists", JSON.stringify(playlists));
        } else {
            localStorage.removeItem("musicPlayerPlaylists");
        }
    }, [playlists]);

    const handlePlaying = (song, index) => {
        setCurrentTrack(song);
        setCurrentTrackIndex(index);
    };

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => {
            const nextIndex = (prev + 1) % allSongs.length;
            setCurrentTrack(allSongs[nextIndex]);
            return nextIndex;
        });
        setIsPlaying(false);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => {
            const nextIndex = prev === 0 ? allSongs.length - 1 : prev - 1;
            setCurrentTrack(allSongs[nextIndex]);
            return nextIndex;
        });
        setIsPlaying(false);
    };

    const formatTime = (time) => {
        if (isNaN(time) || time === undefined) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    // ✅ Create playlist
    const createPlaylist = (name) => {
        const newPlaylist = {
            id: Date.now(),
            name,
            songs: [],
        };
        setPlaylists((prev) => [...prev, newPlaylist]);
    };

    // ✅ Delete playlist
    const deletePlaylist = (playlistId) => {
        setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    };

    // ✅ Add song to playlist (no duplicates)
    const addSongToPlaylist = (playlistId, song) => {
        setPlaylists((prev) =>
            prev.map((playlist) => {
                if (playlist.id === playlistId) {
                    const exists = playlist.songs.some(s => s.id === song.id);
                    if (exists) return playlist;

                    return {
                        ...playlist,
                        songs: [...playlist.songs, song],
                    };
                }
                return playlist;
            })
        );
    };

    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);

    return (
        <MusicContext.Provider
            value={{
                allSongs,
                handlePlaying,
                currentTrack,
                currentTrackIndex,
                currentTime,
                setCurrentTime,
                formatTime,
                duration,
                setDuration,
                nextTrack,
                prevTrack,
                play,
                pause,
                isPlaying,
                volume,
                setVolume,
                createPlaylist,
                playlists,
                addSongToPlaylist,
                setCurrentTrack,
                deletePlaylist,
            }}
        >
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const contextValue = useContext(MusicContext);
    if (!contextValue) {
        throw new Error("useMusic must be used inside of MusicProvider");
    }
    return contextValue;
};