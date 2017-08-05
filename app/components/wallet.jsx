import { Alert, CardBlock, CardFooter, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem, Badge, Progress, FormGroup, Label, Container, Jumbotron, TabContent, InputGroup, Input, InputGroupAddon, InputGroupButton, Table, TabPane, Nav, NavItem, NavLink, Card, CardSubtitle, Button, CardTitle, CardText, Row, Col } from 'reactstrap';

import axios from 'axios'
import React from 'react'
import classnames from 'classnames'
import CopyToClipboard from 'react-copy-to-clipboard'
import zencashjs from 'zencashjs'

import MDCopy from 'react-icons/lib/md/content-copy'
import MDSettings from 'react-icons/lib/md/settings'
import FAUnlock from 'react-icons/lib/fa/unlock-alt'
import FAEyeSlash from 'react-icons/lib/fa/eye-slash'
import FAEye from 'react-icons/lib/fa/eye'

// Append url
function urlAppend(url, param){
  if (url.substr(-1) !== '/'){
    url = url + '/'
  }
  return url + param
}

// Components
class ZWalletGenerator extends React.Component {
  constructor(props) {
    super(props)    
    
    this.handlePasswordPhrase = this.handlePasswordPhrase.bind(this);
    this.state = {
      passwordPhrase: '',
      privateKey: ''
    }
  }

  handlePasswordPhrase(e){
    console.log(this.props.settings)
    // What wif format do we use?
    var wifHash = this.props.settings.useTestNet ? zencashjs.config.testnet.wif : zencashjs.config.mainnet.wif

    var pk = zencashjs.address.mkPrivKey(e.target.value)
    var pkwif = zencashjs.address.privKeyToWIF(pk, true, wifHash)

    if (e.target.value === ''){
      pkwif = ''
    }

    this.setState({
      privateKey: pkwif
    })    
  }

  render () {
    return (
      <Row>          
        <Col>
          <h3 className='display-6'>Create New Wallet</h3>
          <br/>
          <InputGroup>          
            <Input onChange={this.handlePasswordPhrase} placeholder="Password phrase. Do NOT forget to save this! Use >15 words to be safe." />            
          </InputGroup>
          <br/>
          <InputGroup>                      
            <Input value={this.state.privateKey} placeholder="Private key generated from password phrase" />              
            <InputGroupButton>
              <CopyToClipboard text={this.state.privateKey}>
                <Button><MDCopy/></Button>
              </CopyToClipboard>
            </InputGroupButton>
          </InputGroup>
        </Col>
      </Row>
    )
  }
}


class ZWalletUnlockKey extends React.Component {
  constructor(props){
    super(props)

    this.toggleShowPassword = this.toggleShowPassword.bind(this)

    this.state = {
      showPassword: false
    }
  }

  toggleShowPassword(){
    this.setState({
      showPassword: !this.state.showPassword
    })
  }

  render () {
    return (
      <InputGroup>                              
        <InputGroupButton>              
          <Button onClick={this.toggleShowPassword}>
            {this.state.showPassword? <FAEye/> : <FAEyeSlash/>}
          </Button>              
        </InputGroupButton>
        <Input
          type={this.state.showPassword ? "text" : "password"}
          onChange={(e) => this.props.setPrivateKey(e.target.value)}
          placeholder="Private key"
        />                  
        <InputGroupButton>              
          <Button onClick={(e) => this.props.handleUnlockPrivateKey()}><FAUnlock/></Button>              
        </InputGroupButton>
      </InputGroup>
    )
  }
}

class ZWalletSettings extends React.Component {
  render () {
    return (
      <Modal isOpen={this.props.settings.showSettings} toggle={this.props.toggleModalSettings}>
        <ModalHeader toggle={this.props.toggleShowSettings}>ZenCash Wallet Settings</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupAddon>Insight API</InputGroupAddon>
            <Input 
              value={this.props.settings.insightAPI}
              onChange={(e) => this.props.setInsightAPI(e.target.value)}
            />
          </InputGroup><br/>
          <Row>
            <Col sm="6">
              <Label check>
                <Input
                  disabled={!(this.props.publicAddress === null)}
                  defaultChecked={this.props.settings.compressPubKey} type="checkbox" 
                  onChange={this.props.toggleCompressPubKey}
                />{' '}
                Compress Public Key
              </Label>
            </Col>
            <Col sm="6">
              <Label check>
                <Input                                    
                  defaultChecked={this.props.settings.showWalletGen} type="checkbox" 
                  onChange={this.props.toggleShowWalletGen}
                />{' '}
                Show Wallet Generator
              </Label>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Label>
            <Input
              disabled={!(this.props.publicAddress === null)}
              defaultChecked={this.props.settings.useTestNet} type="checkbox" 
              onChange={this.props.toggleUseTestNet}
            />{' '}
            testnet
          </Label>
        </ModalFooter>
      </Modal>
    )
  }
}

