import * as React from 'react';
import { CenterLayout } from '../../components/layout';
import { BackButton } from '../../components/button';
import './generateFreeNFT.css'
import { useNavigate } from 'react-router-dom';
import {useLocation} from "react-router-dom";
import { useEffect } from 'react';
import { FindNftIpfsAddressWithConractId } from '../../NftSystem/updateUserNftStorage';
import { useLedger } from '../../redux/useLedger';

interface GenerateFreeNFTProps {
}

const GenerateFreeNFT: React.FunctionComponent<GenerateFreeNFTProps> = (props) => {
  const navigate = useNavigate()
  const location = useLocation();
  const Ledger = useLedger();
  console.log("location.state is ",location.state);
  const nftId = location.state.nftId;
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [nftIpfsAddress,setNftIpfsAddress] = React.useState<string>("");
  const [nftNumber,setNftNumber] = React.useState<number>(0);
  useEffect(() => {
    FindNftIpfsAddressWithConractId(Ledger,nftId).then(
      (result) => {
        console.log("reslt is ",result);
        setNftIpfsAddress(result.nftImage);
        setNftNumber(result.nftNumber);
        setIsLoading(false);
      }
    ).catch((e:any) => {
      alert("We apologize that some error has occured. You can still get your free NFT in myNft Collection if you haven't get one");
      console.log(e);
    } );
    console.log("nftId is ",nftId);
  },[]);
  const content : JSX.Element = (
    <>
      <img className="photo" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/photo-1@1x.png`} alt="Photo" />
      {/* <BackButton /> */}
      {isLoading === true?(<div className= "x0"></div>):(
        <>
          <img className="x0"src = {`https://ipfs.io/ipfs/${nftIpfsAddress}`} alt="0" />
          <h1 className="text-1">#{nftNumber}</h1>
        </>
      )
    }
      <div className="x16206">
        <div className="lv-1">LV 1</div>
        <img className="x6" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/file---6@1x.png`} alt="6" />
        <div className="reward-10">REWARD +10%</div>
      </div>
      <div className="x0-signa">$0 SIGNA</div>
      <div className="button_-import" onClick={() => navigate('/customizeYourProfile',{state:{nftImageAddress:nftIpfsAddress,nftId:nftId}})}><div className="continue inter-semi-bold-white-15px">Next</div></div>
    </>
  )


  return (
    <CenterLayout
      bgImg={false}
      content={content}
    />
  );
};

export default GenerateFreeNFT;
