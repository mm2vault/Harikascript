import React from 'react';

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, { hasError: boolean; message: string }> {
  state = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, message: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu.' };
  }

  componentDidCatch(error: unknown) {
    console.error('HarikaScript runtime error:', error);
  }

  private reload = () => window.location.reload();

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{minHeight:'100vh',background:'#080a12',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',padding:24,fontFamily:'system-ui,sans-serif'}}>
        <div style={{width:'100%',maxWidth:520,background:'#111522',border:'1px solid rgba(255,255,255,.1)',borderRadius:24,padding:28,textAlign:'center'}}>
          <div style={{fontSize:42,marginBottom:12}}>🛠️</div>
          <h1 style={{fontSize:22,margin:'0 0 8px'}}>HarikaScript güvenli moda geçti</h1>
          <p style={{color:'#aab1c5',fontSize:14,lineHeight:1.6,margin:'0 0 18px'}}>Bir özellik hata verdi ama bütün siteyi beyaz/siyah ekranda bırakmadık. Sayfayı yenileyip tekrar deneyebilirsin.</p>
          <button onClick={this.reload} style={{background:'#6366f1',color:'#fff',border:0,borderRadius:12,padding:'11px 18px',fontWeight:700,cursor:'pointer'}}>Sayfayı Yenile</button>
          <details style={{marginTop:18,textAlign:'left',color:'#737b91',fontSize:11}}><summary>Teknik hata</summary><pre style={{whiteSpace:'pre-wrap'}}>{this.state.message}</pre></details>
        </div>
      </div>
    );
  }
}
