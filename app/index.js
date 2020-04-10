import 'bootstrap/dist/css/bootstrap.css';
import 'react-table/react-table.css';
import '../assets/css/styles.css';
import React from 'react';
import ReactDOM from 'react-dom';
import ZNavbar from './components/navbar.jsx'
import ZWallet from './components/wallet.jsx'
import ZFooter from './components/footer.jsx'
import ZGoogleAnalytics from "./components/googleAnalytics.jsx";

ReactDOM.render(<ZNavbar />, document.getElementById('navbar'));
ReactDOM.render(<ZWallet />, document.getElementById('page-content'));
ReactDOM.render(<ZFooter />, document.getElementById('footer'));
ReactDOM.render(<ZGoogleAnalytics />, document.getElementById('GoogleAnalytics'));
