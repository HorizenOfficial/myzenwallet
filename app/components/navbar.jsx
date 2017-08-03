import React from 'react'
import { ButtonDropdown, DropdownToggle, DropdownMenu, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'

export default class ZNavbar extends React.Component {
  constructor (props) {
    super(props)

    this.toggleNavbar = this.toggleNavbar.bind(this)
    this.state = {
      isOpen: false
    }
  }

  toggleNavbar () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }
  
  render () {
    return (
      <Navbar color='faded' light toggleable>
        <NavbarToggler right onClick={this.toggleNavbar} />
        <NavbarBrand href='/'>
          myzenwallet.io
        </NavbarBrand>
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className='ml-auto' navbar>
            <NavItem>
              <NavLink href='https://github.com/zencashofficial/myzenwallet'>
                Source Code
              </NavLink>
            </NavItem>              
          </Nav>
        </Collapse>
      </Navbar>  
    )
  }
}
