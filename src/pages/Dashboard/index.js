import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom';

import socketio from 'socket.io-client';
import api from '../../services/api'

import './styles.css';

export default function Dashboard() {
    const [spots, setSpots] = useState([]);
    const [requests, setRequests] = useState([]); //request notification

    const user_id = localStorage.getItem('user'); //getting user id with socket io
    const socket = useMemo(() => socketio('http://localhost:3333', {
        query: { user_id }, //getting user id with socket io
    }), [user_id]);

    useEffect(() => {
        socket.on('booking_request', data => {
            setRequests([ ...requests, data])

        })

    }, [requests, socket]);

    useEffect(() => {
        async function loadSpots() {
            const user_id = localStorage.getItem('user');
            const response = await api.get('/dashboard', {
                headers: { user_id }
            });
            
            setSpots(response.data)
        }

        loadSpots();
    }, []);

    return (
        <>

            <ul className= "notifications">
                {requests.map(request => (
                    <li key={request._id}>
                        <p>
                            <strong>{request.user.email}</strong> está solicitando uma reeserva em <strong>{request.spot.company}</strong> para a data: <strong>{request.date}</strong>
                        </p>
                        <button className="accept">ACEITAR</button>
                        <button className="reject">REJEITAR</button>
                    </li>
                ))}
            </ul>
             <ul className="spot-list"> 
                {spots.map(spot => (
                    <li key={spot._id}>
                        <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }}/>
                        <strong>{spot.company}</strong>
                        <span>{spot.price ? `€${spot.price}/dia` : 'GRATUITO'}</span>
                    </li>
                ))}
            </ul>

            <Link to= "/new">
                <button className="btn">Cadastrar novo Campeonato</button>
            </Link>
        </>
    )
}