class ZAddressInfo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {      
      transactionURL: '',
      confirmedBalance: 'loading...',
      unconfirmedBalance: 'loading...',      
    }
  }
  
  componentDidMount() {
    // Sets transcation URL
    this.setState({
      transactionURL: urlAppend(this.props.settings.explorerURL, 'address/') + this.props.publicAddress,
    })

    // GET request to URL
    var info_url = urlAppend(this.props.settings.insightAPI, 'addr/')
    info_url = urlAppend(info_url, this.props.publicAddress + '?noTxList=1')
        
    axios.get(info_url)
    .then(function (response){
      var data = response.data;

      this.setState({
        confirmedBalance: data.balance,
        unconfirmedBalance: data.unconfirmedBalance
      });
    }.bind(this))
    .catch(function (error){
      alert(error);
    })
  }

  render() {    
    return (
      <Row>
        <Col>                
          <Card block>
            <Table>
            <tbody>
              <tr>
                <td>Address</td>
                <td>{this.props.publicAddress}</td>
              </tr>
              <tr>
                <td>Confirmed Balance</td>
                <td>{this.state.confirmedBalance}</td>
              </tr>
              <tr>
                <td>Unconfirmed Balance</td>
                <td>{this.state.unconfirmedBalance}</td>
              </tr>
              <tr>                
                <td><a href={this.state.transactionURL}>Transcation History</a></td>
                <td></td>
              </tr>
            </tbody>            
          </Table>  
          </Card>
        </Col>
      </Row>
    )
  }
}

class ZSendZEN extends React.Component {
  constructor(props) {
    super(props)    

    this.setProgressValue = this.setProgressValue.bind(this);
    this.handleUpdateAddress = this.handleUpdateAddress.bind(this);
    this.handleUpdateAmount = this.handleUpdateAmount.bind(this);
    this.handleCheckChanged = this.handleCheckChanged.bind(this);
    this.handleUpdateFee = this.handleUpdateFee.bind(this);
    this.handleSendZEN = this.handleSendZEN.bind(this);    

    this.state = {
      recipientAddress: '',
      fee: '',
      amount: '',                        
      sentTxid: '', // Whats the send txid
      sendProgress: 0, // Progress bar, 100 to indicate complete      
      confirmSend: false,
    }
  }

  handleUpdateAddress(e) {
    this.setState({
      recipientAddress: e.target.value
    })
  }

  handleUpdateFee(e) {
    this.setState({
      fee: e.target.value
    })
  }

  handleUpdateAmount(e) {    
    this.setState({
      amount: e.target.value
    })
  }

  handleCheckChanged(e){    
    this.setState({
      confirmSend: e.target.checked
    })
  }

  setProgressValue(v){
    this.setState({
      sendProgress: v
    })
  }  

