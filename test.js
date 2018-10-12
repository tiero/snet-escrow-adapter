
const EscrowAdapter = require('./index');
const adapter = new EscrowAdapter({ network: 'kovan' });

const expected = {"value":"10000000","state":2,"consumer":"0xabdd6525BC4012B07a3A3758070C676fAd70869B","ownerAddress":"0x5f1EB1F3FF1350C0A35e23013D0039a166c80B49","agentAddress":"0x2ED982c220feD6C9374e63804670fc16BD481b8f","depositReference":"0xb0c7f2753ce1533a1cbaffbad4ccdeb210ac579df71735d9de71047359e11a59","depositTimestamp":1539356544,"withdrawReference":"0x9a9d9db308fd0eaa3aeb6a0ae36feb34795c9019e1963d361ec2f49f1eb85184","withdrawTimestamp":1539356568}


adapter.process({jobAddress : '0x988C8e2bc509b92960a79d4C92e6f139eEc165A4'})
  .then(function(output) {
    stricEqual(output, expected, '[adapter]: process => output different tnah expected')
    console.log("[adapter]: process => SUCCESS")
  })
  .catch(console.error)


  function stricEqual(a, b, errorMessage) {
    if (Object.keys(a).length !== Object.keys(b).length) {
      throw new Error(errorMessage);
    }
  }


