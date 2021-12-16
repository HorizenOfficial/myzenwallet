import React from 'react'
import {Container, Row, Col} from 'reactstrap';

export default class ZFaq extends React.Component {
  render () {
    return (      
      <Container>      
        <Row>
          <Col> 
            <p>
              <b>Q: Are my private keys secured?</b><br/>
              A: Yes they are secured, your private keys never leave your browser.
            </p>

            <p>
              <b>Q: How is this secure? Its on a web browser!</b><br/>
              A: MyZenWallet has replicated the core features of the ZEN daemon in JavaScript! So the process of creating and signing the transactions are all done within the browser. No sensitive information is sent through the network.
            </p>         

            <p>
              <b>Q: Can I have the source code?</b><br/>
              A: <a href="https://github.com/HorizenOfficial/myzenwallet">Here you go</a>
            </p>               

            <p>
              <b>Q: Why are you doing this?</b><br/>
              A: MyZenWallet was inspired by <a href="https://myetherwallet.com">MyEtherWallet's</a> mission statement: to provide the people the ability to interact with the ZEN blockchain easily, without having to run a full node.
            </p>

            <p>
              <b>Q: Can I get free ZEN?</b><br/>
              A: Sure! Select an address frm your wallet (check out how to create a wallet via <a href="/guide.html">the guide</a> if you don't have one yet) and enter it into <a href="http://getzen.cash">getzen.cash</a>.
            </p>           
          </Col>
        </Row>
      </Container>
    )
  }
}