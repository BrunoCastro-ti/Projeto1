const WHATS='5531981016195'; // troque pelo número real (55 + DDD + número)
const V=[
{id:1,m:'Volvo',n:'FH 540 6x4',t:'Cavalo mecânico',a:2023,km:78420,cv:540,p:789900,tag:'Destaque',img:'img/volvo-fh540.jpg'},
{id:2,m:'Scania',n:'R 450 6x2',t:'Cavalo mecânico',a:2022,km:132000,cv:450,p:649900,tag:'Revisado',img:'img/scania-r450.jpg'},
{id:3,m:'Mercedes-Benz',n:'Actros 2651',t:'Cavalo mecânico',a:2021,km:189700,cv:510,p:579900,tag:'Único dono',img:'img/actros-2651.jpg'},
{id:4,m:'DAF',n:'XF 530 6x4',t:'Cavalo mecânico',a:2022,km:98300,cv:530,p:699900,tag:'Baixa km',img:'img/daf-xf530.jpg'},
{id:5,m:'Volkswagen',n:'Constellation 24.280',t:'Truck',a:2020,km:214000,cv:280,p:389900,tag:'Pronta entrega',img:'img/constellation.jpg'},
{id:6,m:'Iveco',n:'S-Way 480',t:'Cavalo mecânico',a:2023,km:62800,cv:480,p:729900,tag:'Garantia',img:'img/iveco-sway.jpg'}];
const $=s=>document.querySelector(s),brl=n=>'R$ '+n.toLocaleString('pt-BR'),num=n=>n.toLocaleString('pt-BR');
const wa=t=>`https://wa.me/${WHATS}?text=${encodeURIComponent(t)}`;
let favs=[];try{favs=JSON.parse(localStorage.getItem('favs')||'[]')}catch(e){}
const saveFavs=()=>{try{localStorage.setItem('favs',JSON.stringify(favs))}catch(e){}};
const pic=(v,c='')=>`<img src="${v.img}" alt="${v.m} ${v.n}" onerror="this.remove()" ${c}>`;
document.querySelectorAll('[data-wa]').forEach(a=>a.href=wa('Olá! Vim pelo site da Rota Trucks e gostaria de falar com um consultor.'));
const bg=$('.burger');if(bg)bg.onclick=()=>$('nav').classList.toggle('open');
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>$('nav').classList.remove('open')));
/* ESTOQUE */
const grid=$('#grid');
if(grid){
 const mk=$('#fMarca');[...new Set(V.map(v=>v.m))].forEach(m=>mk.add(new Option(m,m)));
 const render=()=>{
  const q=$('#fBusca').value.toLowerCase(),m=mk.value,mx=+$('#fPreco').value||1e12,o=$('#fOrd').value;
  let l=V.filter(v=>(!m||v.m===m)&&v.p<=mx&&(v.m+' '+v.n).toLowerCase().includes(q));
  l.sort((a,b)=>o==='p1'?a.p-b.p:o==='p2'?b.p-a.p:o==='km'?a.km-b.km:o==='ano'?b.a-a.a:a.id-b.id);
  $('#count').textContent=l.length+' veículos encontrados';
  grid.innerHTML=l.map(v=>`<article class="card"><div class="ph"><span class="tag">${v.tag}</span><button class="fav ${favs.includes(v.id)?'on':''}" data-id="${v.id}" aria-label="Favoritar">${favs.includes(v.id)?'♥':'♡'}</button><a href="veiculo.html?id=${v.id}">${pic(v)}</a></div>
  <div class="cb"><div class="brand">${v.m}</div><h3>${v.n}</h3><div class="ty">${v.t}</div>
  <div class="sp"><div>${v.a}<small>Ano</small></div><div>${num(v.km)} km<small>Quilometragem</small></div><div>${v.cv} cv<small>Potência</small></div></div>
  <div class="pr"><div><small>A partir de</small><b>${brl(v.p)}</b></div><a class="go" href="veiculo.html?id=${v.id}" aria-label="Ver detalhes">→</a></div></div></article>`).join('')||'<p class="empty">Nenhum veículo encontrado. Ajuste os filtros.</p>';
 };
 grid.onclick=e=>{const b=e.target.closest('.fav');if(!b)return;const id=+b.dataset.id;favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];saveFavs();render()};
 ['fBusca','fMarca','fPreco','fOrd'].forEach(i=>$('#'+i).addEventListener('input',render));
 $('#maisFiltros').onclick=()=>$('#filters').classList.toggle('open');
 $('#verTodos').onclick=e=>{e.preventDefault();$('#fBusca').value='';mk.value='';$('#fPreco').value='';$('#filters').classList.add('open');render();$('#estoque').scrollIntoView()};
 render();
 /* simulador */
 const sim=()=>{const v=+$('#sVal').value,e=+$('#sEnt').value||0,n=+$('#sPar').value,i=0.0149,pv=Math.max(v-e,0);
  $('#sRes').textContent=pv?brl(Math.round(pv*i/(1-Math.pow(1+i,-n))))+' /mês':'—'};
 V.forEach(v=>$('#sVal').add(new Option(`${v.m} ${v.n} — ${brl(v.p)}`,v.p)));
 ['sVal','sEnt','sPar'].forEach(i=>$('#'+i).addEventListener('input',sim));sim();
 $('#sGo').onclick=e=>{e.currentTarget.href=wa(`Olá! Simulei o financiamento de ${$('#sVal').selectedOptions[0].text}, entrada ${brl(+$('#sEnt').value||0)}, em ${$('#sPar').value}x (${$('#sRes').textContent}). Gostaria de uma análise.`)};
 /* contadores */
 const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;io.unobserve(en.target);
  const t=parseFloat(en.target.dataset.n),d=en.target.dataset.d==='1';let s=null;
  const f=ts=>{s=s||ts;const p=Math.min((ts-s)/1200,1),x=t*p;en.target.textContent=(d?x.toFixed(1).replace('.',','):Math.round(x))+(en.target.dataset.s||'');if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}),{threshold:.6});
 document.querySelectorAll('[data-n]').forEach(e=>io.observe(e));
 /* menu ativo */
 const links=[...document.querySelectorAll('nav a[href^="#"]')];
 addEventListener('scroll',()=>{let c='';links.forEach(a=>{const s=$(a.getAttribute('href'));if(s&&s.getBoundingClientRect().top<140)c=a.getAttribute('href')});links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')===c))});
}
/* DETALHE */
const det=$('#det');
if(det){
 const v=V.find(x=>x.id===+new URLSearchParams(location.search).get('id'))||V[0];
 document.title=`${v.m} ${v.n} | Rota Trucks`;
 det.innerHTML=`<div><div class="main"><span class="tag">${v.tag}</span>${pic(v,'id="big"')}</div>
 <div class="th">${[0,1,2].map(i=>`<button class="${i?'':'on'}" aria-label="Foto ${i+1}">${pic(v)}</button>`).join('')}<div class="insp">✔ Veículo inspecionado<small>Laudo cautelar aprovado</small></div></div></div>
 <aside class="info"><div class="brand">${v.m}</div><h1>${v.n}</h1><div class="ty" style="font-size:13px;color:var(--mu)">${v.t} · Disponível em Contagem, MG</div>
 <div class="sp"><div>${v.a}<small>Ano</small></div><div>${num(v.km)} km<small>Quilometragem</small></div><div>${v.cv} cv<small>Potência</small></div></div>
 <small style="font-size:10px;letter-spacing:.1em;color:var(--mu)">PREÇO DO VEÍCULO</small><div class="big">${brl(v.p)}</div><small style="color:var(--mu);font-size:11px">Financiamento sujeito a análise de crédito</small>
 <a class="btn wa" href="${wa(`Olá! Tenho interesse no ${v.m} ${v.n} ${v.a} (${brl(v.p)}).`)}" target="_blank" rel="noopener">Negociar com o vendedor</a>
 <div style="text-align:center;font-size:13px">Prefere ligar? <a href="tel:+5531981016195"><b>(31) 98101-6195</b></a></div>
 <div class="seller"><i>RM</i><div><b>Ricardo Martins</b><br><small style="color:var(--mu)">Consultor de vendas · Online agora</small></div></div></aside>`;
 $('.bc b').textContent=`${v.m} ${v.n}`;
 const big=$('#big');document.querySelectorAll('.th button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.th button').forEach(x=>x.classList.remove('on'));b.classList.add('on');const im=b.querySelector('img');if(big&&im)big.src=im.src});
}