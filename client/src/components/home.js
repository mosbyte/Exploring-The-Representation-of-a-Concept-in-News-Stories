import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Home extends Component {
    render() {
        return (
            <div align="center">
                <h3 style={{width:"80%"}}>This is a research tool exploring how a concept is represented
                    in a news story. This research focusses on the specific domains 'chant' & 'ritual'...<br></br><br></br>
                    Please select what operation you would like to do based on either domain:<br></br><br></br>
                </h3>
                <div className="d-flex justify-content-center">   
                    <div style={{width: "40%", margin:10}} className="borders">
                        <h2>Chant</h2><br></br>
                        <div>
                            <li className="list-group-item"><Link to={'/chant/categorise'} className="nav-link">Categorise</Link></li>
                            <li className="list-group-item"><Link to={'/chant/visualise'} className="nav-link">Visualise</Link></li>
                            <li className="list-group-item"><Link to={'/chant/database'} className="nav-link">View Database</Link></li>  
                        </div>
                    </div>
                    <div style={{width: "40%", margin:10}} className="borders">
                        <h2>Ritual</h2><br></br>
                        <div>
                            <li className="list-group-item"><Link to={'/ritual/categorise'} className="nav-link">Categorise</Link></li>
                            <li className="list-group-item"><Link to={'/ritual/visualise'} className="nav-link">Visualise</Link></li>
                            <li className="list-group-item"><Link to={'/ritual/database'} className="nav-link">View Database</Link></li>
                        </div>
                    </div>
                </div>
            </div>
            
            
        )
    }
}