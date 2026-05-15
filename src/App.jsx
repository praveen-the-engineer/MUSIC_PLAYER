import { MusicPlayer } from "./components/MusicPlayer";
import { AllSongs } from "./components/AllSongs";
import { Playlists } from "./components/Playlists";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import { MusicProvider } from "./contexts/MusicContext";
import { Navbar } from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>
            <MusicProvider>
                <div className="app">
                    
                    <Navbar />

                    <main className="app-main">
                        
                        <div className="player-section">
                            <MusicPlayer />
                        </div>

                        <div className="content-section">
                            <Routes>
                                
                                {/* ✅ VERY IMPORTANT (default route) */}
                                <Route path="/" element={<AllSongs />} />

                                {/* Your routes */}
                                <Route path="/AllSongs" element={<AllSongs />} />
                                <Route path="/playlists" element={<Playlists />} />

                            </Routes>
                        </div>

                    </main>

                </div>
            </MusicProvider>
        </BrowserRouter>
    );
}

export default App;