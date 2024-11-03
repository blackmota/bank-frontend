import './App.css'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register';
import Navbar from "./components/Navbar";
import Home from './components/Home';
import Simulate from './components/Simulate';
import Solicitation from './components/Solicitation';
import Welcome from './components/Welcome';
import SeeMyTickets from './components/Viewmytickets';
import Executive from './components/Executiveview';
import TicketDetails from './components/TicketDetails';
import NotFound from './components/NotFound';

function App() {
  return (
      <Router>
          <div className="container">
          <Navbar></Navbar>
            <Routes>
              <Route path="/home" element={<Home/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/simulate" element={<Simulate/>} />
              <Route path="/solicitation" element={<Solicitation/>} />
              <Route path="/seetickets" element={<SeeMyTickets/>} />
              <Route path="/executive" element={<Executive/>} />
              <Route path="/dashboard" element={<Welcome/>} />
              <Route path="/ticket/:id" element={<TicketDetails/>} />
              <Route path="" element={<Home/>} />
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </div>
      </Router>
  );
}

export default App
