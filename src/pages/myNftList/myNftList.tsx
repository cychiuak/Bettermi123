import * as React from 'react';
import './myNftList.css'
import { CenterLayout } from '../../components/layout';
import { Link, useNavigate } from 'react-router-dom';
import { BackButton } from '../../components/button';
import { GetToken } from '../../components/getToken';
import { useSelector } from 'react-redux';
import { accountId } from '../../redux/account';
import CSS from 'csstype';
import { ShortTitleBar } from '../../components/titleBar';
import { Col, Row, Card, CardText, CardTitle, Button, CardImg, } from 'reactstrap';
import { useAppSelector, useLedger } from '../../redux/useLedger';
import MyNft from './myNft';
import { selectWalletNodeHost } from '../../redux/useLedger';
import { LedgerClientFactory } from '@signumjs/core';
import { useState, useEffect } from 'react';
import { useRef } from 'react';
import {generateMasterKeys} from "@signumjs/crypto";
import { P2PTransferNftToken } from '../../components/p2pTransferNftToken';
import { AppContext } from '../../redux/useContext';
import { useContext } from 'react';
import { accountPublicKey } from '../../redux/account';
import { CustomTextArea } from '../../components/input';
import { FindLatestTransactionArray,FindLatestTransactionNumber, p2pTransferNft } from '../../NftSystem/updateUserNftStorage';
import { getNftContractStorage } from '../../redux/account';
import { CheckNftOwnerId,TransferNft,UpdateUserStorage } from '../../NftSystem/updateUserNftStorage';
import { store } from '../../redux/reducer';
import { accountSlice } from '../../redux/account';
import { updateReceiverAccount } from '../../NftSystem/updateUserNftStorage';
import ImportAccountScreen from '../../components/importAccountScreens';
import ImportSuccessScreen from '../../components/importAccountSuccessScreen';
import { TransferNftToNewUser } from '../../NftSystem/transferNft';
import { selectCurrentGender } from '../../redux/profile';
import { GetEquippedNftId } from '../../NftSystem/updateUserNftStorage';

interface IMyNftListProps {
  isUpdatingDescription:boolean;
  myNfts:myNftList[];
  setIsUpdatingDescription:(isUpdatingDescription:boolean) => void;
  isOtherUser:boolean;
  equippedNftIpfsAddress?:string;
}

// interface myNftList{
//   image:string;
//   assetId:string;
// }

export interface myNftList{
  level:string;
  image:string;
  nftId:string;
}

