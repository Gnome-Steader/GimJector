/* ====================================================================
   GimJector — Browser Console Script v6.0.0
   Paste this into your browser console while on any gimkit.com page.
   No server / VPS required — runs entirely in the browser.
   ==================================================================== */
(async function GimJector() {
  'use strict';

  if (window.__GimJector) {
    console.info('[GimJector] Already running. Use window.__GimJector to control it.');
    return;
  }

  /* ── lzutf8 (inlined browser build — used by StegCloak) ──────────── */
  (function(){
/*!
 LZ-UTF8 v0.5.8

 Copyright (c) 2021, Rotem Dan
 Released under the MIT license.

 Build date: 2021-01-15 

 Please report any issue at https://github.com/rotemdan/lzutf8.js/issues
*/
var IE10SubarrayBugPatcher,LZUTF8;!function(n){n.runningInNodeJS=function(){return"object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node},n.runningInMainNodeJSModule=function(){return n.runningInNodeJS()&&require.main===module},n.commonJSAvailable=function(){return"object"==typeof module&&"object"==typeof module.exports},n.runningInWebWorker=function(){return"undefined"==typeof window&&"object"==typeof self&&"function"==typeof self.addEventListener&&"function"==typeof self.close},n.runningInNodeChildProcess=function(){return n.runningInNodeJS()&&"function"==typeof process.send},n.runningInNullOrigin=function(){return"object"==typeof window&&"object"==typeof window.location&&"object"==typeof document&&("http:"!==document.location.protocol&&"https:"!==document.location.protocol)},n.webWorkersAvailable=function(){return"function"==typeof Worker&&!n.runningInNullOrigin()&&(!n.runningInNodeJS()&&!(navigator&&navigator.userAgent&&0<=navigator.userAgent.indexOf("Android 4.3")))},n.log=function(e,t){void 0===t&&(t=!1),"object"==typeof console&&(console.log(e),t&&"object"==typeof document&&(document.body.innerHTML+=e+"<br/>"))},n.createErrorMessage=function(e,t){if(void 0===t&&(t="Unhandled exception"),null==e)return t;if(t+=": ","object"==typeof e.content){if(n.runningInNodeJS())return t+e.content.stack;var r=JSON.stringify(e.content);return"{}"!==r?t+r:t+e.content}return"string"==typeof e.content?t+e.content:t+e},n.printExceptionAndStackTraceToConsole=function(e,t){void 0===t&&(t="Unhandled exception"),n.log(n.createErrorMessage(e,t))},n.getGlobalObject=function(){return"object"==typeof global?global:"object"==typeof window?window:"object"==typeof self?self:{}},n.toString=Object.prototype.toString,n.commonJSAvailable()&&(module.exports=n)}(LZUTF8||(LZUTF8={})),function(e){if("function"==typeof Uint8Array&&0!==new Uint8Array(1).subarray(1).byteLength){var t=function(e,t){var r=function(e,t,r){return e<t?t:r<e?r:e};e|=0,t|=0,arguments.length<1&&(e=0),arguments.length<2&&(t=this.length),e<0&&(e=this.length+e),t<0&&(t=this.length+t),e=r(e,0,this.length);var n=(t=r(t,0,this.length))-e;return n<0&&(n=0),new this.constructor(this.buffer,this.byteOffset+e*this.BYTES_PER_ELEMENT,n)},r=["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"],n=void 0;if("object"==typeof window?n=window:"object"==typeof self&&(n=self),void 0!==n)for(var o=0;o<r.length;o++)n[r[o]]&&(n[r[o]].prototype.subarray=t)}}(IE10SubarrayBugPatcher||(IE10SubarrayBugPatcher={})),function(f){var e=function(){function e(){}return e.compressAsync=function(e,n,o){var i=new f.Timer,u=new f.Compressor;if(!o)throw new TypeError("compressAsync: No callback argument given");if("string"==typeof e)e=f.encodeUTF8(e);else if(null==e||!(e instanceof Uint8Array))return void o(void 0,new TypeError("compressAsync: Invalid input argument, only 'string' and 'Uint8Array' are supported"));var s=f.ArrayTools.splitByteArray(e,n.blockSize),a=[],c=function(e){if(e<s.length){var t=void 0;try{t=u.compressBlock(s[e])}catch(e){return void o(void 0,e)}a.push(t),i.getElapsedTime()<=20?c(e+1):(f.enqueueImmediate(function(){return c(e+1)}),i.restart())}else{var r=f.ArrayTools.concatUint8Arrays(a);f.enqueueImmediate(function(){var e;try{e=f.CompressionCommon.encodeCompressedBytes(r,n.outputEncoding)}catch(e){return void o(void 0,e)}f.enqueueImmediate(function(){return o(e)})})}};f.enqueueImmediate(function(){return c(0)})},e.createCompressionStream=function(){var o=new f.Compressor,i=new(require("readable-stream").Transform)({decodeStrings:!0,highWaterMark:65536});return i._transform=function(e,t,r){var n;try{n=f.BufferTools.uint8ArrayToBuffer(o.compressBlock(f.BufferTools.bufferToUint8Array(e)))}catch(e){return void i.emit("error",e)}i.push(n),r()},i},e}();f.AsyncCompressor=e}(LZUTF8||(LZUTF8={})),function(f){var e=function(){function e(){}return e.decompressAsync=function(e,n,o){if(!o)throw new TypeError("decompressAsync: No callback argument given");var i=new f.Timer;try{e=f.CompressionCommon.decodeCompressedBytes(e,n.inputEncoding)}catch(e){return void o(void 0,e)}var u=new f.Decompressor,s=f.ArrayTools.splitByteArray(e,n.blockSize),a=[],c=function(e){if(e<s.length){var t=void 0;try{t=u.decompressBlock(s[e])}catch(e){return void o(void 0,e)}a.push(t),i.getElapsedTime()<=20?c(e+1):(f.enqueueImmediate(function(){return c(e+1)}),i.restart())}else{var r=f.ArrayTools.concatUint8Arrays(a);f.enqueueImmediate(function(){var e;try{e=f.CompressionCommon.encodeDecompressedBytes(r,n.outputEncoding)}catch(e){return void o(void 0,e)}f.enqueueImmediate(function(){return o(e)})})}};f.enqueueImmediate(function(){return c(0)})},e.createDecompressionStream=function(){var o=new f.Decompressor,i=new(require("readable-stream").Transform)({decodeStrings:!0,highWaterMark:65536});return i._transform=function(e,t,r){var n;try{n=f.BufferTools.uint8ArrayToBuffer(o.decompressBlock(f.BufferTools.bufferToUint8Array(e)))}catch(e){return void i.emit("error",e)}i.push(n),r()},i},e}();f.AsyncDecompressor=e}(LZUTF8||(LZUTF8={})),function(i){var e,u;(u=e=i.WebWorker||(i.WebWorker={})).compressAsync=function(e,t,r){if("ByteArray"!=t.inputEncoding||e instanceof Uint8Array){var n={token:Math.random().toString(),type:"compress",data:e,inputEncoding:t.inputEncoding,outputEncoding:t.outputEncoding},o=function(e){var t=e.data;t&&t.token==n.token&&(u.globalWorker.removeEventListener("message",o),"error"==t.type?r(void 0,new Error(t.error)):r(t.data))};u.globalWorker.addEventListener("message",o),u.globalWorker.postMessage(n,[])}else r(void 0,new TypeError("compressAsync: input is not a Uint8Array"))},u.decompressAsync=function(e,t,r){var n={token:Math.random().toString(),type:"decompress",data:e,inputEncoding:t.inputEncoding,outputEncoding:t.outputEncoding},o=function(e){var t=e.data;t&&t.token==n.token&&(u.globalWorker.removeEventListener("message",o),"error"==t.type?r(void 0,new Error(t.error)):r(t.data))};u.globalWorker.addEventListener("message",o),u.globalWorker.postMessage(n,[])},u.installWebWorkerIfNeeded=function(){"object"==typeof self&&void 0===self.document&&null!=self.addEventListener&&(self.addEventListener("message",function(e){var t=e.data;if("compress"==t.type){var r=void 0;try{r=i.compress(t.data,{outputEncoding:t.outputEncoding})}catch(e){return void self.postMessage({token:t.token,type:"error",error:i.createErrorMessage(e)},[])}(n={token:t.token,type:"compressionResult",data:r,encoding:t.outputEncoding}).data instanceof Uint8Array&&-1===navigator.appVersion.indexOf("MSIE 10")?self.postMessage(n,[n.data.buffer]):self.postMessage(n,[])}else if("decompress"==t.type){var n,o=void 0;try{o=i.decompress(t.data,{inputEncoding:t.inputEncoding,outputEncoding:t.outputEncoding})}catch(e){return void self.postMessage({token:t.token,type:"error",error:i.createErrorMessage(e)},[])}(n={token:t.token,type:"decompressionResult",data:o,encoding:t.outputEncoding}).data instanceof Uint8Array&&-1===navigator.appVersion.indexOf("MSIE 10")?self.postMessage(n,[n.data.buffer]):self.postMessage(n,[])}}),self.addEventListener("error",function(e){i.log(i.createErrorMessage(e.error,"Unexpected LZUTF8 WebWorker exception"))}))},u.createGlobalWorkerIfNeeded=function(){if(u.globalWorker)return!0;if(!i.webWorkersAvailable())return!1;if(!u.scriptURI&&"object"==typeof document){var e=document.getElementById("lzutf8");null!=e&&(u.scriptURI=e.getAttribute("src")||void 0)}return!!u.scriptURI&&(u.globalWorker=new Worker(u.scriptURI),!0)},u.terminate=function(){u.globalWorker&&(u.globalWorker.terminate(),u.globalWorker=void 0)},e.installWebWorkerIfNeeded()}(LZUTF8||(LZUTF8={})),function(e){var t=function(){function e(e,t,r){this.container=e,this.startPosition=t,this.length=r}return e.prototype.get=function(e){return this.container[this.startPosition+e]},e.prototype.getInReversedOrder=function(e){return this.container[this.startPosition+this.length-1-e]},e.prototype.set=function(e,t){this.container[this.startPosition+e]=t},e}();e.ArraySegment=t}(LZUTF8||(LZUTF8={})),function(e){var t;(t=e.ArrayTools||(e.ArrayTools={})).copyElements=function(e,t,r,n,o){for(;o--;)r[n++]=e[t++]},t.zeroElements=function(e,t,r){for(;r--;)e[t++]=0},t.countNonzeroValuesInArray=function(e){for(var t=0,r=0;r<e.length;r++)e[r]&&t++;return t},t.truncateStartingElements=function(e,t){if(e.length<=t)throw new RangeError("truncateStartingElements: Requested length should be smaller than array length");for(var r=e.length-t,n=0;n<t;n++)e[n]=e[r+n];e.length=t},t.doubleByteArrayCapacity=function(e){var t=new Uint8Array(2*e.length);return t.set(e),t},t.concatUint8Arrays=function(e){for(var t=0,r=0,n=e;r<n.length;r++)t+=(a=n[r]).length;for(var o=new Uint8Array(t),i=0,u=0,s=e;u<s.length;u++){var a=s[u];o.set(a,i),i+=a.length}return o},t.splitByteArray=function(e,t){for(var r=[],n=0;n<e.length;){var o=Math.min(t,e.length-n);r.push(e.subarray(n,n+o)),n+=o}return r}}(LZUTF8||(LZUTF8={})),function(e){var t;(t=e.BufferTools||(e.BufferTools={})).convertToUint8ArrayIfNeeded=function(e){return"function"==typeof Buffer&&Buffer.isBuffer(e)?t.bufferToUint8Array(e):e},t.uint8ArrayToBuffer=function(e){if(Buffer.prototype instanceof Uint8Array){var t=new Uint8Array(e.buffer,e.byteOffset,e.byteLength);return Object.setPrototypeOf(t,Buffer.prototype),t}for(var r=e.length,n=new Buffer(r),o=0;o<r;o++)n[o]=e[o];return n},t.bufferToUint8Array=function(e){if(Buffer.prototype instanceof Uint8Array)return new Uint8Array(e.buffer,e.byteOffset,e.byteLength);for(var t=e.length,r=new Uint8Array(t),n=0;n<t;n++)r[n]=e[n];return r}}(LZUTF8||(LZUTF8={})),function(o){var e;(e=o.CompressionCommon||(o.CompressionCommon={})).getCroppedBuffer=function(e,t,r,n){void 0===n&&(n=0);var o=new Uint8Array(r+n);return o.set(e.subarray(t,t+r)),o},e.getCroppedAndAppendedByteArray=function(e,t,r,n){return o.ArrayTools.concatUint8Arrays([e.subarray(t,t+r),n])},e.detectCompressionSourceEncoding=function(e){if(null==e)throw new TypeError("detectCompressionSourceEncoding: input is null or undefined");if("string"==typeof e)return"String";if(e instanceof Uint8Array||"function"==typeof Buffer&&Buffer.isBuffer(e))return"ByteArray";throw new TypeError("detectCompressionSourceEncoding: input must be of type 'string', 'Uint8Array' or 'Buffer'")},e.encodeCompressedBytes=function(e,t){switch(t){case"ByteArray":return e;case"Buffer":return o.BufferTools.uint8ArrayToBuffer(e);case"Base64":return o.encodeBase64(e);case"BinaryString":return o.encodeBinaryString(e);case"StorageBinaryString":return o.encodeStorageBinaryString(e);default:throw new TypeError("encodeCompressedBytes: invalid output encoding requested")}},e.decodeCompressedBytes=function(e,t){if(null==t)throw new TypeError("decodeCompressedData: Input is null or undefined");switch(t){case"ByteArray":case"Buffer":var r=o.BufferTools.convertToUint8ArrayIfNeeded(e);if(!(r instanceof Uint8Array))throw new TypeError("decodeCompressedData: 'ByteArray' or 'Buffer' input type was specified but input is not a Uint8Array or Buffer");return r;case"Base64":if("string"!=typeof e)throw new TypeError("decodeCompressedData: 'Base64' input type was specified but input is not a string");return o.decodeBase64(e);case"BinaryString":if("string"!=typeof e)throw new TypeError("decodeCompressedData: 'BinaryString' input type was specified but input is not a string");return o.decodeBinaryString(e);case"StorageBinaryString":if("string"!=typeof e)throw new TypeError("decodeCompressedData: 'StorageBinaryString' input type was specified but input is not a string");return o.decodeStorageBinaryString(e);default:throw new TypeError("decodeCompressedData: invalid input encoding requested: '"+t+"'")}},e.encodeDecompressedBytes=function(e,t){switch(t){case"String":return o.decodeUTF8(e);case"ByteArray":return e;case"Buffer":if("function"!=typeof Buffer)throw new TypeError("encodeDecompressedBytes: a 'Buffer' type was specified but is not supported at the current envirnment");return o.BufferTools.uint8ArrayToBuffer(e);default:throw new TypeError("encodeDecompressedBytes: invalid output encoding requested")}}}(LZUTF8||(LZUTF8={})),function(o){var t,e,i,u;e=t=o.EventLoop||(o.EventLoop={}),u=[],e.enqueueImmediate=function(e){u.push(e),1===u.length&&i()},e.initializeScheduler=function(){var t=function(){for(var e=0,t=u;e<t.length;e++){var r=t[e];try{r.call(void 0)}catch(e){o.printExceptionAndStackTraceToConsole(e,"enqueueImmediate exception")}}u.length=0};if(o.runningInNodeJS()&&(i=function(){return setImmediate(function(){return t()})}),"object"==typeof window&&"function"==typeof window.addEventListener&&"function"==typeof window.postMessage){var e,r="enqueueImmediate-"+Math.random().toString();window.addEventListener("message",function(e){e.data===r&&t()}),e=o.runningInNullOrigin()?"*":window.location.href,i=function(){return window.postMessage(r,e)}}else if("function"==typeof MessageChannel&&"function"==typeof MessagePort){var n=new MessageChannel;n.port1.onmessage=function(){return t()},i=function(){return n.port2.postMessage(0)}}else i=function(){return setTimeout(function(){return t()},0)}},e.initializeScheduler(),o.enqueueImmediate=function(e){return t.enqueueImmediate(e)}}(LZUTF8||(LZUTF8={})),function(e){var r;(r=e.ObjectTools||(e.ObjectTools={})).override=function(e,t){return r.extend(e,t)},r.extend=function(e,t){if(null==e)throw new TypeError("obj is null or undefined");if("object"!=typeof e)throw new TypeError("obj is not an object");if(null==t&&(t={}),"object"!=typeof t)throw new TypeError("newProperties is not an object");if(null!=t)for(var r in t)e[r]=t[r];return e}}(LZUTF8||(LZUTF8={})),function(o){o.getRandomIntegerInRange=function(e,t){return e+Math.floor(Math.random()*(t-e))},o.getRandomUTF16StringOfLength=function(e){for(var t="",r=0;r<e;r++){for(var n=void 0;55296<=(n=o.getRandomIntegerInRange(0,1114112))&&n<=57343;);t+=o.Encoding.CodePoint.decodeToString(n)}return t}}(LZUTF8||(LZUTF8={})),function(e){var t=function(){function e(e){void 0===e&&(e=1024),this.outputBufferCapacity=e,this.outputPosition=0,this.outputString="",this.outputBuffer=new Uint16Array(this.outputBufferCapacity)}return e.prototype.appendCharCode=function(e){this.outputBuffer[this.outputPosition++]=e,this.outputPosition===this.outputBufferCapacity&&this.flushBufferToOutputString()},e.prototype.appendCharCodes=function(e){for(var t=0,r=e.length;t<r;t++)this.appendCharCode(e[t])},e.prototype.appendString=function(e){for(var t=0,r=e.length;t<r;t++)this.appendCharCode(e.charCodeAt(t))},e.prototype.appendCodePoint=function(e){if(e<=65535)this.appendCharCode(e);else{if(!(e<=1114111))throw new Error("appendCodePoint: A code point of "+e+" cannot be encoded in UTF-16");this.appendCharCode(55296+(e-65536>>>10)),this.appendCharCode(56320+(e-65536&1023))}},e.prototype.getOutputString=function(){return this.flushBufferToOutputString(),this.outputString},e.prototype.flushBufferToOutputString=function(){this.outputPosition===this.outputBufferCapacity?this.outputString+=String.fromCharCode.apply(null,this.outputBuffer):this.outputString+=String.fromCharCode.apply(null,this.outputBuffer.subarray(0,this.outputPosition)),this.outputPosition=0},e}();e.StringBuilder=t}(LZUTF8||(LZUTF8={})),function(o){var e=function(){function e(){this.restart()}return e.prototype.restart=function(){this.startTime=e.getTimestamp()},e.prototype.getElapsedTime=function(){return e.getTimestamp()-this.startTime},e.prototype.getElapsedTimeAndRestart=function(){var e=this.getElapsedTime();return this.restart(),e},e.prototype.logAndRestart=function(e,t){void 0===t&&(t=!0);var r=this.getElapsedTime(),n=e+": "+r.toFixed(3)+"ms";return o.log(n,t),this.restart(),r},e.getTimestamp=function(){return this.timestampFunc||this.createGlobalTimestampFunction(),this.timestampFunc()},e.getMicrosecondTimestamp=function(){return Math.floor(1e3*e.getTimestamp())},e.createGlobalTimestampFunction=function(){if("object"==typeof process&&"function"==typeof process.hrtime){var r=0;this.timestampFunc=function(){var e=process.hrtime(),t=1e3*e[0]+e[1]/1e6;return r+t},r=Date.now()-this.timestampFunc()}else if("object"==typeof chrome&&chrome.Interval){var e=Date.now(),t=new chrome.Interval;t.start(),this.timestampFunc=function(){return e+t.microseconds()/1e3}}else if("object"==typeof performance&&performance.now){var n=Date.now()-performance.now();this.timestampFunc=function(){return n+performance.now()}}else Date.now?this.timestampFunc=function(){return Date.now()}:this.timestampFunc=function(){return(new Date).getTime()}},e}();o.Timer=e}(LZUTF8||(LZUTF8={})),function(n){var e=function(){function e(e){void 0===e&&(e=!0),this.MinimumSequenceLength=4,this.MaximumSequenceLength=31,this.MaximumMatchDistance=32767,this.PrefixHashTableSize=65537,this.inputBufferStreamOffset=1,e&&"function"==typeof Uint32Array?this.prefixHashTable=new n.CompressorCustomHashTable(this.PrefixHashTableSize):this.prefixHashTable=new n.CompressorSimpleHashTable(this.PrefixHashTableSize)}return e.prototype.compressBlock=function(e){if(null==e)throw new TypeError("compressBlock: undefined or null input received");return"string"==typeof e&&(e=n.encodeUTF8(e)),e=n.BufferTools.convertToUint8ArrayIfNeeded(e),this.compressUtf8Block(e)},e.prototype.compressUtf8Block=function(e){if(!e||0==e.length)return new Uint8Array(0);var t=this.cropAndAddNewBytesToInputBuffer(e),r=this.inputBuffer,n=this.inputBuffer.length;this.outputBuffer=new Uint8Array(e.length);for(var o=this.outputBufferPosition=0,i=t;i<n;i++){var u=r[i],s=i<o;if(i>n-this.MinimumSequenceLength)s||this.outputRawByte(u);else{var a=this.getBucketIndexForPrefix(i);if(!s){var c=this.findLongestMatch(i,a);null!=c&&(this.outputPointerBytes(c.length,c.distance),o=i+c.length,s=!0)}s||this.outputRawByte(u);var f=this.inputBufferStreamOffset+i;this.prefixHashTable.addValueToBucket(a,f)}}return this.outputBuffer.subarray(0,this.outputBufferPosition)},e.prototype.findLongestMatch=function(e,t){var r=this.prefixHashTable.getArraySegmentForBucketIndex(t,this.reusableArraySegmentObject);if(null==r)return null;for(var n,o=this.inputBuffer,i=0,u=0;u<r.length;u++){var s=r.getInReversedOrder(u)-this.inputBufferStreamOffset,a=e-s,c=void 0;if(c=void 0===n?this.MinimumSequenceLength-1:n<128&&128<=a?i+(i>>>1):i,a>this.MaximumMatchDistance||c>=this.MaximumSequenceLength||e+c>=o.length)break;if(o[s+c]===o[e+c])for(var f=0;;f++){if(e+f===o.length||o[s+f]!==o[e+f]){c<f&&(n=a,i=f);break}if(f===this.MaximumSequenceLength)return{distance:a,length:this.MaximumSequenceLength}}}return void 0!==n?{distance:n,length:i}:null},e.prototype.getBucketIndexForPrefix=function(e){return(7880599*this.inputBuffer[e]+39601*this.inputBuffer[e+1]+199*this.inputBuffer[e+2]+this.inputBuffer[e+3])%this.PrefixHashTableSize},e.prototype.outputPointerBytes=function(e,t){t<128?(this.outputRawByte(192|e),this.outputRawByte(t)):(this.outputRawByte(224|e),this.outputRawByte(t>>>8),this.outputRawByte(255&t))},e.prototype.outputRawByte=function(e){this.outputBuffer[this.outputBufferPosition++]=e},e.prototype.cropAndAddNewBytesToInputBuffer=function(e){if(void 0===this.inputBuffer)return this.inputBuffer=e,0;var t=Math.min(this.inputBuffer.length,this.MaximumMatchDistance),r=this.inputBuffer.length-t;return this.inputBuffer=n.CompressionCommon.getCroppedAndAppendedByteArray(this.inputBuffer,r,t,e),this.inputBufferStreamOffset+=r,t},e}();n.Compressor=e}(LZUTF8||(LZUTF8={})),function(s){var e=function(){function e(e){this.minimumBucketCapacity=4,this.maximumBucketCapacity=64,this.bucketLocators=new Uint32Array(2*e),this.storage=new Uint32Array(2*e),this.storageIndex=1}return e.prototype.addValueToBucket=function(e,t){e<<=1,this.storageIndex>=this.storage.length>>>1&&this.compact();var r,n=this.bucketLocators[e];if(0===n)n=this.storageIndex,r=1,this.storage[this.storageIndex]=t,this.storageIndex+=this.minimumBucketCapacity;else{(r=this.bucketLocators[e+1])===this.maximumBucketCapacity-1&&(r=this.truncateBucketToNewerElements(n,r,this.maximumBucketCapacity/2));var o=n+r;0===this.storage[o]?(this.storage[o]=t,o===this.storageIndex&&(this.storageIndex+=r)):(s.ArrayTools.copyElements(this.storage,n,this.storage,this.storageIndex,r),n=this.storageIndex,this.storageIndex+=r,this.storage[this.storageIndex++]=t,this.storageIndex+=r),r++}this.bucketLocators[e]=n,this.bucketLocators[e+1]=r},e.prototype.truncateBucketToNewerElements=function(e,t,r){var n=e+t-r;return s.ArrayTools.copyElements(this.storage,n,this.storage,e,r),s.ArrayTools.zeroElements(this.storage,e+r,t-r),r},e.prototype.compact=function(){var e=this.bucketLocators,t=this.storage;this.bucketLocators=new Uint32Array(this.bucketLocators.length),this.storageIndex=1;for(var r=0;r<e.length;r+=2){var n=e[r+1];0!==n&&(this.bucketLocators[r]=this.storageIndex,this.bucketLocators[r+1]=n,this.storageIndex+=Math.max(Math.min(2*n,this.maximumBucketCapacity),this.minimumBucketCapacity))}this.storage=new Uint32Array(8*this.storageIndex);for(r=0;r<e.length;r+=2){var o=e[r];if(0!==o){var i=this.bucketLocators[r],u=this.bucketLocators[r+1];s.ArrayTools.copyElements(t,o,this.storage,i,u)}}},e.prototype.getArraySegmentForBucketIndex=function(e,t){e<<=1;var r=this.bucketLocators[e];return 0===r?null:(void 0===t&&(t=new s.ArraySegment(this.storage,r,this.bucketLocators[e+1])),t)},e.prototype.getUsedBucketCount=function(){return Math.floor(s.ArrayTools.countNonzeroValuesInArray(this.bucketLocators)/2)},e.prototype.getTotalElementCount=function(){for(var e=0,t=0;t<this.bucketLocators.length;t+=2)e+=this.bucketLocators[t+1];return e},e}();s.CompressorCustomHashTable=e}(LZUTF8||(LZUTF8={})),function(n){var e=function(){function e(e){this.maximumBucketCapacity=64,this.buckets=new Array(e)}return e.prototype.addValueToBucket=function(e,t){var r=this.buckets[e];void 0===r?this.buckets[e]=[t]:(r.length===this.maximumBucketCapacity-1&&n.ArrayTools.truncateStartingElements(r,this.maximumBucketCapacity/2),r.push(t))},e.prototype.getArraySegmentForBucketIndex=function(e,t){var r=this.buckets[e];return void 0===r?null:(void 0===t&&(t=new n.ArraySegment(r,0,r.length)),t)},e.prototype.getUsedBucketCount=function(){return n.ArrayTools.countNonzeroValuesInArray(this.buckets)},e.prototype.getTotalElementCount=function(){for(var e=0,t=0;t<this.buckets.length;t++)void 0!==this.buckets[t]&&(e+=this.buckets[t].length);return e},e}();n.CompressorSimpleHashTable=e}(LZUTF8||(LZUTF8={})),function(f){var e=function(){function e(){this.MaximumMatchDistance=32767,this.outputPosition=0}return e.prototype.decompressBlockToString=function(e){return e=f.BufferTools.convertToUint8ArrayIfNeeded(e),f.decodeUTF8(this.decompressBlock(e))},e.prototype.decompressBlock=function(e){this.inputBufferRemainder&&(e=f.ArrayTools.concatUint8Arrays([this.inputBufferRemainder,e]),this.inputBufferRemainder=void 0);for(var t=this.cropOutputBufferToWindowAndInitialize(Math.max(4*e.length,1024)),r=0,n=e.length;r<n;r++){var o=e[r];if(o>>>6==3){var i=o>>>5;if(r==n-1||r==n-2&&7==i){this.inputBufferRemainder=e.subarray(r);break}if(e[r+1]>>>7==1)this.outputByte(o);else{var u=31&o,s=void 0;6==i?(s=e[r+1],r+=1):(s=e[r+1]<<8|e[r+2],r+=2);for(var a=this.outputPosition-s,c=0;c<u;c++)this.outputByte(this.outputBuffer[a+c])}}else this.outputByte(o)}return this.rollBackIfOutputBufferEndsWithATruncatedMultibyteSequence(),f.CompressionCommon.getCroppedBuffer(this.outputBuffer,t,this.outputPosition-t)},e.prototype.outputByte=function(e){this.outputPosition===this.outputBuffer.length&&(this.outputBuffer=f.ArrayTools.doubleByteArrayCapacity(this.outputBuffer)),this.outputBuffer[this.outputPosition++]=e},e.prototype.cropOutputBufferToWindowAndInitialize=function(e){if(!this.outputBuffer)return this.outputBuffer=new Uint8Array(e),0;var t=Math.min(this.outputPosition,this.MaximumMatchDistance);if(this.outputBuffer=f.CompressionCommon.getCroppedBuffer(this.outputBuffer,this.outputPosition-t,t,e),this.outputPosition=t,this.outputBufferRemainder){for(var r=0;r<this.outputBufferRemainder.length;r++)this.outputByte(this.outputBufferRemainder[r]);this.outputBufferRemainder=void 0}return t},e.prototype.rollBackIfOutputBufferEndsWithATruncatedMultibyteSequence=function(){for(var e=1;e<=4&&0<=this.outputPosition-e;e++){var t=this.outputBuffer[this.outputPosition-e];if(e<4&&t>>>3==30||e<3&&t>>>4==14||e<2&&t>>>5==6)return this.outputBufferRemainder=this.outputBuffer.subarray(this.outputPosition-e,this.outputPosition),void(this.outputPosition-=e)}},e}();f.Decompressor=e}(LZUTF8||(LZUTF8={})),function(s){var e,t,a,c;e=s.Encoding||(s.Encoding={}),t=e.Base64||(e.Base64={}),a=new Uint8Array([65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,48,49,50,51,52,53,54,55,56,57,43,47]),c=new Uint8Array([255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,62,255,255,255,63,52,53,54,55,56,57,58,59,60,61,255,255,255,0,255,255,255,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,255,255,255,255,255,255,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,255,255,255,255]),t.encode=function(e){return e&&0!=e.length?s.runningInNodeJS()?s.BufferTools.uint8ArrayToBuffer(e).toString("base64"):t.encodeWithJS(e):""},t.decode=function(e){return e?s.runningInNodeJS()?s.BufferTools.bufferToUint8Array(Buffer.from(e,"base64")):t.decodeWithJS(e):new Uint8Array(0)},t.encodeWithJS=function(e,t){if(void 0===t&&(t=!0),!e||0==e.length)return"";for(var r,n=a,o=new s.StringBuilder,i=0,u=e.length;i<u;i+=3)i<=u-3?(r=e[i]<<16|e[i+1]<<8|e[i+2],o.appendCharCode(n[r>>>18&63]),o.appendCharCode(n[r>>>12&63]),o.appendCharCode(n[r>>>6&63]),o.appendCharCode(n[63&r]),r=0):i===u-2?(r=e[i]<<16|e[i+1]<<8,o.appendCharCode(n[r>>>18&63]),o.appendCharCode(n[r>>>12&63]),o.appendCharCode(n[r>>>6&63]),t&&o.appendCharCode(61)):i===u-1&&(r=e[i]<<16,o.appendCharCode(n[r>>>18&63]),o.appendCharCode(n[r>>>12&63]),t&&(o.appendCharCode(61),o.appendCharCode(61)));return o.getOutputString()},t.decodeWithJS=function(e,t){if(!e||0==e.length)return new Uint8Array(0);var r=e.length%4;if(1===r)throw new Error("Invalid Base64 string: length % 4 == 1");2===r?e+="==":3===r&&(e+="="),t||(t=new Uint8Array(e.length));for(var n=0,o=e.length,i=0;i<o;i+=4){var u=c[e.charCodeAt(i)]<<18|c[e.charCodeAt(i+1)]<<12|c[e.charCodeAt(i+2)]<<6|c[e.charCodeAt(i+3)];t[n++]=u>>>16&255,t[n++]=u>>>8&255,t[n++]=255&u}return 61==e.charCodeAt(o-1)&&n--,61==e.charCodeAt(o-2)&&n--,t.subarray(0,n)}}(LZUTF8||(LZUTF8={})),function(s){var e,t;e=s.Encoding||(s.Encoding={}),(t=e.BinaryString||(e.BinaryString={})).encode=function(e){if(null==e)throw new TypeError("BinaryString.encode: undefined or null input received");if(0===e.length)return"";for(var t=e.length,r=new s.StringBuilder,n=0,o=1,i=0;i<t;i+=2){var u=void 0;u=i==t-1?e[i]<<8:e[i]<<8|e[i+1],r.appendCharCode(n<<16-o|u>>>o),n=u&(1<<o)-1,15===o?(r.appendCharCode(n),n=0,o=1):o+=1,t-2<=i&&r.appendCharCode(n<<16-o)}return r.appendCharCode(32768|t%2),r.getOutputString()},t.decode=function(e){if("string"!=typeof e)throw new TypeError("BinaryString.decode: invalid input type");if(""==e)return new Uint8Array(0);for(var t,r=new Uint8Array(3*e.length),n=0,o=0,i=0,u=0;u<e.length;u++){var s=e.charCodeAt(u);32768<=s?(32769==s&&n--,i=0):(0==i?o=s:(t=o<<i|s>>>15-i,r[n++]=t>>>8,r[n++]=255&t,o=s&(1<<15-i)-1),15==i?i=0:i+=1)}return r.subarray(0,n)}}(LZUTF8||(LZUTF8={})),function(e){var t,r;t=e.Encoding||(e.Encoding={}),(r=t.CodePoint||(t.CodePoint={})).encodeFromString=function(e,t){var r=e.charCodeAt(t);if(r<55296||56319<r)return r;var n=e.charCodeAt(t+1);if(56320<=n&&n<=57343)return n-56320+(r-55296<<10)+65536;throw new Error("getUnicodeCodePoint: Received a lead surrogate character, char code "+r+", followed by "+n+", which is not a trailing surrogate character code.")},r.decodeToString=function(e){if(e<=65535)return String.fromCharCode(e);if(e<=1114111)return String.fromCharCode(55296+(e-65536>>>10),56320+(e-65536&1023));throw new Error("getStringFromUnicodeCodePoint: A code point of "+e+" cannot be encoded in UTF-16")}}(LZUTF8||(LZUTF8={})),function(e){var t,r,n;t=e.Encoding||(e.Encoding={}),r=t.DecimalString||(t.DecimalString={}),n=["000","001","002","003","004","005","006","007","008","009","010","011","012","013","014","015","016","017","018","019","020","021","022","023","024","025","026","027","028","029","030","031","032","033","034","035","036","037","038","039","040","041","042","043","044","045","046","047","048","049","050","051","052","053","054","055","056","057","058","059","060","061","062","063","064","065","066","067","068","069","070","071","072","073","074","075","076","077","078","079","080","081","082","083","084","085","086","087","088","089","090","091","092","093","094","095","096","097","098","099","100","101","102","103","104","105","106","107","108","109","110","111","112","113","114","115","116","117","118","119","120","121","122","123","124","125","126","127","128","129","130","131","132","133","134","135","136","137","138","139","140","141","142","143","144","145","146","147","148","149","150","151","152","153","154","155","156","157","158","159","160","161","162","163","164","165","166","167","168","169","170","171","172","173","174","175","176","177","178","179","180","181","182","183","184","185","186","187","188","189","190","191","192","193","194","195","196","197","198","199","200","201","202","203","204","205","206","207","208","209","210","211","212","213","214","215","216","217","218","219","220","221","222","223","224","225","226","227","228","229","230","231","232","233","234","235","236","237","238","239","240","241","242","243","244","245","246","247","248","249","250","251","252","253","254","255"],r.encode=function(e){for(var t=[],r=0;r<e.length;r++)t.push(n[e[r]]);return t.join(" ")}}(LZUTF8||(LZUTF8={})),function(e){var t,r;t=e.Encoding||(e.Encoding={}),(r=t.StorageBinaryString||(t.StorageBinaryString={})).encode=function(e){return t.BinaryString.encode(e).replace(/\0/g,"耂")},r.decode=function(e){return t.BinaryString.decode(e.replace(/\u8002/g,"\0"))}}(LZUTF8||(LZUTF8={})),function(a){var i,t,r,n;i=a.Encoding||(a.Encoding={}),(t=i.UTF8||(i.UTF8={})).encode=function(e){return e&&0!=e.length?a.runningInNodeJS()?a.BufferTools.bufferToUint8Array(Buffer.from(e,"utf8")):t.createNativeTextEncoderAndDecoderIfAvailable()?r.encode(e):t.encodeWithJS(e):new Uint8Array(0)},t.decode=function(e){return e&&0!=e.length?a.runningInNodeJS()?a.BufferTools.uint8ArrayToBuffer(e).toString("utf8"):t.createNativeTextEncoderAndDecoderIfAvailable()?n.decode(e):t.decodeWithJS(e):""},t.encodeWithJS=function(e,t){if(!e||0==e.length)return new Uint8Array(0);t||(t=new Uint8Array(4*e.length));for(var r=0,n=0;n<e.length;n++){var o=i.CodePoint.encodeFromString(e,n);if(o<=127)t[r++]=o;else if(o<=2047)t[r++]=192|o>>>6,t[r++]=128|63&o;else if(o<=65535)t[r++]=224|o>>>12,t[r++]=128|o>>>6&63,t[r++]=128|63&o;else{if(!(o<=1114111))throw new Error("Invalid UTF-16 string: Encountered a character unsupported by UTF-8/16 (RFC 3629)");t[r++]=240|o>>>18,t[r++]=128|o>>>12&63,t[r++]=128|o>>>6&63,t[r++]=128|63&o,n++}}return t.subarray(0,r)},t.decodeWithJS=function(e,t,r){if(void 0===t&&(t=0),!e||0==e.length)return"";void 0===r&&(r=e.length);for(var n,o,i=new a.StringBuilder,u=t,s=r;u<s;){if((o=e[u])>>>7==0)n=o,u+=1;else if(o>>>5==6){if(r<=u+1)throw new Error("Invalid UTF-8 stream: Truncated codepoint sequence encountered at position "+u);n=(31&o)<<6|63&e[u+1],u+=2}else if(o>>>4==14){if(r<=u+2)throw new Error("Invalid UTF-8 stream: Truncated codepoint sequence encountered at position "+u);n=(15&o)<<12|(63&e[u+1])<<6|63&e[u+2],u+=3}else{if(o>>>3!=30)throw new Error("Invalid UTF-8 stream: An invalid lead byte value encountered at position "+u);if(r<=u+3)throw new Error("Invalid UTF-8 stream: Truncated codepoint sequence encountered at position "+u);n=(7&o)<<18|(63&e[u+1])<<12|(63&e[u+2])<<6|63&e[u+3],u+=4}i.appendCodePoint(n)}return i.getOutputString()},t.createNativeTextEncoderAndDecoderIfAvailable=function(){return!!r||"function"==typeof TextEncoder&&(r=new TextEncoder("utf-8"),n=new TextDecoder("utf-8"),!0)}}(LZUTF8||(LZUTF8={})),function(o){o.compress=function(e,t){if(void 0===t&&(t={}),null==e)throw new TypeError("compress: undefined or null input received");var r=o.CompressionCommon.detectCompressionSourceEncoding(e);t=o.ObjectTools.override({inputEncoding:r,outputEncoding:"ByteArray"},t);var n=(new o.Compressor).compressBlock(e);return o.CompressionCommon.encodeCompressedBytes(n,t.outputEncoding)},o.decompress=function(e,t){if(void 0===t&&(t={}),null==e)throw new TypeError("decompress: undefined or null input received");t=o.ObjectTools.override({inputEncoding:"ByteArray",outputEncoding:"String"},t);var r=o.CompressionCommon.decodeCompressedBytes(e,t.inputEncoding),n=(new o.Decompressor).decompressBlock(r);return o.CompressionCommon.encodeDecompressedBytes(n,t.outputEncoding)},o.compressAsync=function(e,t,r){var n;null==r&&(r=function(){});try{n=o.CompressionCommon.detectCompressionSourceEncoding(e)}catch(e){return void r(void 0,e)}t=o.ObjectTools.override({inputEncoding:n,outputEncoding:"ByteArray",useWebWorker:!0,blockSize:65536},t),o.enqueueImmediate(function(){t.useWebWorker&&o.WebWorker.createGlobalWorkerIfNeeded()?o.WebWorker.compressAsync(e,t,r):o.AsyncCompressor.compressAsync(e,t,r)})},o.decompressAsync=function(e,t,r){if(null==r&&(r=function(){}),null!=e){t=o.ObjectTools.override({inputEncoding:"ByteArray",outputEncoding:"String",useWebWorker:!0,blockSize:65536},t);var n=o.BufferTools.convertToUint8ArrayIfNeeded(e);o.EventLoop.enqueueImmediate(function(){t.useWebWorker&&o.WebWorker.createGlobalWorkerIfNeeded()?o.WebWorker.decompressAsync(n,t,r):o.AsyncDecompressor.decompressAsync(e,t,r)})}else r(void 0,new TypeError("decompressAsync: undefined or null input received"))},o.createCompressionStream=function(){return o.AsyncCompressor.createCompressionStream()},o.createDecompressionStream=function(){return o.AsyncDecompressor.createDecompressionStream()},o.encodeUTF8=function(e){return o.Encoding.UTF8.encode(e)},o.decodeUTF8=function(e){return o.Encoding.UTF8.decode(e)},o.encodeBase64=function(e){return o.Encoding.Base64.encode(e)},o.decodeBase64=function(e){return o.Encoding.Base64.decode(e)},o.encodeBinaryString=function(e){return o.Encoding.BinaryString.encode(e)},o.decodeBinaryString=function(e){return o.Encoding.BinaryString.decode(e)},o.encodeStorageBinaryString=function(e){return o.Encoding.StorageBinaryString.encode(e)},o.decodeStorageBinaryString=function(e){return o.Encoding.StorageBinaryString.decode(e)}}(LZUTF8||(LZUTF8={}));
  })();
  const _lz = (typeof LZUTF8 !== 'undefined') ? LZUTF8
    : (typeof module !== 'undefined' ? module.exports : null);
  if (!_lz) { console.error('[GimJector] lzutf8 failed to load'); return; }

  /* ── Blueboat msgpack encoder (inline) ───────────────────────────── */
// this code was stolen from the original Gimkit Util extension
function _blueboatN(t, e, n) {
    for (var i = 0, s = 0, o = n.length; s < o; s++)(i = n.charCodeAt(s)) < 128 ? t.setUint8(e++, i) : (i < 2048 ? t.setUint8(e++, 192 | i >> 6) : (i < 55296 || 57344 <= i ? t.setUint8(e++, 224 | i >> 12) : (s++, i = 65536 + ((1023 & i) << 10 | 1023 & n.charCodeAt(s)), t.setUint8(e++, 240 | i >> 18), t.setUint8(e++, 128 | i >> 12 & 63)), t.setUint8(e++, 128 | i >> 6 & 63)), t.setUint8(e++, 128 | 63 & i))
}

function _blueboatEncode(e) {
    const o = {
        type: 2,
        data: ["blueboat_JOIN_ROOM", e],
        options: {
            compress: !0
        },
        nsp: "/"
    };
    return function(t) {
        var e = [],
            i = [],
            s = function t(e, n, i) {
                var s = typeof i,
                    o = 0,
                    r = 0,
                    a = 0,
                    c = 0,
                    l = 0,
                    u = 0;
                if ("string" === s) {
                    if ((l = function(t) {
                            for (var e = 0, n = 0, i = 0, s = t.length; i < s; i++)(e = t.charCodeAt(i)) < 128 ? n += 1 : e < 2048 ? n += 2 : e < 55296 || 57344 <= e ? n += 3 : (i++, n += 4);
                            return n
                        }(i)) < 32) e.push(160 | l), u = 1;
                    else if (l < 256) e.push(217, l), u = 2;
                    else if (l < 65536) e.push(218, l >> 8, l), u = 3;
                    else {
                        if (!(l < 4294967296)) throw new Error("String too long");
                        e.push(219, l >> 24, l >> 16, l >> 8, l), u = 5
                    }
                    return n.push({
                        h: i,
                        u: l,
                        t: e.length
                    }), u + l
                }
                if ("number" === s) return Math.floor(i) === i && isFinite(i) ? 0 <= i ? i < 128 ? (e.push(i), 1) : i < 256 ? (e.push(204, i), 2) : i < 65536 ? (e.push(205, i >> 8, i), 3) : i < 4294967296 ? (e.push(206, i >> 24, i >> 16, i >> 8, i), 5) : (a = i / Math.pow(2, 32) >> 0, c = i >>> 0, e.push(207, a >> 24, a >> 16, a >> 8, a, c >> 24, c >> 16, c >> 8, c), 9) : -32 <= i ? (e.push(i), 1) : -128 <= i ? (e.push(208, i), 2) : -32768 <= i ? (e.push(209, i >> 8, i), 3) : -2147483648 <= i ? (e.push(210, i >> 24, i >> 16, i >> 8, i), 5) : (a = Math.floor(i / Math.pow(2, 32)), c = i >>> 0, e.push(211, a >> 24, a >> 16, a >> 8, a, c >> 24, c >> 16, c >> 8, c), 9) : (e.push(203), n.push({
                    o: i,
                    u: 8,
                    t: e.length
                }), 9);
                if ("object" === s) {
                    if (null === i) return e.push(192), 1;
                    if (Array.isArray(i)) {
                        if ((l = i.length) < 16) e.push(144 | l), u = 1;
                        else if (l < 65536) e.push(220, l >> 8, l), u = 3;
                        else {
                            if (!(l < 4294967296)) throw new Error("Array too large");
                            e.push(221, l >> 24, l >> 16, l >> 8, l), u = 5
                        }
                        for (o = 0; o < l; o++) u += t(e, n, i[o]);
                        return u
                    }
                    if (i instanceof Date) {
                        var h = i.getTime();
                        return a = Math.floor(h / Math.pow(2, 32)), c = h >>> 0, e.push(215, 0, a >> 24, a >> 16, a >> 8, a, c >> 24, c >> 16, c >> 8, c), 10
                    }
                    if (i instanceof ArrayBuffer) {
                        if ((l = i.byteLength) < 256) e.push(196, l), u = 2;
                        else if (l < 65536) e.push(197, l >> 8, l), u = 3;
                        else {
                            if (!(l < 4294967296)) throw new Error("Buffer too large");
                            e.push(198, l >> 24, l >> 16, l >> 8, l), u = 5
                        }
                        return n.push({
                            l: i,
                            u: l,
                            t: e.length
                        }), u + l
                    }
                    if ("function" == typeof i.toJSON) return t(e, n, i.toJSON());
                    var d = [],
                        f = "",
                        p = Object.keys(i);
                    for (o = 0, r = p.length; o < r; o++) "function" != typeof i[f = p[o]] && d.push(f);
                    if ((l = d.length) < 16) e.push(128 | l), u = 1;
                    else if (l < 65536) e.push(222, l >> 8, l), u = 3;
                    else {
                        if (!(l < 4294967296)) throw new Error("Object too large");
                        e.push(223, l >> 24, l >> 16, l >> 8, l), u = 5
                    }
                    for (o = 0; o < l; o++) u += t(e, n, f = d[o]), u += t(e, n, i[f]);
                    return u
                }
                if ("boolean" === s) return e.push(i ? 195 : 194), 1;
                if ("undefined" === s) return e.push(212, 0, 0), 3;
                throw new Error("Could not encode")
            }(e, i, t),
            o = new ArrayBuffer(s),
            r = new DataView(o),
            a = 0,
            c = 0,
            l = -1;
        0 < i.length && (l = i[0].t);
        for (var u, h = 0, d = 0, f = 0, p = e.length; f < p; f++)
            if (r.setUint8(c + f, e[f]), f + 1 === l) {
                if (h = (u = i[a]).u, d = c + l, u.l)
                    for (var g = new Uint8Array(u.l), E = 0; E < h; E++) r.setUint8(d + E, g[E]);
                else u.h ? _blueboatN(r, d, u.h) : void 0 !== u.o && r.setFloat64(d, u.o);
                c += h, i[++a] && (l = i[a].t)
            } let y = Array.from(new Uint8Array(o));
        y.unshift(4)
        return new Uint8Array(y).buffer 
    }(o)
}


  /* ── StegCloak .hide() — Web-Crypto re-implementation ────────────── */
  // Implements exactly the same algorithm as stegcloak@1.1.1 hide(msg,pw,cover)
  // with encrypt=true, integrity=false so Gimkit can validate the clientType.
  const _ZWC = ['\u200C','\u200D','\u2061','\u2062','\u2063','\u2064'];

  function _zwcFindOptimal(stream) {
    const chars = _ZWC.slice(0, 4);
    const score = Object.fromEntries(chars.map(c => [c, {}]));
    for (let j = 0; j < stream.length; j++) {
      let run = 1;
      while (j < stream.length - 1 && stream[j] === stream[j + 1]) { run++; j++; }
      if (run >= 2 && chars.includes(stream[j])) {
        for (let k = 2; k <= run; k++) {
          score[stream[j]][k] = (score[stream[j]][k] || 0) + Math.floor(run / k) * (k - 1);
        }
      }
    }
    let ranked = [];
    for (const c of chars) for (const k in score[c]) ranked.push([c, +k, score[c][k]]);
    ranked.sort((a, b) => b[2] - a[2]);
    let top2 = ranked.filter(r => r[1] === 2).slice(0, 2).map(r => r[0]);
    if (top2.length < 2) top2 = top2.concat(chars.filter(c => !top2.includes(c))).slice(0, 2);
    return top2.slice().sort();
  }

  function _zwcShrink(stream) {
    const tableMap = [
      _ZWC[0]+_ZWC[1], _ZWC[0]+_ZWC[2], _ZWC[0]+_ZWC[3],
      _ZWC[1]+_ZWC[2], _ZWC[1]+_ZWC[3], _ZWC[2]+_ZWC[3],
    ];
    const [r0, r1] = _zwcFindOptimal(stream);
    const flag = _ZWC[tableMap.indexOf(r0 + r1)];
    // recursiveReplace processes from last to first (Ramda dropLast order)
    let out = stream
      .replace(new RegExp(r1 + r1, 'g'), _ZWC[5])
      .replace(new RegExp(r0 + r0, 'g'), _ZWC[4]);
    return flag + out;
  }

  async function _stegHide(message, password, cover) {
    // 1. LZ-UTF8 compress
    const compressed = _lz.compress(message, { outputEncoding: 'Buffer' });

    // 2. Bitwise-NOT each byte (StegCloak "compliment" step)
    const complemented = new Uint8Array(compressed.length);
    for (let i = 0; i < compressed.length; i++) complemented[i] = (~compressed[i]) & 0xFF;

    // 3. AES-256-CTR encrypt with PBKDF2-derived key (matches stegcloak encrypt.js)
    const salt = crypto.getRandomValues(new Uint8Array(8));
    const pwBytes = new TextEncoder().encode(password);
    const keyMat = await crypto.subtle.importKey('raw', pwBytes, 'PBKDF2', false, ['deriveBits']);
    const derived = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: 10000, hash: 'SHA-512' },
      keyMat, 384               // 48 bytes = iv(16) + key(32)
    );
    const iv  = new Uint8Array(derived, 0, 16);
    const aesKey = await crypto.subtle.importKey(
      'raw', new Uint8Array(derived, 16, 32),
      { name: 'AES-CTR' }, false, ['encrypt']
    );
    const cipherBuf = await crypto.subtle.encrypt(
      { name: 'AES-CTR', counter: iv, length: 128 }, aesKey, complemented
    );

    // 4. payload = salt || ciphertext
    const payload = new Uint8Array(8 + cipherBuf.byteLength);
    payload.set(salt);
    payload.set(new Uint8Array(cipherBuf), 8);

    // 5. Bytes → binary string
    let binStr = '';
    for (const b of payload) binStr += b.toString(2).padStart(8, '0');

    // 6. Binary → ZWC (flag = ZWC[1] for crypt=true, integrity=false)
    let stream = _ZWC[1];
    for (let i = 0; i < binStr.length; i += 2) stream += _ZWC[parseInt(binStr[i] + binStr[i + 1], 2)];

    // 7. Shrink (ZWC run-length compression)
    stream = _zwcShrink(stream);

    // 8. Embed into cover text (StegCloak embed())
    const words = cover.split(' ');
    const idx   = Math.floor(Math.random() * Math.floor(words.length / 2));
    return words.slice(0, idx + 1).concat([stream + words[idx + 1]]).concat(words.slice(idx + 2)).join(' ');
  }

  /* ── JID helper ──────────────────────────────────────────────────── */
  let _jidCache = null, _jidAt = 0;
  async function _getJID(force = false) {
    const now = Date.now();
    if (!force && _jidCache && now - _jidAt < 120_000) return _jidCache;
    const meta = document.querySelector("meta[property='int:jid']");
    if (meta) {
      _jidCache = meta.getAttribute('content').split('').reverse().join('');
      _jidAt    = Date.now();
      return _jidCache;
    }
    const res  = await fetch('/join');
    const html = await res.text();
    const doc  = new DOMParser().parseFromString(html, 'text/html');
    const m    = doc.querySelector("meta[property='int:jid']");
    if (!m) throw new Error("No JID meta tag found on gimkit.com/join");
    _jidCache = m.getAttribute('content').split('').reverse().join('');
    _jidAt    = Date.now();
    return _jidCache;
  }

  /* ── Name generator ──────────────────────────────────────────────── */
  const _ADJ  = ['Angry','Brave','Calm','Dark','Epic','Fast','Goofy','Happy','Icy','Jolly',
    'Kind','Lazy','Mean','Nice','Odd','Pale','Quick','Rude','Sly','Tiny',
    'Ultra','Vast','Wild','Zany','Bold','Cool','Dumb','Evil','Fake','Glad'];
  const _NOUN = ['Axe','Bear','Cat','Dog','Egg','Fox','Gnu','Hog','Imp','Jay',
    'Koi','Leo','Moo','Nit','Owl','Pig','Rat','Spy','Tux','Urn',
    'Van','Wolf','Yak','Zap','Ace','Bug','Cow','Doe','Elf','Fly'];
  const _rand = arr => arr[Math.floor(Math.random() * arr.length)];
  function _randomName() { return `${_rand(_ADJ)}${_rand(_NOUN)}${Math.floor(Math.random()*99)+1}`; }
  const _sleep = ms => new Promise(r => setTimeout(r, ms));

  /* ── Bot ─────────────────────────────────────────────────────────── */
  class Bot {
    constructor(name, onLog, onDrop) {
      this.name       = name;
      this.ws         = null;
      this.alive      = false;
      this._hb        = null;
      this._onLog     = onLog;
      this._onDrop    = onDrop;
    }

    async spawn(code) {
      const jid = await _getJID();

      // 1. Find room
      const infoRes = await fetch('/api/matchmaker/find-info-from-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const info = await infoRes.json();
      if (info.code === 404 || !infoRes.ok) throw new Error(`Game "${code}" not found`);
      const roomId = info.roomId ?? info.room?.roomId;
      if (!roomId) throw new Error('No roomId');

      // 2. Build clientType
      const clientType = await _stegHide(jid, 'BSKA', 'Gimkit Web Client V3.1');

      // 3. Join matchmaker
      const joinRes = await fetch('/api/matchmaker/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientType, name: this.name, roomId }),
      });
      const joinText = await joinRes.text();
      if (!joinRes.ok) throw new Error(`matchmaker/join ${joinRes.status}: ${joinText.slice(0, 120)}`);

      const join      = JSON.parse(joinText);
      const finalRoom = join.roomId ?? roomId;
      if (!join.serverUrl) throw new Error('No serverUrl');

      if (join.source === 'original') {
        await this._blueboat(join.serverUrl, finalRoom, join.intentId);
      } else {
        await this._colyseus(join.serverUrl, finalRoom, join.intentId);
      }
    }

    _blueboat(serverUrl, roomId, intentId) {
      return new Promise((resolve, reject) => {
        const wsUrl = `wss${serverUrl.substr(5)}/blueboat/?id=&EIO=3&transport=websocket`;
        const ws    = new WebSocket(wsUrl);
        this.ws     = ws;

        const timeout = setTimeout(() => { ws.close(); reject(new Error(`"${this.name}" timed out`)); }, 15_000);

        ws.onopen = () => {
          clearTimeout(timeout);
          ws.send(_blueboatEncode({ roomId, options: { intent: intentId } }));
          this._hb = setInterval(() => { if (ws.readyState === WebSocket.OPEN) ws.send('2'); }, 25_000);
        };

        ws.onmessage = (e) => {
          if (this.alive) return;
          const raw = typeof e.data === 'string' ? e.data : '';
          if (raw.startsWith('0') || raw.startsWith('40') || e.data instanceof ArrayBuffer) {
            this.alive = true;
            this._onLog('system', `✓ "${this.name}" joined`);
            resolve();
          }
        };

        ws.onerror = (e) => { clearTimeout(timeout); reject(new Error('WebSocket error')); };

        ws.onclose = (e) => {
          clearTimeout(timeout);
          if (this._hb) { clearInterval(this._hb); this._hb = null; }
          if (this.alive) {
            this.alive = false;
            this._onLog('warn', `"${this.name}" dropped (${e.code})`);
            if (this._onDrop) this._onDrop();
          }
        };
      });
    }

    async _colyseus(serverUrl, roomId, intentId) {
      const seatRes = await fetch(`${serverUrl}/matchmake/joinById/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intentId }),
      });
      const seat = await seatRes.json();
      if (!seat.sessionId) throw new Error('Colyseus: no sessionId');

      const wsUrl = `wss${serverUrl.substr(5)}/${seat.room.processId}/${seat.room.roomId}?sessionId=${seat.sessionId}`;
      return new Promise((resolve, reject) => {
        const ws      = new WebSocket(wsUrl);
        this.ws       = ws;
        const timeout = setTimeout(() => { ws.close(); reject(new Error('Colyseus timeout')); }, 10_000);

        ws.onmessage = (e) => {
          clearTimeout(timeout);
          const txt = typeof e.data === 'string' ? e.data : '';
          if (txt.includes('"type":"FULL"')) { ws.close(); reject(new Error('Room full')); return; }
          this.alive = true;
          this._onLog('system', `✓ "${this.name}" joined (Colyseus)`);
          resolve();
        };

        ws.onerror = () => { clearTimeout(timeout); reject(new Error('Colyseus WS error')); };

        ws.onclose = (e) => {
          if (this._hb) { clearInterval(this._hb); this._hb = null; }
          if (this.alive) {
            this.alive = false;
            this._onLog('warn', `"${this.name}" dropped (${e.code})`);
            if (this._onDrop) this._onDrop();
          }
        };
      });
    }

    sendChat(txt) {
      if (this.ws?.readyState === WebSocket.OPEN)
        this.ws.send('42' + JSON.stringify(['chat', { message: txt }]));
    }

    disconnect() {
      if (this._hb) { clearInterval(this._hb); this._hb = null; }
      if (this.ws)  { this.ws.close(); this.ws = null; }
      this.alive = false;
    }
  }

  /* ── Session state ────────────────────────────────────────────────── */
  const _bots      = new Map();
  let   _botSeq    = 0;
  let   _flooding  = false;
  let   _code      = null;
  let   _cfg       = {};
  let   _spamTimer = null;

  /* ── UI helpers ───────────────────────────────────────────────────── */
  let _ui = null;

  function _esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function _uiLog(level, msg) {
    if (!_ui) return;
    const log   = _ui.querySelector('#gj-log');
    const entry = document.createElement('div');
    entry.style.cssText = 'display:flex;gap:6px;align-items:flex-start;padding:2px 0';
    const colors = { system:'#4ade80', error:'#f87171', warn:'#fbbf24', chat:'#60a5fa' };
    const now = new Date().toLocaleTimeString('en-US',{hour12:false});
    entry.innerHTML =
      `<span style="color:#4b5675;flex-shrink:0;font-size:.68rem;margin-top:1px">${now}</span>`+
      `<span style="font-size:.6rem;font-weight:700;padding:2px 5px;border-radius:4px;flex-shrink:0;background:#111;color:${colors[level]||colors.system}">${(level||'SYS').toUpperCase()}</span>`+
      `<span style="color:#e2e8f0;word-break:break-word;font-size:.78rem">${_esc(msg)}</span>`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
  }

  function _uiBotUpdate(id, name, state) {
    if (!_ui) return;
    const grid = _ui.querySelector('#gj-grid');
    const empty = grid.querySelector('#gj-empty');
    if (empty) empty.remove();
    let card = grid.querySelector(`#gj-bot-${id}`);
    if (!card) {
      card = document.createElement('div');
      card.id = `gj-bot-${id}`;
      card.style.cssText = 'padding:6px 8px;border-radius:7px;border:1px solid #1f2340;font-size:.72rem;display:flex;gap:6px;align-items:center;overflow:hidden;transition:border-color .3s';
      card.innerHTML = `<div class="gj-dot" style="width:6px;height:6px;border-radius:50%;flex-shrink:0"></div><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${_esc(name)}">${_esc(name)}</span>`;
      grid.appendChild(card);
    }
    const dotColors = { alive:'#22c55e', failed:'#ef4444', connecting:'#f59e0b', dropped:'#f97316' };
    card.querySelector('.gj-dot').style.background = dotColors[state] || '#4b5675';
  }

  function _uiStats() {
    if (!_ui) return;
    const total  = _bots.size;
    const alive  = [..._bots.values()].filter(b => b.alive).length;
    const failed = total - alive;
    _ui.querySelector('#gj-alive').textContent  = alive;
    _ui.querySelector('#gj-failed').textContent = failed;
    _ui.querySelector('#gj-total').textContent  = total;
  }

  /* ── Flood / stop ─────────────────────────────────────────────────── */
  function _startSpam(message, intervalMs) {
    if (_spamTimer) { clearInterval(_spamTimer); _spamTimer = null; }
    if (!message || intervalMs < 500) return;
    _spamTimer = setInterval(() => {
      let sent = 0;
      for (const b of _bots.values()) { if (b.alive) { b.sendChat(message); sent++; } }
      if (sent > 0) _uiLog('chat', `Spam sent by ${sent} bots: "${message}"`);
    }, intervalMs);
  }

  async function _spawnBot(name, code, retries = 2) {
    const id  = ++_botSeq;
    const bot = new Bot(name, _uiLog, () => {
      _uiStats();
      _uiBotUpdate(id, name, 'dropped');
      if (_flooding && _cfg.autoReconnect) {
        setTimeout(async () => {
          if (!_flooding) return;
          _uiLog('warn', `Reconnecting "${name}"…`);
          try {
            await _getJID(true);
            await bot.spawn(code);
            _uiStats();
            _uiBotUpdate(id, name, 'alive');
          } catch (e) {
            _uiLog('error', `Reconnect "${name}" failed: ${e.message}`);
            _uiBotUpdate(id, name, 'failed');
          }
        }, 2000);
      }
    });
    _bots.set(id, bot);
    _uiBotUpdate(id, name, 'connecting');

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        if (attempt > 0) await _getJID(true);
        await bot.spawn(code);
        _uiBotUpdate(id, name, 'alive');
        _uiStats();
        return;
      } catch (e) {
        if (attempt < retries) {
          _uiLog('warn', `"${name}" retry ${attempt + 1}: ${e.message}`);
          await _sleep(500 * (attempt + 1));
        } else {
          _uiLog('error', `"${name}" failed after ${retries + 1} attempts: ${e.message}`);
          _uiBotUpdate(id, name, 'failed');
          _bots.delete(id);
          _uiStats();
        }
      }
    }
  }

  async function _startFlood(opts) {
    const { code, count = 10, delay = 300, namePrefix = 'Bot',
            randomNames = false, autoReconnect = false,
            spamMessage = null, spamInterval = 3000 } = opts;

    if (_flooding) { _uiLog('error', 'Already flooding — stop first.'); return; }
    if (!code)     { _uiLog('error', 'No game code provided.'); return; }

    _flooding = true;
    _code     = code.trim();
    _cfg      = { autoReconnect };
    _bots.clear();
    _botSeq = 0;

    _uiLog('system', `Starting flood — ${count} bots, ${delay}ms stagger`);
    _uiSetState('flooding');

    try {
      await _getJID(true);
      _uiLog('system', 'JID ready ✓');
    } catch (e) {
      _uiLog('error', `JID fetch failed: ${e.message}`);
      _flooding = false;
      _uiSetState('idle');
      return;
    }

    for (let i = 0; i < count; i++) {
      if (!_flooding) break;
      const name = randomNames ? _randomName() : `${namePrefix}${i + 1}`;
      _spawnBot(name, _code).catch(() => {});
      if (i < count - 1) await _sleep(delay);
    }

    if (spamMessage && spamInterval) {
      _startSpam(spamMessage, spamInterval);
      _uiLog('system', `Chat spam: "${spamMessage}" every ${spamInterval}ms`);
    }
  }

  function _stopFlood() {
    _flooding = false;
    if (_spamTimer) { clearInterval(_spamTimer); _spamTimer = null; }
    const n = _bots.size;
    _bots.forEach(b => b.disconnect());
    _bots.clear();
    _uiLog('system', `Stopped — ${n} bots disconnected`);
    _uiStats();
    _uiSetState('idle');
    if (_ui) {
      const grid = _ui.querySelector('#gj-grid');
      grid.innerHTML = '<span id="gj-empty" style="color:#4b5675;font-size:.8rem">No bots spawned yet.</span>';
    }
  }

  function _uiSetState(state) {
    if (!_ui) return;
    const flooding = state === 'flooding';
    _ui.querySelector('#gj-btn-flood').disabled = flooding;
    _ui.querySelector('#gj-btn-stop').disabled  = !flooding;
    const dot = _ui.querySelector('#gj-dot');
    dot.style.background = flooding ? '#f59e0b' : state === 'idle' ? '#4b5675' : '#ef4444';
  }

  /* ── UI ───────────────────────────────────────────────────────────── */
  function _createUI() {
    const panel = document.createElement('div');
    panel.id = 'gimjector-panel';
    panel.style.cssText = [
      'position:fixed;top:20px;right:20px;z-index:2147483647',
      'width:320px;background:#0f1120;color:#e2e8f0',
      'border:1px solid #1f2340;border-radius:14px',
      'font-family:Segoe UI,system-ui,sans-serif;font-size:.82rem',
      'box-shadow:0 8px 32px rgba(0,0,0,.6)',
      'display:flex;flex-direction:column;overflow:hidden',
    ].join(';');

    panel.innerHTML = `
<div id="gj-header" style="background:#080a12;padding:10px 14px;display:flex;align-items:center;gap:10px;cursor:grab;border-bottom:1px solid #1f2340;user-select:none">
  <span style="font-size:1rem;font-weight:800;letter-spacing:-.3px">Gim<span style="color:#7c6dfa">Jector</span></span>
  <span style="font-size:.6rem;background:#1f2340;color:#4b5675;padding:2px 7px;border-radius:99px;font-weight:600">v6.0</span>
  <div id="gj-dot" style="width:7px;height:7px;border-radius:50%;background:#4b5675;margin-left:auto"></div>
  <button id="gj-close" style="background:none;border:none;color:#4b5675;cursor:pointer;font-size:1rem;padding:0;line-height:1">✕</button>
</div>

<div style="padding:12px 14px;display:flex;flex-direction:column;gap:10px;max-height:80vh;overflow-y:auto">

  <!-- Stats -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
    <div style="background:#13162a;border:1px solid #1f2340;border-radius:8px;padding:8px;text-align:center">
      <div id="gj-alive"  style="font-size:1.2rem;font-weight:800;color:#22c55e">0</div>
      <div style="font-size:.58rem;color:#4b5675;text-transform:uppercase;letter-spacing:.5px">Alive</div>
    </div>
    <div style="background:#13162a;border:1px solid #1f2340;border-radius:8px;padding:8px;text-align:center">
      <div id="gj-failed" style="font-size:1.2rem;font-weight:800;color:#ef4444">0</div>
      <div style="font-size:.58rem;color:#4b5675;text-transform:uppercase;letter-spacing:.5px">Failed</div>
    </div>
    <div style="background:#13162a;border:1px solid #1f2340;border-radius:8px;padding:8px;text-align:center">
      <div id="gj-total"  style="font-size:1.2rem;font-weight:800;color:#a78bfa">0</div>
      <div style="font-size:.58rem;color:#4b5675;text-transform:uppercase;letter-spacing:.5px">Total</div>
    </div>
  </div>

  <!-- Game code -->
  <div style="display:flex;flex-direction:column;gap:4px">
    <label style="font-size:.65rem;font-weight:600;color:#4b5675;text-transform:uppercase;letter-spacing:.5px">Game Code</label>
    <input id="gj-code" type="text" placeholder="e.g. 123456" maxlength="10"
      style="background:#13162a;border:1px solid #1f2340;border-radius:7px;color:#e2e8f0;padding:7px 10px;font-size:.82rem;outline:none;width:100%;box-sizing:border-box"/>
  </div>

  <!-- Name / random toggle -->
  <div style="display:flex;align-items:center;justify-content:space-between;background:#13162a;border:1px solid #1f2340;border-radius:7px;padding:7px 10px">
    <span>Random names</span>
    <div id="gj-tgl-rand" style="width:32px;height:18px;background:#1f2340;border-radius:99px;cursor:pointer;position:relative;flex-shrink:0;transition:background .2s">
      <div style="position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .2s"></div>
    </div>
  </div>
  <div id="gj-prefix-row" style="display:flex;flex-direction:column;gap:4px">
    <label style="font-size:.65rem;font-weight:600;color:#4b5675;text-transform:uppercase;letter-spacing:.5px">Name Prefix</label>
    <input id="gj-prefix" type="text" value="Bot" maxlength="16"
      style="background:#13162a;border:1px solid #1f2340;border-radius:7px;color:#e2e8f0;padding:7px 10px;font-size:.82rem;outline:none;width:100%;box-sizing:border-box"/>
  </div>

  <!-- Count / delay -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
    <div style="display:flex;flex-direction:column;gap:4px">
      <label style="font-size:.65rem;font-weight:600;color:#4b5675;text-transform:uppercase;letter-spacing:.5px">Bot Count</label>
      <input id="gj-count" type="number" value="10" min="1" max="200"
        style="background:#13162a;border:1px solid #1f2340;border-radius:7px;color:#e2e8f0;padding:7px 10px;font-size:.82rem;outline:none;width:100%;box-sizing:border-box"/>
    </div>
    <div style="display:flex;flex-direction:column;gap:4px">
      <label style="font-size:.65rem;font-weight:600;color:#4b5675;text-transform:uppercase;letter-spacing:.5px">Delay (ms)</label>
      <input id="gj-delay" type="number" value="300" min="0" max="5000"
        style="background:#13162a;border:1px solid #1f2340;border-radius:7px;color:#e2e8f0;padding:7px 10px;font-size:.82rem;outline:none;width:100%;box-sizing:border-box"/>
    </div>
  </div>

  <!-- Auto-reconnect -->
  <div style="display:flex;align-items:center;justify-content:space-between;background:#13162a;border:1px solid #1f2340;border-radius:7px;padding:7px 10px">
    <span>Auto-reconnect</span>
    <div id="gj-tgl-reconn" style="width:32px;height:18px;background:#1f2340;border-radius:99px;cursor:pointer;position:relative;flex-shrink:0;transition:background .2s">
      <div style="position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .2s"></div>
    </div>
  </div>

  <!-- Flood / Stop -->
  <div style="display:flex;gap:6px">
    <button id="gj-btn-flood" style="flex:1;padding:9px;background:#7c6dfa;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:.82rem">🚀 Flood</button>
    <button id="gj-btn-stop"  style="flex:1;padding:9px;background:#ef4444;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:.82rem" disabled>⛔ Stop</button>
  </div>

  <!-- Chat spam -->
  <details style="background:#13162a;border:1px solid #1f2340;border-radius:7px;padding:0">
    <summary style="padding:7px 10px;cursor:pointer;font-weight:600;list-style:none;color:#a78bfa">▸ Chat Spam</summary>
    <div style="padding:0 10px 10px;display:flex;flex-direction:column;gap:6px;margin-top:6px">
      <input id="gj-spam-msg" type="text" placeholder="hi everyone" maxlength="100"
        style="background:#0f1120;border:1px solid #1f2340;border-radius:7px;color:#e2e8f0;padding:7px 10px;font-size:.82rem;outline:none;width:100%;box-sizing:border-box"/>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;align-items:end">
        <div style="display:flex;flex-direction:column;gap:3px">
          <label style="font-size:.6rem;font-weight:600;color:#4b5675;text-transform:uppercase;letter-spacing:.5px">Interval (ms)</label>
          <input id="gj-spam-int" type="number" value="3000" min="500"
            style="background:#0f1120;border:1px solid #1f2340;border-radius:7px;color:#e2e8f0;padding:7px 10px;font-size:.82rem;outline:none;width:100%;box-sizing:border-box"/>
        </div>
        <button id="gj-btn-spam" style="padding:7px;background:#3b82f6;color:#fff;border:none;border-radius:7px;font-weight:700;cursor:pointer;font-size:.76rem">▶ Start</button>
      </div>
    </div>
  </details>

  <!-- Bot grid -->
  <details open style="background:#13162a;border:1px solid #1f2340;border-radius:7px;padding:0">
    <summary style="padding:7px 10px;cursor:pointer;font-weight:600;list-style:none;color:#a78bfa">▸ Bot Grid</summary>
    <div id="gj-grid" style="padding:6px 10px 10px;display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:5px;max-height:140px;overflow-y:auto">
      <span id="gj-empty" style="color:#4b5675;font-size:.8rem">No bots spawned yet.</span>
    </div>
  </details>

  <!-- Log -->
  <details style="background:#13162a;border:1px solid #1f2340;border-radius:7px;padding:0">
    <summary style="padding:7px 10px;cursor:pointer;font-weight:600;list-style:none;color:#a78bfa">▸ Log</summary>
    <div id="gj-log" style="padding:6px 10px 10px;max-height:150px;overflow-y:auto;display:flex;flex-direction:column;gap:1px"></div>
  </details>

</div>
`;

    // Wire up events
    let randOn = false, reconnOn = false, spamOn = false;

    function _toggle(el, state) {
      el.style.background = state ? '#7c6dfa' : '#1f2340';
      el.querySelector('div').style.transform = state ? 'translateX(14px)' : '';
    }

    panel.querySelector('#gj-tgl-rand').onclick = () => {
      randOn = !randOn;
      _toggle(panel.querySelector('#gj-tgl-rand'), randOn);
      panel.querySelector('#gj-prefix-row').style.display = randOn ? 'none' : '';
    };

    panel.querySelector('#gj-tgl-reconn').onclick = () => {
      reconnOn = !reconnOn;
      _toggle(panel.querySelector('#gj-tgl-reconn'), reconnOn);
    };

    panel.querySelector('#gj-btn-flood').onclick = async () => {
      const code  = panel.querySelector('#gj-code').value.trim();
      const count = parseInt(panel.querySelector('#gj-count').value) || 10;
      const delay = parseInt(panel.querySelector('#gj-delay').value) ?? 300;
      const pfx   = panel.querySelector('#gj-prefix').value.trim() || 'Bot';
      const smsg  = panel.querySelector('#gj-spam-msg').value.trim();
      const sint  = parseInt(panel.querySelector('#gj-spam-int').value) || 3000;
      if (!code) { _uiLog('error', 'Enter a game code first.'); return; }
      await _startFlood({ code, count, delay, namePrefix: pfx,
        randomNames: randOn, autoReconnect: reconnOn,
        spamMessage: spamOn ? smsg : null,
        spamInterval: spamOn ? sint : null });
    };

    panel.querySelector('#gj-btn-stop').onclick = _stopFlood;

    panel.querySelector('#gj-btn-spam').onclick = () => {
      spamOn = !spamOn;
      panel.querySelector('#gj-btn-spam').textContent = spamOn ? '⏹ Stop' : '▶ Start';
      const msg = panel.querySelector('#gj-spam-msg').value.trim();
      const itv = parseInt(panel.querySelector('#gj-spam-int').value) || 3000;
      _startSpam(spamOn ? msg : null, itv);
    };

    panel.querySelector('#gj-close').onclick = () => panel.remove();

    // Drag to move
    const header = panel.querySelector('#gj-header');
    let dragging = false, ox = 0, oy = 0;
    header.addEventListener('mousedown', e => {
      dragging = true; ox = e.clientX - panel.offsetLeft; oy = e.clientY - panel.offsetTop;
      header.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      panel.style.left  = (e.clientX - ox) + 'px';
      panel.style.top   = (e.clientY - oy) + 'px';
      panel.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => { dragging = false; header.style.cursor = 'grab'; });

    document.body.appendChild(panel);
    return panel;
  }

  /* ── Init ─────────────────────────────────────────────────────────── */
  _ui = _createUI();
  _uiLog('system', 'GimJector loaded ✓ — enter a game code and click Flood');

  window.__GimJector = {
    start:  _startFlood,
    stop:   _stopFlood,
    bots:   _bots,
    panel:  _ui,
    show:   () => { if (!document.getElementById('gimjector-panel')) { _ui = _createUI(); } },
  };

  console.info('%c GimJector v6.0 loaded ', 'background:#7c6dfa;color:#fff;font-weight:bold;border-radius:4px');
  console.info('Use window.__GimJector.start({code,count,delay}) or the panel above.');

})();
