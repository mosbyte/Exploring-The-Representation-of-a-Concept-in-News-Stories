import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavDropdown extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isToggleOn: false,
        tag: ''
      };
    }
    showDropdown(e) {
      e.preventDefault();
      this.setState(prevState => ({
        isToggleOn: !prevState.isToggleOn
      }));
    }
    render() {
      const classDropdownMenu = 'dropdown-menu' + (this.state.isToggleOn ? ' show' : '')
      return (
        <div className="my-nav-item dropdown">
          <a className="nav-group-item dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false" 
            onMouseOver={(e) => {this.showDropdown(e)}} 
            onMouseLeave={(e) => {this.showDropdown(e)}}>
            {this.props.name}
          </a>
          <div className={classDropdownMenu} style={{marginTop:-1}} text-aria-labelledby="navbarDropdown" onMouseLeave={(e) => {this.showDropdown(e)}}>
            {this.props.children} 
          </div>
        </div>
      )
    }
  }

export default class Navbar extends Component {
    render() {
        return (
            <div className="mynav">
                <header className="navbar navbar-expand navbar-dark flex-column flex-md-row bd-navbar">
                <div className="container">
                    {/* <Link to={'/'} className="navbar-brand"><h5>Final Year Project</h5></Link> */}
                    <div className="collapse navbar-collapse navbar-nav" id="navbarSupportedContent">
                        <a className="nav-list-item"><Link to={'/'} className="nav-group-item">Home</Link></a>

                        <NavDropdown name="Chant" className='my-nav-link'>
                            <li className="dropdown-item"><Link to={'/chant/categorise'} className="nav-link">Categorise</Link></li>
                            <li className="dropdown-item"><Link to={'/chant/visualise'} className="nav-link">Visualise</Link></li>
                            <li className="dropdown-item"><Link to={'/chant/database'} className="nav-link">Database</Link></li>
                        </NavDropdown>
                        <NavDropdown name="Ritual">
                            <li className="dropdown-item"><Link to={'/ritual/categorise'} className="nav-link">Categorise</Link></li>
                            <li className="dropdown-item"><Link to={'/ritual/visualise'} className="nav-link">Visualise</Link></li>
                            <li className="dropdown-item"><Link to={'/ritual/database'} className="nav-link">Database</Link></li>
                        </NavDropdown>
                    </div>
                  <Link to={'/'} className="navbar-brand"><h5>Final Year Project</h5></Link>
                </div>
              </header> <br/>
            </div>
        )
    }
}