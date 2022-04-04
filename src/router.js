import React from 'react';
import MainPage from './pages/Main';

const routes = [
    {
        path: `/`,
        exact: true,
        title: ``,
        component: MainPage
    },
    {
        component: () => <div>
            <h2>404</h2>
        </div>
    }
];

export default routes;
