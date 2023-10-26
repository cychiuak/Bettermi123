import React, { useRef }  from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './home.css'
import { CenterLayout } from '../../components/layout';
import MenuBar from '../../components/menuBar';
import { useSelector } from 'react-redux';
import { selectCurrentUsername } from '../../redux/profile';
import { accountToken } from '../../redux/account';
import { store } from '../../redux/reducer';
import { useState } from 'react';
import { useAppSelector } from '../../redux/useLedger';
import { LedgerClientFactory } from '@signumjs/core';
import { selectWalletNodeHost } from '../../redux/useLedger';
import { useEffect } from 'react';
import { accountSlice } from '../../redux/account';
import { isTodayHaveSelfieRecord } from '../../components/bmiCalculate';
import { useLedger } from '../../redux/useLedger';
import { accountId } from '../../redux/account';
import { testing } from '../../redux/characteraiAPI';
import { selectCurrentGender } from '../../redux/profile';
import { NavigateToTakeSelfieButton } from '../../components/button';
import ImageSlider, { Carousel, CarouselItem } from './Carousel';
import { accountLevel } from '../../redux/account';
import { calRewardSigdaoOnSelfie } from '../../components/selfieToEarnRewardType';
import { TransferToken } from '../../components/transferToken';
import { useContext } from 'react';
import { AppContext } from '../../redux/useContext';
import HorizontalScrollContainerMission from './horzontalScrollContainer';
import { CheckNftOwnerId } from '../../NftSystem/updateUserNftStorage';
import UserIcon from '../../components/loadUserIcon';

interface IHomeProps {
}

function handleScrollHorizontally(event: any) {
  console.log(event);   
  const container = document.querySelector("div.missions-scroll-RoXPLo.x-")!;
  //const container = event.target;
  const largeContainer = document.querySelector("div");
  const delta = Math.max(-1, Math.min(1, (event.deltaY || -event.detail)));
  largeContainer?.classList.add("no-scroll");
  console.log(container);
  const scrollTop = event.pageYOffset || document.documentElement.scrollTop;
  window.onscroll = function() {
    window.scrollTo(-scrollTop,0 );
  };
  container.scrollLeft -= (delta * 40); // Adjust scrolling speed here
  event.preventDefault();

}

