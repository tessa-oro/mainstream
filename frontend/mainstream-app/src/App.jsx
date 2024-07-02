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
    console.log("app username is:", curUser);
  }

  const closeLogin = () => {
    setShowLogin(false);
  }

  return (
    <>
      <Header></Header>
      { showLogin ? (<Login setAppUser={setAppUser} closeLogin={() => closeLogin()}></Login> ) : (<></>)}
      <Dashboard curUser={curUser} login={showLogin}></Dashboard>
    </>
  )
}

export default App
