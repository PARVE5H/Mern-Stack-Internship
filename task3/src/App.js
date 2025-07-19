import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage.jsx";
import EditorPage from "./pages/EditorPage.jsx";
import { Provider } from "../src/components/ui/provider.jsx";
import { ColorModeProvider } from "../src/components/ui/color-mode.jsx";
import { Toaster } from "./components/ui/toaster.jsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <Provider>
          <Toaster />
          <ColorModeProvider>
            {" "}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/editor/:roomId" element={<EditorPage />} />
            </Routes>
          </ColorModeProvider>
        </Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
