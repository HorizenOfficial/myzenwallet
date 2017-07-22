module.exports = {
  // Converts byte array to hex
  bytesToHex: byteArray => {
    return Array.from(byteArray, function(byte) {
      return ("0" + (byte & 0xff).toString(16)).slice(-2);
    }).join("");
  },

  hexToBytes: hex => {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }
};
