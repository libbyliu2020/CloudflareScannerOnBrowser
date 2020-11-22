var respondTimeout=10000,speedTimeout=10000;
function time(){
    return window.performance.now();
    // return new Date().getTime();
}
function tcping(url,ready,onload){
    var st=time();
    var http=new XMLHttpRequest();
    http.open("GET",url,true);
    http.onreadystatechange=()=>{
        if(http.readyState==2&&ready!=null)ready(time()-st),ready=null;
        else if(http.readyState==4&&ready!=null)ready(-1);
    }
    http.onload=()=>{
        var resp=http.responseText,res={};
        for(var i of resp.split('\n')){
            var t=i.split('=');
            res[t[0]]=t[1];
        }
        onload(res);
    }
    http.timeout=respondTimeout
    http.send(null)
}
function speedtest(url,Host,callBack,ProgressCallback){
    var st=time();
    var http=new XMLHttpRequest();
    http.open("GET",url,true);
    http.setRequestHeader('Host',Host);
    http.onreadystatechange=()=>{
        /*
        cut the initialization time can be more accurate (or the speed will show a state of slow climbing)
        but meeting dash 
        if(http.readyState==2)st=time();
        */
    }
    http.loadr=0;
    http.onloadend=(e)=>{
        var rbytes=(e.loaded==0)?http.loadr:e.loaded // In Firefox, error or timeout will always return 0
        callBack(rbytes,time()-st);
    }
    http.onprogress=(e)=>{
        var rbytes=e.loaded;
        http.loadr=rbytes
        var ms=time()-st;
        if(ms>100) // fix first jump
            ProgressCallback(rbytes,ms);
    }
    http.timeout=speedTimeout;
    http.send();
}
async function getIPs(){
    return await fetch('./ips.csv').then(res=>res.text()).then(res=>res.split('\n'));
}
// speedtest('./test.AppImage',
//     (rbytes,ms)=>{
//         console.log('done!',(rbytes/1.024/ms).toFixed(1)+'KB/s');
//     },
//     (rbytes,ms)=>{
//         console.log('downloading... ',rbytes,ms,(rbytes/1.024/ms).toFixed(1)+'KB/s')
//     }
// )