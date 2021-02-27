const SimpleStorage = artifacts.require("./SimpleStorage.sol");

contract("SimpleStorage", ([deployer, author, tipper]) => {
 
  it("name has been set.", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();

    const name = await simpleStorageInstance.name();

    assert.equal(name, "Decentragram", "The value 89 was not stored.");
  });

  it('create images', async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();
    
    let result = await simpleStorageInstance.uploadImage('abc', 'Image desc', {from: author})
    
    let imagecount = await simpleStorageInstance.imageCount();

    assert.equal(imagecount, 1);
    
    // checking if event is emitted
    const event = result.logs[0].args;
    assert.equal(event.id.toNumber(), imagecount.toNumber(), 'id is correct')
    assert.equal(event.hash, 'abc', 'hash is correct')
    assert.equal(event.description, 'Image desc', 'desc is correct')
    assert.equal(event.tipAmount, '0', 'tip is correct')
    assert.equal(event.author, author, 'author is correct')

  });

  it('list image', async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();
    const imagecount = await simpleStorageInstance.imageCount();
    const image = await simpleStorageInstance.images(imagecount);
    assert.equal(image.id.toNumber(), imagecount.toNumber(), 'id is correct')
    assert.equal(image.hash, 'abc', 'hash is correct')
    assert.equal(image.description, 'Image desc', 'desc is correct')
    assert.equal(image.tipAmount, '0', 'tip is correct')
    assert.equal(image.author, author, 'author is correct')
  });

  it('allow users to tip images', async () => {
   
    const simpleStorageInstance = await SimpleStorage.deployed();
     const imagecount = await simpleStorageInstance.imageCount();
    let oldAuthorBalance = await web3.eth.getBalance(author);
    oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);
    
    const result = await simpleStorageInstance.tipImageOwner(imagecount, { from: tipper, value: web3.utils.toWei('1', 'Ether') });
 
    const event = result.logs[0].args;
    assert.equal(event.id.toNumber(), imagecount.toNumber(), 'id is correct')
    assert.equal(event.hash, 'abc', 'hash is correct')
    assert.equal(event.description, 'Image desc', 'desc is correct')
    assert.equal(event.tipAmount, '1000000000000000000', 'tip is correct')
    
    assert.equal(event.author, author, 'author is correct')
     
    let newAuthorBalance =  await web3.eth.getBalance(author);
    newAuthorBalance = new web3.utils.BN(newAuthorBalance);

    let tipImageOwner = web3.utils.toWei('1' ,'Ether');
    tipImageOwner = new web3.utils.BN(tipImageOwner);

    const expectedbalance = oldAuthorBalance.add(tipImageOwner);

    assert.equal(newAuthorBalance.toString(), expectedbalance.toString());

  })


   
  
});
