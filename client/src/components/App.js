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
import Myevents from "./Myevents";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={EventList} />
          <Route path="/events/:id" component={EventDetail} />{" "}
          <Route path="/login" component={Login} />
          <Route path="/admin/dashboard/event/:id/edit" component={EditEvent} />
          <Route path="/register" component={Register} />
          <Route path="/Myevents" component={Myevents} />
          <ProtectedRoute path="/admin" component={AdminDashboard} />
        </Switch>
      </Router>
    </UserProvider>
  );
};

export default App;