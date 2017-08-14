import 'bootstrap/dist/css/bootstrap.css';
import 'react-table/react-table.css'
import React from 'react';
import ReactDOM from 'react-dom';
import ZNavbar from './components/navbar.jsx'
import ZFaq from './components/faq.jsx'
import ZFooter from './components/footer.jsx'

ReactDOM.render(<ZNavbar />, document.getElementById('navbar'));
ReactDOM.render(<ZFaq />, document.getElementById('faq'));
ReactDOM.render(<ZFooter />, document.getElementById('footer'));