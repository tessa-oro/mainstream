import { useState } from 'react'
import './App.css'
import Login from "./Login"
import Dashboard from "./Dashboard"
import Header from "./Header"

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const closeLogin = () => {
    setShowLogin(false);
  }

  return (
    <>
      <Header></Header>
      { showLogin ? (<Login closeLogin={() => closeLogin()}></Login> ) : (<></>)}
      <Dashboard></Dashboard>
    </>
  )
}

export default App
