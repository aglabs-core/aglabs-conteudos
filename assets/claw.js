document.querySelectorAll('[data-copy]').forEach(function(b){
  b.addEventListener('click', function(){
    Promise.resolve().then(function(){ return navigator.clipboard.writeText(b.closest('.box').querySelector('pre').innerText); }).then(function(){
      b.textContent = 'copiado'; b.classList.add('ok');
      setTimeout(function(){ b.textContent = 'copiar'; b.classList.remove('ok'); }, 1600);
    }).catch(function(){ b.textContent = 'Selecione o texto para copiar'; });
  });
});
