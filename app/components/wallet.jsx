import axios from 'axios'
import React from 'react'
import classnames from 'classnames'
import zencashjs from 'zencashjs'
import CopyToClipboard from 'react-copy-to-clipboard';
import { Progress, FormGroup, Label, Container, Jumbotron, TabContent, InputGroup, Input, InputGroupAddon, Table, TabPane, Nav, NavItem, NavLink, Card, CardSubtitle, Button, CardTitle, CardText, Row, Col } from 'reactstrap';


class ZAddressInfo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      zenAddr: this.props.zenAddr,
      transactionURL: 'http://explorer.zenmine.pro/insight/address/' + this.props.zenAddr,
      insightURL: this.props.insightURL,
      confirmedBalance: 'loading...',
      unconfirmedBalance: 'loading...',      
    }
  }
  
  componentDidMount() {
    // GET request to URL
    const info_url = 'http://' + this.state.insightURL + 'addr/' + this.state.zenAddr + '?noTxList=1'
        
    axios.get(info_url)
      .then(function (response){
        var data = response.data;

        this.setState({
          confirmedBalance: data.balance,
          unconfirmedBalance: data.unconfirmedBalance
        });
      }.bind(this))
      .catch(function (error){
        console.log(error);
      })
  }

  render() {    
    return (
      <Row>
        <Col>                
          <Card block>
            <CardSubtitle>Address: {this.state.zenAddr}</CardSubtitle><br/>
            <CardSubtitle>Balance: {this.state.confirmedBalance}</CardSubtitle><br/>
            <CardSubtitle>Unconfirmed: {this.state.unconfirmedBalance}</CardSubtitle><br/>
            <CardSubtitle><a href={this.state.transactionURL}>Transcation History</a></CardSubtitle> 
          </Card>
        </Col>
      </Row>
    )
  }
}

class ZUnlockWallet extends React.Component {
  constructor(props) {
    super(props)

    this.handlePrivKeyChange = this.handlePrivKeyChange.bind(this)
    this.handleCompressedKeyChanged = this.handleCompressedKeyChanged.bind(this)
    this.unlockClick = this.unlockClick.bind(this)
    
    this.state = {
      privKey: ''
    }
  }

  handleCompressedKeyChanged(e){
    this.props.handleCompressPublicKey(e.target.checked);
  }

  handlePrivKeyChange(e){    
    this.setState({
      privKey: e.target.value
    })    
  }
  
  unlockClick(){
    try{
      this.props.handleUnlock(this.state.privKey)
    } catch(err){
      alert('Invalid private key!')
    }
  }

  render() {
    return (
      <Row>          
        <Col>
          <InputGroup>
            <InputGroupAddon>
              <Label check>
                <Input onChange={this.handleCompressedKeyChanged} type="checkbox" />{' '}
                Compress Public Key
              </Label>
            </InputGroupAddon>                  
            <Input onChange={this.handlePrivKeyChange} placeholder="Private key" />              
            <InputGroupAddon>              
              <Button onClick={this.unlockClick}>Unlock</Button>              
            </InputGroupAddon>
          </InputGroup>
        </Col>
      </Row>
    )
  }
}

