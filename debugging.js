var gg = require('./app/lib/zenBip32')
var bitcoin = require('bitcoinjs-lib')
var bip32utils = require('bip32-utils')

var seedHex = Buffer.from('one two three four five six seven eight nine ten eleven twelve').toString('hex')

var m = bitcoin.HDNode.fromSeedHex(seedHex)
var i = m.deriveHardened(0)
var external = i.derive(0)
var internal = i.derive(1)
var account = new bip32utils.Account([
	new bip32utils.Chain(external.neutered()),
	new bip32utils.Chain(internal.neutered())
])

var address = account.getChainAddress(0)
var xpub = account.derive(address).toBase58()
var xprv = account.derive(address, [external, internal]).toBase58()

console.log('seed: ' + m.toBase58())
console.log('xpub: ' + xpub)
console.log('xprv: ' + xprv)