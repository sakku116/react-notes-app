import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import NotesApp from './NotesApp';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Main () {
    return (
        <NotesApp />
    )
};

root.render(<Main />);