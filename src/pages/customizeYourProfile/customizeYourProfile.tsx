import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CenterLayout } from '../../components/layout';
import { BackButton } from '../../components/button';
import './customizeYourProfile.css'
import generateName from '../../components/generateName';
import { profileSlice } from '../../redux/profile';
import {store} from '../../redux/reducer';
import { RandomGenNameInput } from '../../components/input';
import path from 'path';
import { UpdateUserIcon } from '../../NftSystem/updateUserNftStorage';
import { useLedger } from '../../redux/useLedger';
import { useSelector } from 'react-redux';
import { accountId } from '../../redux/account';
import { accountPublicKey } from '../../redux/account';
import { useContext } from 'react';
import { AppContext } from '../../redux/useContext';

interface ICustomizeYourProfileProps {
}

const CustomizeYourProfile: React.FunctionComponent<ICustomizeYourProfileProps> = (props) => {
  // todo: help it to change to nft image IFPS link
  // maybe store the path in redux as well
  const ledger = useLedger();
  const {appName,Wallet,Ledger} = useContext(AppContext);
  const defaultName = 'zoe_li'
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const location = useLocation();
  console.log('pathname is ', pathname);
  console.log('pathname state is',location.state);
  const nftImage = location.state?.nftImageAddress;
  const nftId = location.state?.nftId; 
  const userAccountId = useSelector(accountId);
  const userAccountpublicKey = useSelector(accountPublicKey);

  // when user press "Save", putting the generated name into local storage
  const [name, setName] = useState<string>('');

  const handleSave = async () => {
    await UpdateUserIcon(ledger,nftImage,nftId,userAccountId,userAccountpublicKey,Wallet,name);
    if (!name) {
      localStorage.setItem('name', defaultName);
      store.dispatch(profileSlice.actions.setUsername(defaultName))
    } else {
      localStorage.setItem('name', name);
      store.dispatch(profileSlice.actions.setUsername(name))
    }

    navigate('/profile', { state: { previousPath: pathname}});
  }

  const content: JSX.Element = (
    <div>
      <BackButton/>
      <div className='title-Gzrq3v-container'><h1 className="title-Gzrq3v">Customize your profile</h1></div>
      <div className="pick-a-username-Gzrq3v">PICK A USERNAME</div>
      <p className="reserve-your-name-before-its-taken-Gzrq3v">Reserve your @name before it's taken.</p>
      <img className="photo-Gzrq3v" src={`https://ipfs.io/ipfs/${nftImage}` || `${process.env.PUBLIC_URL}/img/mimi.png`} alt="Photo" />
      <div className="search-bar-container-customizeYourProfile">
        <RandomGenNameInput name={name} setName={setName} />
      </div>
      <div className="button_-save-Gzrq3v" onClick={handleSave}>
        <div className="button1-S5Obts"></div>
        <div className="continue-S5Obts">Save</div>
      </div>
    </div>
  ) 

  return (
    <CenterLayout
      bgImg={false}
      content={content}
    />
  );
};

export default CustomizeYourProfile;
