
const EscrowAdapter = require('./index');
const fs = require('fs');

const adapter = new EscrowAdapter({ network: 'kovan', proto: fs.readFileSync('./adapter.snet.escrow.proto') });

const InputBuffer = adapter.messages.Input.encode({
  job_address: '0x988C8e2bc509b92960a79d4C92e6f139eEc165A4'
});


adapter.process({ InputBuffer })
  .then(function ({ OutputBuffer }) {
    console.log(adapter.messages.Output.decode(OutputBuffer));
    console.log('SUCCESS');
  })
  .catch(function (err) {
    console.error('FAIL');
    console.log(err);
  }) 