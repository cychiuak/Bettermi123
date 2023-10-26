import { leaderBoardBanner } from "../redux/userRanking";
export async function sortArrayAccordingToDescendingTokenBalance(array:any[]){
    var temp;
    for(var i = 0;i<Math.min(array.length,200);i++){
        for(var j = i+1;j<Math.min(array.length,200);j++){
            console.log("compare ",i," ",j," ",array[i].quantityQNT,array[j].quantityQNT);
            if(array[i].quantityQNT < array[j].quantityQNT){
                temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
    }
    return array;
}


export async function GetTokenRanking (ledger2:any){
    const tokenId:string = process.env.REACT_APP_TOKEN_ID!;
    //const tokenId:string = "749570634252288509";
    const omittedAccounts = process.env.REACT_APP_TOKEN_OMITTED_ACCOUNTS!;
    const tokenDecimalPlace = process.env.REACT_APP_TOKEN_DECIMAL_PLACE!;
    const getToken = await ledger2.asset.getAssetHolders({assetId:tokenId});
    let userList:leaderBoardBanner[] = [];
    var userRankingInfo:leaderBoardBanner;
    var tokenBalance:Number = 0;
    console.log(getToken.accountAssets);
    //const sortedArray = await sortArrayAccordingToDescendingTokenBalance(getToken.accountAssets);
    const sortedArray = getToken.accountAssets;
    console.log(sortedArray);
    var userRanking:number = 1;
    var userName:string = "";
    var userNumber:number = 1;
    let promises:any[] = [];
    for(var i = 0;i < Math.min(sortedArray.length,100);i++){
        if(omittedAccounts.includes(sortedArray[i].account)){
            console.log("omitted account is detected", sortedArray[i].account);
            sortedArray.splice(i,1);
            console.log(sortedArray);
            i = i - 1;
            continue;
        }
         promises.push(ledger2.account.getAccount({accountId: sortedArray[i].account}));
    }
    const results = await Promise.all(promises);
    //console.log(contracts);
    console.log("results:",results);
    var imgAddress:string = "";
    for(var i = 0; i < Math.min(sortedArray.length,100);i++){
            let newDes = results[i].description===undefined?{}:JSON.parse(results[i].description);
            console.log(newDes.nm,"newDes.av is ",newDes.av);
            if(newDes.av == null){
                console.log("called newDes.av is null");
            }
            else{
                imgAddress = (Object.keys(newDes.av))[0];
            }
            if(newDes.nm == null){
                userName = "Anonymous User #" + userNumber.toString();
                userName = userName + 1;
            }
            else{
                userName = newDes.nm;
            }
            tokenBalance = Number(sortedArray[i].quantityQNT)/(10**Number(tokenDecimalPlace));
            userRankingInfo = {
                userRanking:userRanking,
                displayAccountId:userName,
                tokenBalance:tokenBalance.toString(),
                accountId : sortedArray[i].account,
                accountImage : imgAddress,
            }
            imgAddress = "";
            userRanking += 1;  
                userList.push(userRankingInfo);
        }
        // for(var j = sortedArray.length; j < 100; j++){
        //     userRankingInfo = {
        //         userRanking:userRanking,
        //         displayAccountId:"",
        //         tokenBalance:"",
        //         accountId : "",
        //         accountImage : "",
        //     }
        //     userRanking += 1;  
        //         userList.push(userRankingInfo);
        // }
    
    // for (var i = 0; i < Math.min(sortedArray.length,100);i++){
    //     if(omittedAccounts.includes(sortedArray[i].account)){
    //         console.log("omitted account is detected", sortedArray[i].account);
    //         continue;
    //     } 
    //     const waitingToBeChangedDescription = await ledger2.account.getAccount({accountId: sortedArray[i].account});
    //     let newDes =waitingToBeChangedDescription.description===undefined?{}:JSON.parse(waitingToBeChangedDescription.description);
    //     if(newDes.nm == null){
    //         userName = "Anonymous User #" + userNumber.toString();
    //         userName = userName + 1;
    //     }
    //     else{
    //         userName = newDes.nm;
    //     }
    //      tokenBalance = Number(sortedArray[i].quantityQNT)/(10**Number(tokenDecimalPlace));
    //      userRankingInfo = {
    //         userRanking:userRanking,
    //         displayAccountId:userName,
    //         tokenBalance:tokenBalance.toString(),
    //         accountId : sortedArray[i].account,
    //      }
    //      userRanking += 1;  
    //         userList.push(userRankingInfo);
    // }
    // for(var j = sortedArray.length; j < 100; j++){
    //     userRankingInfo = {
    //         userRanking:userRanking,
    //         displayAccountId:"",
    //         tokenBalance:"",
    //         accountId : "",
    //      }
    //      userRanking += 1;  
    //         userList.push(userRankingInfo);
    // }
    console.log(userList);
    return userList;
}