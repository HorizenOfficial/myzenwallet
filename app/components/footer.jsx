import React from 'react'
import {Container, Row, Col} from 'reactstrap';

export default class ZFooter extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Container>
      <Row>        
        <Col sm="8">
          <p>MAKE SURE YOU ARE ON <b>MYZENCASH.IO</b></p>

          <p>Keys are validated client-side and does not leave your browser or network. You are responsible for keeping your own keys safe!!!</p>

          <p>Suggestions? Email me: kendricktan0814 at gmail.com or find me on slack @ kendricktan.</p>          

          <p>Donations are always welcome!<br/>
            <b>BTC</b>: 14VmTd7Npm27SmJgrg1eUrSPgFEHcMXVGR<br/>
            <b>ETH</b>: 0x19Ed10db2960B9B21283FdFDe464e7bF3a87D05D<br/>
            <b>ZEN</b>: znSDvF9nA5VCdse5HbEKmsoNbjCbsEA3VAH
          </p>
        </Col>
        <Col sm="4">
          <a href="https://zensystem.io/">website</a><br/>
          <a href="https://blog.zensystem.io/">blog</a><br/>
          <a href="https://forum.zensystem.io/">forum</a><br/>
          <a href="https://github.com/ZencashOfficial">github</a><br/>
          <a href="https://slackinvite.zensystem.io/">slack</a><br/>
        </Col>
      </Row>
      </Container>
    )
  }
}