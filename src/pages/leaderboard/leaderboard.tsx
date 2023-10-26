import React, { useEffect } from 'react'
import { CenterLayout } from '../../components/layout'
import './leaderboard.css'
import { ShortTitleBar } from '../../components/titleBar';
import { GetTokenRanking } from '../../components/getTokenRanking';
import { LedgerClientFactory } from '@signumjs/core';
import { useSelector } from 'react-redux';
import { selectWalletNodeHost } from '../../redux/useLedger';
import { UpdateUserNftList } from '../../NftSystem/updateUserNftList';
import { LeaderBoardBanner } from './leaderBoardBanner';
import { useRef } from 'react';
import { store } from '../../redux/reducer';
import { leaderBoardBanner, userRankingSlice } from '../../redux/userRanking';
import { userRanking } from '../../redux/userRanking';
import { userRankingListRedux } from '../../redux/userRanking';
import { useNavigate } from 'react-router-dom';

type Props = {}

const Leaderboard = (props: Props) => {
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({nodeHost});
  const [userRankingList, setUserRankingList] = React.useState<leaderBoardBanner[]>([]);
  const nftLoaded = useRef(false);
  const[isLeaderBoardLoading,setIsLeaderBoardLoading] = React.useState<boolean>(true);
  const userRankingListFromRedux = useSelector(userRankingListRedux);
  const navigate = useNavigate();
  console.log(userRankingListFromRedux);

  const fetchUserRankingList = () => {
    GetTokenRanking(ledger2).then((userRankingList) => {
      setUserRankingList(userRankingList);
      console.log(userRankingList);
      setIsLeaderBoardLoading(false);
      let state:userRanking = {userRankingList:userRankingList};
      console.log(state);
      store.dispatch(userRankingSlice.actions.setUserRanking(state));
    }).catch((e:any) => {
      setIsLeaderBoardLoading(false);
      alert("some unkown error has happened. We would be grateful if this can be reported to us");
      console.log(e);
    });
  }

  useEffect(() => {
    if(nftLoaded.current ===true){
      console.log("loaded nft");
    }
    else{
      nftLoaded.current = true;
      //if(userRankingListFromRedux == null ){
        
        fetchUserRankingList();
      //}
      // else{
      //   if(userRankingListFromRedux.length === 0){//This is written because I am afraid that the userRankingList is [] but not null initially

      //     fetchUserRankingList();
      //   }
      //   else{
      //     setUserRankingList(userRankingListFromRedux);
          // setIsLeaderBoardLoading(false);
      //   }
      // }
    }
  },[]);
  const leaderBoardBanner = () => {
    var banners:JSX.Element[] = [];
    for(var i = 3; i <Math.min(userRankingList.length,100) ; i++){
        banners.push(
        <LeaderBoardBanner 
          displayAccountId= {userRankingList[i].displayAccountId} 
          userRanking={userRankingList[i].userRanking} 
          tokenBalance={Number(userRankingList[i].tokenBalance)}
          accountId = {userRankingList[i].accountId}
          accountImage = {userRankingList[i].accountImage}
          />
        );
    }
    return banners;
  }
  const content: JSX.Element = (
    // <div className="screen">
      <div className="bettermidapp-leaderboad-the-best-100 screen">
        <ShortTitleBar title="The Best 100" setting={false} aiCoach={false} /> 
        {isLeaderBoardLoading === true ? (<div></div>):(
          <>
        <div className="overlap-group-leader6">
          <div className="_px-container">
            <div className="ic_sentiment_very_satisfied_24px"></div>
            <div className="ic_settings_24px"></div>
          </div>
          <div className="overlap-group-leader7">
            <img className="photo" src="img/leaderboard/photo@1x.png" alt="Photo" />
            <div className="leaderboard-top3">
              <div className="leadboard_st-container">
                <div className="leadboard_1st">
                  <div className="overlap-group-leader2">
                    <div className="overlap-group-leader1">

                      <img className="nft_-avatar-2 nft_-avatar-3" 
                            src={`https://ipfs.io/ipfs/${userRankingList[0].accountImage}`} 
                            alt="NFT_Avatar" 
                            onClick={() => {navigate('/OtherUserProfile',{state:{userId:userRankingList[0].accountId}})}}
                            />
                      
                    
                      <div className="crown-with-red-stone">
                        <div className="crown-with-red-stone-1">
                          <div className="overlap-group-leader-1">
                            <img className="x11694" src="img/leaderboard/file---11694@1x.png" alt="11694" />
                            <img className="x11695" src="img/leaderboard/file---11695@1x.png" alt="11695" />
                            <img className="x11696" src="img/leaderboard/file---11696@1x.png" alt="11696" />
                            <img className="x11697" src="img/leaderboard/file---11697@1x.png" alt="11697" />
                            <img className="x11698" src="img/leaderboard/file---11698@1x.png" alt="11698" />
                            <img className="x16232" src="img/leaderboard/file--16232@1x.png" alt="16232" />
                            <img className="x16233" src="img/leaderboard/file--16233@1x.png" alt="16233" />
                            <img className="x117" src="img/leaderboard/file---11703@1x.png" alt="11703" />
                            <img className="x11704" src="img/leaderboard/file---11704@1x.png" alt="11704" />
                            <img className="x11705" src="img/leaderboard/file---11705@1x.png" alt="11705" />
                            <img className="x11706" src="img/leaderboard/file---11706@1x.png" alt="11706" />
                            <img className="x11707" src="img/leaderboard/file---11707@1x.png" alt="11707" />
                            <img className="x11708" src="img/leaderboard/file---11708@1x.png" alt="11708" />
                            <img className="x11709" src="img/leaderboard/file---11709@1x.png" alt="11709" />
                            <img className="x11710" src="img/leaderboard/file---11710@1x.png" alt="11710" />
                            <img className="x16234" src="img/leaderboard/file--16234@1x.png" alt="16234" />
                            <img className="x1171" src="img/leaderboard/file---11713@1x.png" alt="11713" />
                            <img className="x11714" src="img/leaderboard/file---11714@1x.png" alt="11714" />
                            <img className="x11715" src="img/leaderboard/file---11715@1x.png" alt="11715" />
                            <img className="x1171" src="img/leaderboard/file---11716@1x.png" alt="11716" />
                            <img className="x11717" src="img/leaderboard/file---11717@1x.png" alt="11717" />
                            <img className="x11718" src="img/leaderboard/file---11718@1x.png" alt="11718" />
                            <img className="x11719" src="img/leaderboard/file---11715@1x.png" alt="11719" />
                            <img className="x11720" src="img/leaderboard/file---11720@1x.png" alt="11720" />
                            <img className="x11721" src="img/leaderboard/file---11721@1x.png" alt="11721" />
                            <img className="x11722" src="img/leaderboard/file---11722@1x.png" alt="11722" />
                            <img className="x11723" src="img/leaderboard/file---11723@1x.png" alt="11723" />
                            <img className="x11724" src="img/leaderboard/file---11718@1x.png" alt="11724" />
                            <img className="x11725" src="img/leaderboard/file---11725@1x.png" alt="11725" />
                            <img className="x117" src="img/leaderboard/file---11726@1x.png" alt="11726" />
                            <img className="x11727" src="img/leaderboard/file---11727@1x.png" alt="11727" />
                            <img className="x11728" src="img/leaderboard/file---11728@1x.png" alt="11728" />
                            <img className="x11729" src="img/leaderboard/file---11729@1x.png" alt="11729" />
                            <img className="x11730" src="img/leaderboard/file---11730@1x.png" alt="11730" />
                            <img className="x11731" src="img/leaderboard/file---11731@1x.png" alt="11731" />
                            <img className="x11732" src="img/leaderboard/file---11732@1x.png" alt="11732" />
                            <img className="x11733" src="img/leaderboard/file---11733@1x.png" alt="11733" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="x1st inter-semi-bold-white-18px-2">
                      <span className="inter-semi-bold-white-18px">1</span><span className="inter-semi-bold-white-18px">st</span>
                    </div>
                  </div>
                  <div className="fung_fung00 inter-medium-white-12px">{userRankingList[0].displayAccountId}</div>
                  <div className="sigdao-score-1 sigdao-score-4">
                    <div className="signdao_tokengradient">
                      <div className="overlap-group-leader"><img className="x880" src="img/leaderboard/file---880@1x.png" alt="880" /></div>
                    </div>
                    <div className="x10 inter-semi-bold-keppel-14px"></div>
                      <div className="x10 inter-semi-bold-keppel-14px">{userRankingList[0].tokenBalance}</div>
                  </div>
                </div>
                <div className="leadboard_1st-1 leadboard_1st-3"                         onClick={() => {navigate('/OtherUserProfile',{state:{userId:userRankingList[1].accountId}})}}>
                  <div className="x2nd inter-semi-bold-white-18px-2">
                    <span className="inter-semi-bold-white-18px">2</span><span className="inter-semi-bold-white-18px">nd</span>
                  </div>
                  <img className="nft_-avatar"      src={`https://ipfs.io/ipfs/${userRankingList[1].accountImage}`}  alt="NFT_Avatar" />
                  <div className="son inter-medium-white-12px">{userRankingList[1].displayAccountId}</div>
                  <div className="sigdao-score-2 sigdao-score-4">
                    <div className="signdao_tokengradient">
                      <div className="overlap-group-leader"><img className="x880" src="img/leaderboard/file---880@1x.png" alt="880" /></div>
                    </div>
                    <div className="x10-1 x10-7 inter-semi-bold-keppel-14px">{userRankingList[1].tokenBalance}</div>
                  </div>
                </div>
              </div>
              <div className="leadboard_1st-2 leadboard_1st-3"                          onClick={() => {navigate('/OtherUserProfile',{state:{userId:userRankingList[2].accountId}})}}>
                <div className="x3rd inter-semi-bold-white-18px-2">
                  <span className="inter-semi-bold-white-18px">3</span><span className="inter-semi-bold-white-18px">rd</span>
                </div>
                <img className="nft_-avatar"    src={`https://ipfs.io/ipfs/${userRankingList[2].accountImage}`} alt="NFT_Avatar" />
                <div className="son inter-medium-white-12px">alison_888</div>
                <div className="sigdao-score-3 sigdao-score-4">
                  <div className="signdao_tokengradient">
                    <div className="overlap-group-leader"><img className="x880" src="img/leaderboard/file---880@1x.png" alt="880" /></div>
                  </div>
                  <div className="x10-2 x10-7 inter-semi-bold-keppel-14px">{userRankingList[2].tokenBalance}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="x26">
            {
              leaderBoardBanner()
}
            {/* <div className="rewards_card">
              <div className="number inter-semi-bold-white-18px">4</div>
              <img className="nft_-avatar-1 nft_-avatar-3" src="img/leaderboard/nft-avatar-3@1x.png" alt="NFT_Avatar" />
              <div className="x300 inter-medium-white-12px">zoe_li</div>
              <div className="sigdao-score">
                <div className="signdao_tokengradient">
                  <div className="overlap-group-leader"><img className="x880" src="img/leaderboard/file---880@1x.png" alt="880" /></div>
                </div>
                <div className="x10-3 x10-7 inter-semi-bold-keppel-14px">1234</div>
              </div>
            </div>
            <div className="rewards_card">
              <div className="number inter-semi-bold-white-18px">4</div>
              <img className="nft_-avatar-1 nft_-avatar-3" src="img/leaderboard/nft-avatar-3@1x.png" alt="NFT_Avatar" />
              <div className="x300 inter-medium-white-12px">zoe_li</div>
              <div className="sigdao-score">
                <div className="signdao_tokengradient">
                  <div className="overlap-group-leader"><img className="x880" src="img/leaderboard/file---880@1x.png" alt="880" /></div>
                </div>
                <div className="x10-4 x10-7 inter-semi-bold-keppel-14px">1234</div>
              </div>
            </div>
            <div className="rewards_card">
              <div className="number inter-semi-bold-white-18px">4</div>
              <img className="nft_-avatar-1 nft_-avatar-3" src="img/leaderboard/nft-avatar-3@1x.png" alt="NFT_Avatar" />
              <div className="x300 inter-medium-white-12px">zoe_li</div>
              <div className="sigdao-score">
                <div className="signdao_tokengradient">
                  <div className="overlap-group-leader"><img className="x880" src="img/leaderboard/file---880@1x.png" alt="880" /></div>
                </div>
                <div className="x10-5 x10-7 inter-semi-bold-keppel-14px">1234</div>
              </div>
            </div>
            <div className="rewards_card">
              <div className="number inter-semi-bold-white-18px">4</div>
              <img className="nft_-avatar-1 nft_-avatar-3" src="img/leaderboard/nft-avatar-3@1x.png" alt="NFT_Avatar" />
              <div className="x300 inter-medium-white-12px">zoe_li</div>
              <div className="sigdao-score">
                <div className="signdao_tokengradient">
                  <div className="overlap-group-leader"><img className="x880" src="img/leaderboard/file---880@1x.png" alt="880" /></div>
                </div>
                <div className="x10-6 x10-7 inter-semi-bold-keppel-14px">1234</div>
              </div>
            </div> */}
          </div>
        </div>
        </>
        )}
      </div>
    // </div>
  )

  return (
    <CenterLayout
      content={content}
      bgImg={false}
    />
  )
}

export default Leaderboard;