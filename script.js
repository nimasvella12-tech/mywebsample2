/* =====================================================
   BUMDes Suwaluh Mandiri Sejahtera — script.js FULL REVISED
   Firebase: investor, laporan, usaha, berita, analisis_keuangan
   localStorage: reservasi, saran, modal pending
   ===================================================== */

/* ============ FIREBASE CONFIG ============ */
const FIREBASE_CONFIG = {
  databaseURL: "https://bumdes-suwaluh-default-rtdb.firebaseio.com"
  // GANTI dengan URL Realtime Database Firebase Anda!
};
const DB_URL = FIREBASE_CONFIG.databaseURL;

function isFirebaseConfigured() {
  return DB_URL && !DB_URL.includes('bumdes-suwaluh-default-rtdb.firebaseio.com') && DB_URL.startsWith('https://');
}

async function fbGet(path) {
  try { const r = await fetch(`${DB_URL}/${path}.json`); return r.ok ? await r.json() : null; }
  catch { return null; }
}
async function fbSet(path, data) {
  try { const r = await fetch(`${DB_URL}/${path}.json`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }); return r.ok; }
  catch { return false; }
}
async function fbPush(path, data) {
  try { const r = await fetch(`${DB_URL}/${path}.json`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }); return r.ok; }
  catch { return false; }
}
async function fbDelete(path) {
  try { await fetch(`${DB_URL}/${path}.json`, { method:'DELETE' }); return true; }
  catch { return false; }
}
async function fbGetAll(path) {
  const data = await fbGet(path);
  if (!data) return [];
  return Object.entries(data).map(([fbKey, val]) => ({ ...val, fbKey }));
}

/* ============ DATA DEFAULTS ============ */
const DEFAULT_USAHA = [
  { id:1, nama:'Kolam Renang', kategori:'wisata', harga:'Rp 15.000/orang', hargaNum:15000, jadwal:'Setiap hari 07.00–17.00', icon:'🏊',
    deskripsi:'Kolam renang keluarga dengan wahana air yang menyenangkan, cocok untuk anak-anak hingga dewasa.',
    gambar:'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjMJq3W03JUs59ABkzOHm1zM5No2eAnumF05h6L3PeT4feREN6svJqvhamFTCRoHRbM16f5l3tKHvZuxvAFKRyEzflZB3S2UdztkkioSML7Qxaz7YEOuKsRWAp427YoGGcFefaaSji6C6dtBtBU4lK1cRqaCWT2N_hfrefpwDODEai5BrDixC3A1TsbT7uR/s4000/mini%20waterpark.jpg',
    fasilitas:['Loker','Kamar Ganti','Kantin','Parkir','Wahana Seluncur'], kapasitas:'200 orang/hari', luas:'±500 m²' },
  { id:2, nama:'Flying Fox', kategori:'wisata', harga:'Rp 25.000/orang', hargaNum:25000, jadwal:'Sabtu–Minggu 08.00–16.00', icon:'🪂',
    deskripsi:'Wahana flying fox memacu adrenalin sepanjang 150 meter melintasi danau dan pepohonan hijau.',
    gambar:'https://flyingfoxnesia.com/wp-content/uploads/2020/03/Jasa-Instalasi-Wahana-Outbound-Flyingfoxnesia-Flyingfox-4.jpg',
    fasilitas:['Helm & Harness','Instruktur','Asuransi','Foto Action'], kapasitas:'50 orang/hari', luas:'150 m lintasan' },
  { id:3, nama:'Kolam Pancing', kategori:'wisata', harga:'Rp 20.000/jam', hargaNum:20000, jadwal:'Setiap hari 06.00–18.00', icon:'🎣',
    deskripsi:'Kolam pancing dengan ikan mas, nila, dan lele berkualitas. Area nyaman dengan gazebo dan pepohonan rindang.',
    gambar:'https://akcdn.detik.net.id/community/media/visual/2023/06/05/kolam-pancing-dadaptulis-dalam_169.png?w=700&q=90',
    fasilitas:['Gazebo','Sewa Pancing','Kantin','Parkir'], kapasitas:'80 pemancing', luas:'±800 m²' },
  { id:5, nama:'Warung Kuliner Desa', kategori:'kuliner', harga:'Mulai Rp 10.000', hargaNum:10000, jadwal:'Setiap hari 08.00–20.00', icon:'🍽️',
    deskripsi:'Sajian kuliner khas Desa Suwaluh — nasi rawon, soto ayam, pecel lele, dan berbagai minuman segar alami.',
    gambar:'https://nusawarta.id/wp-content/uploads/2025/12/635e378fea5f2.jpeg',
    fasilitas:['Tempat Duduk','WiFi','Parkir','Toilet'], kapasitas:'60 kursi', luas:'±120 m²' },
  { id:6, nama:'Kredit Usaha Desa', kategori:'jasa', harga:'Bunga 2%/bulan', hargaNum:0, jadwal:'Senin–Sabtu 08.00–16.00', icon:'🏦',
    deskripsi:'Layanan simpan pinjam untuk warga dan pelaku usaha Desa Suwaluh. Proses cepat, persyaratan mudah, dan berbunga rendah untuk mendorong pertumbuhan ekonomi desa.',
    gambar:'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiPK__KD0NVoSnyqVucFsxRbcY9HwKlmc-EwI_jknt6l1Oo6CrhqjIGkEB-XT7uanvE34CsW1fm7F5Pz8H501UpAdesIEFS68cuRiKldePuEXIF9umjnROTm16jbMkZzT6xX3XxrNJ_Acqi/s1600/Foto000.jpg',
    fasilitas:['Pinjaman Usaha','Simpan Deposit','Konsultasi Keuangan','Proses Cepat','Tanpa Agunan < 5Jt'], kapasitas:'Tidak terbatas', luas:'Kantor ±40 m²' },
  { id:7, nama:'BUMDesMart', kategori:'jasa', harga:'Harga Pasar', hargaNum:0, jadwal:'Setiap hari 07.00–21.00', icon:'🛒',
    deskripsi:'Toko sembako dan kebutuhan sehari-hari milik BUMDes yang menyediakan produk berkualitas dengan harga terjangkau. Mendukung ketahanan pangan dan perekonomian warga desa.',
    gambar:'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjHsFhvvKRy7zDWfUjgTYExhOaNpPE3DBPVcY97ot9B96sSwQh7F1YXy0BRxHs18GRTvIXl6s1xGX3WuK79oVRD81xkdSsfpbjMWoFg-N18xctg-Tre458F7AmWIhivYgeJZXLXyhrFDjbehEpMM1psZy3xxSFGq6MlNEEFPAdhgnW53TR4Fj5ZgXnrx7LI/s320/bumdesmart.png',
    fasilitas:['Sembako Lengkap','Produk UMKM Desa','Harga Kompetitif','Parkir','Pembayaran Non-Tunai'], kapasitas:'±50 pengunjung', luas:'±80 m²' },
  { id:8, nama:'Pamsimas (Air Bersih)', kategori:'jasa', harga:'Rp 2.500/m³', hargaNum:2500, jadwal:'Layanan 24 jam', icon:'💧',
    deskripsi:'Pengelolaan Air Bersih BUMDes Suwaluh Mandiri Sejahtera (Pamsimas) menyediakan air bersih layak minum bagi seluruh warga Desa Suwaluh secara merata, terjangkau, dan berkelanjutan.',
    gambar:'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh1F19WYLNx4GHclsteZAPkPmDosI1J79XWC_XACqfHyjS8DXaXuFqw__36KybLbZmaXW2nri_D5V7jSOIV7nLdz5dlQnFNin-Nnr5lJXdj5EAaue41xkdC9Bw1YTThDePqEg1gdkOOyboCWtAruxU_aMfbO19TeA-_lrylDY0U7KJebRtIf7qTvcSAGxxb/s640/Unit%20Pamsimas.jpg',
    fasilitas:['Jaringan Pipa Desa','Air Bersih Layak Minum','Meteran Rumah','Perawatan Rutin','Pengaduan 24 Jam'], kapasitas:'Seluruh KK Desa Suwaluh', luas:'Jaringan ±5 km' }
];

const DEFAULT_INVESTOR_FALLBACK = [
  { id:1, nama:'Pemerintah Desa Suwaluh', alamat:'Balai Desa Suwaluh', nominal:200000000, tanggal:'2022-01-10' },
  { id:2, nama:'H. Suryanto', alamat:'RT 03 RW 01 Suwaluh', nominal:50000000, tanggal:'2022-03-15' },
  { id:3, nama:'Ibu Siti Rahayu', alamat:'RT 01 RW 02 Suwaluh', nominal:30000000, tanggal:'2022-05-20' },
  { id:4, nama:'Bpk. Ahmad Fauzi', alamat:'RT 04 RW 01 Suwaluh', nominal:25000000, tanggal:'2022-07-08' },
  { id:5, nama:'CV. Maju Bersama', alamat:'Jl. Raya Sidoarjo No.12', nominal:100000000, tanggal:'2023-01-20' },
  { id:6, nama:'Koperasi Tani Makmur', alamat:'Desa Suwaluh', nominal:75000000, tanggal:'2023-04-11' },
  { id:7, nama:'Bpk. Hendra Gunawan', alamat:'RT 02 RW 03 Suwaluh', nominal:15000000, tanggal:'2023-09-05' },
  { id:8, nama:'Ibu Dewi Lestari', alamat:'RT 05 RW 02 Suwaluh', nominal:10000000, tanggal:'2024-02-14' },
  { id:9, nama:'Bpk. Suprapto', alamat:'RT 01 RW 01 Suwaluh', nominal:20000000, tanggal:'2024-06-30' },
  { id:10, nama:'Gabungan Ibu PKK', alamat:'Desa Suwaluh', nominal:121000000, tanggal:'2024-12-01' }
];

const DEFAULT_ORGANISASI = [
  { id:1, nama:'Bpk. Suwarno', jabatan:'Kepala Desa / Pembina', icon:'👑', urutan:1 },
  { id:2, nama:'Bpk. Hadi Santoso', jabatan:'Direktur BUMDes', icon:'🏛️', urutan:2 },
  { id:3, nama:'Ibu Siti Fatimah', jabatan:'Sekretaris', icon:'📋', urutan:3 },
  { id:4, nama:'Bpk. Agus Riyanto', jabatan:'Bendahara', icon:'💰', urutan:4 },
  { id:5, nama:'Bpk. Dedi Kusuma', jabatan:'Kepala Unit Wisata', icon:'🏊', urutan:5 },
  { id:6, nama:'Ibu Rina Wati', jabatan:'Kepala Unit Kuliner', icon:'🍽️', urutan:6 },
  { id:7, nama:'Bpk. Bambang Eko', jabatan:'Kepala Unit Jasa', icon:'🛠️', urutan:7 }
];

const DEFAULT_SARAN = [
  { id:1, nama:'Pak Budi', email:'', pesan:'Fasilitas kolam renang sangat bagus, tolong tambah wahana untuk anak kecil!', ratingWisata:5, ratingPrasarana:4, waktu:'10 Apr 2025' },
  { id:2, nama:'Ibu Lina', email:'', pesan:'Warung kulinernya enak, harga terjangkau. Semoga makin ramai!', ratingWisata:4, ratingPrasarana:4, waktu:'15 Apr 2025' },
  { id:3, nama:'Mas Doni', email:'', pesan:'Flying fox seru banget! Rekomendasikan ke semua teman.', ratingWisata:5, ratingPrasarana:5, waktu:'20 Apr 2025' }
];

const DEFAULT_BERITA = [
  { id:1, judul:'Peresmian Wahana Flying Fox Baru', kategori:'wisata', tanggal:'1 Apr 2025', icon:'🎉', deskripsi:'BUMDes Suwaluh resmi meluncurkan wahana flying fox sepanjang 150 meter yang menjadi daya tarik wisata baru desa.' },
  { id:2, judul:'Rapat Anggota Tahunan 2025', kategori:'kegiatan', tanggal:'15 Mar 2025', icon:'📊', deskripsi:'Laporan keuangan BUMDes 2024 disampaikan secara transparan kepada seluruh anggota dan warga desa.' },
  { id:3, judul:'Pembagian Dividen Penyertaan Modal', kategori:'pengumuman', tanggal:'1 Feb 2025', icon:'💵', deskripsi:'BUMDes Suwaluh membagikan dividen kepada seluruh pemegang saham penyertaan modal periode 2024.' }
];

/* ============ FIREBASE DATA LAYER ============ */

