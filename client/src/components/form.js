import React, {useState} from 'react';
import ipfs from '../ipfs';

export function Form({ contract, account}) {
    const [imgDesc, setImgDesc] = useState("");
    const [buffer, setBuffer] = useState({});
    
    const converTOBuffer = async (reader) => {
        const buffer =await Buffer.from(reader.result);
        setBuffer(buffer);
    }

    const capturefile =(e) => {
        e.preventDefault();
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(e.target.files[0]);
    
        reader.onloadend = () => {
           converTOBuffer(reader)
        }
    }
   
    
    const postData = async (e) =>{
        e.preventDefault();
        const added = await ipfs.add(buffer);
        contract.methods.uploadImage(added.path, imgDesc).send({from: account}).on('transactionHash', (hash) => {
            console.log('hash',hash);
        })
        
    }
    return(
        <form>
            <input type="file" accept=".jpg, .jpeg, .png, .bmp, .gif" id="myFile" name="filename" onChange = {(e) => capturefile(e)}></input><br/>
           <input type="text" onChange ={(e) => {setImgDesc(e.target.value)}} placeholder="Image Description" required></input><br/>
           <button type="submit" onClick = {(e) => postData(e)}> submit </button>
        </form>
    );
}