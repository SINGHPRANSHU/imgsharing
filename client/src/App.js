import React,{useState, useEffect} from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import {Form} from './components/form';

import "./App.css";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgCount, setImgCount] = useState(0);
 

  // const runExample = async (contract) => {
  //   const imageCount = await contract.methods.imageCount().call();
  //   setImgCount(imageCount);
  //   setLoading(false);
    

  //   for (let index = 0; index < imageCount; index++) {
  //     const image = await contract.methods.images(index).call();
      
  //     setImages([...images, image]);
      
  //   }
  // };

  useEffect(() => {
    (async function()
      {try {
      // Get network provider and web3 instance.
      const Web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const Accounts = await Web3.eth.getAccounts();
     console.log(Accounts);
      // Get the contract instance.
      const networkId = await Web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new Web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
     
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setWeb3(Web3);
      setAccounts(Accounts);
      setContract(instance);

      const imageCount = await instance.methods.imageCount().call();
      
      setImgCount(imageCount);
      setLoading(false);
      let currimages = [];
      for (let index = 1; index <= imageCount; index++) {
        const image = await instance.methods.images(index).call();
        currimages = [...currimages, image];
        
      }

      setImages(currimages);
    
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
})()
  },[])


 

  const showimage = images.map((ele) => {
    return (
      <div key ={ele.hash}>
        <img src = {`https://ipfs.infura.io/ipfs/${ele.hash}`} alt={`${ele.description}`}></img>
        <h4>{ele.description} {ele.hash}</h4>
        <h6>{web3.utils.fromWei(ele.tipAmount.toString()) } Eth</h6>
        <button onClick = {(e) => {
          e.preventDefault();
          let tipamount = web3.utils.toWei('0.1', 'Ether');
           contract.methods.tipImageOwner(e.target.name).send({from: accounts[0], value: tipamount}).on('transactionHash', (hash) => {
             console.log(hash);
           });
        }} name={ele.id}>TIP</button>
      </div>
    )
  })

  

  


 

  return (
   !web3 && loading?<div>Loading Web3, accounts, and contract...</div>:
      <div className="App">
        <h1>Good to Go! {accounts[0]}</h1>
          <Form contract={contract} account={accounts[0]} />
          <div>
            {showimage}
          </div>
      </div>
    
  )
  }

export default App;