/* USAHA — Firebase (edit admin terlihat semua user) */
async function getUsahaFirebase() {
  if (!isFirebaseConfigured()) return getLs('bumdes_usaha', DEFAULT_USAHA);
  const data = await fbGetAll('usaha');
  return data.length ? data : DEFAULT_USAHA;
}
async function saveUsahaFirebase(usaha) {
  if (!isFirebaseConfigured()) {
    const all = getLs('bumdes_usaha', DEFAULT_USAHA);
    if (usaha.fbKey) { const i=all.findIndex(x=>x.fbKey===usaha.fbKey); if(i>=0) all[i]=usaha; }
    else { usaha.id = genId(all); all.push(usaha); }
    setLs('bumdes_usaha', all); return true;
  }
  if (usaha.fbKey) { const {fbKey,...rest}=usaha; return await fbSet(`usaha/${fbKey}`, rest); }
  return await fbPush('usaha', usaha);
}
async function deleteUsahaFirebase(fbKey) {
  if (!isFirebaseConfigured()) {
    setLs('bumdes_usaha', getLs('bumdes_usaha', DEFAULT_USAHA).filter(x => x.fbKey !== fbKey && String(x.id) !== String(fbKey)));
    return true;
  }
  return await fbDelete(`usaha/${fbKey}`);
}

/* BERITA — Firebase */
async function getBeritaFirebase() {
  if (!isFirebaseConfigured()) return getLs('bumdes_berita', DEFAULT_BERITA);
  const data = await fbGetAll('berita');
  return data.length ? data.sort((a,b)=>b.id-a.id) : DEFAULT_BERITA;
}
async function saveBeritaFirebase(berita) {
  if (!isFirebaseConfigured()) {
    const all = getLs('bumdes_berita', DEFAULT_BERITA);
    if (berita.fbKey) { const i=all.findIndex(x=>x.fbKey===berita.fbKey); if(i>=0) all[i]=berita; }
    else { berita.id = genId(all); all.unshift(berita); }
    setLs('bumdes_berita', all); return true;
  }
  if (berita.fbKey) { const {fbKey,...rest}=berita; return await fbSet(`berita/${fbKey}`, rest); }
  return await fbPush('berita', berita);
}
async function deleteBeritaFirebase(fbKey) {
  if (!isFirebaseConfigured()) {
    setLs('bumdes_berita', getLs('bumdes_berita', DEFAULT_BERITA).filter(x => x.fbKey !== fbKey && String(x.id) !== String(fbKey)));
    return true;
  }
  return await fbDelete(`berita/${fbKey}`);
}

/* INVESTOR — Firebase */
async function getInvestorFirebase() {
  if (!isFirebaseConfigured()) return getLs('bumdes_investor', DEFAULT_INVESTOR_FALLBACK);
  const data = await fbGetAll('investor');
  return data.length ? data : DEFAULT_INVESTOR_FALLBACK;
}
async function saveInvestorFirebase(inv) {
  if (!isFirebaseConfigured()) {
    const all = getLs('bumdes_investor', DEFAULT_INVESTOR_FALLBACK);
    if (inv.fbKey) { const i=all.findIndex(x=>x.fbKey===inv.fbKey); if(i>=0) all[i]=inv; } else { inv.id=genId(all); all.push(inv); }
    setLs('bumdes_investor', all); return true;
  }
  if (inv.fbKey) { const {fbKey,...rest}=inv; return await fbSet(`investor/${fbKey}`, rest); }
  return await fbPush('investor', inv);
}
async function deleteInvestorFirebase(fbKey) {
  if (!isFirebaseConfigured()) { setLs('bumdes_investor', getLs('bumdes_investor',DEFAULT_INVESTOR_FALLBACK).filter(x=>x.fbKey!==fbKey&&String(x.id)!==String(fbKey))); return true; }
  return await fbDelete(`investor/${fbKey}`);
}

/* LAPORAN — Firebase */
async function getLaporanFirebase() {
  if (!isFirebaseConfigured()) return getLs('bumdes_laporan_fb', []);
  return await fbGetAll('laporan') || [];
}
async function saveLaporanFirebase(entry) {
  if (!isFirebaseConfigured()) {
    const data = getLs('bumdes_laporan_fb', []);
    const filtered = data.filter(l => !(l.tahun===entry.tahun&&l.jenis===entry.jenis));
    filtered.push(entry); setLs('bumdes_laporan_fb', filtered.slice(-20)); return true;
  }
  const existing = await getLaporanFirebase();
  const old = existing.find(l=>l.tahun===entry.tahun&&l.jenis===entry.jenis);
  if (old&&old.fbKey) await fbDelete(`laporan/${old.fbKey}`);
  return await fbPush('laporan', entry);
}
async function deleteLaporanFirebase(fbKey) {
  if (!isFirebaseConfigured()) { setLs('bumdes_laporan_fb', getLs('bumdes_laporan_fb',[]).filter(x=>x.fbKey!==fbKey)); return true; }
  return await fbDelete(`laporan/${fbKey}`);
}

/* ANALISIS KEUANGAN — Firebase */
async function getAnalisisFirebase() {
  if (!isFirebaseConfigured()) return getLs('bumdes_analisis', {});
  return await fbGet('analisis') || {};
}
async function saveAnalisisFirebase(data) {
  if (!isFirebaseConfigured()) { setLs('bumdes_analisis', data); return true; }
  return await fbSet('analisis', data);
}

/* ============ LOCALSTORAGE HELPERS ============ */
function getLs(key, def=[]) { try { const d=localStorage.getItem(key); return d?JSON.parse(d):def; } catch { return def; } }
function setLs(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
function getOrganisasi() { return getLs('bumdes_organisasi', DEFAULT_ORGANISASI); }
function setOrganisasi(d) { setLs('bumdes_organisasi', d); }
function getSaran() { return getLs('bumdes_saran', DEFAULT_SARAN); }
function setSaran(d) { setLs('bumdes_saran', d); }
function getReservasi() { return getLs('bumdes_reservasi', []); }
function setReservasi(d) { setLs('bumdes_reservasi', d); }
function getModalPending() { return getLs('bumdes_modal_pending', []); }
function setModalPending(d) { setLs('bumdes_modal_pending', d); }

/* ============ UTILITIES ============ */
function rupiah(n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); }
function genId(arr) { return arr.length ? Math.max(...arr.map(x=>parseInt(x.id)||0))+1 : 1; }
function genInvoiceNo() { return 'INV-'+Date.now().toString().slice(-8); }
function pct(v) { return isFinite(v) ? v.toFixed(2)+'%' : '—'; }
function showToast(msg, type='success') {
  const t=document.getElementById('toast'); if(!t)return;
  t.textContent=msg; t.className='toast show'+(type==='error'?' error':'');
  clearTimeout(t._timer); t._timer=setTimeout(()=>{t.className='toast';},3500);
}

/* ============ FIREBASE STATUS ============ */
function renderFirebaseStatus() {
  const el=document.getElementById('firebaseStatusInfo'); if(!el)return;
  if (isFirebaseConfigured()) {
    el.innerHTML=`<div style="background:#d1fae5;border-radius:8px;padding:.7rem 1rem;font-size:.82rem;color:#065f46;margin-bottom:1rem">✅ <strong>Firebase aktif.</strong> Semua data tersinkron ke seluruh pengguna secara realtime.</div>`;
  } else {
    el.innerHTML=`<div style="background:#fef3c7;border-radius:8px;padding:.8rem 1rem;font-size:.82rem;color:#92400e;margin-bottom:1rem">
      ⚠️ <strong>Firebase belum dikonfigurasi.</strong> Data hanya tersimpan di browser ini.<br><br>
      <strong>Setup (gratis, 5 menit):</strong><br>
      1. Buka <a href="https://console.firebase.google.com" target="_blank" style="color:#1d4ed8">console.firebase.google.com</a> → Add project<br>
      2. Realtime Database → Create Database → Start in test mode<br>
      3. Copy URL → buka <code>script.js</code> → ganti nilai <code>databaseURL</code> → simpan & reload
    </div>`;
  }
}

/* ============ NAVBAR ============ */
(function initNav() {
  const btn=document.getElementById('hamburger'), links=document.getElementById('navLinks');
  if(!btn||!links)return;
  btn.addEventListener('click',()=>{btn.classList.toggle('open');links.classList.toggle('open');});
  links.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',()=>{btn.classList.remove('open');links.classList.remove('open');}));
})();
window.addEventListener('scroll',()=>document.getElementById('backToTop')?.classList.toggle('show',window.scrollY>400));
document.getElementById('backToTop')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
const fadeObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');fadeObserver.unobserve(e.target);}}),{threshold:0.1});
document.querySelectorAll('.fade-up').forEach(el=>fadeObserver.observe(el));
function animateCounter(el){const t=parseInt(el.dataset.target);if(!t)return;let c=0;const s=Math.max(1,Math.ceil(t/60));const ti=setInterval(()=>{c=Math.min(c+s,t);el.textContent=c;if(c>=t)clearInterval(ti);},25);}
document.querySelectorAll('.stat-number[data-target]').forEach(el=>{const o=new IntersectionObserver(e=>{if(e[0].isIntersecting){animateCounter(el);o.disconnect();}},{threshold:0.5});o.observe(el);});

/* ============ PERSON AVATAR ============ */
function personAvatarSVG(color='#40916c') {
  return `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="12" r="7" fill="${color}" opacity="0.8"/><ellipse cx="18" cy="28" rx="11" ry="8" fill="${color}" opacity="0.6"/></svg>`;
}

/* Foto asli pengurus — key: lowercase nama pertama */
const FOTO_PENGURUS = {
  'suwarno':       'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiq9VPv8KykoCzRjHEPKXlIjP6S2XgVSAOFDCCwQQsG_PwL8i9lDKfuxOVfb9HvdOQcxiEbItqX44L1-eCUzcmV-6q0KOQFgadx1hX9XJVvOce-Zsv2N04EpOag8fAmRrA13vKCuewV3KkCA8qvi_8jWAPZTR22sd8Ocbc-CCi7WG52YVvd61mYotp9vg/w701-h733/WhatsApp%20Image%202026-05-14%20at%2006.08.49.jpeg',
  'hadi santoso':  'https://www.mldspot.com/storage/generated/June2021/72268352_157613611980727_7594661751893685589_n.jpg',
  'siti fatimah':  'https://cdn.bithe.co/files/images/20221006-buk-yusniwati.png',
  'agus riyanto':  'https://news.nexa.net.id/wp-content/uploads/2025/03/bapak-internet-indonesia.jpg',
  'dedi kusuma':   'https://sarinovita.com/wp-content/uploads/2017/08/DSC06124-e1502651234261.jpg',
  'rina wati':     'https://media.suara.com/pictures/original/2023/06/30/59306-potret-cantik-ibu-jeje-govinda.jpg',
  'bambang eko':   'https://p16-images-sign-sg.tokopedia-static.net/tos-alisg-i-aphluv4xwc-sg/img/VqbcmM/2024/12/10/e4e15677-838d-492e-9dba-8ad842f7e7a4.jpg~tplv-aphluv4xwc-resize-jpeg:700:0.jpeg?lk3s=0ccea506&x-expires=1778723570&x-signature=3HuirHzFOoz5Tqsxq3htqswb1wg%3D&x-signature-webp=0n4bBBof%2FP9GploTB2tKggQaAnc%3D',
};

function getFotoPengurus(nama) {
  const key = nama.toLowerCase().replace(/^(bpk\.|bapak|ibu)\s+/,'').trim();
  for (const [k,v] of Object.entries(FOTO_PENGURUS)) {
    if (key.includes(k) || k.includes(key.split(' ')[0])) return v;
  }
  return null;
}

/* ============ ORG CHART ============ */
function renderOrgChart() {
  const container=document.getElementById('orgChart'); if(!container)return;
  const data=getOrganisasi().sort((a,b)=>(a.urutan||99)-(b.urutan||99));
  if(!data.length){container.innerHTML='<p style="text-align:center;color:var(--gray-500)">Belum ada data pengurus</p>';return;}
  const levels=[data.filter(d=>d.urutan===1),data.filter(d=>d.urutan===2),data.filter(d=>d.urutan===3||d.urutan===4),data.filter(d=>d.urutan>=5)].filter(l=>l.length>0);
  function makeCard(p,isTop=false){
    const foto=getFotoPengurus(p.nama);
    const avatarHtml=foto
      ?`<div class="org-avatar org-avatar-photo"><img src="${foto}" alt="${p.nama}" onerror="this.parentElement.innerHTML='${personAvatarSVG(isTop?'#1a4731':'#40916c').replace(/'/g,'"')}'" /></div>`
      :`<div class="org-avatar">${personAvatarSVG(isTop?'#1a4731':'#40916c')}</div>`;
    return `<div class="org-card ${isTop?'top-card':''}">${avatarHtml}<div class="org-name">${p.nama}</div><div class="org-jabatan">${p.jabatan}</div></div>`;
  }
  let html='';
  levels.forEach((level,i)=>{
    if(i>0) html+=level.length===1?'<div class="org-v-line"></div>':'<div class="org-h-connect"></div>';
    html+=`<div class="org-level">${level.map((p,li)=>makeCard(p,i===0)).join('')}</div>`;
  });
  container.innerHTML=html;
}

