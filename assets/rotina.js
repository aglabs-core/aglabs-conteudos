document.querySelectorAll('[data-copy]').forEach(function(b){
  b.addEventListener('click', function(){
    Promise.resolve().then(function(){ return navigator.clipboard.writeText(b.closest('.box').querySelector('pre').innerText); }).then(function(){
      b.textContent = 'copiado'; b.classList.add('ok');
      setTimeout(function(){ b.textContent = 'copiar'; b.classList.remove('ok'); }, 1600);
    }).catch(function(){ b.textContent = 'Selecione o texto para copiar'; });
  });
});

var SUPABASE_URL = 'https://meunnuxoojhbuddcskgm.supabase.co';
var SUPABASE_KEY = 'sb_publishable_N1GXD6QXEQiZ5eVQKv7rLA_RXP3QX1q';
var ORIGEM = 'rotina';
var LINK_PACOTE = 'https://drive.google.com/drive/folders/1GlxkbosfeyfKVKfDXLjUS2IiahDJEGG8?usp=drive_link';

var ov = document.getElementById('ov'), f = document.getElementById('f'),
    msg = document.getElementById('msg');

var focoAnterior;
function abre(){ focoAnterior = document.activeElement; ov.classList.add('on'); document.body.style.overflow = 'hidden';
  setTimeout(function(){ (f.style.display === 'none' ? document.getElementById('dl') : document.getElementById('nome')).focus(); }, 40); }
function fecha(){ ov.classList.remove('on'); document.body.style.overflow = ''; if (focoAnterior) focoAnterior.focus(); }

document.getElementById('abrir').addEventListener('click', abre);
// aglabs.ia.br/conteudos/rotina#pacote abre o formulario direto (link do direct)
if (location.hash === '#pacote') abre();
document.getElementById('fechar').addEventListener('click', fecha);
ov.addEventListener('click', function(e){ if (e.target === ov) fecha(); });
document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && ov.classList.contains('on')) fecha(); });

function normalizaZap(v){
  var d = (v || '').replace(/\D/g, '');
  if (d.length === 10 || d.length === 11) return '55' + d;
  if (d.length === 12 || d.length === 13) return d;
  return null;
}
function erro(t){ msg.className = 'msg err'; msg.textContent = t; }

f.addEventListener('submit', function(e){
  e.preventDefault();
  var nome = document.getElementById('nome').value.trim();
  var zap  = normalizaZap(document.getElementById('zap').value);

  if (nome.length < 2) return erro('Escreva o seu nome.');
  if (!zap) return erro('WhatsApp inválido. DDD + número.');
  if (!document.getElementById('ok').checked) return erro('Marque a autorização.');

  var btn = f.querySelector('button[type=submit]');
  btn.disabled = true; btn.textContent = 'Enviando...';
  msg.className = 'msg'; msg.textContent = '';

  fetch(SUPABASE_URL + '/rest/v1/leads_conteudo', {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY,
               'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: nome, whatsapp: zap, origem: ORIGEM,
      consentimento: true, user_agent: navigator.userAgent.slice(0, 300) })
  }).then(function(r){
    // 409 = ja cadastrado neste material. Para a pessoa, e sucesso.
    if (!r.ok && r.status !== 409) throw new Error(r.status);
    document.getElementById('dl').href = LINK_PACOTE;
    f.style.display = 'none';
    document.getElementById('done').classList.add('on');
    document.getElementById('dl').focus();
  }).catch(function(){
    btn.disabled = false; btn.textContent = 'Enviar';
    erro('Não consegui registrar agora. Tenta de novo.');
  });
});

ov.addEventListener('keydown', function(e){
  if(e.key !== 'Tab') return;
  var items = Array.from(ov.querySelectorAll('button, input, a[href]')).filter(function(el){return !el.disabled && el.getClientRects().length;});
  var first = items[0], last = items[items.length - 1];
  if(e.shiftKey && document.activeElement === first){e.preventDefault();last.focus();}
  else if(!e.shiftKey && document.activeElement === last){e.preventDefault();first.focus();}
});