  handleSendZEN(){      
    const value = this.state.amount;
    const fee = this.state.fee;
    const recipientAddress = this.state.recipientAddress;
    
    // Reset zen send progress
    this.setState({
      sendProgress: 0
    })

    // Validation
    if (recipientAddress.length !== 35){
      alert('Address length not valid')
      return
    }

    if (typeof parseInt(value) !== 'number' || value === ''){
      alert('Amount needs to be a number')
      return
    }

    if (typeof parseInt(fee) !== 'number' || fee === ''){
      alert('Fee needs to be a number')
      return
    }

    // Get previous transactions
    const prevTxURL = urlAppend(this.props.settings.insightAPI, 'addr/') + this.props.publicAddress + '/utxo'
    const infoURL = urlAppend(this.props.settings.insightAPI, 'status?q=getInfo')
    const sendRawTxURL = urlAppend(this.props.settings.insightAPI, 'tx/send')

    // Convert how much we wanna send
    // to satoshis
    const satoshisToSend = Math.round(value * 100000000)
    const satoshisfeesToSend = Math.round(fee * 100000000)

    // Building our transaction TXOBJ
    // How many satoshis do we have so far
    var satoshisSoFar = 0
    var history = []
    var recipients = [{address: recipientAddress, satoshis: satoshisToSend}]

    // Get transactions and info
    axios.get(prevTxURL)
    .then(function (tx_resp){
      this.setProgressValue(26)
      
      const tx_data = tx_resp.data      

      axios.get(infoURL)
      .then(function (info_resp){
        this.setProgressValue(50)
        const info_data = info_resp.data

        const blockHeight = info_data.info.blocks - 300
        const blockHashURL = urlAppend(this.props.settings.insightAPI, 'block-index/') + blockHeight        

        // Get block hash
        axios.get(blockHashURL)
        .then(function(response_bhash){
          this.setProgressValue(75)
          
          const blockHash = response_bhash.data.blockHash

          // Iterate through each utxo
          // append it to history
          for (var i = 0; i < tx_data.length; i ++){
            if (tx_data[i].confirmations == 0){
              continue;
            }

            history = history.concat({
              txid: tx_data[i].txid,
              vout: tx_data[i].vout,
              scriptPubKey: tx_data[i].scriptPubKey,            
            });
            
            // How many satoshis do we have so far
            satoshisSoFar = satoshisSoFar + tx_data[i].satoshis;
            if (satoshisSoFar >= satoshisToSend + satoshisfeesToSend){
              break;
            }
          }

          // If we don't have enough address
          // fail and tell user
          if (satoshisSoFar < satoshisToSend + satoshisfeesToSend){
            this.setProgressValue(0)
            alert('Not enough confirmed ZEN in account to perform transaction')
            return
          }

          // If we don't have exact amount
          // Refund remaining to current address
          if (satoshisSoFar !== satoshisToSend + satoshisfeesToSend){
            var refundSatoshis = satoshisSoFar - satoshisToSend - satoshisfeesToSend
            recipients = recipients.concat({address: this.props.publicAddress, satoshis: refundSatoshis})
          }

          // Create transaction
          var txObj = zencashjs.transaction.createRawTx(history, recipients, blockHeight, blockHash)

          // Sign each history transcation          
          for (var i = 0; i < history.length; i ++){
            txObj = zencashjs.transaction.signTx(txObj, i, this.props.privateKey, this.props.settings.compressPubKey)
          }

          // Convert it to hex string
          const txHexString = zencashjs.transaction.serializeTx(txObj)

          axios.post(sendRawTxURL, {rawtx: txHexString})
          .then(function(sendtx_resp){         
            this.setState({
              sendProgress: 100,
              sentTxid: sendtx_resp.data.txid
            })
          }.bind(this))
          .catch(function(error) {
            this.setProgressValue(0)           
            alert('Error: ' + error)            
            return
          }.bind(this))
        }.bind(this))
      }.bind(this))
    }.bind(this))
    .catch(function(error){
      this.setProgressValue(0)
      alert(error);
    }.bind(this));
  } 

  render() {
    // Where to view our new transaction o
    // the blockchain
    
    var zenTxLink
    if (this.state.sendProgress === 100){
      var zentx = urlAppend(this.props.settings.explorerURL, 'tx/') + this.state.sentTxid
      zenTxLink = <div className="text-center"><a href={zentx}>click here to view your transaction</a></div>
    }

    return (
      <Row>
        <Col>
          <Card>
            <CardBlock>       
              <Alert color="danger">!!! ALWAYS VALIDATE YOUR DESINATION ADDRESS BY SENDING SMALL AMOUNTS OF ZEN FIRST !!!</Alert>
              <CardText>
                <InputGroup>
                  <InputGroupAddon>Address</InputGroupAddon>
                  <Input onChange={this.handleUpdateAddress} placeholder="e.g znSDvF9nA5VCdse5HbEKmsoNbjCbsEA3VAH" />
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon>Amount</InputGroupAddon>
                  <Input onChange={this.handleUpdateAmount} placeholder="e.g 42" />
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon>Fee</InputGroupAddon>
                  <Input onChange={this.handleUpdateFee} placeholder="e.g 0.001" />
                </InputGroup>
              </CardText>
              <CardText>
                <FormGroup check>
                  <Label check>
                    <Input onChange={this.handleCheckChanged} type="checkbox" />{' '}
                    Yes, I would like to send these ZEN
                  </Label>
                </FormGroup>                
              </CardText>   
              <Button color="warning" className="btn-block" disabled={!this.state.confirmSend} onClick={this.handleSendZEN}>Send</Button>
            </CardBlock>
            <CardFooter> 
              {zenTxLink}
              <Progress value={this.state.sendProgress} />                                  
            </CardFooter>       
          </Card>
        </Col>
      </Row>
    )
  }
}

class ZWalletTabs extends React.Component {
  constructor(props){
    super(props)

    this.toggleTabs = this.toggleTabs.bind(this);
    this.state = {
      activeTab: '1'
    }
  }

  toggleTabs(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render () {
    return (      
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggleTabs('1'); }}
            >
              Info
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggleTabs('2'); }}
            >
              Send ZEN
            </NavLink>
          </NavItem>         
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <ZAddressInfo
              publicAddress={this.props.publicAddress}
              settings={this.props.settings}
            />
          </TabPane>
          <TabPane tabId="2">
            <ZSendZEN 
              settings={this.props.settings}
              publicAddress={this.props.publicAddress}
              privateKey={this.props.privateKey}
            />
          </TabPane>  
        </TabContent>
      </div>       
    )
  }
}