const MyNftList: React.FunctionComponent<IMyNftListProps> = (props) => {
  const {isUpdatingDescription,myNfts,setIsUpdatingDescription,isOtherUser,equippedNftIpfsAddress} = props;
  const userAccountId: string = useSelector(accountId);
  const mobile = process.env.REACT_APP_MOBILE === 'true';
  let height: string | number
  let width: string | number;
  const [loading, setLoading] = useState(true);
  //const [myNfts, setMyNfts] = useState<myNftList[]>([]);
  const [onDuty, setOnDuty] = useState<string>("");
  const [array, setArray] = useState<string[]>([]);
  const [selectedNftId, setSelectedNftId] = useState<string>("");
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const [userNftTokenList,setNftTokenList] = useState<myNftList[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputAddress,setInputAddress] = useState("");
  const [level,setLevel] = useState("1");
  const [hasImportError, setHasImportError] = useState<boolean>(false);
  const [importSuccess,setImportSuccess] = useState<boolean>(false);
  const [isOpenImport, setIsOpenImport] = useState<boolean>(false);
  const [nftNumber,setNftNumber] = useState<number>();
  const gender = useSelector(selectCurrentGender);
  const dataFetchedRef = useRef(false);
  const nftContractChecked = useRef(false);
  const {appName,Wallet,Ledger} = useContext(AppContext);
  const nftTokenIssuer:string = process.env.REACT_APP_NFT_TOKEN_ISSUER!;
  const userAccountpublicKey:string = useSelector(accountPublicKey);
  const mimiNftStorageAccounts = process.env.REACT_APP_NFT_STORAGE_MIMI!.split(",");
  const ioNftStorageAccounts = process.env.REACT_APP_NFT_STORAGE_IO!.split(",");
  var nft: myNftList;
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const trialAccountId = "416342944383657789";
  var nftAddressList:string[] = [];
  var userNftList:myNftList[] = [];
  var userNftToken:myNftList[] = [];
  const navigate = useNavigate();

  const codeHashIdForNft = "5093642053599315133";
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const nftDistributorPublicKey = process.env.REACT_APP_NFT_DISTRIBUTOR_PUBLIC_KEY!;
  const nftDistributorPrivateKey = process.env.REACT_APP_NFT_DISTRIBUTOR_PRIVATE_KEY!;
  const nftContractStorage = useSelector(getNftContractStorage);
  useEffect(() => {
    if (nftContractChecked.current) {  return; }
    nftContractChecked.current = true;
    ledger2.contract.getContractsByAccount({
          accountId: userAccountId,
          machineCodeHash: codeHashIdForNft,
      }).then((senderNftStorage)=>{
        store.dispatch(accountSlice.actions.setNftContractStorage(senderNftStorage.ats[0].at));
        if(gender === "Female"){
        TransferNftToNewUser(ledger2,userAccountId,mimiNftStorageAccounts,codeHashIdForNft,nftDistributor,nftDistributorPublicKey,nftDistributorPrivateKey);
        }
        if(gender === "Male"){
          TransferNftToNewUser(ledger2,userAccountId,ioNftStorageAccounts,codeHashIdForNft,nftDistributor,nftDistributorPublicKey,nftDistributorPrivateKey);
          }
      }).catch((error)=>{
        console.log(error);
        alert(
          `something is wrong. Its very likely that your storage account isn' ready. 
          Please wait an few minutes and try again.
          `);navigate("/home")
      });
    
      },[]);
    
      const getEquippedNftNumber = async() => {
        const equippedNftId = await GetEquippedNftId(ledger2,userAccountId);
        const equippedNftIDDescription = await ledger2.contract.getContract(equippedNftId);
        const equippedNftDescription = JSON.parse(equippedNftIDDescription.description);
        const image = equippedNftDescription.descriptor;
        fetch(`https://ipfs.io/ipfs/${image}`).then((res)=>{
          res.text().then((text)=>{
              //console.log(text); 
              var nftInfo = JSON.parse(text);
              let matches = nftInfo.name.match(/(\d+)/);
              //console.log(matches[0]);
              const nftNumber = matches[0].toString().padStart(8, '0');
              setNftNumber(nftNumber);
          })
        }).catch((e) => {console.log(e);})
      }

  useEffect(() => {
    if (dataFetchedRef.current) { console.log("called"); return; }
    dataFetchedRef.current = true;
    ledger2.account.getAccount({ accountId: userAccountId }).then((account) => {
      const description = account.description == null?{}:JSON.parse(account.description);
      if(description.av !== null){

      setOnDuty(Object.keys(description.av)[0]);
      // fetch(`https://ipfs.io/ipfs/${Object.keys(description.av)[0]}`).then((res)=>{
      //   res.text().then((text)=>{
      //       //console.log(text); 
      //       var nftInfo = JSON.parse(text);
      //       let matches = nftInfo.name.match(/(\d+)/);
      //       console.log("matches[0] is   ",matches[0]);
      //       setNftNumber(matches[0]);
      //   }).catch((error)=>{console.log(error)});
      // }).catch((error)=>{console.log(error)});
      getEquippedNftNumber();
      }
    }).catch((error) => { console.log(error) });
  },[]);

  //   useEffect(() => {
  //         FindLatestTransactionNumber(ledger2,nftContractStorage,nftDistributor).then((number)=>{
  //           console.log(number);
  //           FindLatestTransactionArray(ledger2,nftContractStorage,nftDistributor,number).then(async(nftAddressList)=>{
  //             if(nftAddressList[0] === "empty"){
  //               setLoading(false);
  //             }
  //             else{
  //                   console.log(nftAddressList);
  //                 // nftAddressList.map((nftAddress)=>{
  //                 //   ledger2.contract.getContract(nftAddress).then((hi)=>{
  //                 //       //console.log("array is ",nftAddress,"  ",hi);
  //                 //       const trial = JSON.parse(hi.description);
  //                 //       //console.log(trial);
  //                 //       //console.log(trial.descriptor);
  //                 //       nft = {level:trial.version,image:trial.descriptor,nftId:nftAddress};
  //                 //       //console.log([...myNfts,nft]);
  //                 //       //console.log(myNfts);
  //                 //       setMyNfts([...myNfts,nft]);
  //                 //       setArray([...array,"123"]);
  //                 //       //console.log("testing array is ",array);
  //                 //       //console.log("appended list is ",[...myNfts,nft]);
  //                 //       userNftList.push(nft);
  //                 //       setMyNfts(userNftList);
  //                 //       setLoading(false);
  //                 //   });
  //                 // });
  //                 for (var i = 0;i < nftAddressList.length;i++){
  //                   const contractInfo = await ledger2.contract.getContract(nftAddressList[i]);
  //                   const trial = JSON.parse(contractInfo.description);
  //                   nft = {level:trial.version,image:trial.descriptor,nftId:nftAddressList[i]};
  //                   userNftList.push(nft);
  //                   if(i === nftAddressList.length-1){
  //                     console.log(userNftList);
  //                     setMyNfts(userNftList);
  //                     setLoading(false);
  //                   }
  //                 }
  //               }
  //           });
  //         }).catch((error)=>{console.log(error);navigate("/home")});

  // }, [userAccountId]);



  if (mobile) {
    height = "844px";
    width = "390px";
    // display in ipad air size
  } else {
    height = "100vh";
    width = "820px";
  }
  const bgStyle: CSS.Properties = mobile ?
    {
      'background': `transparent`,
    }
    :
    {
      'position': 'fixed',
      'background': `linear-gradient(112deg, #221D4B 0%, #171717 100%)`,
      'boxShadow': '0px 3px 30px var(--royal-blue)',
      'width': '100vw',
      'minHeight': '100vh',
      'height': '100%',
      // 'overflowY': `${isOpenPopup ? 'hidden' : 'auto'}`,
      'overflowY': 'auto',
      'zIndex': '1',
      'overflowX': 'hidden',
      'display': 'flex!important',
    }
  const centerLayoutStyle: CSS.Properties = {
    // 'backgroundPosition': 'center',
    'minHeight': `${height}`, // ipad size
    'width': `min(100vw,${width})`, // ipad size
    'height': '100%',
    //'margin': 'auto',
    'display': 'flex',
    //'justifyContent': 'center',
    //'alignItems': 'center',
    //'backgroundColor': 'green',
    'flexDirection': 'column',
  }
  const customStyle: CSS.Properties = {
    'alignItems': 'flex-start',
    'cursor': 'pointer',
    'display': 'flex',
    'height': '44px',
    'left': '16px',
    'minWidth': '44px',
    'paddingLeft': '14px',
    'position': 'relative',
    'top': '44px',
  }
  const importNft = async (ledger2:any,nftAddress:string,userAccountId:string) => {
    try{
let accountDes = await ledger2.account.getAccount({accountId:nftAddress});
const nftId = accountDes.account;
    const nftOwnerId = await CheckNftOwnerId(ledger2,nftId);
    if(nftOwnerId === userAccountId){
      //console.log("updating receiver account");
      //console.log(userAccountId);
      updateReceiverAccount(ledger2,userAccountId,codeHashIdForNft,nftId,nftDistributor,nftDistributorPublicKey,nftDistributorPrivateKey);
    }
  }
  catch(e){
    console.log(e);
  }
  }
  const displayMyNft = myNfts.map((nft) => {//Contract Id
    //console.log("userNftList is  ", myNfts);
    return (
      <MyNft 
      image={nft.image} 
      level={level} 
      isOpenPopup={isOpenPopup} 
      setIsOpenPopup={setIsOpenPopup} 
      nftId = {nft.nftId} 
      setSelectedAssetId={setSelectedNftId} 
      setLevel={setLevel} 
      isUpdatingDescription = {isUpdatingDescription} 
      setIsUpdatingDescription={setIsUpdatingDescription} 
      isOtherUser = {isOtherUser}
      ></MyNft>
    );
  }
  );
  const displayNftToken = userNftTokenList.map((nft) => {//Contract Id
    return(
      <MyNft 
      image={nft.image} 
      level={level} 
      isOpenPopup={isOpenPopup} 
      setIsOpenPopup={setIsOpenPopup} 
      nftId= {nft.nftId} 
      setSelectedAssetId={setSelectedNftId} 
      setLevel={setLevel}
      isUpdatingDescription = {isUpdatingDescription} 
      setIsUpdatingDescription={setIsUpdatingDescription}
      isOtherUser = {isOtherUser}
      ></MyNft>
    );
  }
  );
  const transferNft = async(assetId:string) => {
    try{
      const contractInfo = await ledger2.contract.getContract(selectedNftId);
      const trial = JSON.parse(contractInfo.description);
      /*  Get the NFT image of ths selected asset and check if its same to the onDuty one      */
      const res = await fetch(`https://ipfs.io/ipfs/${trial.descriptor}`);
      const text = await res.text();
      var nftInfo = JSON.parse(text);
      const nftImage = nftInfo.media[0].social;

      /**/
      
      if(onDuty === nftImage){
        alert("You can't transfer the NFT you are using");
        return;
      }
      const nftOwner = await CheckNftOwnerId(ledger2,selectedNftId);
      if(nftOwner === userAccountId){
        //TransferNft(ledger2,selectedNftId,userAccountId,codeHashIdForNft,nftDistributor,nftDistributorPublicKey,nftDistributorPrivateKey);
        const latestTransactionNumber:string = await FindLatestTransactionNumber(ledger2,nftContractStorage,nftDistributor);
        const latestArray:string[] = await FindLatestTransactionArray(ledger2,nftContractStorage,nftDistributor,latestTransactionNumber);
        const transactionCost = (Math.floor((latestArray.length)/8+1)*1000000).toString();
       const userCoverTheirTransactionCost = await ledger2.transaction.sendAmountToSingleRecipient({
          recipientId: nftDistributor,
          amountPlanck: transactionCost,
          feePlanck: "1000000",
          senderPublicKey: userAccountpublicKey,
        });
        await Wallet.Extension.confirm(userCoverTheirTransactionCost.unsignedTransactionBytes);
        const recipientInfo  = await ledger2.account.getAccount({accountId:inputAddress});
        //await p2pTransferNft(ledger2,Wallet,selectedNftId,userAccountpublicKey,recipientInfo.account);
        const transaction = await ledger2.contract.callContractMethod({
          senderPublicKey: userAccountpublicKey,
          feePlanck: "2000000",
          amountPlanck: "30000000",
          contractId: selectedNftId,
          methodHash: "-8011735560658290665",
          methodArgs: [recipientInfo.account],
          });
          await Wallet.Extension.confirm(transaction.unsignedTransactionBytes);
        await UpdateUserStorage(ledger2,userAccountId,inputAddress,codeHashIdForNft,selectedNftId,nftDistributor,nftDistributorPublicKey,nftDistributorPrivateKey);
      }
      else{
        alert("We are sorry, it seems like you still don't own this NFT, maybe wait for a few more minutes if you just received it revcently");
      }
    }
    catch(e){
     
      console.log(e);
    }
  }

    const handleInputChange = (event:any) => {
      setInputValue(event.target.value);
    };
    const handleAddressChange = (event:any) => {
      setInputAddress(event.target.value);
    };
    const unequipNft = async() => {
      const waitingToBeChangedDescription = await ledger2.account.getAccount({accountId: userAccountId});
      let newDes =waitingToBeChangedDescription.description===undefined?{}:JSON.parse(waitingToBeChangedDescription.description);

    }

    // testing for github update

return(
    <div style={bgStyle}>
      <div style={centerLayoutStyle} className='bettermidapp-mimi-nfts-send-address-1'>
        {isOtherUser?(                
          <>            
          <ShortTitleBar title='My NFTs' addSign = {true} aiCoach = {false} filter = {false} />
              <div className = "containerMyNftList">
                <div className = "containerMyNftList2">     
                    {displayMyNft}
                </div>
              </div>
              </>
              ):
        (<>
            <ShortTitleBar title='My NFTs' addSign = {true} aiCoach = {false} filter = {false} importButton = {true} isOpenImport = {isOpenImport} setIsOpenImport={setIsOpenImport}/>
            <div className = "containerMyNftList">
              <div className = "containerMyNftList2">
              {onDuty === ""?(             
              <div className = "myNftList">
                {gender === "Female"?
                  (
                  <Link to="https://test.signumart.io/">
                  <div className="myNftListEmptyNft">
                    <img className="myNftListAdd" src="img/profile/add-2@1x.png" alt="Add" />
                    <img
                      className="myNftListadd2"
                      src="img/profile/ic-add-2@1x.png"
                      alt="ic_add"
                    />
                  </div>
                </Link>
                  ):
                  (
                    <Link to="https://test.signumart.io/">
                    <div className="myNftListEmptyNft">
                      <img className="myNftListAdd" src="img/profile/add-2@1x.png" alt="Add" />
                      <img
                        className="myNftListadd2"
                        src="img/profile/ic-add-2@1x.png"
                        alt="ic_add"
                      />
                    </div>
                  </Link>
                  )
                }
                  <div className = "myNftDescription">
                  <div className = "myNftNumber">#{nftNumber}</div>
                    <div className = "myNftBar">
                      <div  className = "myNftLevel">
                        Lv{level}       
                        </div>
                        <div className = "myNftVerticalLine"></div>  
                        <div  className = "inter-normal-white-12px">
                          Reward + 10%
                          </div>
                    </div>
                    <div className = "myNftPrice">
                      $0 SIGNA
                    </div>
                  </div>
                  <div className = "myNftBottom">
                  <button 
                  onClick = {() => {}}
                    className = "myNftButtonOnDuty" 
                    style = {{backgroundColor:"#39B3AF!important"}}
                  >ON DATE</button>
                  <img  className = "myNftButtomArrow" src  = {`${process.env.PUBLIC_URL}/img/NftList/ic-send@1x.png`} onClick={() => setIsOpenPopup((prev) => !prev)}></img>
                  </div>
                </div>
                ):(
                  <div className = "myNftList">
                    {isUpdatingDescription === true?
                    <img className = "myNftImage" src = "/img/loadingMinting/mimi-dancing-for-loadin-page.gif"></img>
                    :(
                      <img className = "myNftImage" src = {`https://ipfs.io/ipfs/${onDuty}`}></img>
                    )
                    }
                  <div className = "myNftDescription">
                  <div className = "myNftNumber">#{nftNumber}</div>
                    <div className = "myNftBar">
                      <div  className = "myNftLevel">
                        Lv{level}       
                        </div>
                        <div className = "myNftVerticalLine"></div>  
                        <div  className = "inter-normal-white-12px">
                          Reward + 10%
                          </div>
                    </div>
                    <div className = "myNftPrice">
                      $0 SIGNA
                    </div>
                  </div>
                  <div className = "myNftBottom">
                  <button className = "myNftButtonOnDuty" style = {{backgroundColor:"#39B3AF!important"}}>ON DATE</button>
                  <img className = "myNftButtomArrow" src  = {`${process.env.PUBLIC_URL}/img/NftList/ic-send@1x.png`} onClick={() => setIsOpenPopup((prev) => !prev)}></img>
                  </div>
                </div>
                    )

                    }
                    {/* {displayMyNft} */}
                    {/* {loading?(<div></div>):(displayMyNft)} */}
                    {displayMyNft}
              </div>
              {/* {loading?(<p>loading...</p>):(
                <>
                      <ShortTitleBar title='My NFTs' />
                      {console.log(userNftList)}{console.log(array)}
              <div className = "containerMyNftList">
                <div className = "containerMyNftList2">
                    {displayMyNft}
                </div>
              </div>
              </>
              )
        } */}
            </div>
            {isOpenPopup && 
                <div className="edit-profile-layer">
                  <div className="icon-arrow-left-1-popup icon-arrow-left-3-popup">
                    <img className="icon-arrow-left-popup" onClick={() => setIsOpenPopup((prev) => !prev)} src="img/myNftList/icon-arrow-left-1@1x.png" alt="icon-arrow-left" />
                  </div>
                  <div className="edit-profile">
                    <div className="overlap-group-1">
                      <img className="seperate-line-1" src="img/myNftList/seperate-line-1@1x.png" alt="Seperate line" />
                      <img className="bg" src="img/myNftList/bg-2@1x.png" alt="BG" />
                      <img className="seperat-line-1 seperat-line-3" src="img/myNftList/seperat-line-3@1x.png" alt="Seperat line" />
                      <div className="transfer-n-ft inter-bold-royal-blue-15px">TRANSFER NFT</div>
                      <div className="recipient inter-bold-royal-blue-15px">RECIPIENT</div>
                      <div className="nft-details inter-bold-royal-blue-15px">NFT DETAILS</div>
                      <div className="rewards">
                        <div className="ic_send-1">
                          <img className="ic_send-1-content" src="img/myNftList/ic-send-1@1x.png" alt="" />
                        </div>
                        <div className="place inter-semi-bold-white-18px">Send</div>
                      </div>
                      <div className="search_bar"></div>
                      <CustomTextArea 
                        text= {inputAddress} 
                        setText={setInputAddress} 
                        width={300} 
                        height={56} 
                        importClassName="card-number-1 search_bar-1 search_bar-4"
                        activeClassName="active-card-number-1 search_bar-1 search_bar-4"
                        placeholder="e.g. TS-9DJR-MGA2-VH44-5GMXY"
                      />
                      {/* <textarea
                        className="search_bar-1 search_bar-4"
                        value={inputAddress}
                        onChange={handleAddressChange}
                        placeholder="Enter something"
                      /> */}
                      {/* <div className="search_bar-1 search_bar-4"><p className="card-number">e.g. TS-9DJR-MGA2-VH44-5GMXY or Anderson</p></div> */}
                      <div className="search_bar-2 search_bar-4"></div>
                      <div className="button_save" onClick={() => transferNft(selectedNftId)}>
                        <div className="continue inter-semi-bold-white-15px">Transfer</div>
                      </div>
                      <p className="address-id-to-send-nft-to">Address, ID to send NFT to.</p>
                      <h1 className="text-7">#00000001</h1>
                      <div className="x0-signa-1">$0 SIGNA</div>
                      <div className="x16228">
                        <div className="lv-1-1">LV {level || 1}</div>
                        <img className="x6" src="img/myNftList/file---6@1x.png" alt="6" />
                        <div className="reward-10-1">REWARD +10%</div>
                      </div>
                      <CustomTextArea 
                        text= {inputValue} 
                        setText={setInputValue} 
                        width={300} 
                        height={121} 
                        importClassName="card-number-1 search_bar-4 search_bar-3"
                        activeClassName="active-card-number-1 search_bar-4 search_bar-3"
                        placeholder="You may attach some text or binary data to this transaction. Here you also enter the memo required by many exchanges"
                      />
                      {/* <textarea
                        className="search_bar-3 search_bar-4"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="You may attach some text or binary data to this transaction. Here you also enter the memo required by many exchanges"
                      /> */}
                    {/* <p>Input Value: {inputValue}</p> */}
                      {/* <div className="search_bar-3 search_bar-4">
                        <p className="card-number-1">
                          You may attach some text or binary data to this transaction. Here you also enter the memo required
                          by many exchanges
                        </p>
                      </div> */}
                      <div className="additional-text inter-bold-royal-blue-15px">ADDITIONAL TEXT</div>
                    </div>
                  </div>
                </div>
            }
            { isOpenImport&& <ImportAccountScreen setIsOpenImport={setIsOpenImport} isOpenImport = {isOpenImport} importSuccess = {importSuccess}setImportSuccess={setImportSuccess} ></ImportAccountScreen>}
            {hasImportError && <ImportAccountScreen setIsOpenImport={setIsOpenImport} isOpenImport = {isOpenImport} importSuccess = {importSuccess}setImportSuccess={setImportSuccess}></ImportAccountScreen>}
            {importSuccess && <ImportSuccessScreen importSuccess = {importSuccess} setImportSuccess={setImportSuccess}></ImportSuccessScreen>}
            </>
          )
        }
        
      </div>
    </div>


  );


  // return (
  //   <CenterLayout
  //     content={content}
  //     bgImg={false}
  //   />
  // );"{"version":1,"descriptor":"QmNhdiqCRXzoVm3pn5eaqvudAjbWsavwqi6a6Bs7ZL5WeE"}"
};

export default MyNftList;