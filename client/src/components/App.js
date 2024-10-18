import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import EventDetail from "./EventDetails";
import EventList from "./EventList";
import BookingDetails from "./BookingDetails";
import AdminDashboard from "./AdminDashboard";
import ProtectedRoute from "./RouteProtection";
import Login from "./Login";
import Register from "./Register";
import { UserProvider } from "./UserContext";

const App = () => {
  const isAdmin = true; // Replace with actual admin check logic

  return (
    <UserProvider>
      <Router>
        <Switch>
          <Route path="/events/:id" component={EventDetail} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/events" component={EventList} />
          <Route path="/booking/:id" component={BookingDetails} />
          <ProtectedRoute
            path="/admin"
            component={AdminDashboard}
            isAdmin={isAdmin}
          />
          <Route path="/" component={EventList} />
        </Switch>
      </Router>
    </UserProvider>
  );
};

export default App;