export default class ZWallet extends React.Component {
  constructor(props) {
    super(props);

    this.handleUnlockPrivateKey = this.handleUnlockPrivateKey.bind(this)
    this.setPrivateKey = this.setPrivateKey.bind(this)        
    this.setInsightAPI = this.setInsightAPI.bind(this)    
    this.toggleUseTestNet = this.toggleUseTestNet.bind(this)
    this.toggleCompressPubKey = this.toggleCompressPubKey.bind(this)
    this.toggleShowSettings = this.toggleShowSettings.bind(this)
    this.toggleShowWalletGen = this.toggleShowWalletGen.bind(this)     

    this.state = {
      privateKey : '',
      publicAddress: null,
      settings: {
        showSettings: false,
        showWalletGen: false,
        compressPubKey: true,
        insightAPI: 'http://explorer.zenmine.pro/insight-api-zen/',
        explorerURL: 'http://explorer.zenmine.pro/insight/',
        useTestNet: false
      }
    };    
  }

  handleUnlockPrivateKey(){
    try{
      // Get private key from state
      var pk = this.state.privateKey

      // If not 64 length, probs WIF format
      if (pk.length !== 64){
        pk = zencashjs.address.WIFToPrivKey(pk)
      }

      // Convert public key to public address
      const pubKey = zencashjs.address.privKeyToPubKey(pk, this.state.settings.compressPubKey)

      // Testnet or nah
      const pubKeyHash = this.state.settings.useTestNet ? zencashjs.config.testnet.pubKeyHash : zencashjs.config.mainnet.pubKeyHash
      const publicAddr = zencashjs.address.pubKeyToAddr(pubKey, pubKeyHash)

      // Set public address
      this.setPublicAddress(publicAddr)

      // Set private key
      this.setPrivateKey(pk)

    } catch(err) {      
      alert('Invalid private key')
    }
  }

  setPrivateKey(pk){
    this.setState({
      privateKey: pk
    })
  }

  setPublicAddress(pa){
    this.setState({
      publicAddress: pa
    })
  }

  setInsightAPI(uri){    
    var _settings = this.state.settings
    _settings.insightAPI = uri

    this.setState({
      _settings: _settings
    })
  }  

  toggleCompressPubKey(b){
    var _settings = this.state.settings
    _settings.compressPubKey = !_settings.compressPubKey    

    this.setState({
      _settings: _settings
    })
  }

  toggleUseTestNet(){
    var _settings = this.state.settings
    _settings.useTestNet = !_settings.useTestNet

    if (_settings.useTestNet){
      _settings.insightAPI = 'http://aayanl.tech:8081/insight-api-zen/'
      _settings.explorerURL = 'http://aayanl.tech:8081/'
    }
    else{
      _settings.insightAPI = 'http://explorer.zenmine.pro/insight-api-zen/'
      _settings.explorerURL = 'http://explorer.zenmine.pro/insight/'
    }

    this.setState({
      settings: _settings
    })
  }

  toggleShowSettings(){
    var _settings = this.state.settings
    _settings.showSettings = !_settings.showSettings

    this.setState({
      settings: _settings
    })
  }

  toggleShowWalletGen(){
    var _settings = this.state.settings
    _settings.showWalletGen = !_settings.showWalletGen

    this.setState({
      settings: _settings
    })
  }

  render() {        
    return (
      <Container>
        <Row>
          <Col>            
            <h1 className='display-6'>ZenCash&nbsp;Wallet&nbsp;<Button onClick={this.toggleShowSettings}><MDSettings/></Button></h1>
            <ZWalletSettings 
              toggleShowSettings={this.toggleShowSettings}
              toggleCompressPubKey={this.toggleCompressPubKey}           
              toggleShowWalletGen={this.toggleShowWalletGen}
              toggleUseTestNet={this.toggleUseTestNet}
              setInsightAPI={this.setInsightAPI}
              settings={this.state.settings}
              publicAddress={this.state.publicAddress}
            />
            <br/>
          </Col>
        </Row>
        <Row>
          <Col>            
            { this.state.publicAddress === null ?
              (<ZWalletUnlockKey
                handleUnlockPrivateKey={this.handleUnlockPrivateKey}
                setPrivateKey={this.setPrivateKey}
              />)
              :
              (<ZWalletTabs
                publicAddress={this.state.publicAddress}
                settings={this.state.settings}
                privateKey={this.state.privateKey}
              />)
            }
          </Col>
        </Row>
        { this.state.settings.showWalletGen ?
          (<div><br/><hr/><ZWalletGenerator settings={this.state.settings}/></div>) : null
        }
      </Container>
    );
  }
}
