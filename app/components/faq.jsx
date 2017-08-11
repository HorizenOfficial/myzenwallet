import React from 'react'
import {Container, Row, Col} from 'reactstrap';

export default class ZFaq extends React.Component {
  render () {
    return (      
      <Container>      
        <Row>
          <Col>
            <p>
              <b>Q: How is this secure? Its on a web browser!</b><br/>
              A: MyZenWallet has replicated the core features of the ZEN daemon using JavaScript! So the process of creating and signing the transactions are all within the browser. Nothing sensitive is send through the network.
            </p>

            <p>
              <b>Q: I still don't trust you! What did you use and where's the source code?</b><br/>
              A: To replicate the primitive features of the ZEN daemon, I used: <a href="https://github.com/kendricktan/zencashjs">zencashjs</a>, as for source code of the myzenwallet: <a href="https://github.com/zencashofficial/myzenwallet">myzenwallet</a>
            </p>
          </Col>
        </Row>
      </Container>
    )
  }
}