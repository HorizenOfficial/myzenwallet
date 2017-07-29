import React from 'react'
import classnames from 'classnames'
import zencashjs from 'zencashjs'
import CopyToClipboard from 'react-copy-to-clipboard';
import { Container, Jumbotron, TabContent, InputGroup, Input, InputGroupAddon, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';


class ZUnlockWallet extends React.Component {
  constructor(props) {
    super(props)    
  }

  render() {
    return (
      <Row>
        <Col>                
          <Card block>
            <CardTitle>Use Existing Private Key</CardTitle>
            <InputGroup>                    
              <Input placeholder="Private Key" />
              <InputGroupAddon><Button>Unlock</Button></InputGroupAddon>
            </InputGroup>
          </Card>
        </Col>
      </Row>
    )
  }
}

class ZSendZEN extends React.Component {
  constructor(props) {
    super(props)    
  }

  render() {
    return (
      <Row>
        <Col>
          <Card block>            
            <InputGroup>
              <InputGroupAddon>Address</InputGroupAddon>
              <Input placeholder="znSDvF9nA5VCdse5HbEKmsoNbjCbsEA3VAH" />
            </InputGroup>
            <InputGroup>
              <InputGroupAddon>Amount</InputGroupAddon>
              <Input placeholder="42.24" />
            </InputGroup>
            <br/>
            <Button>Send</Button>
          </Card>
        </Col>
      </Row>
    )
  }
}

class ZWalletSettings extends React.Component {
  constructor(props) {
    super(props)    
  }

  render() {
    return (
      <Row>
        <Col>
          <Card block>
            <CardTitle>Node settings</CardTitle>
            <InputGroup>
              <InputGroupAddon>Insight URL</InputGroupAddon>
              <Input value="explorer.zenmine.pro/insight-api-zen/" />
            </InputGroup>
          </Card>
        </Col>
      </Row>
    )
  }
}

class ZWalletGenerator extends React.Component {
  constructor(props) {
    super(props)    
    
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      passwordPhrase: '',
      privateKey: ''
    }
  }

  handleChange(e){
    var pk = zencashjs.address.mkPrivKey(e.target.value)

    if (e.target.value === ''){
      pk = ''
    }

    this.setState({
      privateKey: pk
    })    
  }

  render () {
    return (
      <Row>          
        <Col>
          <h3 className='display-6'>Create New Wallet</h3>
          <br/>
          <InputGroup>          
            <Input onChange={this.handleChange} placeholder="Password phrase. Do NOT forget to save this!" />            
          </InputGroup>
          <br/>
          <InputGroup>                      
            <Input value={this.state.privateKey} placeholder="Private key generated from password phrase" />              
            <InputGroupAddon>
              <CopyToClipboard text={this.state.privateKey}>
                <Button>Copy Private Key</Button>
              </CopyToClipboard>
            </InputGroupAddon>
          </InputGroup>
        </Col>
      </Row>
    )
  }

}

export default class ZWallet extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      insightURL: 'explorer.zenmine.pro/insight-api-zen/',
      privateKey: '',      
    };    
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    return (
      <Container>
        <Row>
        <Col>
        <h1 className='display-4'>ZenCash Wallet</h1>
        <br/>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Unlock Wallet
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              Send ZEN
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}
            >
              Settings
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <ZUnlockWallet/>
          </TabPane>
          <TabPane tabId="2">
            <ZSendZEN/>
          </TabPane>
          <TabPane tabId="3">
            <ZWalletSettings/>
          </TabPane>  
        </TabContent>
        </Col>
        </Row>

        <br/>
        <hr/>
        <br/>
                
        <ZWalletGenerator/>
      </Container>
    );
  }
}
