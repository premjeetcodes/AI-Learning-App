import { useState } from "react";
import Auth from "./Auth";
import Tracker from "./Tracker";

export default function App() {
  const [logged, setLogged] = useState(!!localStorage.getItem("token"));

  return logged ? <Tracker /> : <Auth onAuth={() => setLogged(true)} />;
}