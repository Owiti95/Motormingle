// import React, { useEffect, useState } from "react";
// import { Switch, Route } from "react-router-dom";

// function App() {
//   return <h1>Project Client</h1>;
// }

// export default App;
// import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// // import SearchBar from './components/SearchBar';
// import EventDetails from './EventDetails';
// import EventList from './EventList';
// // import Home from './pages/Home';
// // import Events from './pages/Events';
// // import './index.css';

// const App = () => {
//     return (
//         <Router>
//             {/* <Navbar /> */}
//             <Switch>
//                 {/* <Route path="/" exact component={Home} /> */}
//                 <Route path="/events" component={EventList}/>
//                 <Route path="/events/:id" component={EventDetails} />
//                 {/* Add other routes here */}
//             </Switch>
//         </Router>
//     );
// };

// export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Navbar from './components/Navbar'; // Uncomment if you have a Navbar component
import EventDetails from './EventDetails'; // Ensure the path is correct
import EventList from './EventList'; // Ensure the path is correct
import BookingDetails from './BookingDetails';
// import './index.css'; // Ensure your CSS is imported if needed

const App = () => {
    return (
        <Router>
            {/* <Navbar /> */} {/* Uncomment if you have a Navbar */}
            <Switch>
                {/* <Route path="/" exact component={Home} /> */} {/* Uncomment for Home route */}
                <Route path="/events" component={EventList} />
                <Route path="/events/:id" component={EventDetails} />
                <Route path="/booking/:id" component={BookingDetails} />
            </Switch>
        </Router>
    );
};

export default App;
