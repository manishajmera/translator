
var translations = {
    'Maruti Baleno' : 'मारुति बलेनो',
    'Jaipur': 'जयपुर'
};

const specialTranslation = {
"{0} owners {1}" : {
        "value":"{0} के मालिकों  {1}",
        "regex" : "(.*) owners (.*)"
    },
    "ask {0}" : {
        "value":"{0} से एक प्रश्न पूछें",
	"regex" : "^ask (.*)"

    },                            
    
    "about {0} cars" : {
		"value":"{0} के बारे  में",
        	"regex" : "^about (.*) cars$"
	},
    "car dealers {0} in {1}" : {
		"value":"{0} के बारे  {1} में",
        	"regex" : "^car dealers (.*) in (.*)"
	}

}
var regexArray = [];
var regex = function(){
    for (var i in specialTranslation) { 
        if(typeof specialTranslation[i]=='object'){
            regexArray.push(new RegExp(specialTranslation[i].regex, 'i'));
    
        }else{
            var s = i.replace(new RegExp(/{\d+}/, 'i'), '');
            regexArray.push(new RegExp(s, 'i'));
        }
    }
    return regexArray;
}
let translate = function(key,isContainRegex){

		if(isContainRegex){
				console.log(isContainRegex);
			return translation(key);
		}
            	return (typeof translations !== 'undefined' && typeof translations[key] !== 'undefined') ? translations[key]: key;
        }
var regexArray = regex();
var isCheckRegex =  function(str){
 	for(var i in regexArray){
            // if(str.includes("Maruti Swift LXI")){
            //     console.log(str);
            //     console.log(regexArray[i]);
            //     //console.log(regexArray[i])
            // }
            if(regexArray[i].test(str)){
                var tempKeys = {};
                //tempKeys.keyArray = str.split(regexArray[i]);
                tempKeys.regex = regexArray[i];
            //    if(str.includes("On Road Price in")){
            //        console.log(tempKeys);
            //     //console.log(regexArray[i])
            //     }
                return tempKeys;
            }
	}
	return false;
}
var removeEmptyKeyFromArray = function(tempKeys){

	var finalArray=[];
	 if(tempKeys.length>0){
                for(let i in tempKeys){
                    if (tempKeys[i].length <= 0) {
                        continue;
                    }
                    finalArray.push(tempKeys[i]);
                }
                // if(str.includes("Version")){
                //     console.log("===========>");
                //     console.log(finalKeyArray);
                // }
            }
	return finalArray;
}
var replaceOtherThenRegex=function(finalKeyArray,str){
	for(let i in finalKeyArray){
                str = str.replace(finalKeyArray[i],'{' + i + '}')
            }
	return str;
}
var translatedString = function(finalKeyArray,value,isContainRegex){
	for(let i in finalKeyArray){
        	value = value.replace('{' + i + '}', translate(finalKeyArray[i].trim(),isContainRegex));
    	}
	return value;
}
function isCheckType (key){
        if(typeof key=='string'){
            return key.trim().toLowerCase();
        }
        else
            return key;
    }
function middleRegex(str,reg){
	console.log(str,reg)
        reg+='';
        var newStr="";
        for(i=0;i<reg.length-1;i++){
            if(reg[i]=='^' || reg[i]=='$' || reg[i]=='/'){
                continue;
            }
            newStr+=reg[i];
        }
        var splittedNewStrArray = newStr.split(" ");
        var indexCount=0;

        var splittedStrArray = str.split(" ");            
        var keyArray = [];
        var tempStr= "";
        var arrayKey="";
	var j=0;
	console.log(splittedNewStrArray,splittedStrArray);
        for(i in splittedStrArray){
            if(splittedStrArray[i]==splittedNewStrArray[j]){
                if(arrayKey.length>0){
                    keyArray.push(arrayKey.trim());
                    arrayKey="";
                }
                tempStr+=splittedStrArray[i]+' ';
                j++;
                continue;
            }
            if(splittedNewStrArray[j]=='(.*)'){
                tempStr+='{' + indexCount + '} '
                j++;
                arrayKey+=splittedStrArray[i]+' '
		console.log(i,splittedStrArray.length-1);
                if(i==splittedStrArray.length-1){
                    keyArray.push(arrayKey.trim());
                  }
                indexCount++;
            }else{
		
                arrayKey+=splittedStrArray[i]+' '
		if(i==splittedStrArray.length-1){
                    keyArray.push(arrayKey.trim());
                  }
            }                    
        }
	console.log(keyArray,tempStr);
	return {keyArray,tempStr}
    }
var translation = function(key){
   var str = key.trim();
        var finalKeyArray = isCheckRegex(str)
        //console.log(finalKeyArray);
        if(!finalKeyArray){
            return finalTranslate(key);
        }

        //finalKeyArray.keyArray = removeEmptyKeyFromArray(finalKeyArray.keyArray);


            var strAndArray = middleRegex(str,finalKeyArray.regex);
            str = strAndArray.tempStr;
            finalKeyArray.keyArray = strAndArray.keyArray;
       

        var value,isContainRegex;
   
        if(typeof specialTranslation[isCheckType(str)]!='object')
            value = specialTranslation[isCheckType(str)];
        else{
            value  = specialTranslation[isCheckType(str)].value;
            if(specialTranslation[isCheckType(str)].isVariant){
                return splitStringWithSpace(key.trim());
                //console.log(t);
            }
            isContainRegex = specialTranslation[isCheckType(str)].isContainRegex; 
        }
        console.log(value);
        if(typeof value=='undefined')
            return key;
        
        value = translatedString(finalKeyArray.keyArray,value,isContainRegex);
	 console.log(value);
        return value;




}

translation("Jaipur owners Maruti Baleno");

