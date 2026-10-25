'use strict';
(() => {
 const header = document.querySelector('.header');
 const menu = document.querySelector('.menu-toggle');
 const mobile = document.querySelector('.mobile-nav');
 const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
 onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
 menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); mobile.hidden = !open; });
 mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {mobile.hidden=true;menu.setAttribute('aria-expanded','false');}));
 if ('IntersectionObserver' in window) {
  document.body.classList.add('js-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(e => {if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:0.08});
  document.querySelectorAll('.reveal').forEach(e => observer.observe(e));
 }
 const videos = [...document.querySelectorAll('video')];
 const control = document.querySelector('.motion-control');
 const setPaused = paused => {videos.forEach(v => {if(paused)v.pause();else v.play().catch(()=>{});});document.body.classList.toggle('motion-paused',paused);control.setAttribute('aria-pressed', String(paused));control.textContent = paused ? 'Putar video ▷' : 'Jeda video Ⅱ';};
 control.addEventListener('click',()=>setPaused(control.getAttribute('aria-pressed')!=='true'));
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)setPaused(true);
 const form = document.querySelector('#inquiry-form');
 const status = form.querySelector('.form-status');
 const summary = form.querySelector('.summary');
 const field = name => form.elements.namedItem(name);
 const today = new Date(); const localToday = new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
 field('checkin').min=localToday;field('checkout').min=localToday;
 field('checkin').addEventListener('change',()=>{field('checkout').min=field('checkin').value || localToday;field('checkout').setCustomValidity('');});
 field('checkout').addEventListener('input',()=>field('checkout').setCustomValidity(''));
 document.querySelectorAll('[data-city]').forEach(a=>a.addEventListener('click',()=>{field('city').value=a.dataset.city;}));
 document.querySelectorAll('[data-type]').forEach(a=>a.addEventListener('click',()=>{field('type').value=a.dataset.type;}));
 form.addEventListener('submit', event => {
  event.preventDefault(); status.textContent='';
  if(!form.reportValidity())return;
  if(!field('name').value.trim()){field('name').setCustomValidity('Mohon isi nama Anda.');field('name').reportValidity();return;}
  if(field('checkout').value <= field('checkin').value){field('checkout').setCustomValidity('Check-out harus setelah tanggal check-in.');field('checkout').reportValidity();return;}
  const data = new FormData(form);
  const text = `Assalamu’alaikum HHP Land Arrangement, saya ingin konsultasi akomodasi.\n\nNama: ${String(data.get('name')).trim()}\nKebutuhan: ${data.get('type')}\nKota: ${data.get('city')}\nCheck-in: ${data.get('checkin')}\nCheck-out: ${data.get('checkout')}\nJumlah tamu: ${data.get('guests')}\nJumlah kamar: ${data.get('rooms')}\nCatatan: ${String(data.get('notes')).trim() || '-'}\n\nMohon informasi pilihan hotel, ketersediaan, harga, dan ketentuan reservasi.`;
  document.querySelector('#inquiry-summary').value=text;summary.hidden=false;
  const number=form.dataset.whatsapp;
  if(/^[1-9]\d{7,14}$/.test(number)){window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer');status.textContent='Ringkasan siap. Periksa pesan dan penerima di WhatsApp sebelum mengirim.';}
  else status.textContent='Ringkasan siap. Kontak resmi belum diatur; tidak ada data yang dikirim.';
 });
 field('name').addEventListener('input',()=>field('name').setCustomValidity(''));
 form.querySelector('.copy-summary').addEventListener('click',async()=>{const text=document.querySelector('#inquiry-summary');try{await navigator.clipboard.writeText(text.value);status.textContent='Ringkasan berhasil disalin.';}catch{ text.focus();text.select();status.textContent='Silakan salin teks yang dipilih dengan Ctrl+C.';}});
})();
