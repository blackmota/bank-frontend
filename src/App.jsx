import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
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
import ExtraHoursList from './components/ExtraHoursList';
import AddEditExtraHours from './components/AddEditExtraHours';
import NotFound from './components/NotFound';
import PaycheckList from './components/PaycheckList';
import PaycheckCalculate from './components/PaycheckCalculate';
import AnualReport from './components/AnualReport';

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
              <Route path="/paycheck/list" element={<PaycheckList/>} />
              <Route path="/paycheck/calculate" element={<PaycheckCalculate/>} />
              <Route path="/reports/AnualReport" element={<AnualReport/>} />
              <Route path="/extraHours/list" element={<ExtraHoursList/>} />
              <Route path="/extraHours/add" element={<AddEditExtraHours/>} />
              <Route path="/extraHours/edit/:id" element={<AddEditExtraHours/>} />
              <Route path="" element={<Home/>} />
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </div>
      </Router>
  );
}

export default App
