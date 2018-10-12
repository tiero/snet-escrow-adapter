const Web3      = require('web3');
const protobuf = require('protocol-buffers');

const JobAbi    = require('singularitynet-platform-contracts/abi/Job.json');
const AgentAbi  = require('singularitynet-platform-contracts/abi/Agent.json');


class EscrowAdapter {
  //fs.readFileSync(file.proto)
  constructor({ network, proto }) {

    if (!validateNetwork(network))
      throw "Missing network"

    try { this.messages = protobuf(proto) } catch (e) { throw e };
    
    this.network  = network;
    this.web3     = new Web3(new Web3.providers.HttpProvider(`https://${network}.infura.io`));
  }

  async getTxHashByEvent(contract, eventName) {
    //We assume only one event exists, if present, so the take the 0 element
    const event = (await contract.getPastEvents(eventName, FULL_SCAN_OPTIONS))[0];
    const blockTimestamp = (await this.web3.eth.getBlock(event.blockNumber)).timestamp;

    return [event.transactionHash, blockTimestamp];
  }

  async process({ InputBuffer }) {

    const Input = this.messages.Input.decode(InputBuffer);
    const jobAddress = Input.job_address;

    if (!jobAddress) 
      throw "Missing jobAddress";
    
    const JobContract = new this.web3.eth.Contract(JobAbi, jobAddress),
          jobState    = await JobContract.methods.state().call();

    if (Number(jobState) !== STATE.COMPLETED)
      throw "Job not finished yet";
    
    const value         = await JobContract.methods.jobPrice().call(),
          consumer      = await JobContract.methods.consumer().call(),
          agentAddress  = await JobContract.methods.agent().call(),
          AgentContract = new this.web3.eth.Contract(AgentAbi, agentAddress),
          ownerAddress  = await AgentContract.methods.owner().call();

    const [depositReference, depositTimestamp]  = await this.getTxHashByEvent(JobContract, 'JobFunded');
    const [withdrawReference, withdrawTimestamp]  = await this.getTxHashByEvent(JobContract, 'JobCompleted');

    const Output =  {
      value,
      consumer,
      agent: agentAddress,
      owner: ownerAddress,
      state: Object.keys(STATE)[jobState],
      deposit: {
        hash: depositReference,
        timestamp: depositTimestamp
      },
      withdraw: {
        hash: withdrawReference,
        timestamp: withdrawTimestamp
      }
    };

    const OutputBuffer = this.messages.Output.encode(Output);

    return { OutputBuffer };
  }

} 


const STATE = {
  "PENDING"   : 0,
  "FUNDED"    : 1,
  "COMPLETED" : 2
}

const FULL_SCAN_OPTIONS = {
  fromBlock: 0,
  toBlock: 'latest'
}

function validateNetwork(network) {
  if (network === 'kovan' || network === 'mainnet' || network === 'rinkeby' || network === 'ropsten') {
    return true;
  } else {
    return false;
  }
}

module.exports = EscrowAdapter;