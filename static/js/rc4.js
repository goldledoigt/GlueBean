function utf8_encode ( str_dataIn ) {    // Encodes an ISO-8859-1 string to UTF-8
    // 
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
 
    var str_data = str_dataIn.replace(/\r\n/g,"\n");
    var utftext = "";
 
    for (var n = 0; n < str_data.length; n++) {
        var c = str_data.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }
 
    return utftext;
}

function crc32 (strIn) {
    // 
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
 
    var str = utf8_encode(strIn);
    var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
 
    //if (typeof(crc) == "undefined") { crc = 0; }
    var crc = 0;
    var x = 0;
    var y = 0;
 
    crc = crc ^ (-1);
    for( var i = 0, iTop = str.length; i < iTop; i++ ) {
        y = ( crc ^ str.charCodeAt( i ) ) & 0xFF;
        x = "0x" + table.substr( y * 9, 8 );
        crc = ( crc >>> 8 ) ^ x;
    }
 
    return crc ^ (-1);
};

var ASCII = {
	translations: {
	    js2php: {1026:128, 1027:129, 8218:130, 1107:131, 8222:132,
	             8230:133, 8224:134, 8225:135, 8364:136, 8240:137,
			     1033:138, 8249:139, 1034:140, 1036:141, 1035:142,
			     1039:143, 1106:144, 8216:145, 8217:146, 8220:147,
			     8221:148, 8226:149, 8211:150, 8212:151, 65533:152,
			     8482:153, 1113:154, 8250:155, 1114:156, 1116:157,
			     1115:158, 1119:159, 1038:161, 1118:162, 1032:163,
			     1168:165, 1025:168, 1028:170, 1031:175, 1030:178,
			     1110:179, 1169:180, 1105:184, 8470:185, 1108:186,
			     1112:188, 1029:189, 1109:190, 1111:191, 1040:192,
			     1041:193, 1042:194, 1043:195, 1044:196, 1045:197,
			     1046:198, 1047:199, 1048:200, 1049:201, 1050:202,
			     1051:203, 1052:204, 1053:205, 1054:206, 1055:207,
			     1056:208, 1057:209, 1058:210, 1059:211, 1060:212,
			     1061:213, 1062:214, 1063:215, 1064:216, 1065:217,
			     1066:218, 1067:219, 1068:220, 1069:221, 1070:222,
			     1071:223, 1072:224, 1073:225, 1074:226, 1075:227,
			     1076:228, 1077:229, 1078:230, 1079:231, 1080:232,
			     1081:233, 1082:234, 1083:235, 1084:236, 1085:237,
			     1086:238, 1087:239, 1088:240, 1089:241, 1090:242,
			     1091:243, 1092:244, 1093:245, 1094:246, 1095:247,
			     1096:248, 1097:249, 1098:250, 1099:251, 1100:252,
			     1101:253, 1102:254, 1103:255},
		php2js: {128:1026, 129:1027, 130:8218, 131:1107, 132:8222,
	             133:8230, 134:8224, 135:8225, 136:8364, 137:8240,
			     138:1033, 139:8249, 140:1034, 141:1036, 142:1035,
			     143:1039, 144:1106, 145:8216, 146:8217, 147:8220,
			     148:8221, 149:8226, 150:8211, 151:8212, 152:65533,
			     153:8482, 154:1113, 155:8250, 156:1114, 157:1116,
			     158:1115, 159:1119, 161:1038, 162:1118, 163:1032,
			     165:1168, 168:1025, 170:1028, 175:1031, 178:1030,
			     179:1110, 180:1169, 184:1105, 185:8470, 186:1108,
			     188:1112, 189:1029, 190:1109, 191:1111, 192:1040,
			     193:1041, 194:1042, 195:1043, 196:1044, 197:1045,
			     198:1046, 199:1047, 200:1048, 201:1049, 202:1050,
			     203:1051, 204:1052, 205:1053, 206:1054, 207:1055,
			     208:1056, 209:1057, 210:1058, 211:1059, 212:1060,
			     213:1061, 214:1062, 215:1063, 216:1064, 217:1065,
			     218:1066, 219:1067, 220:1068, 221:1069, 222:1070,
			     223:1071, 224:1072, 225:1073, 226:1074, 227:1075,
			     228:1076, 229:1077, 230:1078, 231:1079, 232:1080,
			     233:1081, 234:1082, 235:1083, 236:1084, 237:1085,
			     238:1086, 239:1087, 240:1088, 241:1089, 242:1090,
			     243:1091, 244:1092, 245:1093, 246:1094, 247:1095,
			     248:1096, 249:1097, 250:1098, 251:1099, 252:1100,
			     253:1101, 254:1102, 255:1103}
	},

	ord: function(chr, dir) {
		dir = dir || 'js2php';
		if(!this.translations[dir]) return null;
		chr = chr.charCodeAt(0);
		return (chr in this.translations[dir]) ? this.translations[dir][chr] : chr;
	},
	chr: function(ord, dir) {
		dir = dir || 'php2js';
		if(!this.translations[dir]) return null;
		ord = (ord in this.translations[dir]) ? this.translations[dir][ord] : ord;
		return String.fromCharCode(ord);
	}
};

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
var Base64 = {
    // private property
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode_utf8 : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
            this.alphabet.charAt(enc1) + this.alphabet.charAt(enc2) +
            this.alphabet.charAt(enc3) + this.alphabet.charAt(enc4);
        }
        return output;
    },

    // public method for decoding
    decode_utf8 : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = this.alphabet.indexOf(input.charAt(i++));
            enc2 = this.alphabet.indexOf(input.charAt(i++));
            enc3 = this.alphabet.indexOf(input.charAt(i++));
            enc4 = this.alphabet.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Base64._utf8_decode(output);
        return output;
    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },
    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    },

	encode: function(input) {
	    var output = '', chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
	    while(i < input.length) {
			chr1 = ASCII.ord(input.charAt(i++));
			chr2 = ASCII.ord(input.charAt(i++));
			chr3 = ASCII.ord(input.charAt(i++));
			
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3)  << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			
			if(isNaN(chr2)) enc3 = enc4 = 64;
			else if(isNaN(chr3)) enc4 = 64;
			
			output = output +
			this.alphabet.charAt(enc1) + this.alphabet.charAt(enc2) +
			this.alphabet.charAt(enc3) + this.alphabet.charAt(enc4);
		}
  	return output;
	},

	decode: function(input) {
		var output = '', chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
		input = input.replace(new RegExp('[^A-Za-z0-9+/=]', 'g'), '');

		while(i < input.length) {
			enc1 = this.alphabet.indexOf(input.charAt(i++));
			enc2 = this.alphabet.indexOf(input.charAt(i++));
			enc3 = this.alphabet.indexOf(input.charAt(i++));
			enc4 = this.alphabet.indexOf(input.charAt(i++));
			
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			
			output = output + ASCII.chr(chr1);
			
			if (enc3 != 64) output = output + ASCII.chr(chr2);
			if (enc4 != 64) output = output + ASCII.chr(chr3);
		}
	return output;
	}
};

