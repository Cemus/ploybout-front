import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home/HomePage";
import Register from "./components/auth/RegisterPage";
import Login from "./components/auth/LoginPage";
import Profile from "./components/profile/ProfilePage";
import CombatPage from "./components/combat/CombatPage";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import News from "./components/home/NewsPage";
import Tcu from "./components/home/TcuPage";
import CharacterEditorPage from "./components/character/character-editor/CharacterEditorPage";
import CollectionPage from "./components/cards/CollectionPage";
import Battlefield from "./components/combat/Battlefield";
import { AuthProvider } from "./contexts/AuthContext";
import { DndProvider } from "react-dnd";
import { MultiBackend } from "react-dnd-multi-backend";
import { FighterProvider } from "./contexts/FighterContext";
import EquipmentPage from "./components/equipment/EquipmentPage";
import { HTML5toTouch } from "rdndmb-html5-to-touch";

function App() {
  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <AuthProvider>
        <FighterProvider>
          <HashRouter>
            <div className="flex flex-col h-full min-h-screen bg-gradient-to-br to-75% from-gray-800 to-gray-900">
              <Header />
              <Routes>
                {"Main"}
                <Route path="/" Component={Home} />
                <Route path="/news" Component={News} />
                <Route path="/about" Component={News} />
                <Route path="/gcu" Component={Tcu} />
                <Route path="/register" Component={Register} />
                <Route path="/login" Component={Login} />
                <Route path="/profile" Component={Profile} />
                <Route path="/arena" Component={CombatPage} />
                <Route path="/collection" Component={CollectionPage} />
                <Route path="/equipment" Component={EquipmentPage} />
                <Route path="/battlefield" Component={Battlefield} />
                <Route path="/editor" Component={CharacterEditorPage} />
              </Routes>
              <Footer />
            </div>
          </HashRouter>
        </FighterProvider>
      </AuthProvider>
    </DndProvider>
  );
}
export default App;
