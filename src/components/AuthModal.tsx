import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus, Chrome } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps { isOpen:boolean; onClose:()=>void; }

export const AuthModal: React.FC<AuthModalProps> = ({isOpen,onClose}) => {
  const [mode,setMode]=useState<'login'|'signup'>('login');
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState('');
  const [message,setMessage]=useState(''); const [busy,setBusy]=useState(false);
  if(!isOpen) return null;
  const submit=async()=>{
    if(!supabase){setMessage('Giriş sistemi yapılandırılmadı.');return;}
    if(!email.trim()||!password){setMessage('E-posta ve kod/şifre gerekli.');return;}
    setBusy(true);setMessage('');
    try{
      if(mode==='signup'){
        const {data,error}=await supabase.auth.signUp({email:email.trim(),password,options:{data:{name:name.trim()||email.split('@')[0]}}});
        if(error)throw error; setMessage(data.session?'Hesap oluşturuldu.':'Hesap oluşturuldu; e-posta doğrulaması gerekebilir.');
      }else{const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(error)throw error;onClose();}
    }catch(e:any){setMessage(e?.message||'Giriş başarısız.')}finally{setBusy(false)}
  };
  const google=async()=>{if(!supabase){setMessage('Supabase bağlantısı yok.');return;}const {error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.href}});if(error)setMessage(error.message)};
  return <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div className="w-full max-w-md rounded-3xl bg-[#0d1019] border border-white/10 p-6 shadow-2xl">
      <div className="flex justify-between items-center"><div><h2 className="text-xl font-bold text-white">{mode==='login'?'Giriş Yap':'Hesap Oluştur'}</h2><p className="text-xs text-slate-400 mt-1">Google veya e-posta + kod/şifre.</p></div><button onClick={onClose} className="w-9 h-9 rounded-full bg-white/5 text-slate-400 flex items-center justify-center"><X className="w-4 h-4"/></button></div>
      <button onClick={google} className="mt-5 w-full rounded-xl bg-white text-slate-900 py-3 text-sm font-bold flex items-center justify-center gap-2"><Chrome className="w-4 h-4"/> Google ile devam et</button>
      <div className="flex items-center gap-3 my-4 text-[10px] text-slate-500"><span className="h-px bg-white/10 flex-1"/><span>VEYA</span><span className="h-px bg-white/10 flex-1"/></div>
      {mode==='signup'&&<div className="relative mb-3"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/><input value={name} onChange={e=>setName(e.target.value)} placeholder="Kullanıcı adı" className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm text-white outline-none"/></div>}
      <div className="relative mb-3"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Gmail / E-posta" className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm text-white outline-none"/></div>
      <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="Kod / Şifre" className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm text-white outline-none"/></div>
      {message&&<div className="mt-3 text-xs text-indigo-200 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">{message}</div>}
      <button disabled={busy} onClick={submit} className="mt-4 w-full rounded-xl bg-indigo-600 text-white py-3 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50">{mode==='login'?<LogIn className="w-4 h-4"/>:<UserPlus className="w-4 h-4"/>}{busy?'Bekle...':mode==='login'?'Giriş Yap':'Hesap Oluştur'}</button>
      <button onClick={()=>{setMode(mode==='login'?'signup':'login');setMessage('')}} className="mt-3 w-full text-xs text-slate-400 hover:text-white">{mode==='login'?'Hesabın yok mu? Hesap oluştur':'Zaten hesabın var mı? Giriş yap'}</button>
    </div>
  </div>;
};