function Crypt_RC4 () {
	var thisClass = this;
    var s = new Array();
    var i= 0;
    var j= 0;
    var _key;

	var symbArray = new Array(); 

	this.setArray = function(text) {
		for (var i=0; i<256; i++) {
			symbArray[i] = text.charAt(i); 
		}
	};

	// Finds whether a variable is an array
	function is_array( mixed_var ) {    
	    return ( mixed_var instanceof Array );
	}
	function stringToArray( str ) {
		if (is_array(str)) {return str;}
	   	_str = new Array();
	   	for (i=0; i<str.length; i++) {
	   		_str[i] = str.charAt(i); 
	  	}
	  	return _str;
	} 
	function arrayToStr( arr ) {
		if (is_array(arr)) {
			str = "";
		   	for (i=0; i<arr.length; i++) {
		   		str+= arr[i]; 
		  	}
			
			return str;
		} else {
			return arr;
		}
	}

    this.setKey = function (key) {
        if (key.length > 0)
        	_key = stringToArray(key);
    };

    //* Assign encryption key to class
    this.AssignKey = function(keyIn) {
        var len= keyIn.length;
        var key = keyIn; 
        
        for (i = 0; i < 256; i++) {
            s[i] = i;
        }

        j = 0;
        var t = 0;
        for (i = 0; i < 256; i++) {
            j = (j + s[i] + ASCII.ord(key[i % len])) % 256;
            t = s[i];
            s[i] = s[j];
            s[j] = t;
        }
        i = j = 0;
    };

    //* Encrypt function
    this.crypt = function(paramstrIn) {
    	var paramstr = stringToArray(paramstrIn);
        thisClass.AssignKey(_key);

        var len = paramstr.length;
        var t = 0;
        for (var c= 0; c < len; c++) {
            i = (i + 1) % 256;
            j = (j + s[i]) % 256;
            t = s[i];
            s[i] = s[j];
            s[j] = t;
            t = (s[i] + s[j]) % 256;
            paramstr[c] = ASCII.chr(ASCII.ord(paramstr[c]) ^ s[t]);
        }
        return arrayToStr(paramstr);
    };

    //* Decrypt function
    this.decrypt = function(paramstr) {
        //Decrypt is exactly the same as encrypting the string. Reuse (en)crypt code
        return thisClass.crypt(paramstr);
    };
}	//end of RC4 class

// TODO тут надо написать проверку всяких CRC и т.д.
function decryptRC4Str(key, str) {
	var rc4 = new Crypt_RC4();
	rc4.setKey(key);
	var input = str;
	var str = Base64.decode(input);
	var result = rc4.decrypt(str);
	result = Base64.decode_utf8(result);

	var indexOfCrc = result.lastIndexOf("#");
	var crc = result.slice(indexOfCrc+1);
	result = result.slice(0, (crc.length * -1)-1);
	var crc2 = crc32(result); 

	if (result.length > 1000) {
		//AddLogMessage(result);
		//alert(result);
	}

	if (crc != crc2) {
		AddLogMessage("CRC error: " + crc + "!=" + crc2,1);
	}
	return result;
}
