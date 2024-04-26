import React from "react";
import { useState } from "react";
import Header from "./components/header";
import Notebook from "./components/notebook";
import Auth from "./components/auth";
import Reg from "./components/reg";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";


export default function App() {
  const email = localStorage.getItem("user");
  const [user, setUser] = useState(email);
  const [notebooks, setNotebooks] = useState([]);
  const [notebook_id, setNotebookId] = useState('');
  return (
    <div className="bg-primary h-full px-8">
        <Router>
          {user && <Header setUser={setUser} notebooks={notebooks} setNotebooks={setNotebooks}  notebook_id={notebook_id} setNotebookId={setNotebookId}/>}
          <Routes>
            <Route path="/notebook" element={user? <Notebook notebooks={notebooks} setNotebooks={setNotebooks} notebook_id={notebook_id} setNotebookId={setNotebookId}/> :<Auth user={user} setUser={setUser} />} />
            <Route path="/login" element={user ? <Notebook notebooks={notebooks} setNotebooks={setNotebooks} notebook_id={notebook_id} setNotebookId={setNotebookId}/> : <Auth user={user} setUser={setUser} />} />
            <Route path="/" element={user ? <Notebook notebooks={notebooks} setNotebooks={setNotebooks} notebook_id={notebook_id} setNotebookId={setNotebookId}/> :<Auth user={user} setUser={setUser} />} />
            <Route path="/register" element={<Reg user={user} setUser={setUser} />} />
          </Routes>
        </Router>
    </div>
  );
}