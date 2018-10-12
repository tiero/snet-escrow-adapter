# SingularityNet Escrow Adapter

## Input

```
{
  jobAddress: "0x988C8e2bc509b92960a79d4C92e6f139eEc165A4"
}
```

## Output

```
{ 
  value: '10000000',
  consumer: '0xabdd6525BC4012B07a3A3758070C676fAd70869B',
  ownerAddress: '0x5f1EB1F3FF1350C0A35e23013D0039a166c80B49',
  agentAddress: '0x2ED982c220feD6C9374e63804670fc16BD481b8f' 
}
```

## Usage 


### Requirements 

* Node > 8
* Yarn > 1.9

### Install 

```sh
yarn add https://github.com/tiero/snet-escrow-adapter
```

### Example 

```js
//Import as module
const { EscrowAdapter }  = require('singularitynet-escrow-adapter');
//New instance of adapter using Kovan testnet
const adapter = new EscrowAdapter({ network: 'kovan' });

//Process a Job escrow contract providing the Kovan address
const address = '0x988C8e2bc509b92960a79d4C92e6f139eEc165A4';

adapter.process({jobAddress : address})
  .then(function(output) {
    console.log(output)
  })
  .catch(console.error)
```



