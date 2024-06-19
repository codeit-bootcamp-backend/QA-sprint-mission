// import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Items from "pages/Items";
import Register from "pages/Register";
import Signin from "pages/Signin";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/items" element={<Items />} />
          <Route path="/registration" element={<Register />} />
          {/* <Route path="/login" element={<Signin />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