class ZSendZEN extends React.Component {
  constructor(props) {
    super(props)    

    this.handleUpdateAddress = this.handleUpdateAddress.bind(this);
    this.handleUpdateAmount = this.handleUpdateAmount.bind(this);
    this.handleCheckChanged = this.handleCheckChanged.bind(this);
    this.handleUpdateFee = this.handleUpdateFee.bind(this);
    this.handleSendZEN = this.handleSendZEN.bind(this);    

    this.state = {
      recipientAddress: '',
      fee: 0.0001,
      amount: '',
      privateKey: this.props.privateKey,
      zenAddress: this.props.zenAddr,
      isPubKeyCompressed: this.props.isPubKeyCompressed,
      insightURL: this.props.insightURL,
      sendZenProgress: 0, // Progress bar, 100 to indicate complete
      sentZenTxid: '',
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

  handleSendZEN(){      
    const value = this.state.amount;
    const fee = this.state.fee;
    const recipientAddress = this.state.recipientAddress;
    
    // Reset zen send progress
    this.setState({
      sendZenProgress: 0
    })

    // Validation
    if (recipientAddress.length !== 35){
      alert('Address length not valid')
      return
    }

    if (typeof value == 'number'){
      alert('Amount needs to be a number')
      return
    }

    if (typeof fee == 'number'){
      alert('Fee needs to be a number')
      return
    }

    // Get previous transactions
    const prevTxURL = 'http://' + this.state.insightURL + 'addr/' + this.state.zenAddress + '/utxo'
    const infoURL = 'http://' + this.state.insightURL + 'status?q=getInfo'
    const sendRawTxURL = 'http://' + this.state.insightURL + 'tx/send'

    // Convert how much we wanna send
    // to satoshis
    const satoshisToSend = value * 100000000
    const satoshisfeesToSend = fee * 100000000

    // Building our transaction TXOBJ
    // How many satoshis do we have so far
    var satoshisSoFar = 0
    var history = []
    var recipients = [{address: recipientAddress, satoshis: satoshisToSend}]

    // Get transactions and info
    axios.get(prevTxURL)
    .then(function (tx_resp){
      this.setState({
        sendZenProgress: 25
      })
      
      const tx_data = tx_resp.data      

      axios.get(infoURL)
      .then(function (info_resp){
        this.setState({
          sendZenProgress: 50
        })
        
        const info_data = info_resp.data

        const blockHeight = info_data.info.blocks - 300
        const blockHashURL = 'http://' + this.state.insightURL + 'block-index/' + blockHeight        

        // Get block hash
        axios.get(blockHashURL)
        .then(function(response_bhash){
          this.setState({
            sendZenProgress: 75
          })
          
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
            this.setState({
              sendZenProgress: 0,              
            })
            alert('Not enough confirmed ZEN in account to perform transaction')
            return
          }

          // If we don't have exact amount
          // Refund remaining to current address
          if (satoshisSoFar !== satoshisToSend + satoshisfeesToSend){
            var refundSatoshis = satoshisSoFar - satoshisToSend - satoshisfeesToSend
            recipients = recipients.concat({address: this.state.zenAddress, satoshis: refundSatoshis})
          }

          // Create transaction
          var txObj = zencashjs.transaction.createRawTx(history, recipients, blockHeight, blockHash)

          // Sign each history transcation
          for (var i = 0; i < history.length; i ++){
            txObj = zencashjs.transaction.signTx(txObj, i, this.state.privateKey, this.state.isPubKeyCompressed)
          }

          // Convert it to hex string
          const txHexString = zencashjs.transaction.serializeTx(txObj)

          axios.post(sendRawTxURL, {rawtx: txHexString})
          .then(function(sendtx_resp){
            console.log(sendtx_resp.data)
            this.setState({
              sendZenProgress: 100,
              sentZenTxid: sendtx_resp.data.txid
            })
          }.bind(this))
        }.bind(this))
      }.bind(this))
    }.bind(this))
    .catch(error => console.log(error));
  } 

  render() {
    // Where to view our new transaction o
    // the blockchain
    
    var zenTxLink
    if (this.state.sendZenProgress === 100){
      var zentx = 'http://explorer.zenmine.pro/insight/tx/' + this.state.sentZenTxid
      zenTxLink = <div className="text-center"><a href={zentx}>click here to view your transaction</a></div>
    }

    return (
      <Row>
        <Col>
          <Card block>            
            <InputGroup>
              <InputGroupAddon>Address</InputGroupAddon>
              <Input onChange={this.handleUpdateAddress} placeholder="znSDvF9nA5VCdse5HbEKmsoNbjCbsEA3VAH" />
            </InputGroup>
            <InputGroup>
              <InputGroupAddon>Amount</InputGroupAddon>
              <Input onChange={this.handleUpdateAmount} placeholder="42.24" />
            </InputGroup>
            <InputGroup>
              <InputGroupAddon>Fee</InputGroupAddon>
              <Input onChange={this.handleUpdateFee} placeholder="0.001" />
            </InputGroup>
            <br/>
            <FormGroup check>
              <Label check>
                <Input onChange={this.handleCheckChanged} type="checkbox" />{' '}
                I really wanna send some ZEN
              </Label>
            </FormGroup>
            <div>
              <Progress value={this.state.sendZenProgress} />            
              {zenTxLink}         
            </div>
            <br/>
            <Button disabled={!this.state.confirmSend} onClick={this.handleSendZEN}>Send</Button>
          </Card>
        </Col>
      </Row>
    )
  }
}

class ZWalletSettings extends React.Component {
  constructor(props) {
    super(props)

    this.onUpdateInsight = this.onUpdateInsight.bind(this);
    this.handleInsightUpdate = this.handleInsightUpdate.bind(this);
    
    this.state = {
      insightURL: this.props.insightURL
    }
  }

