const Web3      = require('web3');

const JobAbi    = require('singularitynet-platform-contracts/abi/Job.json');
const AgentAbi  = require('singularitynet-platform-contracts/abi/Agent.json');


class EscrowAdapter {

  constructor({ network }) {

    if (!validateNetwork(network))
      throw "Missing network"
    
    this.network  = network;
    this.web3     = new Web3(new Web3.providers.HttpProvider(`https://${network}.infura.io`));
  }

  async process({ jobAddress }) {
    if (!jobAddress) 
      throw "Missing jobAddress";
    
    const JobContract   = new this.web3.eth.Contract(JobAbi, jobAddress),
          value         = await JobContract.methods.jobPrice().call(),
          consumer      = await JobContract.methods.consumer().call(),
          agentAddress  = await JobContract.methods.agent().call();
  
    const AgentContract = new this.web3.eth.Contract(AgentAbi, agentAddress),
          ownerAddress  = await AgentContract.methods.owner().call();
  
    /* const depositReference   = await JobContract.getPastEvents('JobFunded'),
          withdrawReference  = await JobContract.getPastEvents('JobCompleted') */
  
    return {
      value,
      consumer,
      ownerAddress,
      agentAddress
    };
  }

} 

function validateNetwork(network) {
  if (network === 'kovan' || network === 'mainnet' || network === 'rinkeby' || network === 'ropsten') {
    return true;
  } else {
    return false;
  }
}

module.exports = EscrowAdapter;