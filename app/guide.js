import 'bootstrap/dist/css/bootstrap.css';
import 'react-table/react-table.css'
import React from 'react';
import ReactDOM from 'react-dom';
import ZNavbar from './components/navbar.jsx'
import ZGuide from './components/guide.jsx'
import ZFooter from './components/footer.jsx'

ReactDOM.render(<ZNavbar />, document.getElementById('navbar'));
ReactDOM.render(<ZGuide />, document.getElementById('guide'));
ReactDOM.render(<ZFooter />, document.getElementById('footer'));