  handleInsightUpdate(e){
    this.setState({
      insightURL: e.target.value
    })
  }

  onUpdateInsight(){
    this.props.handleSettings(this.state.insightURL);
  }

  render() {
    return (
      <Row>
        <Col>
          <Card block>
            <CardTitle>Node settings</CardTitle>
            <InputGroup>
              <InputGroupAddon>Insight URL</InputGroupAddon>
              <Input onChange={this.handleInsightUpdate} value={this.state.insightURL} />
            </InputGroup>
            <br/>
            <Button onClick={this.onUpdateInsight}>Update</Button>
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
    var pkwif = zencashjs.address.privKeyToWIF(pk + '01') // Compress it

    if (e.target.value === ''){
      pk = ''
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
    this.handleUnlock = this.handleUnlock.bind(this);
    this.handleSettings = this.handleSettings.bind(this);    
    this.handleCompressPublicKey = this.handleCompressPublicKey.bind(this);

    this.state = {
      activeTab: '1',             
      insightURL: 'explorer.zenmine.pro/insight-api-zen/',                  
      isPubKeyCompressed: false,      
      isUnlocked: false,
      privateKey: '',
      zenAddr: ''
    };    
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  // We using compreesed public key?
  handleCompressPublicKey(b){    
    this.setState({
      isPubKeyCompressed: b
    })
  }

  // Unlocks wallet and previews
  // your transaction history
  handleUnlock(privKey) {
    // If its not 64 length, probs a WIF format
    if (privKey.length !== 64){
      privKey = zencashjs.address.WIFToPrivKey(privKey)
    }

    var pubKey = zencashjs.address.privKeyToPubKey(privKey, this.state.isPubKeyCompressed)
    var zenaddr = zencashjs.address.pubKeyToAddr(pubKey)

    this.setState({
      privateKey: privKey,      
      zenAddr: zenaddr,
      isUnlocked: true,      
    })
  }

  // Updates insightURL
  handleSettings(newInsightURL){    
    this.setState({
      insightURL: newInsightURL
    })
  }   

  render() {
    var contentState    

    // If we haven't unlocked our wallet
    if (!this.state.isUnlocked){      
      contentState = (        
          contentState = <ZUnlockWallet handleUnlock={this.handleUnlock} handleCompressPublicKey={this.handleCompressPublicKey}/>
      );
    }
    else{
      contentState = (
        <Row>
          <Col>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '1' })}
                onClick={() => { this.toggle('1'); }}
              >
                Info
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '2' })}
                onClick={() => { this.toggle('2'); }}
              >
                Send ZEN
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '3' })}
                onClick={() => { this.toggle('3'); }}
              >
                Settings
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <ZAddressInfo insightURL={this.state.insightURL} zenAddr={this.state.zenAddr}/>
            </TabPane>
            <TabPane tabId="2">
              <ZSendZEN zenAddr={this.state.zenAddr} privateKey={this.state.privateKey} isPubKeyCompressed={this.state.isPubKeyCompressed} insightURL={this.state.insightURL}/>
            </TabPane>
            <TabPane tabId="3">
              <ZWalletSettings handleSettings={this.handleSettings} insightURL={this.state.insightURL}/>
            </TabPane>  
          </TabContent>
          </Col>
        </Row> 
      )
    }

    // If we have then show the tabs
    return (
      <Container>
        <Row>
          <Col>
            <h1 className='display-4'>Lite ZenCash Wallet</h1>
            <br/>
          </Col>
        </Row> 

        { contentState }
          
        <br/>
        <hr/>
        <br/>

        <ZWalletGenerator/>
      </Container>
    );
  }
}
