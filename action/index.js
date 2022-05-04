module.exports=function(e,t){"use strict";var n={};function __webpack_require__(t){if(n[t]){return n[t].exports}var r=n[t]={i:t,l:false,exports:{}};var s=true;try{e[t].call(r.exports,r,r.exports,__webpack_require__);s=false}finally{if(s)delete n[t]}r.l=true;return r.exports}__webpack_require__.ab=__dirname+"/";function startup(){return __webpack_require__(676)}return startup()}({16:function(e){e.exports=require("tls")},82:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:true});t.toCommandProperties=t.toCommandValue=void 0;function toCommandValue(e){if(e===null||e===undefined){return""}else if(typeof e==="string"||e instanceof String){return e}return JSON.stringify(e)}t.toCommandValue=toCommandValue;function toCommandProperties(e){if(!Object.keys(e).length){return{}}return{title:e.title,file:e.file,line:e.startLine,endLine:e.endLine,col:e.startColumn,endColumn:e.endColumn}}t.toCommandProperties=toCommandProperties},87:function(e){e.exports=require("os")},102:function(e,t,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){if(r===undefined)r=n;Object.defineProperty(e,r,{enumerable:true,get:function(){return t[n]}})}:function(e,t,n,r){if(r===undefined)r=n;e[r]=t[n]});var s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:true,value:t})}:function(e,t){e["default"]=t});var o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(n!=="default"&&Object.hasOwnProperty.call(e,n))r(t,e,n);s(t,e);return t};Object.defineProperty(t,"__esModule",{value:true});t.issueCommand=void 0;const i=o(n(747));const a=o(n(87));const u=n(82);function issueCommand(e,t){const n=process.env[`GITHUB_${e}`];if(!n){throw new Error(`Unable to find environment variable for file command ${e}`)}if(!i.existsSync(n)){throw new Error(`Missing file at path: ${n}`)}i.appendFileSync(n,`${u.toCommandValue(t)}${a.EOL}`,{encoding:"utf8"})}t.issueCommand=issueCommand},141:function(e,t,n){"use strict";var r=n(631);var s=n(16);var o=n(605);var i=n(211);var a=n(614);var u=n(357);var c=n(669);t.httpOverHttp=httpOverHttp;t.httpsOverHttp=httpsOverHttp;t.httpOverHttps=httpOverHttps;t.httpsOverHttps=httpsOverHttps;function httpOverHttp(e){var t=new TunnelingAgent(e);t.request=o.request;return t}function httpsOverHttp(e){var t=new TunnelingAgent(e);t.request=o.request;t.createSocket=createSecureSocket;t.defaultPort=443;return t}function httpOverHttps(e){var t=new TunnelingAgent(e);t.request=i.request;return t}function httpsOverHttps(e){var t=new TunnelingAgent(e);t.request=i.request;t.createSocket=createSecureSocket;t.defaultPort=443;return t}function TunnelingAgent(e){var t=this;t.options=e||{};t.proxyOptions=t.options.proxy||{};t.maxSockets=t.options.maxSockets||o.Agent.defaultMaxSockets;t.requests=[];t.sockets=[];t.on("free",function onFree(e,n,r,s){var o=toOptions(n,r,s);for(var i=0,a=t.requests.length;i<a;++i){var u=t.requests[i];if(u.host===o.host&&u.port===o.port){t.requests.splice(i,1);u.request.onSocket(e);return}}e.destroy();t.removeSocket(e)})}c.inherits(TunnelingAgent,a.EventEmitter);TunnelingAgent.prototype.addRequest=function addRequest(e,t,n,r){var s=this;var o=mergeOptions({request:e},s.options,toOptions(t,n,r));if(s.sockets.length>=this.maxSockets){s.requests.push(o);return}s.createSocket(o,function(t){t.on("free",onFree);t.on("close",onCloseOrRemove);t.on("agentRemove",onCloseOrRemove);e.onSocket(t);function onFree(){s.emit("free",t,o)}function onCloseOrRemove(e){s.removeSocket(t);t.removeListener("free",onFree);t.removeListener("close",onCloseOrRemove);t.removeListener("agentRemove",onCloseOrRemove)}})};TunnelingAgent.prototype.createSocket=function createSocket(e,t){var n=this;var r={};n.sockets.push(r);var s=mergeOptions({},n.proxyOptions,{method:"CONNECT",path:e.host+":"+e.port,agent:false,headers:{host:e.host+":"+e.port}});if(e.localAddress){s.localAddress=e.localAddress}if(s.proxyAuth){s.headers=s.headers||{};s.headers["Proxy-Authorization"]="Basic "+new Buffer(s.proxyAuth).toString("base64")}l("making CONNECT request");var o=n.request(s);o.useChunkedEncodingByDefault=false;o.once("response",onResponse);o.once("upgrade",onUpgrade);o.once("connect",onConnect);o.once("error",onError);o.end();function onResponse(e){e.upgrade=true}function onUpgrade(e,t,n){process.nextTick(function(){onConnect(e,t,n)})}function onConnect(s,i,a){o.removeAllListeners();i.removeAllListeners();if(s.statusCode!==200){l("tunneling socket could not be established, statusCode=%d",s.statusCode);i.destroy();var u=new Error("tunneling socket could not be established, "+"statusCode="+s.statusCode);u.code="ECONNRESET";e.request.emit("error",u);n.removeSocket(r);return}if(a.length>0){l("got illegal response body from proxy");i.destroy();var u=new Error("got illegal response body from proxy");u.code="ECONNRESET";e.request.emit("error",u);n.removeSocket(r);return}l("tunneling connection has established");n.sockets[n.sockets.indexOf(r)]=i;return t(i)}function onError(t){o.removeAllListeners();l("tunneling socket could not be established, cause=%s\n",t.message,t.stack);var s=new Error("tunneling socket could not be established, "+"cause="+t.message);s.code="ECONNRESET";e.request.emit("error",s);n.removeSocket(r)}};TunnelingAgent.prototype.removeSocket=function removeSocket(e){var t=this.sockets.indexOf(e);if(t===-1){return}this.sockets.splice(t,1);var n=this.requests.shift();if(n){this.createSocket(n,function(e){n.request.onSocket(e)})}};function createSecureSocket(e,t){var n=this;TunnelingAgent.prototype.createSocket.call(n,e,function(r){var o=e.request.getHeader("host");var i=mergeOptions({},n.options,{socket:r,servername:o?o.replace(/:.*$/,""):e.host});var a=s.connect(0,i);n.sockets[n.sockets.indexOf(r)]=a;t(a)})}function toOptions(e,t,n){if(typeof e==="string"){return{host:e,port:t,localAddress:n}}return e}function mergeOptions(e){for(var t=1,n=arguments.length;t<n;++t){var r=arguments[t];if(typeof r==="object"){var s=Object.keys(r);for(var o=0,i=s.length;o<i;++o){var a=s[o];if(r[a]!==undefined){e[a]=r[a]}}}}return e}var l;if(process.env.NODE_DEBUG&&/\btunnel\b/.test(process.env.NODE_DEBUG)){l=function(){var e=Array.prototype.slice.call(arguments);if(typeof e[0]==="string"){e[0]="TUNNEL: "+e[0]}else{e.unshift("TUNNEL:")}console.error.apply(console,e)}}else{l=function(){}}t.debug=l},211:function(e){e.exports=require("https")},226:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:true});class BasicCredentialHandler{constructor(e,t){this.username=e;this.password=t}prepareRequest(e){e.headers["Authorization"]="Basic "+Buffer.from(this.username+":"+this.password).toString("base64")}canHandleAuthentication(e){return false}handleAuthentication(e,t,n){return null}}t.BasicCredentialHandler=BasicCredentialHandler;class BearerCredentialHandler{constructor(e){this.token=e}prepareRequest(e){e.headers["Authorization"]="Bearer "+this.token}canHandleAuthentication(e){return false}handleAuthentication(e,t,n){return null}}t.BearerCredentialHandler=BearerCredentialHandler;class PersonalAccessTokenCredentialHandler{constructor(e){this.token=e}prepareRequest(e){e.headers["Authorization"]="Basic "+Buffer.from("PAT:"+this.token).toString("base64")}canHandleAuthentication(e){return false}handleAuthentication(e,t,n){return null}}t.PersonalAccessTokenCredentialHandler=PersonalAccessTokenCredentialHandler},357:function(e){e.exports=require("assert")},413:function(e,t,n){e.exports=n(141)},431:function(e,t,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){if(r===undefined)r=n;Object.defineProperty(e,r,{enumerable:true,get:function(){return t[n]}})}:function(e,t,n,r){if(r===undefined)r=n;e[r]=t[n]});var s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:true,value:t})}:function(e,t){e["default"]=t});var o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(n!=="default"&&Object.hasOwnProperty.call(e,n))r(t,e,n);s(t,e);return t};Object.defineProperty(t,"__esModule",{value:true});t.issue=t.issueCommand=void 0;const i=o(n(87));const a=n(82);function issueCommand(e,t,n){const r=new Command(e,t,n);process.stdout.write(r.toString()+i.EOL)}t.issueCommand=issueCommand;function issue(e,t=""){issueCommand(e,{},t)}t.issue=issue;const u="::";class Command{constructor(e,t,n){if(!e){e="missing.command"}this.command=e;this.properties=t;this.message=n}toString(){let e=u+this.command;if(this.properties&&Object.keys(this.properties).length>0){e+=" ";let t=true;for(const n in this.properties){if(this.properties.hasOwnProperty(n)){const r=this.properties[n];if(r){if(t){t=false}else{e+=","}e+=`${n}=${escapeProperty(r)}`}}}}e+=`${u}${escapeData(this.message)}`;return e}}function escapeData(e){return a.toCommandValue(e).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A")}function escapeProperty(e){return a.toCommandValue(e).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A").replace(/:/g,"%3A").replace(/,/g,"%2C")}},470:function(e,t,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){if(r===undefined)r=n;Object.defineProperty(e,r,{enumerable:true,get:function(){return t[n]}})}:function(e,t,n,r){if(r===undefined)r=n;e[r]=t[n]});var s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:true,value:t})}:function(e,t){e["default"]=t});var o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(n!=="default"&&Object.hasOwnProperty.call(e,n))r(t,e,n);s(t,e);return t};var i=this&&this.__awaiter||function(e,t,n,r){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,s){function fulfilled(e){try{step(r.next(e))}catch(e){s(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){s(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:true});t.getIDToken=t.getState=t.saveState=t.group=t.endGroup=t.startGroup=t.info=t.notice=t.warning=t.error=t.debug=t.isDebug=t.setFailed=t.setCommandEcho=t.setOutput=t.getBooleanInput=t.getMultilineInput=t.getInput=t.addPath=t.setSecret=t.exportVariable=t.ExitCode=void 0;const a=n(431);const u=n(102);const c=n(82);const l=o(n(87));const d=o(n(622));const p=n(742);var f;(function(e){e[e["Success"]=0]="Success";e[e["Failure"]=1]="Failure"})(f=t.ExitCode||(t.ExitCode={}));function exportVariable(e,t){const n=c.toCommandValue(t);process.env[e]=n;const r=process.env["GITHUB_ENV"]||"";if(r){const t="_GitHubActionsFileCommandDelimeter_";const r=`${e}<<${t}${l.EOL}${n}${l.EOL}${t}`;u.issueCommand("ENV",r)}else{a.issueCommand("set-env",{name:e},n)}}t.exportVariable=exportVariable;function setSecret(e){a.issueCommand("add-mask",{},e)}t.setSecret=setSecret;function addPath(e){const t=process.env["GITHUB_PATH"]||"";if(t){u.issueCommand("PATH",e)}else{a.issueCommand("add-path",{},e)}process.env["PATH"]=`${e}${d.delimiter}${process.env["PATH"]}`}t.addPath=addPath;function getInput(e,t){const n=process.env[`INPUT_${e.replace(/ /g,"_").toUpperCase()}`]||"";if(t&&t.required&&!n){throw new Error(`Input required and not supplied: ${e}`)}if(t&&t.trimWhitespace===false){return n}return n.trim()}t.getInput=getInput;function getMultilineInput(e,t){const n=getInput(e,t).split("\n").filter(e=>e!=="");return n}t.getMultilineInput=getMultilineInput;function getBooleanInput(e,t){const n=["true","True","TRUE"];const r=["false","False","FALSE"];const s=getInput(e,t);if(n.includes(s))return true;if(r.includes(s))return false;throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${e}\n`+`Support boolean input list: \`true | True | TRUE | false | False | FALSE\``)}t.getBooleanInput=getBooleanInput;function setOutput(e,t){process.stdout.write(l.EOL);a.issueCommand("set-output",{name:e},t)}t.setOutput=setOutput;function setCommandEcho(e){a.issue("echo",e?"on":"off")}t.setCommandEcho=setCommandEcho;function setFailed(e){process.exitCode=f.Failure;error(e)}t.setFailed=setFailed;function isDebug(){return process.env["RUNNER_DEBUG"]==="1"}t.isDebug=isDebug;function debug(e){a.issueCommand("debug",{},e)}t.debug=debug;function error(e,t={}){a.issueCommand("error",c.toCommandProperties(t),e instanceof Error?e.toString():e)}t.error=error;function warning(e,t={}){a.issueCommand("warning",c.toCommandProperties(t),e instanceof Error?e.toString():e)}t.warning=warning;function notice(e,t={}){a.issueCommand("notice",c.toCommandProperties(t),e instanceof Error?e.toString():e)}t.notice=notice;function info(e){process.stdout.write(e+l.EOL)}t.info=info;function startGroup(e){a.issue("group",e)}t.startGroup=startGroup;function endGroup(){a.issue("endgroup")}t.endGroup=endGroup;function group(e,t){return i(this,void 0,void 0,function*(){startGroup(e);let n;try{n=yield t()}finally{endGroup()}return n})}t.group=group;function saveState(e,t){a.issueCommand("save-state",{name:e},t)}t.saveState=saveState;function getState(e){return process.env[`STATE_${e}`]||""}t.getState=getState;function getIDToken(e){return i(this,void 0,void 0,function*(){return yield p.OidcClient.getIDToken(e)})}t.getIDToken=getIDToken;var h=n(548);Object.defineProperty(t,"markdownSummary",{enumerable:true,get:function(){return h.markdownSummary}})},507:function(e,t,n){const r=n(628);const s=r.XXHash32,o=r.XXHash64,i=r.XXHash3,a=r.XXHash128;e.exports={XXHash32:s,XXHash64:o,XXHash3:i,XXHash128:a}},539:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:true});const r=n(605);const s=n(211);const o=n(950);let i;var a;(function(e){e[e["OK"]=200]="OK";e[e["MultipleChoices"]=300]="MultipleChoices";e[e["MovedPermanently"]=301]="MovedPermanently";e[e["ResourceMoved"]=302]="ResourceMoved";e[e["SeeOther"]=303]="SeeOther";e[e["NotModified"]=304]="NotModified";e[e["UseProxy"]=305]="UseProxy";e[e["SwitchProxy"]=306]="SwitchProxy";e[e["TemporaryRedirect"]=307]="TemporaryRedirect";e[e["PermanentRedirect"]=308]="PermanentRedirect";e[e["BadRequest"]=400]="BadRequest";e[e["Unauthorized"]=401]="Unauthorized";e[e["PaymentRequired"]=402]="PaymentRequired";e[e["Forbidden"]=403]="Forbidden";e[e["NotFound"]=404]="NotFound";e[e["MethodNotAllowed"]=405]="MethodNotAllowed";e[e["NotAcceptable"]=406]="NotAcceptable";e[e["ProxyAuthenticationRequired"]=407]="ProxyAuthenticationRequired";e[e["RequestTimeout"]=408]="RequestTimeout";e[e["Conflict"]=409]="Conflict";e[e["Gone"]=410]="Gone";e[e["TooManyRequests"]=429]="TooManyRequests";e[e["InternalServerError"]=500]="InternalServerError";e[e["NotImplemented"]=501]="NotImplemented";e[e["BadGateway"]=502]="BadGateway";e[e["ServiceUnavailable"]=503]="ServiceUnavailable";e[e["GatewayTimeout"]=504]="GatewayTimeout"})(a=t.HttpCodes||(t.HttpCodes={}));var u;(function(e){e["Accept"]="accept";e["ContentType"]="content-type"})(u=t.Headers||(t.Headers={}));var c;(function(e){e["ApplicationJson"]="application/json"})(c=t.MediaTypes||(t.MediaTypes={}));function getProxyUrl(e){let t=o.getProxyUrl(new URL(e));return t?t.href:""}t.getProxyUrl=getProxyUrl;const l=[a.MovedPermanently,a.ResourceMoved,a.SeeOther,a.TemporaryRedirect,a.PermanentRedirect];const d=[a.BadGateway,a.ServiceUnavailable,a.GatewayTimeout];const p=["OPTIONS","GET","DELETE","HEAD"];const f=10;const h=5;class HttpClientError extends Error{constructor(e,t){super(e);this.name="HttpClientError";this.statusCode=t;Object.setPrototypeOf(this,HttpClientError.prototype)}}t.HttpClientError=HttpClientError;class HttpClientResponse{constructor(e){this.message=e}readBody(){return new Promise(async(e,t)=>{let n=Buffer.alloc(0);this.message.on("data",e=>{n=Buffer.concat([n,e])});this.message.on("end",()=>{e(n.toString())})})}}t.HttpClientResponse=HttpClientResponse;function isHttps(e){let t=new URL(e);return t.protocol==="https:"}t.isHttps=isHttps;class HttpClient{constructor(e,t,n){this._ignoreSslError=false;this._allowRedirects=true;this._allowRedirectDowngrade=false;this._maxRedirects=50;this._allowRetries=false;this._maxRetries=1;this._keepAlive=false;this._disposed=false;this.userAgent=e;this.handlers=t||[];this.requestOptions=n;if(n){if(n.ignoreSslError!=null){this._ignoreSslError=n.ignoreSslError}this._socketTimeout=n.socketTimeout;if(n.allowRedirects!=null){this._allowRedirects=n.allowRedirects}if(n.allowRedirectDowngrade!=null){this._allowRedirectDowngrade=n.allowRedirectDowngrade}if(n.maxRedirects!=null){this._maxRedirects=Math.max(n.maxRedirects,0)}if(n.keepAlive!=null){this._keepAlive=n.keepAlive}if(n.allowRetries!=null){this._allowRetries=n.allowRetries}if(n.maxRetries!=null){this._maxRetries=n.maxRetries}}}options(e,t){return this.request("OPTIONS",e,null,t||{})}get(e,t){return this.request("GET",e,null,t||{})}del(e,t){return this.request("DELETE",e,null,t||{})}post(e,t,n){return this.request("POST",e,t,n||{})}patch(e,t,n){return this.request("PATCH",e,t,n||{})}put(e,t,n){return this.request("PUT",e,t,n||{})}head(e,t){return this.request("HEAD",e,null,t||{})}sendStream(e,t,n,r){return this.request(e,t,n,r)}async getJson(e,t={}){t[u.Accept]=this._getExistingOrDefaultHeader(t,u.Accept,c.ApplicationJson);let n=await this.get(e,t);return this._processResponse(n,this.requestOptions)}async postJson(e,t,n={}){let r=JSON.stringify(t,null,2);n[u.Accept]=this._getExistingOrDefaultHeader(n,u.Accept,c.ApplicationJson);n[u.ContentType]=this._getExistingOrDefaultHeader(n,u.ContentType,c.ApplicationJson);let s=await this.post(e,r,n);return this._processResponse(s,this.requestOptions)}async putJson(e,t,n={}){let r=JSON.stringify(t,null,2);n[u.Accept]=this._getExistingOrDefaultHeader(n,u.Accept,c.ApplicationJson);n[u.ContentType]=this._getExistingOrDefaultHeader(n,u.ContentType,c.ApplicationJson);let s=await this.put(e,r,n);return this._processResponse(s,this.requestOptions)}async patchJson(e,t,n={}){let r=JSON.stringify(t,null,2);n[u.Accept]=this._getExistingOrDefaultHeader(n,u.Accept,c.ApplicationJson);n[u.ContentType]=this._getExistingOrDefaultHeader(n,u.ContentType,c.ApplicationJson);let s=await this.patch(e,r,n);return this._processResponse(s,this.requestOptions)}async request(e,t,n,r){if(this._disposed){throw new Error("Client has already been disposed.")}let s=new URL(t);let o=this._prepareRequest(e,s,r);let i=this._allowRetries&&p.indexOf(e)!=-1?this._maxRetries+1:1;let u=0;let c;while(u<i){c=await this.requestRaw(o,n);if(c&&c.message&&c.message.statusCode===a.Unauthorized){let e;for(let t=0;t<this.handlers.length;t++){if(this.handlers[t].canHandleAuthentication(c)){e=this.handlers[t];break}}if(e){return e.handleAuthentication(this,o,n)}else{return c}}let t=this._maxRedirects;while(l.indexOf(c.message.statusCode)!=-1&&this._allowRedirects&&t>0){const i=c.message.headers["location"];if(!i){break}let a=new URL(i);if(s.protocol=="https:"&&s.protocol!=a.protocol&&!this._allowRedirectDowngrade){throw new Error("Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.")}await c.readBody();if(a.hostname!==s.hostname){for(let e in r){if(e.toLowerCase()==="authorization"){delete r[e]}}}o=this._prepareRequest(e,a,r);c=await this.requestRaw(o,n);t--}if(d.indexOf(c.message.statusCode)==-1){return c}u+=1;if(u<i){await c.readBody();await this._performExponentialBackoff(u)}}return c}dispose(){if(this._agent){this._agent.destroy()}this._disposed=true}requestRaw(e,t){return new Promise((n,r)=>{let s=function(e,t){if(e){r(e)}n(t)};this.requestRawWithCallback(e,t,s)})}requestRawWithCallback(e,t,n){let r;if(typeof t==="string"){e.options.headers["Content-Length"]=Buffer.byteLength(t,"utf8")}let s=false;let o=(e,t)=>{if(!s){s=true;n(e,t)}};let i=e.httpModule.request(e.options,e=>{let t=new HttpClientResponse(e);o(null,t)});i.on("socket",e=>{r=e});i.setTimeout(this._socketTimeout||3*6e4,()=>{if(r){r.end()}o(new Error("Request timeout: "+e.options.path),null)});i.on("error",function(e){o(e,null)});if(t&&typeof t==="string"){i.write(t,"utf8")}if(t&&typeof t!=="string"){t.on("close",function(){i.end()});t.pipe(i)}else{i.end()}}getAgent(e){let t=new URL(e);return this._getAgent(t)}_prepareRequest(e,t,n){const o={};o.parsedUrl=t;const i=o.parsedUrl.protocol==="https:";o.httpModule=i?s:r;const a=i?443:80;o.options={};o.options.host=o.parsedUrl.hostname;o.options.port=o.parsedUrl.port?parseInt(o.parsedUrl.port):a;o.options.path=(o.parsedUrl.pathname||"")+(o.parsedUrl.search||"");o.options.method=e;o.options.headers=this._mergeHeaders(n);if(this.userAgent!=null){o.options.headers["user-agent"]=this.userAgent}o.options.agent=this._getAgent(o.parsedUrl);if(this.handlers){this.handlers.forEach(e=>{e.prepareRequest(o.options)})}return o}_mergeHeaders(e){const t=e=>Object.keys(e).reduce((t,n)=>(t[n.toLowerCase()]=e[n],t),{});if(this.requestOptions&&this.requestOptions.headers){return Object.assign({},t(this.requestOptions.headers),t(e))}return t(e||{})}_getExistingOrDefaultHeader(e,t,n){const r=e=>Object.keys(e).reduce((t,n)=>(t[n.toLowerCase()]=e[n],t),{});let s;if(this.requestOptions&&this.requestOptions.headers){s=r(this.requestOptions.headers)[t]}return e[t]||s||n}_getAgent(e){let t;let a=o.getProxyUrl(e);let u=a&&a.hostname;if(this._keepAlive&&u){t=this._proxyAgent}if(this._keepAlive&&!u){t=this._agent}if(!!t){return t}const c=e.protocol==="https:";let l=100;if(!!this.requestOptions){l=this.requestOptions.maxSockets||r.globalAgent.maxSockets}if(u){if(!i){i=n(413)}const e={maxSockets:l,keepAlive:this._keepAlive,proxy:{...(a.username||a.password)&&{proxyAuth:`${a.username}:${a.password}`},host:a.hostname,port:a.port}};let r;const s=a.protocol==="https:";if(c){r=s?i.httpsOverHttps:i.httpsOverHttp}else{r=s?i.httpOverHttps:i.httpOverHttp}t=r(e);this._proxyAgent=t}if(this._keepAlive&&!t){const e={keepAlive:this._keepAlive,maxSockets:l};t=c?new s.Agent(e):new r.Agent(e);this._agent=t}if(!t){t=c?s.globalAgent:r.globalAgent}if(c&&this._ignoreSslError){t.options=Object.assign(t.options||{},{rejectUnauthorized:false})}return t}_performExponentialBackoff(e){e=Math.min(f,e);const t=h*Math.pow(2,e);return new Promise(e=>setTimeout(()=>e(),t))}static dateTimeDeserializer(e,t){if(typeof t==="string"){let e=new Date(t);if(!isNaN(e.valueOf())){return e}}return t}async _processResponse(e,t){return new Promise(async(n,r)=>{const s=e.message.statusCode;const o={statusCode:s,result:null,headers:{}};if(s==a.NotFound){n(o)}let i;let u;try{u=await e.readBody();if(u&&u.length>0){if(t&&t.deserializeDates){i=JSON.parse(u,HttpClient.dateTimeDeserializer)}else{i=JSON.parse(u)}o.result=i}o.headers=e.message.headers}catch(e){}if(s>299){let e;if(i&&i.message){e=i.message}else if(u&&u.length>0){e=u}else{e="Failed request: ("+s+")"}let t=new HttpClientError(e,s);t.result=o.result;r(t)}else{n(o)}})}}t.HttpClient=HttpClient},548:function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,s){function fulfilled(e){try{step(r.next(e))}catch(e){s(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){s(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:true});t.markdownSummary=t.SUMMARY_DOCS_URL=t.SUMMARY_ENV_VAR=void 0;const s=n(87);const o=n(747);const{access:i,appendFile:a,writeFile:u}=o.promises;t.SUMMARY_ENV_VAR="GITHUB_STEP_SUMMARY";t.SUMMARY_DOCS_URL="https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-markdown-summary";class MarkdownSummary{constructor(){this._buffer=""}filePath(){return r(this,void 0,void 0,function*(){if(this._filePath){return this._filePath}const e=process.env[t.SUMMARY_ENV_VAR];if(!e){throw new Error(`Unable to find environment variable for $${t.SUMMARY_ENV_VAR}. Check if your runtime environment supports markdown summaries.`)}try{yield i(e,o.constants.R_OK|o.constants.W_OK)}catch(t){throw new Error(`Unable to access summary file: '${e}'. Check if the file has correct read/write permissions.`)}this._filePath=e;return this._filePath})}wrap(e,t,n={}){const r=Object.entries(n).map(([e,t])=>` ${e}="${t}"`).join("");if(!t){return`<${e}${r}>`}return`<${e}${r}>${t}</${e}>`}write(e){return r(this,void 0,void 0,function*(){const t=!!(e===null||e===void 0?void 0:e.overwrite);const n=yield this.filePath();const r=t?u:a;yield r(n,this._buffer,{encoding:"utf8"});return this.emptyBuffer()})}clear(){return r(this,void 0,void 0,function*(){return this.emptyBuffer().write({overwrite:true})})}stringify(){return this._buffer}isEmptyBuffer(){return this._buffer.length===0}emptyBuffer(){this._buffer="";return this}addRaw(e,t=false){this._buffer+=e;return t?this.addEOL():this}addEOL(){return this.addRaw(s.EOL)}addCodeBlock(e,t){const n=Object.assign({},t&&{lang:t});const r=this.wrap("pre",this.wrap("code",e),n);return this.addRaw(r).addEOL()}addList(e,t=false){const n=t?"ol":"ul";const r=e.map(e=>this.wrap("li",e)).join("");const s=this.wrap(n,r);return this.addRaw(s).addEOL()}addTable(e){const t=e.map(e=>{const t=e.map(e=>{if(typeof e==="string"){return this.wrap("td",e)}const{header:t,data:n,colspan:r,rowspan:s}=e;const o=t?"th":"td";const i=Object.assign(Object.assign({},r&&{colspan:r}),s&&{rowspan:s});return this.wrap(o,n,i)}).join("");return this.wrap("tr",t)}).join("");const n=this.wrap("table",t);return this.addRaw(n).addEOL()}addDetails(e,t){const n=this.wrap("details",this.wrap("summary",e)+t);return this.addRaw(n).addEOL()}addImage(e,t,n){const{width:r,height:s}=n||{};const o=Object.assign(Object.assign({},r&&{width:r}),s&&{height:s});const i=this.wrap("img",null,Object.assign({src:e,alt:t},o));return this.addRaw(i).addEOL()}addHeading(e,t){const n=`h${t}`;const r=["h1","h2","h3","h4","h5","h6"].includes(n)?n:"h1";const s=this.wrap(r,e);return this.addRaw(s).addEOL()}addSeparator(){const e=this.wrap("hr",null);return this.addRaw(e).addEOL()}addBreak(){const e=this.wrap("br",null);return this.addRaw(e).addEOL()}addQuote(e,t){const n=Object.assign({},t&&{cite:t});const r=this.wrap("blockquote",e,n);return this.addRaw(r).addEOL()}addLink(e,t){const n=this.wrap("a",e,{href:t});return this.addRaw(n).addEOL()}}t.markdownSummary=new MarkdownSummary},605:function(e){e.exports=require("http")},614:function(e){e.exports=require("events")},622:function(e){e.exports=require("path")},628:function(e,t,n){e.exports=require(n.ab+"build/Release/addon.node")},631:function(e){e.exports=require("net")},669:function(e){e.exports=require("util")},676:function(e,t,n){const r=n(470);const s=n(747);const o=n(622);const{XXHash64:i,XXHash128:a}=n(507);const{name:u}=n(731);function getXxh128(e){const t=new i;t.update(Buffer.from(e));const n=new a(t.digest());return n}function generateMetaFile(e,t,n=false){let r=`fileFormatVersion: 2\nguid: {${t.toString("hex")}}`;if(n){r=`${r}\nfolderAsset: yes\nDefaultImporter:\n  externalObjects: {}\n  userData:\n  assetBundleName:\n  assetBundleVariant: `}else{const t=o.extname(e);switch(t){case".json":if(e.endsWith("package.json")){r=`${r}\nPackageManifestImporter:\n  externalObjects: {}\n  userData:\n  assetBundleName:\n  assetBundleVariant: `}else{r=`${r}\ntimeCreated: ${Math.round(Date.now()/1e3)}`}break;case".cs":r=`${r}\nMonoImporter:\n  externalObjects: {}\n  serializedVersion: 2\n  defaultReferences: []\n  executionOrder: 0\n  icon: {instanceID: 0}\n  userData:\n  assetBundleName:\n  assetBundleVariant: `;break;case".dll":r=`${r}\nPluginImporter:\n  externalObjects: {}\n  serializedVersion: 2\n  iconMap: {}\n  executionOrder: {}\n  defineConstraints: []\n  isPreloaded: 0\n  isOverridable: 1\n  isExplicitlyReferenced: 0\n  validateReferences: 1\n  platformData:\n  - first:\n      Any:\n    second:\n      enabled: 1\n      settings: {}\n  - first:\n      Editor: Editor\n    second:\n      enabled: 0\n      settings:\n        DefaultValueInitialized: true\n  - first:\n      Windows Store Apps: WindowsStoreApps\n    second:\n      enabled: 0\n      settings:\n        CPU: AnyCPU\n  userData:\n  assetBundleName:\n  assetBundleVariant:\n`;break;default:r=`${r}\ntimeCreated: ${Math.round(Date.now()/1e3)}`;break}}s.writeFile(`${e}.meta`,r,e=>{if(e){throw e}})}function processFile(e,t){if(s.existsSync(e)&&!e.endsWith(".meta")&&s.existsSync(`${e}.meta`)){t.update(Buffer.from(e));const n=t.digest();t.reset();generateMetaFile(e,n)}}function processDirectory(e,t){t.update(Buffer.from(e));const n=t.digest();t.reset();generateMetaFile(e,n,true)}function walkTree(e){const t=r.getInput("seed")||u;const n=getXxh128(t);const i=s.readdirSync(e);i.forEach(t=>{const r=o.join(e,t);const i=s.statSync(r);if(i.isFile()){processFile(r,n)}else if(i.isDirectory()){processDirectory(r,n);walkTree(r)}})}function main(){const e=r.getInput("directory")||"./";walkTree(e)}try{main()}catch(e){r.setFailed(e.message)}},731:function(e){e.exports={name:"metagen-gha",version:"0.0.1",description:"Github action generating meta files for Unity using JS.",main:"action/index.js",files:["action/**"],scripts:{lint:"eslint --ext .js,.ts src",build:"ncc build src --out action --minify",prepare:"husky install"},keywords:["unity","meta"],author:"Tomáš Starý",license:"MIT",dependencies:{"@actions/core":"^1.6.0","@actions/github":"^5.0.0",glob:"^7.2.0","xxhash-addon":"^1.4.0"},devDependencies:{"@babel/cli":"^7.17.6","@babel/core":"^7.17.9","@babel/eslint-parser":"^7.17.0","@babel/preset-env":"^7.16.11","@zeit/ncc":"^0.22.3","babel-eslint":"^10.1.0",eslint:"^8.14.0","eslint-config-airbnb-base":"^15.0.0","eslint-config-prettier":"^8.5.0","eslint-plugin-import":"^2.26.0",husky:"^7.0.4","lodash-es":"^4.17.21",prettier:"^2.6.2"}}},742:function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,s){function fulfilled(e){try{step(r.next(e))}catch(e){s(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){s(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:true});t.OidcClient=void 0;const s=n(539);const o=n(226);const i=n(470);class OidcClient{static createHttpClient(e=true,t=10){const n={allowRetries:e,maxRetries:t};return new s.HttpClient("actions/oidc-client",[new o.BearerCredentialHandler(OidcClient.getRequestToken())],n)}static getRequestToken(){const e=process.env["ACTIONS_ID_TOKEN_REQUEST_TOKEN"];if(!e){throw new Error("Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable")}return e}static getIDTokenUrl(){const e=process.env["ACTIONS_ID_TOKEN_REQUEST_URL"];if(!e){throw new Error("Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable")}return e}static getCall(e){var t;return r(this,void 0,void 0,function*(){const n=OidcClient.createHttpClient();const r=yield n.getJson(e).catch(e=>{throw new Error(`Failed to get ID Token. \n \n        Error Code : ${e.statusCode}\n \n        Error Message: ${e.result.message}`)});const s=(t=r.result)===null||t===void 0?void 0:t.value;if(!s){throw new Error("Response json body do not have ID Token field")}return s})}static getIDToken(e){return r(this,void 0,void 0,function*(){try{let t=OidcClient.getIDTokenUrl();if(e){const n=encodeURIComponent(e);t=`${t}&audience=${n}`}i.debug(`ID token url is ${t}`);const n=yield OidcClient.getCall(t);i.setSecret(n);return n}catch(e){throw new Error(`Error message: ${e.message}`)}})}}t.OidcClient=OidcClient},747:function(e){e.exports=require("fs")},950:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:true});function getProxyUrl(e){let t=e.protocol==="https:";let n;if(checkBypass(e)){return n}let r;if(t){r=process.env["https_proxy"]||process.env["HTTPS_PROXY"]}else{r=process.env["http_proxy"]||process.env["HTTP_PROXY"]}if(r){n=new URL(r)}return n}t.getProxyUrl=getProxyUrl;function checkBypass(e){if(!e.hostname){return false}let t=process.env["no_proxy"]||process.env["NO_PROXY"]||"";if(!t){return false}let n;if(e.port){n=Number(e.port)}else if(e.protocol==="http:"){n=80}else if(e.protocol==="https:"){n=443}let r=[e.hostname.toUpperCase()];if(typeof n==="number"){r.push(`${r[0]}:${n}`)}for(let e of t.split(",").map(e=>e.trim().toUpperCase()).filter(e=>e)){if(r.some(t=>t===e)){return true}}return false}t.checkBypass=checkBypass}});