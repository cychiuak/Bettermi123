import * as React from 'react';
import { CenterLayout } from '../../components/layout';
import { useRef, useState, useCallback, useEffect } from "react";

import Webcam from "react-webcam";
import './TakeSelfie.css';
import { BackButton } from '../../components/button';
import CSS from 'csstype';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { profileSlice } from '../../redux/profile';
import { store } from '../../redux/reducer';
import { userBMISlice } from '../../redux/userBMI';
import { useGetBMIMutation } from '../../redux/userBMIApi';
import useEnhancedEffect from '@mui/material/utils/useEnhancedEffect';
import { isSelfieRecord, isTodayHaveSelfieRecord } from '../../components/bmiCalculate';
import { accountId } from '../../redux/account';
import { useLedger } from '../../redux/useLedger';
import BorderLinearProgress from './borderLinearProgress';

interface ITakeSelfieProps {
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const takeSelfieButton : CSS.Properties = {
  'background': `url(${process.env.PUBLIC_URL}/img/takeSelfie/icon--take-photo-1@1x.png)`,
  'backgroundSize': 'cover',
  'width': '100px',
  'height': '100px',
  'position': 'absolute',
  'left': 'calc((100% - 100px) / 2)',
  'border': 'none',
  'outline': 'none',
  'cursor': 'pointer',
  // 'top': 'calc(529px - 50px)',
  'top': '575px',
}

const convertBase64toJpg = (base64String: string): File => {
  const byteCharacters = atob(base64String.split(',')[1]);

  // Convert the byte string to a Uint8Array
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Create a Blob object from the Uint8Array
  const blob = new Blob([byteArray], { type: 'image/jpeg' });

  // Create a File object from the Blob and set the name to be "image.jpg"
  return new File([blob], 'image.jpg', { type: 'image/jpeg' });

}

const counttime = (setCount) => {
  const incrementInterval = 30000 / 99;
  const timer = setInterval(() => {
    setCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount >= 99) {
        clearInterval(timer);
      }
      return newCount;
    });
  }, incrementInterval);

  return () => {
    clearInterval(timer);
  };
};



// main function
const TakeSelfie: React.FunctionComponent<ITakeSelfieProps> = (props) => {
  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bmidata, setbmidata] = useState<any>();
  // const [isLoading, setIsLoading] = useState(false);
  // var navigatePath: string = '/generateBMINFTImport'
  const [navigatePath, setNavigatePath] = useState<string>('/generateBMIDaily');
  const tempAccountId = useSelector(accountId);
  const Ledger2 = useLedger();
  const [count, setCount] = useState(0);
  var [imageSrc, setImageSrc] = useState<string | null | undefined>();

  const [ getBMI, {isLoading, data} ] = useGetBMIMutation()

  useEffect(() => {
    if (data && "bmi" in data) {
      const { bmi } = data
      console.log('bmi', bmi)
      dispatch(profileSlice.actions.setBMI(bmi.toFixed(1).toString()))
      
      navigate(navigatePath)
    } else if (data){
      navigate('/errorTakeSelfie')
    }
  }
  , [data])

  // change the navigate path when the user has already create bmi contract
  useEffect(() => {
    isSelfieRecord(tempAccountId, Ledger2)
      .then((result) => {
        if (!result) {
          setNavigatePath('/generateBMINFTImport')
        }
      })
  }, []);


  // action after 
  useEffect(() => {
    const action: Function = async () => {
      const formData = new FormData();
      if (!imageSrc) {
        console.log('imageSrc is null');
        navigate(navigatePath)
        return;
      }
      formData.append('file', convertBase64toJpg(imageSrc))
      dispatch(profileSlice.actions.setSelfieImage(imageSrc))
      await getBMI(formData)   
    }
  
    if (imageSrc) {
      // dispatch(profileSlice.actions.setSelfieImage(imageSrc))
      // dispatch(profileSlice.actions.setBMI('25.5'))
      action()
    }
    // navigate(navigatePath)
  }, [imageSrc])

  // for mobile
  const webcamContainerStyle : CSS.Properties = {
    'zIndex': '1',
    'display': 'inline-block',
    'position': 'absolute',
    'top': 'calc(190px - 50px)',   
  }

  const mobile = process.env.REACT_APP_MOBILE === 'true'
  // const width = process.env.REACT_APP_MOBILE === 'true' ? '390' : '819'
  const width = 819

  if (mobile) {
    webcamContainerStyle.position = 'absolute'
    webcamContainerStyle.width = '390px'
    webcamContainerStyle.left = 'calc((100% - 390px) / 2)'
    webcamContainerStyle.height = 'calc(844px - 230px)'
    webcamContainerStyle.overflow = 'hidden'
  } else {
    webcamContainerStyle.position = 'absolute'
    webcamContainerStyle.width = '819px'
    webcamContainerStyle.left = 'calc((100% - 819px) / 2)'
  }

  
  useEffect(() => {
    if (isLoading && count === 0) {
      counttime(setCount);
    }
  }, [isLoading]);

  

  // capture the selfie image, and store it in the redux store
  const capture = React.useCallback(
    () => {
      setImageSrc(webcamRef.current?.getScreenshot())
      // if (imageSrc) {
      //   // dispatch(profileSlice.actions.setSelfieImage(imageSrc))
      //   // dispatch(profileSlice.actions.setBMI('25.5'))
      //   action()
      // }
      // navigate(navigatePath)
    },
    [webcamRef]
  );

  const content : JSX.Element = (
    <div className='selfie-content-container'>
      <BackButton/>
      {isLoading ?
        <div className="disclaimer inter-normal-white-15px">
          Scaning...
        </div>
        :
        <div className="disclaimer inter-normal-white-15px">
          <h3>
            We care about your privacy, your selfie will not be stored
          </h3>
            <h4>
              Join our discord link to grab free tokens!
            </h4>
        </div>
      }
      {/* <div className="disclaimer inter-normal-white-15px">
      We super care your privacy, your selfie will not be stored
      </div> */}
      <div className="webcam-container" style={webcamContainerStyle}>
        {
          isLoading ?
          <div className="loading-container">
            <img src={imageSrc ? imageSrc : undefined } alt="loading" />
          </div>
          :
          <Webcam 
            audio={false}
            // height={720}
            screenshotFormat="image/jpeg"
            // width={1280}
            width={width}
            ref={webcamRef}
            videoConstraints={videoConstraints}
          />

        }
        <div className="selfie-shadow"></div>
        {isLoading ? 
        <div className="animation-containter">
          <div className="percentage-display inter-normal-cape-cod-12px">
            {count}%
          </div>
          <BorderLinearProgress variant='determinate' value={count} />
        </div>
        : 
          <button 
            style={takeSelfieButton}
            onClick={capture}
          />
        }
      
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

export default TakeSelfie;




