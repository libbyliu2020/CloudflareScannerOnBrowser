var sizes=[1048576,10485760,104857600];// 1M,10M,100M
var List=document.getElementById('ipList'),nodes=[];
function show(){
    List.innerHTML='';
    for(var node of nodes){
        var tr=document.createElement('tr');
        var a=document.createElement('td'),b=document.createElement('td'),c=document.createElement('td'),d=document.createElement('td');
        a.innerText=node.ip;
        b.innerText=node.colo;
        if(node.respondTime)c.innerText=~node.respondTime?node.respondTime.toFixed(2)+'ms':'timeout';
        d.innerText=node.downloadSpeed;
        tr.append(a,b,c,d);
        List.append(tr);
    }
    mdui.mutation();
    mdui.updateTables();
}
function rand(n){
    return Math.random()*n;
}
function pingSelect(all=0){
    nodes.forEach((node,i)=>{
        if(all||List.children[i].classList.contains('mdui-table-row-selected')){
            tcping(`http://${node.ip}/cdn-cgi/trace?${rand(1000)}`,(ms)=>{
                node.respondTime=ms;
                List.children[i].children[3].innerText=
                    ~ms?ms.toFixed(2)+'ms':'timeout';
            },({colo})=>{
                node.colo=colo;
                List.children[i].children[2].innerText=colo
            });
        }
    });
}

function sortByRespondTime(){
    nodes.sort((x,y)=>{
        if(x.respondTime==null||x.respondTime==-1)return 1;
        else if(x.respondTime>y.respondTime)return 1;
        else if(x.respondTime==y.respondTime)return 0;
        else return -1;
    });
    show();
}

function speedtestSelect(){
    nodes.forEach((node,i)=>{
        if(all||List.children[i].classList.contains('mdui-table-row-selected')){
            speedtest(``,(rbytes,ms)=>{

            },(rbytes,ms)=>{

            });
            tcping(`//${node.ip}/cdn-cgi/trace?${rand(1000)}`,(ms)=>{
                node.respondTime=ms;
                List.children[i].children[3].innerText=
                    ~ms?ms.toFixed(2)+'ms':'timeout';
            },({colo})=>{
                node.colo=colo;
                List.children[i].children[2].innerText=colo
            });
        }
    });
}
getIPs().then(data=>{
    data.forEach((ip,i)=>{nodes[i]={ip,colo:null,respondTime:null,downloadSpeed:null}});
    show();
    pingSelect(1);
})

speedtest(`https://speed.cloudflare.com/__down?bytes=100000000`,'speed.cloudflare.com',(rbytes,ms)=>{
    console.log(rbytes,ms,(rbytes/ms/1.024).toFixed(1)+'KB/s');
},(rbytes,ms)=>{
    console.log(rbytes,ms,(rbytes/ms/1.024).toFixed(1)+'KB/s');
});