const HorizontalScrollContainer = (props: any) => {
  const containerRef = useRef(null);

  return (
    <div
      className='missions-scroll-RoXPLo x-'
      ref={containerRef}
      style={{ overflowX: 'auto' }}
      onWheel={handleScrollHorizontally}
    >
      {props.children}
    </div>
  );
}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const slides = [
    {'src': `${process.env.PUBLIC_URL}/img/home/1@1x.png`, 'link': 'https://www.bettermi.io/'},
    {'src': `${process.env.PUBLIC_URL}/img/leaderboard/photo@1x.png`, 'link': '/leaderboard'},
    {'src': `${process.env.PUBLIC_URL}/img/home/1@1x.png`, 'link': 'https://www.bettermi.io/'},
  ]

  // info
  const {appName,Wallet,Ledger} = useContext(AppContext);
  const name = useSelector(selectCurrentUsername);
  const Token:string = useSelector(accountToken);
  const userAccountId = useSelector(accountId);
  const [loading, setLoading] = useState<boolean>(true);
  const [imgAddress, setImgAddress] = useState<string>("");
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({nodeHost});
  const userAccoubntId = useAppSelector(accountId);
  const navigate = useNavigate();
  const tempAccountId = useSelector(accountId);
  const Ledger2 = useLedger();
  const gender = useSelector(selectCurrentGender);
  const [level,setLevel] = useState<string>("");
  const codeHashIdForNft = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!;
  console.log(Token);
  console.log(store.getState());
  console.log("Token is  ",Token);
  console.log(Wallet);
  console.log(Wallet.Extension.connection);  
  console.log(Wallet.Extension.connection == null);

  // useEffect(() => {
  //   testing();
  // }, []);

  useEffect(() => {
    // Function to fetch data from the APIc
    ledger2.account.getAccount({accountId:userAccountId})
      .then(async(account)=>{
        for (var i = 0;i<account.assetBalances.length;i++){
          if(account.assetBalances[i].asset === "13116962758643420722"){
            store.dispatch(accountSlice.actions.setToken(Number(account.assetBalances[i].balanceQNT)/1000000));
            localStorage.setItem('token',account.assetBalances[i].balanceQNT);
            console.log(account.assetBalances[i].balanceQNT);
          }
        }
        const description = JSON.parse(account.description);
        console.log(description.id);
          if(description.id != null){
            const accountInfo = await ledger2.contract.getContract(description.id);
            console.log(accountInfo);
            const ipfsAddress = JSON.parse(accountInfo.description).descriptor;
            console.log(ipfsAddress);
            const ipfsJson = await fetch(`https://ipfs.io/ipfs/${ipfsAddress}`);
            console.log(ipfsJson);
            const text = await ipfsJson.text();
            console.log(text);
            const nftInfo = JSON.parse(text);
            console.log(nftInfo);
          if(nftInfo.description.includes("1") === true){
            setLevel("1");
          }
          if(nftInfo.description.includes("2") === true){
            setLevel("2");

          }
          if(nftInfo.description.includes("3") === true){
            setLevel("3");
          }
          store.dispatch(accountSlice.actions.setLevel(description.ds));
        }
        else{
          setLevel("1");
          store.dispatch(accountSlice.actions.setLevel(description.ds));
        }
        
        console.log(description);
        console.log(Object.keys(description.av));
        console.log(typeof(Object.keys(description.av)[0]));
        setImgAddress(Object.keys(description.av)[0]);
        setLoading(false);  
        console.log(imgAddress);
        console.log(typeof(imgAddress));
      })
      .catch((error)=>{ 
        console.log("need to equip nft");
        console.log(imgAddress);
        console.log(typeof(imgAddress));
        setLoading(false);
      });

      // TransferToken(nodeHost,userId,"10");

      // console.log(calRewardSigdaoOnSelfie(22.9), "calRewardSigdaoOnSelfie(22.9)");

  }, []);

  // todo: map
  // const userSIGDAO = 

  // todo: export a button as take a selfie component
  async function handleTakeASelfie() {
    // if (await isTodayHaveSelfieRecord(tempAccountId, Ledger2)) {
    //   alert('already taken a selfie, since we are in demo mode, click comfirm for another selfie')
    //   navigate('/takeSelfie')
    // }
    navigate('/takeSelfie')
  }

  // const testing = async () => {
  //   await TransferToken(nodeHost,userId, calRewardSigdaoOnSelfie(22.9).toString())
  // }
  const nftContractChecked = useRef(false);
  useEffect(() => {
    if (nftContractChecked.current) { console.log("called"); return; }
    nftContractChecked.current = true;
    ledger2.contract.getContractsByAccount({
          accountId: userAccountId,
          machineCodeHash: codeHashIdForNft,
      }).then((senderNftStorage)=>{
        store.dispatch(accountSlice.actions.setNftContractStorage(senderNftStorage.ats[0].at));

      }).catch((error)=>{
        console.log(error);
      });
    
      },[]);

  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermidapp-home-1">
        <Link to="/featureMissions">
          <div className="view-all-RoXPLo inter-medium-royal-blue-14px">See all</div>
        </Link>
        <div className="feature-missions-RoXPLo inter-semi-bold-white-21px">Feature Missions</div>
        <div className="reservation_button-RoXPLo">
          <img className="button_bg-nXPAX5" src={`${process.env.PUBLIC_URL}/img/home/button-bg-1@1x.png`} alt="Button_bg" />
          <div className="ic_reservation-nXPAX5 ic_reservation">
            <img className="ic_reservation-p9BhAR ic_reservation" src={`${process.env.PUBLIC_URL}/img/home/ic-reservation@1x.png`} alt="ic_reservation" />
          </div>
          <div className="ic_locked-nXPAX5 ic_locked">
            <img className="ic_locked-OiAYIf ic_locked" src={`${process.env.PUBLIC_URL}/img/ic-locked-1@1x.png`} alt="ic_locked" />
          </div>
        </div>
        <div className="leaderboard_button-RoXPLo">
          <div className="button_bg-IgToMG"></div>
          <div className="ic_leaderboard-IgToMG ic_leaderboard">
            <img className="ic_leaderboard-6DxnCN ic_leaderboard" src={`${process.env.PUBLIC_URL}/img/ic-leaderboard@1x.png`} alt="ic_leaderboard" />
          </div>
          <div className="ic_locked-IgToMG ic_locked">
            <img className="ic_locked-Itp9oo ic_locked" src={`${process.env.PUBLIC_URL}/img/ic-locked-1@1x.png`} alt="ic_locked" />
          </div>
        </div>
        {/* <ImageSlider slides={slides} /> */}
        <div className="special-card-RoXPLo">
          {/* <div className="special-scroll-hH9Cww">
            <div className="x25-hK4LUV">
              <Carousel>
                {slides.map((slide, index) => {
                  return (
                    <CarouselItem key={index}>
                      <Link to={slide.link}>
                        <img className='home-scroller-element-image' src={slide.src} alt="" />
                      </Link>
                    </CarouselItem>
                  )
                })}
              </Carousel>
              <Link to='https://www.bettermi.io/'>
                <div className="x01-78JfKY"><img className="x1" src={`${process.env.PUBLIC_URL}/img/home/1@1x.png`} alt="1" /></div>
              </Link>
              <Link to=''>
                <div className="x11-78JfKY"><img className="x1" src={`${process.env.PUBLIC_URL}/img/home/1@1x.png`} alt="1" /></div>
              </Link>
              <Link to=''>
                <div className="x21-78JfKY"><img className="x1" src={`${process.env.PUBLIC_URL}/img/home/1@1x.png`} alt="1" /></div>
              </Link>
            </div>
          </div>
          <div className="slide-dots-hH9Cww">
            <div className="x444-3SAlGE"></div>
            <div className="x445-3SAlGE"></div>
            <div className="x446-3SAlGE"></div>
          </div> */}
          <ImageSlider slides={slides} />
          <div className="special_button-hH9Cww">
            <div className="button_bg-9uK1Tx"></div>
            <div className="ic_notifications-9uK1Tx ic_notifications">
              <img
                className="ic_notifications-6bhCAa ic_notifications"
                src={`${process.env.PUBLIC_URL}/img/home/ic-notifications@1x.png`}
                alt="ic_notifications"
                />
            </div>
          </div>
        </div>
        <Link to="https://discord.com/invite/BF8NjfEd4Y)">
          <div className="discord-RoXPLo inter-medium-royal-blue-14px" >Discord</div>
        </Link>
        <div className="our-community-RoXPLo inter-semi-bold-white-21px">Our Community</div>
        {/* <Link to="/selfieToEarn"> */}
        {/* <div className="button_-selfie-to-earn-RoXPLo" onClick={() => handleTakeASelfie()}>
          <p className="take-a-selfie-to-earn-TRrnim inter-semi-bold-white-15px">Take a Selfie to Earn!</p>
          <img className="ic_selfie-TRrnim" src={`${process.env.PUBLIC_URL}/img/ic-selfie-1@1x.png`} alt="ic_selfie" />
          <img className="ic_arrow_forward-TRrnim" src={`${process.env.PUBLIC_URL}/img/ic-arrow-forward-1@1x.png`} alt="ic_arrow_forward" />
        </div> */}
        <div className="nav-to-take-selfie-content">
          <NavigateToTakeSelfieButton/>
        </div>
        {/* </Link> */}
        <div className="quick-actions-RoXPLo inter-semi-bold-white-21px">Quick Actions</div>
        <div className="greetings-RoXPLo">
          {/* <h1 className="title-2ZgxSS">Hi ! </h1> */}
          <h1 className="title-2ZgxSS">Hello ! </h1>
          <div className="lv_-reward-2ZgxSS">
            <div className="lv-1-b5x63m inter-semi-bold-keppel-15px">LV {level}</div>
            <div className="nft-reward-10-b5x63m inter-semi-bold-white-15px">NFT REWARD +10%</div>
            <img className="seperate-line-b5x63m" src={`${process.env.PUBLIC_URL}/img/seperate-line-1@1x.png`} alt="seperate line" />
          </div>
          <UserIcon home = {true} userAccountId = {userAccountId}></UserIcon>
          {/* {imgAddress === ""?gender === "Female"?
          // <img className="nft_-avatar-2ZgxSS" src={`${process.env.PUBLIC_URL}/img/home/nft-avatar-13@1x.png`} alt="NFT_Avatar" />
          <Link to="https://test.signumart.io/">
              <div className="home_nft_-avatar">
                  <img
                    className="home_icon_ic_add"
                    src="img/profile/ic-add-2@1x.png"
                    alt="ic_add"
                  />
              </div>
            </Link>
          :(
            <Link to="https://test.signumart.io/">
              <div className="home_nft_-avatar">
                <img
                  className="home_icon_ic_add"
                  src="img/profile/ic-add-2@1x.png"
                  alt="ic_add"
                />
              </div>
            </Link>
              // <img className="nft_-avatar-2ZgxSS" src={`${process.env.PUBLIC_URL}/img/home/1.png`} alt="NFT_Avatar" />
          )
          :(
            <img className = "nft_-avatar-2ZgxSS" src = {`https://ipfs.io/ipfs/${imgAddress}`}></img>
          )
          } */}
          <Link to="/profile">
            <div className="ic_next-2ZgxSS">
              <img
                className="ic_chevron_right_24px-LRB8nH"
                src={`${process.env.PUBLIC_URL}/img/ic-chevron-right-24px-1@1x.png`}
                alt="ic_chevron_right_24px"
                />
            </div>
          </Link>
          <Link to='/aiCoachSelect'>
            <img className='home-ai-select-icon' src={`${process.env.PUBLIC_URL}/img/ic_chat.png`}/>
          </Link>
          <Link to='/setting'>
            <img className='home-setting-icon' src={`${process.env.PUBLIC_URL}/img/ic-settings-24px-1@1x.png`} alt="" />
          </Link>
          <div className="score-bar_3-2ZgxSS">
            <div className="sigdao-score-iPTNDG sigdao-score">
              <div className="x10-kxjIEt x10 inter-semi-bold-keppel-15px">{loading?<div>loading...</div>:Token}</div>
              <div className="signdao_tokengradient-kxjIEt signdao_tokengradient">
                <div className="x441-e5x8kp x441"></div>
                <div className="x442-e5x8kp x442"></div>
                <img className="x880-e5x8kp x880" src={`${process.env.PUBLIC_URL}/img/file---880-1x-png-10@1x.png`} alt="880" />
              </div>
            </div>
          </div>
          <div className="sigdao-2ZgxSS inter-semi-bold-white-15px">SIGDAO:</div>
        </div>
        {/* <HorizontalScrollContainerMission></HorizontalScrollContainerMission> */}
        <HorizontalScrollContainer>
          <Link to="/missionChallenge">
            <div className="challenges-x9-hacks-GEWAL1">
              <div className="small-image">
                <img className="challenge-x9_banner-UqALvc" src={`${process.env.PUBLIC_URL}/img/home/challengex9-banner@1x.png`} alt="ChallengeX9_banner" />
              </div>
              <div className="challengesx-9-hacks-ewZMRw inter-medium-white-15px">Challenges<br />x 9 hacks</div>
              <div className="x1-3mins-each-ewZMRw inter-normal-cadet-blue-12px">1-3mins/ each</div>
              <div className="sigdao-score-ewZMRw sigdao-score">
                <div className="x10-HEHiSw x10 inter-semi-bold-keppel-14px">+5.25 - 15.75</div>
                <div className="signdao_tokengradient-HEHiSw signdao_tokengradient">
                  <div className="x441-giFx9O x441"></div>
                  <div className="x442-giFx9O x442"></div>
                  <img className="x880-giFx9O x880" src={`${process.env.PUBLIC_URL}/img/file---880-1x-png-10@1x.png`} alt="880" />
                </div>
              </div>
            </div>
          </Link>
          <div className="meditations-GEWAL1">
            <div className="home-meditation-content">
              <div className="small-image">
                <img className="meditation_banner-dLbFgX" src={`${process.env.PUBLIC_URL}/img/home/meditation-banner@1x.png`} alt="Meditation_banner" />
              </div>
              <div className="weekly-meditation-3kbxqV inter-medium-white-15px">Weekly Meditation</div>
              <div className="saturday-only-3kbxqV inter-normal-cadet-blue-12px">Saturday only</div>
              <div className="sigdao-score-3kbxqV sigdao-score">
                <div className="x10-UyxTRp x10 inter-semi-bold-keppel-14px">+20</div>
                <div className="signdao_tokengradient-UyxTRp signdao_tokengradient">
                  <div className="x441-ozHgg7 x441"></div>
                  <div className="x442-ozHgg7 x442"></div>
                  <img className="x880-ozHgg7 x880" src={`${process.env.PUBLIC_URL}/img/file---880-1x-png-10@1x.png`} alt="880" />
                </div>
              </div>
            </div>
            <div className="meditations-overlay">
              <img src="/img/ic-locked-1@1x.png" className='lock-image' alt="" />
            </div>
          </div>
          <div className="step-counts-GEWAL1">
            <div className="home-meditation-content">
              <div className="small-image">
                <img className="step_count_banner-45Wblr" src={`${process.env.PUBLIC_URL}/img/home/step-count-banner@1x.png`} alt="Step_count_banner" />
              </div>
              <div className="walking-mission-7hGHU0 inter-medium-white-15px">Walking Mission</div>
              <div className="step-count-7hGHU0 inter-normal-cadet-blue-12px">Step Count</div>
              <div className="sigdao-score-7hGHU0 sigdao-score">
                <div className="x10-SMcg87 x10 inter-semi-bold-keppel-14px">+20</div>
                <div className="signdao_tokengradient-SMcg87 signdao_tokengradient">
                  <div className="x441-JHyhgs x441"></div>
                  <div className="x442-JHyhgs x442"></div>
                  <img className="x880-JHyhgs x880" src={`${process.env.PUBLIC_URL}/img/file---880-1x-png-10@1x.png`} alt="880" />
                </div>
              </div>
            </div>
            <div className="meditations-overlay">
              <img src="/img/ic-locked-1@1x.png" className='lock-image' alt="" />
            </div>

          </div>
        </HorizontalScrollContainer>
        {/* <div className="missions-scroll-RoXPLo">
        </div> */}
        <MenuBar/>
      </div>
    </div>
  )

  return (
    <CenterLayout
      content={content}
      bgImg={false}
    />
  );
};

export default Home;
