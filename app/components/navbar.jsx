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
      <Navbar color="light" light expand="md">
        <NavbarBrand href='/'>
          <img src="./favicon.ico" alt="myzenwallet.io" height={42}/>&nbsp;myzenwallet.io
        </NavbarBrand>
        <NavbarToggler onClick={this.toggleNavbar} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href='https://getzen.cash'>
                FREE ZEN
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='./faq.html'>
                FAQ
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='./guide.html'>
                GETTING STARTED
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}
