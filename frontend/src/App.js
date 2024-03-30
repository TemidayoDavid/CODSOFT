import { Route, Routes } from "react-router-dom";
import Main from "./components/Main/Main";

export default function App() {
  return (
    <Routes>
      <Route path="/" exact element={<Main />} />
    </Routes>
  );
}