/* ============ UNIT USAHA — from Firebase ============ */
async function renderUsahaGrid(filter='semua') {
  const grid=document.getElementById('usahaGrid'); if(!grid)return;
  let data=await getUsahaFirebase();
  if(filter!=='semua') data=data.filter(u=>u.kategori===filter);
  grid.innerHTML=data.map(u=>`
    <div class="usaha-card" data-cat="${u.kategori}">
      <div class="usaha-img">
        ${u.gambar?`<img src="${u.gambar}" alt="${u.nama}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="usaha-img-fallback" style="display:none;font-size:4rem;width:100%;height:100%;align-items:center;justify-content:center">${u.icon||'🏢'}</div>`:`<div class="usaha-img-fallback">${u.icon||'🏢'}</div>`}
        <span class="usaha-badge">${u.kategori}</span>
      </div>
      <div class="usaha-body">
        <h3 class="usaha-name">${u.nama}</h3>
        <p class="usaha-desc">${u.deskripsi}</p>
        <div class="usaha-harga">${u.harga}</div>
        <div class="usaha-jadwal">🕐 ${u.jadwal}</div>
        <div class="usaha-actions">
          <button class="btn btn-outline" style="color:var(--green-main);border-color:var(--green-main);background:transparent" onclick="showDetailModal('${u.fbKey||u.id}')">Detail</button>
          <a href="unit-wisata.html#reservasi" class="btn btn-primary">Pesan</a>
        </div>
      </div>
    </div>`).join('');
  if(!data.length) grid.innerHTML='<p style="text-align:center;color:var(--gray-500);grid-column:1/-1;padding:2rem">Tidak ada unit usaha.</p>';
}

async function showDetailModal(id) {
  const all=await getUsahaFirebase();
  const u=all.find(x=>(x.fbKey===id||String(x.id)===String(id)));
  if(!u)return;
  const overlay=document.getElementById('modalDetail'); if(!overlay)return;
  document.getElementById('modalContent').innerHTML=`
    ${u.gambar?`<img class="modal-img" src="${u.gambar}" alt="${u.nama}" onerror="this.style.display='none'" />`:`<div class="modal-img-fallback">${u.icon||'🏢'}</div>`}
    <div class="modal-body">
      <span class="section-badge">${u.kategori}</span>
      <h3>${u.nama}</h3>
      <div class="modal-info-row">
        <div class="modal-info-item"><span class="modal-info-label">Harga</span><span class="modal-info-value">${u.harga}</span></div>
        <div class="modal-info-item"><span class="modal-info-label">Operasional</span><span class="modal-info-value">${u.jadwal}</span></div>
        ${u.kapasitas?`<div class="modal-info-item"><span class="modal-info-label">Kapasitas</span><span class="modal-info-value">${u.kapasitas}</span></div>`:''}
        ${u.luas?`<div class="modal-info-item"><span class="modal-info-label">Luas</span><span class="modal-info-value">${u.luas}</span></div>`:''}
      </div>
      <p class="modal-desc">${u.deskripsi}</p>
      ${u.fasilitas&&u.fasilitas.length?`<div class="modal-fasilitas"><h4>✅ Fasilitas</h4><ul>${u.fasilitas.map(f=>`<li>${f}</li>`).join('')}</ul></div>`:''}
      <div class="modal-footer">
        <a href="unit-wisata.html#reservasi" class="btn btn-primary">📅 Reservasi Sekarang</a>
        <button class="btn btn-outline" style="color:var(--green-main);border-color:var(--green-main)" onclick="closeModal()">Tutup</button>
      </div>
    </div>`;
  overlay.classList.add('active'); document.body.style.overflow='hidden';
}
function closeModal(){document.getElementById('modalDetail')?.classList.remove('active');document.body.style.overflow='';}
document.getElementById('modalDetail')?.addEventListener('click',function(e){if(e.target===this)closeModal();});
document.getElementById('usahaFilter')?.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',function(){document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active');renderUsahaGrid(this.dataset.cat);});
});

/* ============ BERITA — from Firebase ============ */
async function renderBeritaSection() {
  const el=document.getElementById('beritaGrid')||document.getElementById('beritaList'); if(!el)return;
  const data=await getBeritaFirebase();
  const items=data.slice(0,6);
  el.innerHTML=items.map(b=>`
    <div class="berita-card fade-up">
      <div class="berita-badge-wrap"><span class="berita-badge ${b.kategori}">${b.kategori}</span></div>
      <div class="berita-icon">${b.icon||'📰'}</div>
      <h4 class="berita-judul">${b.judul}</h4>
      <p class="berita-tanggal">📅 ${b.tanggal}</p>
      <p class="berita-desc">${b.deskripsi}</p>
    </div>`).join('');
  if(!items.length) el.innerHTML='<p style="text-align:center;color:var(--gray-500);grid-column:1/-1;padding:2rem">Belum ada berita.</p>';
  // Re-observe new elements
  el.querySelectorAll('.fade-up').forEach(e=>fadeObserver.observe(e));
}

/* ============ INVESTOR TABLE ============ */
async function renderInvestorTable(search='') {
  const tbody=document.getElementById('investorBody'); if(!tbody)return;
  tbody.innerHTML='<tr><td colspan="4" style="text-align:center;color:var(--gray-500);padding:1rem">⏳ Memuat...</td></tr>';
  let data=await getInvestorFirebase();
  if(search) data=data.filter(i=>i.nama.toLowerCase().includes(search.toLowerCase()));
  tbody.innerHTML=data.map((inv,idx)=>`<tr><td>${idx+1}</td><td>${inv.nama}</td><td>${inv.alamat}</td><td class="nominal-cell">${rupiah(inv.nominal)}</td></tr>`).join('');
  if(!data.length) tbody.innerHTML='<tr><td colspan="4" style="text-align:center;color:var(--gray-500);padding:1rem">Data tidak ditemukan</td></tr>';
}
document.getElementById('searchInvestor')?.addEventListener('input',function(){renderInvestorTable(this.value);});

/* ============ FORM SAHAM ============ */
const lembarInput=document.getElementById('s-lembar'), totalDisplay=document.getElementById('totalSaham');
if(lembarInput&&totalDisplay) lembarInput.addEventListener('input',function(){totalDisplay.textContent=rupiah((parseInt(this.value)||0)*100000);});

document.getElementById('formSaham')?.addEventListener('submit',function(e){
  e.preventDefault();
  const nama=document.getElementById('s-nama').value.trim(), alamat=document.getElementById('s-alamat').value.trim(), telp=document.getElementById('s-telp').value.trim(), lembar=parseInt(document.getElementById('s-lembar').value)||0;
  let valid=true;
  [{id:'s-nama',val:nama},{id:'s-alamat',val:alamat},{id:'s-telp',val:telp}].forEach(f=>{const el=document.getElementById(f.id);const err=el.nextElementSibling;if(!f.val){el.classList.add('error');err.textContent='Wajib diisi';valid=false;}else{el.classList.remove('error');err.textContent='';}});
  if(lembar<1){document.getElementById('s-lembar').classList.add('error');document.getElementById('s-lembar').nextElementSibling.textContent='Minimal 1 lembar';valid=false;}else{document.getElementById('s-lembar').classList.remove('error');document.getElementById('s-lembar').nextElementSibling.textContent='';}
  if(!valid)return;
  const pending=getModalPending();
  pending.push({id:genId(pending),nama,alamat,telp,lembar,total:lembar*100000,bukti:(document.getElementById('s-bukti')?.files[0])?document.getElementById('s-bukti').files[0].name:'-',status:'pending',waktu:new Date().toLocaleDateString('id-ID')});
  setModalPending(pending);
  showToast('✅ Permintaan pembelian saham dikirim! Tunggu konfirmasi admin.');
  this.reset(); if(totalDisplay)totalDisplay.textContent='Rp 0';
  const p=document.getElementById('s-bukti-preview');if(p)p.textContent='';
});
function previewBukti(input,previewId){const p=document.getElementById(previewId);if(!p)return;p.textContent=(input.files&&input.files[0])?'✅ File dipilih: '+input.files[0].name:'';}

/* ============ INVOICE GENERATOR ============ */
function generateInvoiceHTML(data) {
  const tglInvoice=new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'});
  const hargaSatuan=DEFAULT_USAHA.find(x=>x.nama===data.wisata)?.hargaNum||0;
  const subtotal=hargaSatuan*(data.jumlah||1), adminFee=2000, total=subtotal+adminFee;
  return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Invoice ${data.invoiceNo}</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Plus Jakarta Sans',sans-serif;background:#f0f4f1;display:flex;justify-content:center;padding:2rem 1rem;}.invoice{background:#fff;max-width:680px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.12);}.inv-header{background:linear-gradient(135deg,#1a4731,#40916c);color:#fff;padding:2rem 2.5rem;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;}.inv-brand{display:flex;align-items:center;gap:.8rem;}.inv-brand img{height:52px;border-radius:6px;}.inv-brand-text h2{font-size:1.1rem;font-weight:700;}.inv-brand-text p{font-size:.78rem;opacity:.8;margin-top:.2rem;}.inv-meta{text-align:right;}.inv-meta h1{font-size:1.6rem;font-weight:700;letter-spacing:.05em;color:#74c69d;}.inv-meta p{font-size:.82rem;opacity:.8;margin-top:.3rem;}.inv-status{display:inline-block;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.4);border-radius:20px;padding:.2rem .8rem;font-size:.75rem;font-weight:600;margin-top:.4rem;}.inv-body{padding:2rem 2.5rem;}.inv-info{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:2rem;}.inv-info-box h4{font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:#6b7e72;margin-bottom:.5rem;font-weight:600;}.inv-info-box p{font-size:.92rem;color:#1a2420;font-weight:500;line-height:1.6;}.inv-table{width:100%;border-collapse:collapse;margin-bottom:1.5rem;}.inv-table thead tr{background:#f0f4f1;}.inv-table th{padding:.75rem 1rem;text-align:left;font-size:.78rem;text-transform:uppercase;letter-spacing:.04em;color:#6b7e72;font-weight:600;}.inv-table td{padding:.9rem 1rem;border-bottom:1px solid #e0e8e2;font-size:.9rem;color:#374740;}.inv-totals{background:#f8faf8;border-radius:10px;padding:1.2rem 1.5rem;margin-bottom:1.5rem;}.inv-total-row{display:flex;justify-content:space-between;font-size:.9rem;color:#374740;padding:.3rem 0;}.inv-total-row.final{font-size:1.1rem;font-weight:700;color:#1a4731;border-top:2px solid #d8f3dc;margin-top:.5rem;padding-top:.8rem;}.inv-payment{background:#d8f3dc;border-radius:10px;padding:1.2rem 1.5rem;margin-bottom:1.5rem;}.inv-payment h4{color:#1a4731;font-size:.9rem;font-weight:700;margin-bottom:.6rem;}.inv-payment p{font-size:.85rem;color:#2d6a4f;line-height:1.7;}.inv-qris{text-align:center;margin:.8rem 0;}.inv-qris img{width:130px;height:130px;object-fit:contain;border:2px solid #40916c;border-radius:8px;padding:3px;}.inv-footer{background:#f0f4f1;padding:1.2rem 2.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem;}.inv-footer p{font-size:.78rem;color:#6b7e72;}.inv-stamp .stamp-box{display:inline-block;border:2px solid #40916c;border-radius:8px;padding:.5rem 1.2rem;font-size:.72rem;color:#40916c;font-weight:600;letter-spacing:.04em;}.no-print{text-align:center;margin:1.5rem 0;}.no-print button{background:#40916c;color:#fff;border:none;padding:.7rem 2rem;border-radius:50px;font-size:.9rem;font-weight:600;cursor:pointer;margin:0 .4rem;}.no-print .btn-close{background:#6b7e72;}@media print{.no-print{display:none;}body{background:#fff;padding:0;}.invoice{box-shadow:none;border-radius:0;max-width:100%;}}@media(max-width:600px){.inv-info{grid-template-columns:1fr;}}</style></head><body>
<div class="invoice">
  <div class="inv-header">
    <div class="inv-brand"><img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj-pp89vk96KV32rX2Ngid7XRhyphenhyphendbRx4NS74bpPc_lcJ5yqx2U2oxBx2-SWuvt2jVgohPwCg90h0QaQPHyIj-I3rwwe_48iNRoeip7JREZGByj6MZoMWgsiIZoi2p2rWgOX-lBWvGqUAUc93MfZTXtVRFmAMoCEdeZs96WpV9_r1_9FEzbD4zOxcdZGVf2M/s1024/logo%20bumdes%20sms.png" alt="Logo" onerror="this.style.display='none'"/><div class="inv-brand-text"><h2>BUMDes Suwaluh</h2><p>Mandiri Sejahtera</p><p>Desa Suwaluh, Kec. Balongbendo, Sidoarjo</p></div></div>
    <div class="inv-meta"><h1>INVOICE</h1><p>${data.invoiceNo}</p><p>Tanggal: ${tglInvoice}</p><span class="inv-status">⏳ Menunggu Pembayaran</span></div>
  </div>
  <div class="inv-body">
    <div class="inv-info"><div class="inv-info-box"><h4>Tagihan Kepada</h4><p><strong>${data.nama}</strong><br>${data.telp}</p></div><div class="inv-info-box"><h4>Detail Kunjungan</h4><p>📅 ${data.tanggal}<br>🎯 ${data.wisata}</p></div></div>
    <table class="inv-table"><thead><tr><th>Item</th><th>Qty</th><th>Harga Satuan</th><th>Subtotal</th></tr></thead><tbody>
      <tr><td><strong>Tiket ${data.wisata}</strong><br><small style="color:#6b7e72">Kunjungan tgl ${data.tanggal}</small></td><td>${data.jumlah} tiket</td><td>${hargaSatuan>0?rupiah(hargaSatuan):'Lihat tarif'}</td><td>${hargaSatuan>0?rupiah(subtotal):'—'}</td></tr>
      ${data.catatan?`<tr><td colspan="4" style="font-size:.82rem;color:#6b7e72;padding:.5rem 1rem">📝 Catatan: ${data.catatan}</td></tr>`:''}
    </tbody></table>
    ${hargaSatuan>0?`<div class="inv-totals"><div class="inv-total-row"><span>Subtotal</span><span>${rupiah(subtotal)}</span></div><div class="inv-total-row"><span>Biaya Admin</span><span>${rupiah(adminFee)}</span></div><div class="inv-total-row final"><span>TOTAL BAYAR</span><span>${rupiah(total)}</span></div></div>`:''}
    <div class="inv-payment"><h4>💳 Cara Pembayaran</h4><div class="inv-qris"><img src="https://gopay.co.id/api/_ipx/f_webp&w_660&q_90/https://d2v6npc8wmnkqk.cloudfront.net/storage/26035/conversions/Tipe-QRIS-statis-small-large.jpg" alt="QRIS"/><p style="font-size:.72rem;color:#2d6a4f;margin-top:.4rem;font-weight:600">Scan QRIS di atas</p></div>
    <p>🏦 Transfer BRI: <strong>1234-5678-9012-3456</strong> a.n. BUMDes Suwaluh Mandiri Sejahtera</p><p style="margin-top:.4rem">📲 Kirim bukti ke WA: <strong>0812-3456-7890</strong></p></div>
  </div>
  <div class="inv-footer"><div><p>📞 0812-3456-7890</p><p>✉️ bumdes.suwaluh@gmail.com</p></div><div class="inv-stamp"><div class="stamp-box">BUMDes Suwaluh SMS</div></div></div>
</div>
<div class="no-print"><button onclick="window.print()">🖨️ Cetak Invoice</button><button class="btn-close" onclick="window.close()">✕ Tutup</button></div>
</body></html>`;
}

function showInvoice(data){const w=window.open('','_blank');if(w){w.document.write(generateInvoiceHTML(data));w.document.close();}else showToast('Aktifkan pop-up untuk melihat invoice!','error');}

/* ============ TIKET ONLINE GENERATOR ============ */
function generateTiketHTML(r) {
  const qrData=`TIKET-${r.invoiceNo||r.id}-${r.wisata}-${r.tanggal}`;
  return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"/><title>E-Tiket ${r.invoiceNo||r.id}</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Plus Jakarta Sans',sans-serif;background:#f0f4f1;display:flex;justify-content:center;align-items:flex-start;padding:2rem 1rem;min-height:100vh;}
.tiket{background:#fff;width:100%;max-width:480px;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.15);}
.tiket-header{background:linear-gradient(135deg,#1a4731,#40916c);padding:1.5rem 2rem;color:#fff;text-align:center;}
.tiket-header img{height:48px;margin-bottom:.6rem;border-radius:6px;}
.tiket-header h2{font-size:1.1rem;font-weight:700;}
.tiket-header p{font-size:.78rem;opacity:.8;}
.tiket-body{padding:1.8rem 2rem;}
.tiket-title{font-size:1.4rem;font-weight:700;color:#1a4731;text-align:center;margin-bottom:1.2rem;}
.tiket-row{display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px dashed #e0e8e2;font-size:.9rem;}
.tiket-row:last-of-type{border-bottom:none;}
.tiket-label{color:#6b7e72;font-weight:500;}
.tiket-val{color:#1a2420;font-weight:600;text-align:right;}
.tiket-divider{display:flex;align-items:center;margin:1.2rem -2rem;position:relative;}
.tiket-divider::before,.tiket-divider::after{content:'';flex:1;height:2px;background:repeating-linear-gradient(to right,#e0e8e2 0,#e0e8e2 8px,transparent 8px,transparent 16px);}
.tiket-divider .circle{width:24px;height:24px;background:#f0f4f1;border-radius:50%;flex-shrink:0;}
.tiket-qr{text-align:center;padding:1rem 0;}
.tiket-qr canvas{border:2px solid #40916c;border-radius:8px;padding:4px;}
.tiket-qr p{font-size:.75rem;color:#6b7e72;margin-top:.4rem;}
.tiket-status{background:#d1fae5;color:#065f46;border-radius:8px;padding:.5rem 1rem;text-align:center;font-weight:700;font-size:.85rem;margin-top:1rem;}
.tiket-footer{background:#f0f4f1;padding:.8rem 2rem;font-size:.75rem;color:#6b7e72;text-align:center;}
.no-print{text-align:center;margin:1.5rem 0;}
.no-print button{background:#40916c;color:#fff;border:none;padding:.7rem 2rem;border-radius:50px;font-size:.9rem;font-weight:600;cursor:pointer;margin:0 .3rem;}
.no-print .btn-close{background:#6b7e72;}
@media print{.no-print{display:none;}body{background:#fff;padding:0;}.tiket{box-shadow:none;max-width:100%;border-radius:0;}}
</style></head><body>
<div class="tiket">
  <div class="tiket-header">
    <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj-pp89vk96KV32rX2Ngid7XRhyphenhyphendbRx4NS74bpPc_lcJ5yqx2U2oxBx2-SWuvt2jVgohPwCg90h0QaQPHyIj-I3rwwe_48iNRoeip7JREZGByj6MZoMWgsiIZoi2p2rWgOX-lBWvGqUAUc93MfZTXtVRFmAMoCEdeZs96WpV9_r1_9FEzbD4zOxcdZGVf2M/s1024/logo%20bumdes%20sms.png" alt="Logo" onerror="this.style.display='none'"/>
    <h2>E-Tiket Wisata</h2><p>BUMDes Suwaluh Mandiri Sejahtera</p>
  </div>
  <div class="tiket-body">
    <div class="tiket-title">🎫 ${r.wisata}</div>
    <div class="tiket-row"><span class="tiket-label">Nama Pemesan</span><span class="tiket-val">${r.nama}</span></div>
    <div class="tiket-row"><span class="tiket-label">Tanggal Kunjungan</span><span class="tiket-val">📅 ${r.tanggal}</span></div>
    <div class="tiket-row"><span class="tiket-label">Jumlah Tiket</span><span class="tiket-val">${r.jumlah} orang</span></div>
    <div class="tiket-row"><span class="tiket-label">No Invoice</span><span class="tiket-val">${r.invoiceNo||'—'}</span></div>
    <div class="tiket-row"><span class="tiket-label">No Tiket</span><span class="tiket-val" style="color:#40916c;font-size:1rem">${qrData.slice(0,20)}</span></div>
    <div class="tiket-divider"><div class="circle"></div></div>
    <div class="tiket-qr">
      <canvas id="qrCanvas"></canvas>
      <p>Tunjukkan tiket ini kepada petugas</p>
    </div>
    <div class="tiket-status">✅ TIKET VALID — SUDAH DIKONFIRMASI</div>
  </div>
  <div class="tiket-footer">Tiket ini diterbitkan oleh BUMDes Suwaluh Mandiri Sejahtera • Desa Suwaluh, Kec. Balongbendo, Sidoarjo</div>
</div>
<div class="no-print">
  <button onclick="window.print()">🖨️ Cetak Tiket</button>
  <button class="btn-close" onclick="window.close()">✕ Tutup</button>
</div>
<script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
<script>
QRCode.toCanvas(document.getElementById('qrCanvas'),'${qrData}',{width:160,margin:1,color:{dark:'#1a4731',light:'#ffffff'}},function(err){if(err)console.error(err);});
</script>
</body></html>`;
}

function kirimTiket(id){
  const r=getReservasi().find(x=>x.id===id);
  if(!r){showToast('Data reservasi tidak ditemukan','error');return;}
  if(r.status!=='validated'){showToast('Konfirmasi reservasi terlebih dahulu!','error');return;}
  const w=window.open('','_blank');
  if(w){w.document.write(generateTiketHTML(r));w.document.close();}
  else showToast('Aktifkan pop-up untuk membuka tiket!','error');
}

/* ============ FORM RESERVASI ============ */
document.getElementById('formReservasi')?.addEventListener('submit',function(e){
  e.preventDefault();
  const nama=document.getElementById('res-nama').value.trim(),telp=document.getElementById('res-telp').value.trim(),wisata=document.getElementById('res-wisata').value,tanggal=document.getElementById('res-tanggal').value,jumlah=parseInt(document.getElementById('res-jumlah').value)||0;
  let valid=true;
  [{id:'res-nama',val:nama},{id:'res-telp',val:telp},{id:'res-wisata',val:wisata},{id:'res-tanggal',val:tanggal}].forEach(f=>{const el=document.getElementById(f.id);const err=el.nextElementSibling;if(!f.val){el.classList.add('error');if(err)err.textContent='Wajib diisi';valid=false;}else{el.classList.remove('error');if(err)err.textContent='';}});
  if(jumlah<1){document.getElementById('res-jumlah').classList.add('error');valid=false;}else document.getElementById('res-jumlah').classList.remove('error');
  if(!valid)return;
  const invoiceNo=genInvoiceNo();
  const data={id:genId(getReservasi()),invoiceNo,nama,telp,wisata,tanggal,jumlah,catatan:document.getElementById('res-catatan')?.value.trim()||'',bukti:(document.getElementById('res-bukti')?.files[0])?document.getElementById('res-bukti').files[0].name:'-',status:'pending',waktu:new Date().toLocaleDateString('id-ID')};
  const reservasi=getReservasi(); reservasi.push(data); setReservasi(reservasi);
  showReservasiSuccessModal(data);
  this.reset(); document.getElementById('res-bukti-preview')&&(document.getElementById('res-bukti-preview').textContent='');
});

function showReservasiSuccessModal(data){
  const existing=document.getElementById('reservasiSuccessModal'); if(existing)existing.remove();
  const modal=document.createElement('div');
  modal.id='reservasiSuccessModal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:8000;display:flex;align-items:center;justify-content:center;padding:1rem;';
  modal.innerHTML=`<div style="background:#fff;border-radius:16px;max-width:440px;width:100%;padding:2rem;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:3.5rem;margin-bottom:.8rem">✅</div>
    <h3 style="color:#1a4731;font-size:1.3rem;margin-bottom:.5rem">Reservasi Berhasil!</h3>
    <p style="color:#6b7e72;font-size:.9rem;margin-bottom:1.2rem">No Invoice: <strong style="color:#40916c">${data.invoiceNo}</strong><br>${data.wisata} • ${data.tanggal} • ${data.jumlah} tiket</p>
    <p style="color:#6b7e72;font-size:.85rem;margin-bottom:1.5rem">Unduh invoice & lakukan pembayaran. Admin konfirmasi via WhatsApp.</p>
    <div style="display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap">
      <button onclick="showInvoice(${JSON.stringify(data).replace(/"/g,'&quot;')});document.getElementById('reservasiSuccessModal').remove()"
        style="background:#40916c;color:#fff;border:none;padding:.7rem 1.5rem;border-radius:50px;font-weight:600;cursor:pointer;font-size:.9rem">🧾 Download Invoice</button>
      <button onclick="document.getElementById('reservasiSuccessModal').remove()"
        style="background:#f0f4f1;color:#374740;border:none;padding:.7rem 1.5rem;border-radius:50px;font-weight:600;cursor:pointer;font-size:.9rem">Tutup</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
}

/* ============ FORM SARAN ============ */
const ratings={};
document.querySelectorAll('.star-rating').forEach(container=>{
  const key=container.dataset.key; ratings[key]=0;
  const stars=container.querySelectorAll('span');
  stars.forEach(star=>{
    star.addEventListener('mouseenter',()=>stars.forEach(s=>s.classList.toggle('hover',parseInt(s.dataset.v)<=parseInt(star.dataset.v))));
    star.addEventListener('mouseleave',()=>stars.forEach(s=>s.classList.remove('hover')));
    star.addEventListener('click',()=>{ratings[key]=parseInt(star.dataset.v);stars.forEach(s=>s.classList.toggle('active',parseInt(s.dataset.v)<=ratings[key]));});
  });
});
document.getElementById('formSaran')?.addEventListener('submit',function(e){
  e.preventDefault();
  const nama=document.getElementById('sr-nama').value.trim(),pesan=document.getElementById('sr-pesan').value.trim();
  let valid=true;
  [{id:'sr-nama',val:nama},{id:'sr-pesan',val:pesan}].forEach(f=>{const el=document.getElementById(f.id);const err=el.nextElementSibling;if(!f.val){el.classList.add('error');err.textContent='Wajib diisi';valid=false;}else{el.classList.remove('error');err.textContent='';}});
  if(!valid)return;
  const saranData=getSaran();
  saranData.unshift({id:genId(saranData),nama,email:document.getElementById('sr-email')?.value||'',pesan,ratingWisata:ratings['wisata']||0,ratingPrasarana:ratings['prasarana']||0,waktu:new Date().toLocaleDateString('id-ID')});
  setSaran(saranData); renderSaranList(); renderTestimoniList();
  showToast('✅ Terima kasih atas masukan Anda!');
  this.reset(); Object.keys(ratings).forEach(k=>{ratings[k]=0;}); document.querySelectorAll('.star-rating span').forEach(s=>s.classList.remove('active','hover'));
});
function renderSaranList(){const el=document.getElementById('saranList');if(!el)return;el.innerHTML=getSaran().slice(0,3).map(s=>`<div class="testimoni-card"><div class="testimoni-header"><span class="testimoni-nama">${s.nama}</span><span style="font-size:.78rem;color:var(--gray-500)">${s.waktu}</span></div><p class="testimoni-pesan">${s.pesan}</p></div>`).join('')||'<p style="color:var(--gray-500);font-size:.9rem">Belum ada masukan.</p>';}
function renderTestimoniList(){const el=document.getElementById('testimoniList');if(!el)return;el.innerHTML=getSaran().filter(s=>s.ratingWisata>=4).slice(0,3).map(s=>`<div class="testimoni-card"><div class="testimoni-header"><span class="testimoni-nama">${s.nama}</span><span class="testimoni-stars">${'★'.repeat(s.ratingWisata)}${'☆'.repeat(5-s.ratingWisata)}</span></div><p class="testimoni-pesan">${s.pesan}</p></div>`).join('')||'<p style="color:var(--gray-500);font-size:.9rem">Belum ada testimoni.</p>';}

/* ============ TRANSPARANSI TABS ============ */
document.getElementById('tabsTransparansi')?.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',function(){
    document.querySelectorAll('#tabsTransparansi .tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
    this.classList.add('active'); document.getElementById('tab-'+this.dataset.tab)?.classList.add('active');
    if(this.dataset.tab==='tren')initCharts();
    if(this.dataset.tab==='analisis')renderAnalisisGrid();
  });
});

/* ============ GOOGLE DRIVE PARSER ============ */
function parseDriveLink(url){
  if(!url)return null; url=url.trim();
  const m=url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)||url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if(!m)return null;
  const fileId=m[1];
  return{fileId,embedUrl:`https://drive.google.com/file/d/${fileId}/preview`,downloadUrl:`https://drive.google.com/uc?export=download&id=${fileId}`,viewUrl:`https://drive.google.com/file/d/${fileId}/view`};
}

/* ============ LAPORAN KEUANGAN ============ */
async function renderLaporanList(){
  const el=document.getElementById('laporanList');if(!el)return;
  const tahun=(document.getElementById('filterTahun')?.value)||'2025';
  el.innerHTML='<div style="text-align:center;padding:2rem;color:var(--gray-500)">⏳ Memuat laporan...</div>';
  const all=await getLaporanFirebase(); const list=all.filter(l=>l.tahun===tahun).slice(0,5);
  if(!list.length){el.innerHTML=`<div style="text-align:center;padding:3rem;color:var(--gray-500)"><div style="font-size:3rem;margin-bottom:1rem">📂</div><p style="font-size:1rem;font-weight:600">Belum ada laporan untuk tahun ${tahun}</p></div>`;return;}
  el.innerHTML=list.map(l=>{const drive=parseDriveLink(l.driveLink);const ok=drive!==null;return`<div class="laporan-item"><div style="display:flex;align-items:center;flex:1;min-width:0"><span class="laporan-icon">📄</span><div class="laporan-info"><h4>${l.nama}</h4><p>${l.jenis} • ${l.tahun} • ${ok?'<span style="color:var(--green-main);font-weight:600">✅ Tersedia</span>':'<span style="color:var(--accent-dark)">⚠️ Link tidak valid</span>'}</p>${l.uploadDate?`<p style="font-size:.75rem;color:var(--gray-500)">${l.uploadDate}</p>`:''}</div></div><div class="laporan-actions">${ok?`<a class="btn btn-primary" href="${drive.downloadUrl}" target="_blank">⬇ Unduh</a><button class="btn btn-outline" style="color:var(--green-main);border-color:var(--green-main)" onclick="previewLaporan('${drive.embedUrl}','${l.nama} ${l.tahun}')">👁 Preview</button>`:`<button class="btn btn-outline" style="color:var(--gray-500);border-color:var(--gray-200);cursor:not-allowed" disabled>Tidak tersedia</button>`}</div></div>`;}).join('');
}
function previewLaporan(url,nama){const ex=document.getElementById('laporanPreviewModal');if(ex)ex.remove();const m=document.createElement('div');m.id='laporanPreviewModal';m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1rem;';m.innerHTML=`<div style="background:white;border-radius:12px;width:100%;max-width:860px;height:90vh;display:flex;flex-direction:column;overflow:hidden"><div style="display:flex;justify-content:space-between;align-items:center;padding:.8rem 1.2rem;background:var(--green-dark);color:white;border-radius:12px 12px 0 0"><span style="font-weight:600;font-size:.95rem">📄 ${nama}</span><button onclick="document.getElementById('laporanPreviewModal').remove()" style="background:rgba(255,255,255,.2);border:none;color:white;width:32px;height:32px;border-radius:50%;font-size:1.1rem;cursor:pointer">✕</button></div><div style="flex:1;position:relative;background:#f5f5f5"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#999">⏳ Memuat...</div><iframe src="${url}" style="position:absolute;inset:0;width:100%;height:100%;border:none;z-index:1" onload="this.previousElementSibling.style.display='none'"></iframe></div></div>`;
document.body.appendChild(m);m.addEventListener('click',e=>{if(e.target===m)m.remove();});}
document.getElementById('filterTahun')?.addEventListener('change',renderLaporanList);

/* ============ ANALISIS KEUANGAN — ROI, ROA, ROE, Payback ============ */
async function renderAnalisisGrid(){
  const el=document.getElementById('analisisGrid');if(!el)return;
  const data=await getAnalisisFirebase();
  const periodes=['2025','2024','2023','2022','2021'];
  const hasData=periodes.some(p=>data[p]);

  if(!hasData){
    el.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--gray-500)">
      <div style="font-size:3rem;margin-bottom:1rem">📊</div>
      <p style="font-weight:600;font-size:1rem;margin-bottom:.4rem">Belum ada data analisis keuangan</p>
      <p style="font-size:.85rem">Admin dapat menginput data melalui Admin Panel → tab 📊 Analisis Keuangan</p>
    </div>`; return;
  }

  // Format nilai persen dengan validasi agar tidak tampil ekstrem
  function fmtPct(val, pembagi) {
    if (!pembagi || pembagi === 0) return '<span style="color:var(--gray-500)">—</span>';
    const result = (val / pembagi) * 100;
    const fixed = result.toFixed(2);
    const color = result >= 0 ? 'inherit' : '#dc2626';
    const icon = result >= 15 ? '🟢' : result >= 5 ? '🟡' : '🔴';
    return `<span style="color:${color}">${fixed}%</span> ${icon}`;
  }

  function fmtPayback(investasi, kasPerTahun) {
    if (!kasPerTahun || kasPerTahun === 0) return '<span style="color:var(--gray-500)">—</span>';
    const val = investasi / kasPerTahun;
    const icon = val <= 2 ? '🟢' : val <= 5 ? '🟡' : '🔴';
    return `${val.toFixed(1)} tahun ${icon}`;
  }

  // Tabel ringkasan semua periode
  const activeData = periodes.filter(p => data[p]);

  // Ringkasan tabel multi-periode
  let tableHTML = `
  <div style="grid-column:1/-1;overflow-x:auto;margin-bottom:1.5rem">
    <table style="width:100%;border-collapse:collapse;font-size:.88rem;min-width:600px">
      <thead>
        <tr style="background:var(--green-dark);color:#fff">
          <th style="padding:.7rem 1rem;text-align:left;border-radius:8px 0 0 0">Indikator</th>
          ${activeData.map(p=>`<th style="padding:.7rem 1rem;text-align:center">${p}</th>`).join('')}
          <th style="padding:.7rem 1rem;text-align:left;font-size:.72rem;opacity:.7;border-radius:0 8px 0 0">Rumus</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background:var(--green-pale)">
          <td style="padding:.65rem 1rem;font-weight:600;color:var(--green-dark)">💰 Laba Bersih</td>
          ${activeData.map(p=>{const d=data[p];return`<td style="padding:.65rem 1rem;text-align:center;font-weight:600">${rupiah(parseFloat(d.laba_bersih)||0)}</td>`;}).join('')}
          <td style="padding:.65rem 1rem;font-size:.75rem;color:var(--gray-500)">Input langsung</td>
        </tr>
        <tr>
          <td style="padding:.65rem 1rem;font-weight:600;color:var(--gray-700)">🏦 Total Aset</td>
          ${activeData.map(p=>{const d=data[p];return`<td style="padding:.65rem 1rem;text-align:center">${rupiah(parseFloat(d.total_aset)||0)}</td>`;}).join('')}
          <td style="padding:.65rem 1rem;font-size:.75rem;color:var(--gray-500)">Input langsung</td>
        </tr>
        <tr style="background:var(--gray-50)">
          <td style="padding:.65rem 1rem;font-weight:600;color:var(--gray-700)">📊 Ekuitas</td>
          ${activeData.map(p=>{const d=data[p];return`<td style="padding:.65rem 1rem;text-align:center">${rupiah(parseFloat(d.ekuitas)||0)}</td>`;}).join('')}
          <td style="padding:.65rem 1rem;font-size:.75rem;color:var(--gray-500)">Input langsung</td>
        </tr>
        <tr>
          <td style="padding:.65rem 1rem;font-weight:600;color:var(--gray-700)">💳 Total Investasi</td>
          ${activeData.map(p=>{const d=data[p];return`<td style="padding:.65rem 1rem;text-align:center">${rupiah(parseFloat(d.total_investasi)||0)}</td>`;}).join('')}
          <td style="padding:.65rem 1rem;font-size:.75rem;color:var(--gray-500)">Input langsung</td>
        </tr>
        <tr style="background:var(--gray-50)">
          <td style="padding:.65rem 1rem;font-weight:600;color:var(--gray-700)">💧 Kas Bersih/Tahun</td>
          ${activeData.map(p=>{const d=data[p];return`<td style="padding:.65rem 1rem;text-align:center">${rupiah(parseFloat(d.kas_per_tahun)||0)}</td>`;}).join('')}
          <td style="padding:.65rem 1rem;font-size:.75rem;color:var(--gray-500)">Input langsung</td>
        </tr>
        <tr style="border-top:2px solid var(--green-light)">
          <td style="padding:.8rem 1rem;font-weight:700;color:var(--green-dark);background:var(--green-pale)">📈 ROI</td>
          ${activeData.map(p=>{const d=data[p];return`<td style="padding:.8rem 1rem;text-align:center;font-weight:700;background:var(--green-pale)">${fmtPct(parseFloat(d.laba_bersih)||0,parseFloat(d.total_investasi)||0)}</td>`;}).join('')}
          <td style="padding:.8rem 1rem;font-size:.75rem;color:var(--gray-500);background:var(--green-pale)">Laba ÷ Investasi × 100</td>
        </tr>
        <tr style="background:#fefce8">
          <td style="padding:.8rem 1rem;font-weight:700;color:#92400e">📊 ROA</td>
          ${activeData.map(p=>{const d=data[p];return`<td style="padding:.8rem 1rem;text-align:center;font-weight:700">${fmtPct(parseFloat(d.laba_bersih)||0,parseFloat(d.total_aset)||0)}</td>`;}).join('')}
          <td style="padding:.8rem 1rem;font-size:.75rem;color:var(--gray-500)">Laba ÷ Total Aset × 100</td>
        </tr>
        <tr style="background:#f5f3ff">
          <td style="padding:.8rem 1rem;font-weight:700;color:#5b21b6">💜 ROE</td>
          ${activeData.map(p=>{const d=data[p];return`<td style="padding:.8rem 1rem;text-align:center;font-weight:700">${fmtPct(parseFloat(d.laba_bersih)||0,parseFloat(d.ekuitas)||0)}</td>`;}).join('')}
          <td style="padding:.8rem 1rem;font-size:.75rem;color:var(--gray-500)">Laba ÷ Ekuitas × 100</td>
        </tr>
        <tr style="background:#fff1f2">
          <td style="padding:.8rem 1rem;font-weight:700;color:#991b1b;border-radius:0 0 0 8px">⏱️ Payback Period</td>
          ${activeData.map(p=>{const d=data[p];return`<td style="padding:.8rem 1rem;text-align:center;font-weight:700">${fmtPayback(parseFloat(d.total_investasi)||0,parseFloat(d.kas_per_tahun)||0)}</td>`;}).join('')}
          <td style="padding:.8rem 1rem;font-size:.75rem;color:var(--gray-500);border-radius:0 0 8px 0">Investasi ÷ Kas/Tahun</td>
        </tr>
      </tbody>
    </table>
  </div>`;

  // Kartu detail per periode
  let cardsHTML = activeData.map(p => {
    const d = data[p];
    const labaB = parseFloat(d.laba_bersih)||0;
    const totalAset = parseFloat(d.total_aset)||0;
    const ekuitas = parseFloat(d.ekuitas)||0;
    const investasi = parseFloat(d.total_investasi)||0;
    const kas = parseFloat(d.kas_per_tahun)||0;
    return `
    <div style="background:var(--white);border:1px solid var(--gray-200);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm)">
      <div style="background:linear-gradient(135deg,var(--green-dark),var(--green-mid));color:#fff;padding:.7rem 1.2rem;display:flex;justify-content:space-between;align-items:center">
        <span style="font-weight:700;font-size:.95rem">📅 Periode ${p}</span>
        <span style="font-size:.72rem;opacity:.8;background:rgba(255,255,255,.15);padding:.15rem .5rem;border-radius:10px">Analisis Keuangan</span>
      </div>
      <div style="padding:1.2rem;display:grid;grid-template-columns:1fr 1fr;gap:.7rem">
        <div style="background:var(--green-pale);border-radius:10px;padding:.9rem;text-align:center;border-left:3px solid var(--green-main)">
          <div style="font-size:.65rem;text-transform:uppercase;letter-spacing:.06em;color:var(--gray-500);font-weight:600;margin-bottom:.3rem">ROI</div>
          <div style="font-size:1.3rem;font-weight:700;color:var(--green-dark);line-height:1">${investasi>0?((labaB/investasi)*100).toFixed(2)+'%':'—'}</div>
          <div style="font-size:.68rem;color:var(--gray-500);margin-top:.25rem">Return on Investment</div>
        </div>
        <div style="background:#fefce8;border-radius:10px;padding:.9rem;text-align:center;border-left:3px solid #ca8a04">
          <div style="font-size:.65rem;text-transform:uppercase;letter-spacing:.06em;color:var(--gray-500);font-weight:600;margin-bottom:.3rem">ROA</div>
          <div style="font-size:1.3rem;font-weight:700;color:#92400e;line-height:1">${totalAset>0?((labaB/totalAset)*100).toFixed(2)+'%':'—'}</div>
          <div style="font-size:.68rem;color:var(--gray-500);margin-top:.25rem">Return on Asset</div>
        </div>
        <div style="background:#f5f3ff;border-radius:10px;padding:.9rem;text-align:center;border-left:3px solid #7c3aed">
          <div style="font-size:.65rem;text-transform:uppercase;letter-spacing:.06em;color:var(--gray-500);font-weight:600;margin-bottom:.3rem">ROE</div>
          <div style="font-size:1.3rem;font-weight:700;color:#5b21b6;line-height:1">${ekuitas>0?((labaB/ekuitas)*100).toFixed(2)+'%':'—'}</div>
          <div style="font-size:.68rem;color:var(--gray-500);margin-top:.25rem">Return on Equity</div>
        </div>
        <div style="background:#fff1f2;border-radius:10px;padding:.9rem;text-align:center;border-left:3px solid #dc2626">
          <div style="font-size:.65rem;text-transform:uppercase;letter-spacing:.06em;color:var(--gray-500);font-weight:600;margin-bottom:.3rem">PAYBACK</div>
          <div style="font-size:1.3rem;font-weight:700;color:#991b1b;line-height:1">${kas>0?(investasi/kas).toFixed(1)+' thn':'—'}</div>
          <div style="font-size:.68rem;color:var(--gray-500);margin-top:.25rem">Payback Period</div>
        </div>
      </div>
      <div style="padding:.8rem 1.2rem;background:var(--gray-50);border-top:1px solid var(--gray-200);font-size:.78rem;color:var(--gray-500);display:grid;grid-template-columns:1fr 1fr;gap:.3rem">
        <span>💰 Laba: <strong style="color:var(--green-dark)">${rupiah(labaB)}</strong></span>
        <span>🏦 Aset: <strong style="color:var(--gray-700)">${rupiah(totalAset)}</strong></span>
        <span>📊 Ekuitas: <strong style="color:#5b21b6">${rupiah(ekuitas)}</strong></span>
        <span>💳 Investasi: <strong style="color:#991b1b">${rupiah(investasi)}</strong></span>
      </div>
    </div>`;
  }).join('');

  // Keterangan indikator kinerja
  const legendHTML = `
  <div style="grid-column:1/-1;background:var(--gray-50);border-radius:var(--radius-md);padding:1rem 1.5rem;border:1px solid var(--gray-200);font-size:.8rem">
    <p style="font-weight:600;color:var(--green-dark);margin-bottom:.5rem">📖 Keterangan Indikator:</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.4rem;color:var(--gray-500)">
      <span>🟢 Baik &nbsp;🟡 Cukup &nbsp;🔴 Perlu perhatian</span>
      <span><strong>ROI</strong> = Laba Bersih ÷ Total Investasi × 100</span>
      <span><strong>ROA</strong> = Laba Bersih ÷ Total Aset × 100</span>
      <span><strong>ROE</strong> = Laba Bersih ÷ Ekuitas × 100</span>
      <span><strong>Payback</strong> = Total Investasi ÷ Kas Bersih/Tahun</span>
    </div>
  </div>`;

  el.innerHTML = tableHTML + cardsHTML + legendHTML;
}

/* ============ CHARTS ============ */
let chartsInited=false;
function initCharts(){if(chartsInited)return;chartsInited=true;const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';s.onload=buildCharts;document.head.appendChild(s);}
function buildCharts(){const years=['2021','2022','2023','2024','2025*'];const mk=(id,data,color,label)=>{const ctx=document.getElementById(id);if(!ctx)return;new Chart(ctx,{type:'line',data:{labels:years,datasets:[{label,data,borderColor:color,backgroundColor:color+'22',borderWidth:2.5,fill:true,tension:0.4,pointBackgroundColor:color,pointRadius:5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{grid:{color:'#e0e8e2'}},x:{grid:{display:false}}}}});};
mk('grafikPendapatan',[320,480,620,890,1050],'#40916c','Pendapatan');mk('grafikLaba',[28,55,89,127,155],'#2d6a4f','Laba Bersih');mk('grafikKas',[45,72,110,160,210],'#74c69d','Arus Kas');mk('grafikProfit',[8.8,11.5,14.4,14.3,14.8],'#f4a261','Profitabilitas %');}

/* ============ ADMIN AUTH — klik 2x ============ */
const ADMIN_CREDS={username:'admin',password:'bumdes2025'};
let adminLoggedIn=false, logoClickCount=0;
// REVISED: hanya 2x klik
document.querySelector('.secret-trigger')?.addEventListener('click',()=>{showAdminLogin();});
document.querySelector('.nav-brand')?.addEventListener('click',e=>{
  e.preventDefault(); logoClickCount++;
  if(logoClickCount>=2){logoClickCount=0;showAdminLogin();}
  else setTimeout(()=>{logoClickCount=0;},1500);
});

function showAdminLogin(){if(adminLoggedIn){showAdminPanel();return;}document.getElementById('adminLoginOverlay')?.classList.add('active');}
function attemptLogin(){
  const u=document.getElementById('adminUsername')?.value.trim(),p=document.getElementById('adminPassword')?.value.trim();
  if(u===ADMIN_CREDS.username&&p===ADMIN_CREDS.password){adminLoggedIn=true;document.getElementById('adminLoginOverlay').classList.remove('active');showAdminPanel();}
  else{const err=document.getElementById('adminLoginError');if(err)err.style.display='block';}
}
function showAdminPanel(){document.getElementById('adminPanelContainer')?.classList.add('open');populateAdminTables();}
function hideAdminPanel(){document.getElementById('adminPanelContainer')?.classList.remove('open');}
function logoutAdmin(){adminLoggedIn=false;hideAdminPanel();showToast('Anda telah keluar dari admin panel.');}
function switchAdminTab(tab){
  document.querySelectorAll('.admin-tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelector(`.admin-tab-btn[data-tab="${tab}"]`)?.classList.add('active');
  document.getElementById(`admin-tab-${tab}`)?.classList.add('active');
  populateAdminTables();
}

function populateAdminTables(){
  renderAdminUsahaTable();renderAdminBeritaTable();renderAdminInvestorTable();
  renderAdminReservasiTable();renderAdminModalPendingTable();renderAdminSaranTable();
  renderAdminOrganisasiTable();renderAdminLaporanList();renderAdminAnalisisForm();renderFirebaseStatus();
}

/* ============ ADMIN: UNIT USAHA (Firebase) ============ */
async function renderAdminUsahaTable(){
  const tbody=document.getElementById('adminUsahaTableBody');if(!tbody)return;
  tbody.innerHTML='<tr><td colspan="5" style="text-align:center;color:var(--gray-500);padding:.8rem">⏳ Memuat...</td></tr>';
  const data=await getUsahaFirebase();
  tbody.innerHTML=data.map(u=>`<tr><td>${u.id||'-'}</td><td>${u.nama}</td><td>${u.kategori}</td><td>${u.harga}</td>
    <td><button class="admin-btn-edit" onclick="editAdminUsahaFb('${u.fbKey||u.id}')">✏️ Edit</button>
    <button class="admin-btn-delete" onclick="deleteAdminUsahaFb('${u.fbKey||u.id}')">🗑️</button></td></tr>`).join('');
}
function openAdminUsahaForm(){document.getElementById('adminUsahaForm')?.classList.remove('hidden');document.getElementById('adminEditUsahaFbKey').value='';['adminNamaUsaha','adminHargaUsaha','adminJadwalUsaha','adminIconUsaha','adminDeskripsiUsaha','adminGambarUsaha','adminFasilitasUsaha'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});}
function closeAdminUsahaForm(){document.getElementById('adminUsahaForm')?.classList.add('hidden');}
async function editAdminUsahaFb(key){
  const all=await getUsahaFirebase();
  const u=all.find(x=>x.fbKey===key||String(x.id)===String(key));
  if(!u)return;openAdminUsahaForm();
  document.getElementById('adminEditUsahaFbKey').value=u.fbKey||'';
  document.getElementById('adminNamaUsaha').value=u.nama||'';document.getElementById('adminKategoriUsaha').value=u.kategori||'wisata';document.getElementById('adminHargaUsaha').value=u.harga||'';document.getElementById('adminJadwalUsaha').value=u.jadwal||'';document.getElementById('adminIconUsaha').value=u.icon||'';document.getElementById('adminDeskripsiUsaha').value=u.deskripsi||'';document.getElementById('adminGambarUsaha').value=u.gambar||'';
  const fas=document.getElementById('adminFasilitasUsaha');if(fas)fas.value=(u.fasilitas||[]).join(', ');
}
async function saveAdminUsaha(){
  const fbKey=document.getElementById('adminEditUsahaFbKey').value;
  const nama=document.getElementById('adminNamaUsaha').value.trim();if(!nama){showToast('Nama wajib diisi!','error');return;}
  const fasStr=document.getElementById('adminFasilitasUsaha')?.value||'';
  const obj={nama,kategori:document.getElementById('adminKategoriUsaha').value,harga:document.getElementById('adminHargaUsaha').value.trim(),hargaNum:parseInt(document.getElementById('adminHargaUsaha').value.replace(/\D/g,''))||0,jadwal:document.getElementById('adminJadwalUsaha').value.trim(),icon:document.getElementById('adminIconUsaha').value.trim()||'🏢',deskripsi:document.getElementById('adminDeskripsiUsaha').value.trim(),gambar:document.getElementById('adminGambarUsaha').value.trim()||'',fasilitas:fasStr?fasStr.split(',').map(s=>s.trim()).filter(Boolean):[],fbKey:fbKey||undefined};
  if(!fbKey){const all=await getUsahaFirebase();obj.id=genId(all);}
  const ok=await saveUsahaFirebase(obj);
  if(ok){closeAdminUsahaForm();renderAdminUsahaTable();renderUsahaGrid();showToast('✅ Unit usaha disimpan & tersinkron ke semua user!');}
  else showToast('❌ Gagal menyimpan.','error');
}
async function deleteAdminUsahaFb(key){
  if(!confirm('Hapus unit usaha ini?'))return;
  await deleteUsahaFirebase(key);renderAdminUsahaTable();renderUsahaGrid();showToast('🗑️ Dihapus.');
}

/* ============ ADMIN: BERITA (Firebase) ============ */
async function renderAdminBeritaTable(){
  const tbody=document.getElementById('adminBeritaTableBody');if(!tbody)return;
  tbody.innerHTML='<tr><td colspan="5" style="text-align:center;color:var(--gray-500);padding:.8rem">⏳ Memuat...</td></tr>';
  const data=await getBeritaFirebase();
  tbody.innerHTML=data.map(b=>`<tr><td>${b.id||'-'}</td><td>${b.judul}</td><td>${b.kategori}</td><td>${b.tanggal}</td>
    <td><button class="admin-btn-edit" onclick="editAdminBeritaFb('${b.fbKey||b.id}')">✏️</button>
    <button class="admin-btn-delete" onclick="deleteAdminBeritaFb('${b.fbKey||b.id}')">🗑️</button></td></tr>`).join('');
  if(!data.length)tbody.innerHTML='<tr><td colspan="5" style="text-align:center;color:var(--gray-500);padding:1rem">Belum ada berita</td></tr>';
}
function openAdminBeritaForm(){document.getElementById('adminBeritaForm')?.classList.remove('hidden');document.getElementById('adminEditBeritaFbKey').value='';['adminJudulBerita','adminTanggalBerita','adminIconBerita','adminDeskripsiBerita'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});}
function closeAdminBeritaForm(){document.getElementById('adminBeritaForm')?.classList.add('hidden');}
async function editAdminBeritaFb(key){
  const all=await getBeritaFirebase();
  const b=all.find(x=>x.fbKey===key||String(x.id)===String(key));
  if(!b)return;openAdminBeritaForm();
  document.getElementById('adminEditBeritaFbKey').value=b.fbKey||'';document.getElementById('adminJudulBerita').value=b.judul||'';document.getElementById('adminKategoriBerita').value=b.kategori||'wisata';document.getElementById('adminTanggalBerita').value=b.tanggal||'';document.getElementById('adminIconBerita').value=b.icon||'';document.getElementById('adminDeskripsiBerita').value=b.deskripsi||'';
}
async function saveAdminBerita(){
  const fbKey=document.getElementById('adminEditBeritaFbKey').value;
  const judul=document.getElementById('adminJudulBerita').value.trim();if(!judul){showToast('Judul wajib diisi!','error');return;}
  const obj={judul,kategori:document.getElementById('adminKategoriBerita').value,tanggal:document.getElementById('adminTanggalBerita').value.trim(),icon:document.getElementById('adminIconBerita').value.trim()||'📰',deskripsi:document.getElementById('adminDeskripsiBerita').value.trim(),fbKey:fbKey||undefined};
  if(!fbKey){const all=await getBeritaFirebase();obj.id=genId(all);}
  const ok=await saveBeritaFirebase(obj);
  if(ok){closeAdminBeritaForm();renderAdminBeritaTable();renderBeritaSection();showToast('✅ Berita disimpan & tersinkron!');}
  else showToast('❌ Gagal menyimpan.','error');
}
async function deleteAdminBeritaFb(key){
  if(!confirm('Hapus berita ini?'))return;
  await deleteBeritaFirebase(key);renderAdminBeritaTable();renderBeritaSection();showToast('🗑️ Berita dihapus.');
}

/* ============ ADMIN: INVESTOR (Firebase) ============ */
async function renderAdminInvestorTable(){
  const tbody=document.getElementById('adminInvestorTableBody');if(!tbody)return;
  tbody.innerHTML='<tr><td colspan="5" style="text-align:center;color:var(--gray-500);padding:.8rem">⏳ Memuat...</td></tr>';
  const data=await getInvestorFirebase();
  tbody.innerHTML=data.map(inv=>`<tr><td>${inv.id||'-'}</td><td>${inv.nama}</td><td>${inv.alamat}</td><td class="nominal-cell">${rupiah(inv.nominal)}</td>
    <td><button class="admin-btn-delete" onclick="deleteAdminInvestorFb('${inv.fbKey||inv.id}')">🗑️</button></td></tr>`).join('');
  if(!data.length)tbody.innerHTML='<tr><td colspan="5" style="text-align:center;color:var(--gray-500);padding:1rem">Belum ada investor</td></tr>';
}
function openAdminInvestorForm(){document.getElementById('adminInvestorForm')?.classList.remove('hidden');document.getElementById('adminEditInvestorId').value='';}
function closeAdminInvestorForm(){document.getElementById('adminInvestorForm')?.classList.add('hidden');}
async function saveAdminInvestor(){
  const nama=document.getElementById('adminNamaInvestor').value.trim();if(!nama){showToast('Nama wajib diisi!','error');return;}
  const ok=await saveInvestorFirebase({nama,alamat:document.getElementById('adminAlamatInvestor').value.trim(),nominal:parseInt(document.getElementById('adminNominalInvestor').value)||0,tanggal:document.getElementById('adminTanggalInvestor').value});
  if(ok){closeAdminInvestorForm();renderAdminInvestorTable();renderInvestorTable();showToast('✅ Investor disimpan & tersinkron!');}
  else showToast('❌ Gagal menyimpan.','error');
}
async function deleteAdminInvestorFb(key){if(!confirm('Hapus investor?'))return;await deleteInvestorFirebase(key);renderAdminInvestorTable();renderInvestorTable();}

/* ============ ADMIN: RESERVASI ============ */
function renderAdminReservasiTable(){
  const tbody=document.getElementById('adminReservasiTableBody');if(!tbody)return;
  const data=getReservasi();
  if(!data.length){tbody.innerHTML='<tr><td colspan="10" style="text-align:center;color:var(--gray-500);padding:1rem">Belum ada reservasi</td></tr>';return;}
  tbody.innerHTML=data.map((r,i)=>`<tr>
    <td>${i+1}</td><td><strong>${r.nama}</strong><br><small>${r.telp}</small></td>
    <td>${r.wisata}</td><td>${r.tanggal}</td><td>${r.jumlah}</td>
    <td><small>${r.bukti!=='-'?'📎 '+r.bukti:'—'}</small></td>
    <td><small>${r.invoiceNo||'—'}</small></td>
    <td><span class="status-badge status-${r.status}">${r.status==='pending'?'⏳ Pending':r.status==='validated'?'✅ Konfirmasi':'❌ Ditolak'}</span></td>
    <td>
      ${r.status==='validated'&&r.tiketUrl?`<a href="${r.tiketUrl}" target="_blank" style="font-size:.75rem;color:var(--green-main);font-weight:600">🎫 Lihat Tiket</a>`:(r.status==='validated'?`<label style="cursor:pointer;font-size:.75rem;background:#dbeafe;color:#1d4ed8;padding:.25rem .6rem;border-radius:6px;white-space:nowrap">📤 Upload Tiket<input type="file" accept="image/*,.pdf" style="display:none" onchange="uploadTiketOnline(${r.id},this)"/></label>`:'—')}
    </td>
    <td style="white-space:nowrap">
      ${r.status==='pending'?`<button class="admin-btn-validate" onclick="validateReservasi(${r.id})" title="Konfirmasi">✅</button><button class="admin-btn-delete" onclick="rejectReservasi(${r.id})" title="Tolak">❌</button>`:''}
      <button class="admin-btn-edit" onclick="cetakInvoiceAdmin(${r.id})" title="Cetak Invoice">🧾</button>
      <button class="admin-btn-delete" onclick="deleteReservasi(${r.id})" title="Hapus">🗑️</button>
    </td></tr>`).join('');
}
function validateReservasi(id){
  const d=getReservasi();const i=d.findIndex(x=>x.id===id);
  if(i>=0){
    d[i].status='validated';
    setReservasi(d);
    renderAdminReservasiTable();
    showToast('✅ Reservasi dikonfirmasi! Silakan upload tiket online untuk pelanggan.');
    // Prompt upload tiket segera
    setTimeout(()=>{ promptUploadTiket(id); }, 300);
  }
}
function promptUploadTiket(id){
  const input=document.createElement('input'); input.type='file'; input.accept='image/*,.pdf'; input.style.display='none';
  input.addEventListener('change', function(){
    if(!this.files || !this.files[0]) return;
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = function(e){
      const dataUrl = e.target.result;
      const arr = getReservasi(); const idx = arr.findIndex(x=>x.id===id);
      if(idx>=0){
        arr[idx].tiketUrl = dataUrl;
        arr[idx].tiketNama = file.name;
        setReservasi(arr);
        renderAdminReservasiTable();
        showToast('🎫 Tiket online berhasil diupload!');
      }
    };
    reader.readAsDataURL(file);
    document.body.removeChild(input);
  });
  document.body.appendChild(input);
  input.click();
}
function uploadTiketOnline(id, input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=function(e){
    const d=getReservasi();const i=d.findIndex(x=>x.id===id);
    if(i>=0){
      d[i].tiketUrl=e.target.result;
      d[i].tiketNama=file.name;
      setReservasi(d);
      renderAdminReservasiTable();
      showToast('🎫 Tiket online berhasil diupload!');
    }
  };
  reader.readAsDataURL(file);
}
function rejectReservasi(id){const d=getReservasi();const i=d.findIndex(x=>x.id===id);if(i>=0){d[i].status='rejected';setReservasi(d);renderAdminReservasiTable();showToast('❌ Reservasi ditolak.','error');}}
function deleteReservasi(id){if(!confirm('Hapus?'))return;setReservasi(getReservasi().filter(x=>x.id!==id));renderAdminReservasiTable();}
function cetakInvoiceAdmin(id){const r=getReservasi().find(x=>x.id===id);if(r)showInvoice(r);}

/* ============ ADMIN: MODAL PENDING ============ */
function renderAdminModalPendingTable(){
  const tbody=document.getElementById('adminModalPendingTableBody');if(!tbody)return;
  const data=getModalPending();
  if(!data.length){tbody.innerHTML='<tr><td colspan="9" style="text-align:center;color:var(--gray-500);padding:1rem">Belum ada permintaan</td></tr>';return;}
  tbody.innerHTML=data.map((m,i)=>`<tr><td>${i+1}</td><td><strong>${m.nama}</strong></td><td>${m.alamat}</td><td>${m.telp}</td><td>${m.lembar} lbr</td><td class="nominal-cell">${rupiah(m.total)}</td><td><small>${m.bukti!=='-'?'📎 '+m.bukti:'—'}</small></td>
    <td><span class="status-badge status-${m.status}">${m.status==='pending'?'⏳ Pending':m.status==='validated'?'✅ Valid':'❌ Ditolak'}</span></td>
    <td>${m.status==='pending'?`<button class="admin-btn-validate" onclick="validateModalPending(${m.id})">✅</button><button class="admin-btn-delete" onclick="rejectModalPending(${m.id})">❌</button>`:''}<button class="admin-btn-delete" onclick="deleteModalPending(${m.id})">🗑️</button></td></tr>`).join('');
}
async function validateModalPending(id){
  const data=getModalPending();const idx=data.findIndex(x=>x.id===id);if(idx<0)return;
  data[idx].status='validated';setModalPending(data);
  const m=data[idx];
  const ok=await saveInvestorFirebase({nama:m.nama,alamat:m.alamat,nominal:m.total,tanggal:new Date().toISOString().split('T')[0]});
  renderAdminModalPendingTable();renderAdminInvestorTable();renderInvestorTable();
  showToast(ok?'✅ Divalidasi! Investor tersinkron ke semua pengguna.':'✅ Divalidasi (aktifkan Firebase agar terlihat user lain).');
}
function rejectModalPending(id){const d=getModalPending();const i=d.findIndex(x=>x.id===id);if(i>=0){d[i].status='rejected';setModalPending(d);renderAdminModalPendingTable();showToast('❌ Ditolak.','error');}}
function deleteModalPending(id){if(!confirm('Hapus?'))return;setModalPending(getModalPending().filter(x=>x.id!==id));renderAdminModalPendingTable();}

/* ============ ADMIN: SARAN ============ */
function renderAdminSaranTable(){const tbody=document.getElementById('adminSaranTableBody');if(!tbody)return;tbody.innerHTML=getSaran().map(s=>`<tr><td>${s.id}</td><td>${s.nama}</td><td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${s.pesan}</td><td>⭐${s.ratingWisata}</td><td><button class="admin-btn-delete" onclick="deleteAdminSaran(${s.id})">🗑️</button></td></tr>`).join('');}
function deleteAdminSaran(id){if(!confirm('Hapus?'))return;setSaran(getSaran().filter(x=>x.id!==id));renderAdminSaranTable();renderSaranList();renderTestimoniList();}

/* ============ ADMIN: ORGANISASI ============ */
function renderAdminOrganisasiTable(){const tbody=document.getElementById('adminOrganisasiTableBody');if(!tbody)return;tbody.innerHTML=getOrganisasi().sort((a,b)=>(a.urutan||99)-(b.urutan||99)).map(o=>`<tr><td>${o.urutan}</td><td>${o.nama}</td><td>${o.jabatan}</td><td><button class="admin-btn-edit" onclick="editAdminOrganisasi(${o.id})">✏️</button><button class="admin-btn-delete" onclick="deleteAdminOrganisasi(${o.id})">🗑️</button></td></tr>`).join('');}
function openAdminOrganisasiForm(){document.getElementById('adminOrganisasiForm')?.classList.remove('hidden');document.getElementById('adminEditOrganisasiId').value='';}
function closeAdminOrganisasiForm(){document.getElementById('adminOrganisasiForm')?.classList.add('hidden');}
function editAdminOrganisasi(id){const o=getOrganisasi().find(x=>x.id===id);if(!o)return;openAdminOrganisasiForm();document.getElementById('adminEditOrganisasiId').value=o.id;document.getElementById('adminNamaOrganisasi').value=o.nama;document.getElementById('adminJabatanOrganisasi').value=o.jabatan;document.getElementById('adminIconOrganisasi').value=o.icon;document.getElementById('adminUrutanOrganisasi').value=o.urutan;}
function saveAdminOrganisasi(){const id=parseInt(document.getElementById('adminEditOrganisasiId').value)||0;const nama=document.getElementById('adminNamaOrganisasi').value.trim();if(!nama){showToast('Nama wajib!','error');return;}const data=getOrganisasi();const obj={id:id||genId(data),nama,jabatan:document.getElementById('adminJabatanOrganisasi').value.trim(),icon:document.getElementById('adminIconOrganisasi').value.trim()||'👤',urutan:parseInt(document.getElementById('adminUrutanOrganisasi').value)||99};if(id){const i=data.findIndex(x=>x.id===id);if(i>=0)data[i]=obj;}else data.push(obj);setOrganisasi(data);closeAdminOrganisasiForm();renderAdminOrganisasiTable();renderOrgChart();showToast('✅ Pengurus disimpan!');}
function deleteAdminOrganisasi(id){if(!confirm('Hapus?'))return;setOrganisasi(getOrganisasi().filter(x=>x.id!==id));renderAdminOrganisasiTable();renderOrgChart();}

/* ============ ADMIN: ANALISIS KEUANGAN INPUT ============ */
async function renderAdminAnalisisForm(){
  const el=document.getElementById('adminAnalisisBody');if(!el)return;
  const data=await getAnalisisFirebase();
  const periodes=['2025','2024','2023','2022','2021'];
  el.innerHTML=`<p style="font-size:.82rem;color:var(--gray-500);margin-bottom:1rem">Input data keuangan per periode. Sistem akan menghitung ROI, ROA, ROE, dan Payback Period otomatis.</p>
  <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-bottom:1rem">${periodes.map(p=>`<button onclick="switchAnalisisPeriode('${p}')" id="btn-periode-${p}" class="filter-btn ${p==='2025'?'active':''}" style="font-size:.8rem;padding:.35rem .8rem">${p}</button>`).join('')}</div>
  <div id="analisisFormContent"></div>`;
  switchAnalisisPeriode('2025');
}

async function switchAnalisisPeriode(tahun){
  document.querySelectorAll('[id^="btn-periode-"]').forEach(b=>b.classList.remove('active'));
  document.getElementById(`btn-periode-${tahun}`)?.classList.add('active');
  const data=await getAnalisisFirebase();
  const d=data[tahun]||{};
  const el=document.getElementById('analisisFormContent');if(!el)return;
  el.innerHTML=`<div style="background:var(--gray-50);border-radius:12px;padding:1.2rem">
    <h4 style="color:var(--green-dark);margin-bottom:1rem">📊 Data Keuangan Periode ${tahun}</h4>
    <input type="hidden" id="analisisTahun" value="${tahun}"/>
    <div class="admin-form-row">
      <div class="admin-form-group"><label>Laba Bersih (Rp)</label><input type="number" id="analisis_laba_bersih" value="${d.laba_bersih||''}" placeholder="127000000"/></div>
      <div class="admin-form-group"><label>Total Aset (Rp)</label><input type="number" id="analisis_total_aset" value="${d.total_aset||''}" placeholder="10000000000"/></div>
      <div class="admin-form-group"><label>Ekuitas (Rp)</label><input type="number" id="analisis_ekuitas" value="${d.ekuitas||''}" placeholder="646000000"/></div>
      <div class="admin-form-group"><label>Total Investasi (Rp)</label><input type="number" id="analisis_total_investasi" value="${d.total_investasi||''}" placeholder="646000000"/></div>
      <div class="admin-form-group"><label>Kas Bersih/Tahun (Rp)</label><input type="number" id="analisis_kas_per_tahun" value="${d.kas_per_tahun||''}" placeholder="160000000"/></div>
    </div>
    <div id="analisisPreview" style="margin-top:1rem"></div>
    <div style="display:flex;gap:.5rem;margin-top:1rem">
      <button class="admin-btn-add" onclick="saveAdminAnalisis()">💾 Simpan & Hitung</button>
      <button onclick="previewAnalisis()" style="background:#e0e8e2;border:none;padding:.5rem 1rem;border-radius:8px;cursor:pointer;font-size:.85rem">👁 Preview</button>
    </div>
  </div>`;
  ['analisis_laba_bersih','analisis_total_aset','analisis_ekuitas','analisis_total_investasi','analisis_kas_per_tahun'].forEach(id=>{document.getElementById(id)?.addEventListener('input',previewAnalisis);});
}

function previewAnalisis(){
  const labaB=parseFloat(document.getElementById('analisis_laba_bersih')?.value)||0;
  const totalAset=parseFloat(document.getElementById('analisis_total_aset')?.value)||0;
  const ekuitas=parseFloat(document.getElementById('analisis_ekuitas')?.value)||0;
  const investasi=parseFloat(document.getElementById('analisis_total_investasi')?.value)||0;
  const kasPerTahun=parseFloat(document.getElementById('analisis_kas_per_tahun')?.value)||0;
  if(!labaB&&!totalAset)return;
  const roi=investasi>0?((labaB/investasi)*100).toFixed(2)+'%':'—';
  const roa=totalAset>0?((labaB/totalAset)*100).toFixed(2)+'%':'—';
  const roe=ekuitas>0?((labaB/ekuitas)*100).toFixed(2)+'%':'—';
  const payback=kasPerTahun>0?(investasi/kasPerTahun).toFixed(1)+' tahun':'—';
  const el=document.getElementById('analisisPreview');if(!el)return;
  el.innerHTML=`<div style="background:#d1fae5;border-radius:8px;padding:.8rem 1rem;font-size:.85rem;color:#065f46">
    <strong>📊 Hasil Kalkulasi:</strong><br>
    ROI = ${roi} &nbsp;|&nbsp; ROA = ${roa} &nbsp;|&nbsp; ROE = ${roe} &nbsp;|&nbsp; Payback = ${payback}
  </div>`;
}

async function saveAdminAnalisis(){
  const tahun=document.getElementById('analisisTahun')?.value;
  const entry={laba_bersih:parseFloat(document.getElementById('analisis_laba_bersih')?.value)||0,total_aset:parseFloat(document.getElementById('analisis_total_aset')?.value)||0,ekuitas:parseFloat(document.getElementById('analisis_ekuitas')?.value)||0,total_investasi:parseFloat(document.getElementById('analisis_total_investasi')?.value)||0,kas_per_tahun:parseFloat(document.getElementById('analisis_kas_per_tahun')?.value)||0};
  const allData=await getAnalisisFirebase();
  allData[tahun]=entry;
  const ok=await saveAnalisisFirebase(allData);
  if(ok){showToast('✅ Data analisis disimpan & tersinkron!');renderAnalisisGrid();}
  else showToast('❌ Gagal menyimpan.','error');
}

/* ============ ADMIN: LAPORAN ============ */
function validateDriveLink(val){const info=document.getElementById('adminDriveLinkInfo');if(!info)return;if(!val.trim()){info.innerHTML='';return;}info.innerHTML=parseDriveLink(val)?'<span style="color:var(--green-main);font-size:.8rem">✅ Link valid!</span>':'<span style="color:var(--accent-dark);font-size:.8rem">⚠️ Format link tidak dikenali.</span>';}
async function saveAdminLaporan(){
  const nama=document.getElementById('adminLaporanNama')?.value.trim(),tahun=document.getElementById('adminLaporanTahun')?.value,jenis=document.getElementById('adminLaporanJenis')?.value,driveLink=document.getElementById('adminLaporanDriveLink')?.value.trim();
  if(!nama){showToast('Nama laporan wajib!','error');return;}
  if(!driveLink){showToast('Link Google Drive wajib!','error');return;}
  if(!parseDriveLink(driveLink)){showToast('Format link tidak valid!','error');return;}
  const btn=document.querySelector('[onclick="saveAdminLaporan()"]');if(btn){btn.disabled=true;btn.textContent='⏳';}
  const ok=await saveLaporanFirebase({nama,tahun,jenis,driveLink,uploadDate:new Date().toLocaleDateString('id-ID')});
  if(btn){btn.disabled=false;btn.textContent='💾 Simpan Laporan';}
  if(ok){showToast('✅ Laporan tersinkron ke semua pengguna!');document.getElementById('adminLaporanNama').value='';document.getElementById('adminLaporanDriveLink').value='';document.getElementById('adminDriveLinkInfo').innerHTML='';renderAdminLaporanList();renderLaporanList();}
  else showToast('❌ Gagal. Cek Firebase config.','error');
}
async function renderAdminLaporanList(){
  const el=document.getElementById('adminLaporanUploadList');if(!el)return;
  el.innerHTML='<p style="color:var(--gray-500);font-size:.82rem">⏳ Memuat...</p>';
  const data=await getLaporanFirebase();
  if(!data.length){el.innerHTML='<p style="color:var(--gray-500);font-size:.85rem;margin-bottom:1rem">Belum ada laporan.</p>';return;}
  el.innerHTML=`<div style="margin-bottom:.8rem"><strong style="font-size:.9rem;color:var(--green-dark)">📋 Laporan Tersimpan (${data.length}):</strong></div>`+
    [...data].reverse().map(l=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:.7rem .9rem;background:var(--green-pale);border-radius:8px;margin-bottom:.4rem;font-size:.82rem;gap:.5rem;flex-wrap:wrap">
      <div style="flex:1;min-width:0">📄 <strong>${l.nama}</strong> <span style="color:var(--gray-500)">— ${l.tahun} (${l.jenis})</span>${l.uploadDate?`<br><small style="color:var(--gray-500)">📅 ${l.uploadDate}</small>`:''}</div>
      <button class="admin-btn-delete" onclick="deleteAdminLaporan('${l.fbKey||''}')">🗑️</button>
    </div>`).join('');
}
async function deleteAdminLaporan(key){if(!confirm('Hapus laporan?'))return;await deleteLaporanFirebase(key);renderAdminLaporanList();renderLaporanList();showToast('🗑️ Laporan dihapus.');}

/* ============================
   FOOTER: add requested logo if missing
   ============================ */
function initFooterLogos(){
  try{
    const container = document.querySelector('.footer-bottom-logo');
    if(!container) return;
    const extraSrc = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh1F19WYLNx4GHclsteZAPkPmDosI1J79XWC_XACqfHyjS8DXaXuFqw__36KybLbZmaXW2nri_D5V7jSOIV7nLdz5dlQnFNin-Nnr5lJXdj5EAaue41xkdC9Bw1YTThDePqEg1gdkOOyboCWtAruxU_aMfbO19TeA-_lrylDY0U7KJebRtIf7qTvcSAGxxb/s640/Unit%20Pamsimas.jpg';
    const exists = Array.from(container.querySelectorAll('img')).some(i=>i.src===extraSrc||i.getAttribute('src')===extraSrc);
    if(!exists){
      const img = document.createElement('img');
      img.src = extraSrc;
      img.alt = 'Unit Pamsimas';
      img.style.cssText = 'height:50px;width:auto;object-fit:cover;border-radius:6px;border:2px solid rgba(255,255,255,.2);margin-right:8px';
      container.insertBefore(img, container.firstChild);
    }
  }catch(e){/* ignore */ }
}

/* ============================
   INIT
   ============================ */
document.addEventListener('DOMContentLoaded',()=>{
  renderUsahaGrid();renderOrgChart();renderInvestorTable();renderSaranList();renderTestimoniList();
  renderLaporanList();renderAnalisisGrid();renderBeritaSection();
  // admin tables might be populated if admin opens panel
  renderAdminUsahaTable();renderAdminBeritaTable();renderAdminInvestorTable();
  renderAdminReservasiTable();renderAdminModalPendingTable();renderAdminOrganisasiTable();
  initFooterLogos();renderFirebaseStatus();
});