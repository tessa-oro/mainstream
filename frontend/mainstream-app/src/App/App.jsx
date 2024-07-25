import { useState } from 'react'
import './App.css'
import Login from "../Login/Login"
import Dashboard from "../Dashboard/Dashboard"
import Header from "../Header/Header"
import Leaderboard from '../Leaderboard/Leaderboard'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

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
    <Router>
      <Header></Header>
      {showLogin ? (<Login setAppUser={setAppUser} closeLogin={() => closeLogin()}></Login>) : (<></>)}
      <Switch>
        <Route exact path='/'>
          <Dashboard curUser={curUser} login={showLogin} handleLogout={() => handleLogout()}></Dashboard>
        </Route>
        <Route path='/leaderboard'>
          <Leaderboard></Leaderboard>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
