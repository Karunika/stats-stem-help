import { useState, useEffect } from 'react';

import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { useParams } from "react-router";

import Graph from './Graph';
import Buttons from '../components/Buttons'

import axios from 'axios';

const targets = [`year`, `month`, `week`, `vc_week`, `compare`];


const User = () => {
    const {userId} = useParams();
    const {path, url} = useRouteMatch();
    const [primary, setPrimary] = useState(``);
    const [error, setError] = useState(``);
    const fetchData = async id => {
        let axious = await axios((process.env.REACT_APP_API ?? `http://localhost:3000`) + `/${id}`)
        return axious?.data;
    }
    useEffect(() => {
        (async () => {
            const response = await fetchData(userId);
            if(!response) setError(`User not found`)
            else setPrimary(response)
        })();
    }, [userId])
    return (
        <>
            {error ? <h1>{error}</h1> : <Buttons targets={targets} url={url} />}
            <Switch>
                <Route path={`${path}/:targetId`}>
                    <Graph primary={primary} secondary={null} />
                </Route>
            </Switch>
        </>
    )
}

export default User;