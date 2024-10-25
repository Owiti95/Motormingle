import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import EventList from "./EventList";
import EventDetail from "./EventDetails"; // Import the EventDetail component
import Login from "./Login";
import Register from "./Register";
import AdminDashboard from "./AdminDashboard";
import { UserProvider } from "./UserContext";
import NavBar from "./NavBar";
import ProtectedRoute from "./RouteProtection";
import EditEvent from "./EditEvent";
import MyEvents from "./Myevents";
import Home from "./Home";
import Attendees from "./Attendees";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/events" exact component={EventList} />
          <Route path="/events/:id" component={EventDetail} />{" "}
          <Route path="/login" component={Login} />
          <Route path="/admin/dashboard/event/:id/edit" component={EditEvent} />
          <Route
            path="/admin/dashboard/event/:eventId/attendees"
            component={Attendees}
          />
          <Route path="/register" component={Register} />
          <Route path="/Myevents" component={MyEvents} />
          <ProtectedRoute path="/admin" component={AdminDashboard} />
        </Switch>
      </Router>
    </UserProvider>
  );
};

export default App;
