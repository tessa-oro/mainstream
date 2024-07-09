import { useState } from 'react'
import './App.css'
import Login from "./Login"
import Dashboard from "./Dashboard"
import Header from "./Header"
import Leaderboard from "./Leaderboard"
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'

function App() {
  const [curUser, setCurUser] = useState("");
  const [showLogin, setShowLogin] = useState(true);

  const setAppUser = (e) => {
    setCurUser(e);
  }

  const closeLogin = () => {
    setShowLogin(false);
  }

  return (
    <Router>
      <Header></Header>
      { showLogin ? (<Login setAppUser={setAppUser} closeLogin={() => closeLogin()}></Login> ) : (<></>)}
      <Switch>
        <Route exact path="/">
          <Dashboard curUser={curUser} login={showLogin}></Dashboard>
        </Route>
        <Route path="/lb">
          <Leaderboard></Leaderboard>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
