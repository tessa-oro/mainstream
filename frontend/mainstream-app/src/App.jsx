import { useState } from 'react'
import './App.css'
import Login from "./Login"
import Dashboard from "./Dashboard"
import Header from "./Header"

function App() {
  const [curUser, setCurUser] = useState("");
  const [showLogin, setShowLogin] = useState(true);

  const setAppUser = (e) => {
    setCurUser(e);
  }

  const closeLogin = () => {
    setShowLogin(false);
  }

  const handleLogout = () => {
    setCurUser("");
    setShowLogin(true);
  }

  return (
    <>
      <Header></Header>
      { showLogin ? (<Login setAppUser={setAppUser} closeLogin={() => closeLogin()}></Login> ) : (<></>)}
      <Dashboard curUser={curUser} login={showLogin} handleLogout={() => handleLogout()}></Dashboard>
    </>
  )
}

export default App
