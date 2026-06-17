import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Home, Building2, PlusCircle, Star, Search, Sun, Moon, LogOut, Pencil, Trash2, Eye,
  Link2, Filter, Download, X, Check, AlertTriangle, TrendingDown, Clock, ImageOff,
  Upload, ChevronLeft, ChevronRight, Heart, Tag, Phone, MessageCircle, Instagram,
  Facebook, Globe, ExternalLink, LayoutGrid, List as ListIcon, Sparkles, FileSpreadsheet,
  FileText, Printer, MapPin, User, ShieldCheck, BarChart3
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

/* ---------------------------------- THEME / TOKENS ---------------------------------- */

const STATUS_META = {
  ativo: { label: 'Ativo', bg: '#DDF5D5', fg: '#111111' },
  impulsionando: { label: 'Impulsionando', bg: '#FF72C8', fg: '#111111' },
  pausado: { label: 'Pausado', bg: '#E9E9E9', fg: '#111111' },
  negociacao: { label: 'Em Negociação', bg: '#FFE6A0', fg: '#111111' },
  vendido: { label: 'Vendido', bg: '#111111', fg: '#F8F6F1' },
  arquivado: { label: 'Arquivado', bg: '#CFCFCF', fg: '#555555' },
};
const STATUS_KEYS = Object.keys(STATUS_META);
const TIPOS_IMOVEL = ['Casa', 'Apartamento', 'Terreno', 'Cobertura', 'Sala Comercial', 'Outro'];
const ROLES = ['Administrador', 'Corretor', 'Assistente'];

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Bungee&family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

  .y2k-root { --pink:#FF72C8; --pink-light:#FFC5E8; --mint:#DDF5D5; --bg:#F8F6F1; --ink:#111111; --card:#FFFFFF; --shadow:#111111; --muted:#6b6b6b;
    background: var(--bg); color: var(--ink); min-height: 100vh; font-family:'Inter',sans-serif; position:relative; }
  .y2k-root[data-theme='dark'] { --bg:#171520; --ink:#F5F1ED; --card:#221F2C; --shadow:#FF72C8; --pink-light:#3A2A38; --mint:#243426; --muted:#b9b3c4; }
  .y2k-root * { box-sizing: border-box; }
  .y2k-root .ff-display { font-family:'Bungee', cursive; }
  .y2k-root .ff-head { font-family:'Anton', sans-serif; letter-spacing:0.5px; }
  .y2k-root .ff-stat { font-family:'Bebas Neue', sans-serif; letter-spacing:0.5px; }
  .y2k-root .ff-ui { font-family:'Poppins', sans-serif; }

  .y2k-card { background: var(--card); border:3px solid var(--ink); border-radius:16px; box-shadow:6px 6px 0 var(--shadow); }
  .y2k-btn { font-family:'Poppins',sans-serif; font-weight:600; border:3px solid var(--ink); border-radius:10px; padding:9px 16px; cursor:pointer; box-shadow:3px 3px 0 var(--shadow); transition: transform .12s ease; background: var(--card); color: var(--ink); display:inline-flex; align-items:center; gap:6px; font-size:13px; white-space:nowrap; }
  .y2k-btn:hover { transform: translate(-2px,-2px); }
  .y2k-btn:active { transform: translate(0,0); box-shadow:1px 1px 0 var(--shadow); }
  .y2k-btn-pink { background: var(--pink); color:#111; }
  .y2k-btn-mint { background: var(--mint); color:#111; }
  .y2k-btn-ink { background: var(--ink); color: var(--bg); }
  .y2k-btn-ghost { background: transparent; box-shadow:none; border:2px solid var(--ink); }
  .y2k-btn:disabled { opacity:.45; cursor:not-allowed; transform:none; }
  .y2k-input, .y2k-select, .y2k-textarea { font-family:'Inter',sans-serif; border:2.5px solid var(--ink); border-radius:8px; padding:9px 12px; background: var(--card); color: var(--ink); width:100%; font-size:14px; }
  .y2k-input:focus, .y2k-select:focus, .y2k-textarea:focus { outline:3px solid var(--pink); outline-offset:1px; }
  .y2k-label { font-family:'Poppins',sans-serif; font-weight:600; font-size:12px; text-transform:uppercase; letter-spacing:0.6px; margin-bottom:5px; display:block; color: var(--muted); }
  .y2k-sticker { display:inline-flex; align-items:center; gap:5px; font-family:'Poppins',sans-serif; font-weight:700; font-size:11px; text-transform:uppercase; padding:5px 11px; border-radius:999px; border:2.5px solid var(--ink); transform: rotate(-2deg); }
  .y2k-badge-status { font-family:'Poppins',sans-serif; font-weight:700; font-size:11px; text-transform:uppercase; padding:5px 10px; border-radius:999px; border:2px solid var(--ink); white-space:nowrap; letter-spacing:.3px; }
  .y2k-divider { border:none; border-top:3px dashed var(--ink); opacity:.35; margin: 18px 0; }
  .y2k-scrollbar::-webkit-scrollbar{ height:8px; width:8px; }
  .y2k-scrollbar::-webkit-scrollbar-thumb{ background:var(--pink); border-radius:8px; }

  .y2k-header { position: sticky; top:0; z-index:30; background: var(--bg); border-bottom:3px solid var(--ink); }
  .y2k-nav-tab { font-family:'Poppins',sans-serif; font-weight:600; font-size:13px; padding:9px 14px; border-radius:10px 10px 0 0; border:3px solid transparent; cursor:pointer; display:flex; align-items:center; gap:7px; color: var(--muted); }
  .y2k-nav-tab.active { color: var(--ink); border-color: var(--ink); border-bottom-color: var(--bg); background: var(--card); margin-bottom:-3px; }

  .y2k-photo-frame { border:3px solid var(--ink); border-radius:12px; overflow:hidden; background: repeating-linear-gradient(45deg, var(--pink-light), var(--pink-light) 10px, var(--bg) 10px, var(--bg) 20px); display:flex; align-items:center; justify-content:center; }
  .y2k-dropzone { border:3px dashed var(--ink); border-radius:14px; padding:26px; text-align:center; cursor:pointer; background: var(--pink-light); }
  .y2k-dropzone.drag { background: var(--mint); }

  .y2k-modal-backdrop { position:fixed; inset:0; background:rgba(17,17,17,0.55); z-index:90; display:flex; align-items:flex-start; justify-content:center; padding: 26px 14px; overflow-y:auto; }
  .y2k-toast { position:fixed; bottom:22px; right:22px; z-index:200; }

  .y2k-table th { font-family:'Poppins',sans-serif; font-size:11px; text-transform:uppercase; letter-spacing:.5px; text-align:left; padding:10px 12px; border-bottom:3px solid var(--ink); color: var(--muted); white-space:nowrap; }
  .y2k-table td { padding:10px 12px; border-bottom:2px solid var(--pink-light); vertical-align:middle; }
  .y2k-table tr:hover td { background: var(--pink-light); }

  .y2k-icon-btn { border:2.5px solid var(--ink); border-radius:8px; padding:6px; background: var(--card); cursor:pointer; display:inline-flex; }
  .y2k-icon-btn:hover { background: var(--mint); }

  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body, .y2k-root { background: white !important; }
  }
  .print-only { display: none; }

  @media (max-width: 760px) {
    .y2k-hide-mobile { display: none !important; }
    .y2k-nav-tab span { display:none; }
    .y2k-summary-grid { grid-template-columns: repeat(2,1fr) !important; }
  }
`;

/* ---------------------------------- HELPERS ---------------------------------- */

const uid = () => `im_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const formatBRL = (v) => {
  const n = Number(v) || 0;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDateBR = (iso) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('pt-BR'); } catch (e) { return '—'; }
};

const daysSince = (iso) => {
  if (!iso) return 0;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
};

const calcDesconto = (anterior, atual) => {
  const a = Number(anterior), b = Number(atual);
  if (a > 0 && b > 0 && a > b) {
    return { valor: a - b, percentual: ((a - b) / a) * 100 };
  }
  return null;
};

function resizeImageFile(file, maxWidth = 700, quality = 0.62) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler arquivo'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Falha ao carregar imagem'));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function getAlerts(imoveis) {
  const alerts = [];
  imoveis.forEach((im) => {
    if (im.status !== 'vendido' && im.status !== 'arquivado') {
      const dias = daysSince(im.dataAlteracao || im.dataCadastro);
      if (dias > 30) alerts.push({ id: im.id, tipo: 'parado', icon: Clock, msg: `${im.titulo} está parado há ${dias} dias` });
    }
    const semLink = !im.linkInstagram && !im.linkFacebook && !im.linkMarketplace && !im.linkSite && !im.linkPrincipal && !im.linkWhatsapp;
    if (semLink) alerts.push({ id: im.id, tipo: 'semlink', icon: Link2, msg: `${im.titulo} não tem nenhum link de anúncio cadastrado` });
    if (!im.imagemPrincipal && (!im.fotos || im.fotos.length === 0)) alerts.push({ id: im.id, tipo: 'semfoto', icon: ImageOff, msg: `${im.titulo} está sem foto cadastrada` });
    if (Number(im.precoAnterior) > Number(im.precoAtual)) alerts.push({ id: im.id, tipo: 'reduzido', icon: TrendingDown, msg: `${im.titulo} teve redução de preço recente` });
    if (im.dataVencimentoCampanha) {
      const diasRestantes = Math.floor((new Date(im.dataVencimentoCampanha).getTime() - Date.now()) / 86400000);
      if (diasRestantes >= 0 && diasRestantes <= 7) alerts.push({ id: im.id, tipo: 'vencendo', icon: AlertTriangle, msg: `Campanha de "${im.titulo}" vence em ${diasRestantes} dia(s)` });
    }
  });
  return alerts;
}

function seedData() {
  const now = Date.now();
  const days = (n) => new Date(now - n * 86400000).toISOString();
  return [
    {
      id: uid(), codigo: 'IM-0001', titulo: 'Casa frente ao mar em Búzios', tipo: 'Casa',
      cidade: 'Búzios', bairro: 'Geribá', endereco: 'Rua das Conchas, 120', corretor: 'Marina Souza',
      telefone: '(22) 99887-1122', whatsapp: '(22) 99887-1122',
      precoAtual: 1250000, precoAnterior: 1450000, dataAlteracao: days(4),
      linkInstagram: 'https://instagram.com/exemplo', linkFacebook: '', linkMarketplace: '', linkSite: '',
      linkWhatsapp: '', linkPrincipal: 'https://exemplo.com/imovel/0001',
      imagemPrincipal: null, fotos: [], observacoes: 'Estava por R$ 1.450.000 e foi para R$ 1.250.000. Proprietário com urgência de venda.',
      tags: ['vista mar', 'urgente'], status: 'impulsionando', favorito: true, visualizacoes: 482,
      dataCadastro: days(40), dataVencimentoCampanha: new Date(now + 4 * 86400000).toISOString(),
      historico: [
        { data: days(40), tipo: 'criacao', descricao: 'Imóvel cadastrado no sistema', usuario: 'Marina Souza' },
        { data: days(4), tipo: 'preco', descricao: 'Preço alterado de R$ 1.450.000 para R$ 1.250.000', usuario: 'Marina Souza' },
      ],
    },
    {
      id: uid(), codigo: 'IM-0002', titulo: 'Apartamento 2 quartos no Centro', tipo: 'Apartamento',
      cidade: 'Casimiro de Abreu', bairro: 'Centro', endereco: 'Av. Beira Rio, 88', corretor: 'Pedro Lima',
      telefone: '(22) 99112-4455', whatsapp: '(22) 99112-4455',
      precoAtual: 320000, precoAnterior: 320000, dataAlteracao: days(55),
      linkInstagram: '', linkFacebook: '', linkMarketplace: '', linkSite: '', linkWhatsapp: '', linkPrincipal: '',
      imagemPrincipal: null, fotos: [], observacoes: 'Aguardando fotos profissionais.',
      tags: ['oportunidade'], status: 'ativo', favorito: false, visualizacoes: 96,
      dataCadastro: days(60), dataVencimentoCampanha: '',
      historico: [{ data: days(60), tipo: 'criacao', descricao: 'Imóvel cadastrado no sistema', usuario: 'Pedro Lima' }],
    },
    {
      id: uid(), codigo: 'IM-0003', titulo: 'Cobertura duplex com piscina', tipo: 'Cobertura',
      cidade: 'Rio das Ostras', bairro: 'Costazul', endereco: 'Rua dos Coqueiros, 45', corretor: 'Marina Souza',
      telefone: '(22) 99887-1122', whatsapp: '(22) 99887-1122',
      precoAtual: 980000, precoAnterior: 980000, dataAlteracao: days(2),
      linkInstagram: 'https://instagram.com/exemplo2', linkFacebook: 'https://facebook.com/exemplo2',
      linkMarketplace: 'https://marketplace.com/exemplo2', linkSite: '', linkWhatsapp: '', linkPrincipal: 'https://exemplo.com/imovel/0003',
      imagemPrincipal: null, fotos: [], observacoes: 'Cliente aceitou contraproposta, em fase final de negociação.',
      tags: ['piscina', 'duplex'], status: 'negociacao', favorito: true, visualizacoes: 731,
      dataCadastro: days(18), dataVencimentoCampanha: '',
      historico: [
        { data: days(18), tipo: 'criacao', descricao: 'Imóvel cadastrado no sistema', usuario: 'Marina Souza' },
        { data: days(2), tipo: 'status', descricao: 'Status alterado de "Impulsionando" para "Em Negociação"', usuario: 'Marina Souza' },
      ],
    },
    {
      id: uid(), codigo: 'IM-0004', titulo: 'Terreno plano 500m² em condomínio', tipo: 'Terreno',
      cidade: 'Macaé', bairro: 'Lagomar', endereco: 'Quadra 4, Lote 12', corretor: 'João Carvalho',
      telefone: '(22) 99334-7788', whatsapp: '(22) 99334-7788',
      precoAtual: 145000, precoAnterior: 145000, dataAlteracao: days(70),
      linkInstagram: '', linkFacebook: '', linkMarketplace: '', linkSite: '', linkWhatsapp: '', linkPrincipal: '',
      imagemPrincipal: null, fotos: [], observacoes: '', tags: [], status: 'pausado', favorito: false, visualizacoes: 41,
      dataCadastro: days(70), dataVencimentoCampanha: '',
      historico: [{ data: days(70), tipo: 'criacao', descricao: 'Imóvel cadastrado no sistema', usuario: 'João Carvalho' }],
    },
    {
      id: uid(), codigo: 'IM-0005', titulo: 'Sala comercial no centro empresarial', tipo: 'Sala Comercial',
      cidade: 'Macaé', bairro: 'Centro', endereco: 'Ed. Atlântico, sala 302', corretor: 'João Carvalho',
      telefone: '(22) 99334-7788', whatsapp: '(22) 99334-7788',
      precoAtual: 210000, precoAnterior: 250000, dataAlteracao: days(9),
      linkInstagram: '', linkFacebook: 'https://facebook.com/exemplo5', linkMarketplace: '', linkSite: 'https://exemplo.com',
      linkWhatsapp: '', linkPrincipal: 'https://exemplo.com/imovel/0005',
      imagemPrincipal: null, fotos: [], observacoes: 'Estava por R$ 250.000 e foi para R$ 210.000.', tags: ['comercial'],
      status: 'ativo', favorito: false, visualizacoes: 158, dataCadastro: days(33), dataVencimentoCampanha: '',
      historico: [
        { data: days(33), tipo: 'criacao', descricao: 'Imóvel cadastrado no sistema', usuario: 'João Carvalho' },
        { data: days(9), tipo: 'preco', descricao: 'Preço alterado de R$ 250.000 para R$ 210.000', usuario: 'João Carvalho' },
      ],
    },
    {
      id: uid(), codigo: 'IM-0006', titulo: 'Casa de campo com 3 suítes', tipo: 'Casa',
      cidade: 'Cabo Frio', bairro: 'Jardim Esperança', endereco: 'Estrada do Sítio, km 3', corretor: 'Marina Souza',
      telefone: '(22) 99887-1122', whatsapp: '(22) 99887-1122',
      precoAtual: 690000, precoAnterior: 690000, dataAlteracao: days(120),
      linkInstagram: 'https://instagram.com/exemplo6', linkFacebook: '', linkMarketplace: '', linkSite: '', linkWhatsapp: '', linkPrincipal: '',
      imagemPrincipal: null, fotos: [], observacoes: 'Venda concluída, cliente satisfeito.', tags: ['vendido-rapido'],
      status: 'vendido', favorito: false, visualizacoes: 312, dataCadastro: days(140), dataVencimentoCampanha: '',
      historico: [
        { data: days(140), tipo: 'criacao', descricao: 'Imóvel cadastrado no sistema', usuario: 'Marina Souza' },
        { data: days(120), tipo: 'status', descricao: 'Status alterado para "Vendido"', usuario: 'Marina Souza' },
      ],
    },
  ];
}

/* ---------------------------------- SMALL UI PIECES ---------------------------------- */

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.ativo;
  return <span className="y2k-badge-status" style={{ background: meta.bg, color: meta.fg }}>{meta.label}</span>;
}

function SummaryCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="y2k-card" style={{ padding: '16px 18px', background: accent || 'var(--card)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span className="y2k-label" style={{ margin: 0 }}>{label}</span>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div className="ff-stat" style={{ fontSize: 34, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="y2k-toast">
      <div className="y2k-card y2k-btn-ink" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Check size={16} /> <span className="ff-ui" style={{ fontSize: 13, fontWeight: 600 }}>{toast}</span>
      </div>
    </div>
  );
}

function PhotoFrame({ src, size = 56, radius = 12 }) {
  if (!src) {
    return (
      <div className="y2k-photo-frame" style={{ width: size, height: size, borderRadius: radius, flexShrink: 0 }}>
        <ImageOff size={Math.round(size * 0.4)} strokeWidth={2} />
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: radius, border: '3px solid var(--ink)', overflow: 'hidden', flexShrink: 0 }}>
      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}

/* ---------------------------------- LOGIN VIEW ---------------------------------- */

function LoginView({ onLogin }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  return (
    <div className="y2k-root" data-theme="light" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <style>{GLOBAL_STYLES}</style>
      <div className="y2k-card" style={{ width: '100%', maxWidth: 420, padding: 34 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div className="y2k-sticker" style={{ background: 'var(--pink)' }}>★ painel vip</div>
        </div>
        <h1 className="ff-display" style={{ fontSize: 32, margin: '6px 0 2px' }}>GLOSSY<span style={{ color: 'var(--pink)' }}>°</span>IMÓVEIS</h1>
        <p className="ff-ui" style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>painel de impulsionamento &amp; gestão de imóveis</p>

        <label className="y2k-label">Seu nome</label>
        <input className="y2k-input" placeholder="Ex: Marina Souza" value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: 16 }} />

        <label className="y2k-label">Perfil de acesso</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {ROLES.map((r) => (
            <button key={r} type="button" onClick={() => setRole(r)}
              className={`y2k-btn ${role === r ? 'y2k-btn-pink' : 'y2k-btn-ghost'}`} style={{ fontSize: 12 }}>
              {r}
            </button>
          ))}
        </div>

        <button className="y2k-btn y2k-btn-ink" style={{ width: '100%', justifyContent: 'center', padding: '12px 16px' }}
          disabled={!name.trim()}
          onClick={() => onLogin({ name: name.trim(), role })}>
          <ShieldCheck size={16} /> Entrar no painel
        </button>
        <p className="ff-ui" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 14, textAlign: 'center' }}>
          Demonstração: este login não usa senha real, apenas identifica quem está fazendo as alterações no histórico.
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------- DASHBOARD VIEW ---------------------------------- */

function DashboardView({ imoveis, onOpenDetail, onGoTo }) {
  const total = imoveis.length;
  const ativos = imoveis.filter((i) => i.status === 'ativo' || i.status === 'impulsionando').length;
  const pausados = imoveis.filter((i) => i.status === 'pausado').length;
  const vendidos = imoveis.filter((i) => i.status === 'vendido').length;
  const comReducao = imoveis.filter((i) => Number(i.precoAnterior) > Number(i.precoAtual)).length;
  const promocao = imoveis.filter((i) => i.status === 'impulsionando').length;

  const alerts = useMemo(() => getAlerts(imoveis), [imoveis]);

  const reduzidosRecentes = [...imoveis].filter((i) => Number(i.precoAnterior) > Number(i.precoAtual))
    .sort((a, b) => new Date(b.dataAlteracao) - new Date(a.dataAlteracao)).slice(0, 5);

  const maisAntigos = [...imoveis].filter((i) => i.status !== 'vendido' && i.status !== 'arquivado')
    .sort((a, b) => new Date(a.dataCadastro) - new Date(b.dataCadastro)).slice(0, 5);

  const maisVistos = [...imoveis].sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0)).slice(0, 5);

  const chartData = STATUS_KEYS.map((k) => ({ name: STATUS_META[k].label, value: imoveis.filter((i) => i.status === k).length, color: STATUS_META[k].bg }))
    .filter((d) => d.value > 0);

  return (
    <div>
      <div className="y2k-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }}>
        <SummaryCard icon={Building2} label="Total de imóveis" value={total} />
        <SummaryCard icon={Sparkles} label="Ativos / impulsionando" value={ativos} accent="var(--mint)" />
        <SummaryCard icon={Clock} label="Pausados" value={pausados} />
        <SummaryCard icon={Check} label="Vendidos" value={vendidos} accent="var(--ink)" />
        <SummaryCard icon={TrendingDown} label="Com redução de preço" value={comReducao} accent="var(--pink-light)" />
        <SummaryCard icon={Star} label="Promoção ativa" value={promocao} accent="var(--pink)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, marginBottom: 18 }} className="dash-grid">
        <div className="y2k-card" style={{ padding: 18 }}>
          <h3 className="ff-head" style={{ fontSize: 18, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={18} /> ALERTAS DO PAINEL
          </h3>
          {alerts.length === 0 && <p className="ff-ui" style={{ color: 'var(--muted)', fontSize: 13 }}>Nenhum alerta por aqui — tudo em ordem! ✨</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 260, overflowY: 'auto' }} className="y2k-scrollbar">
            {alerts.slice(0, 12).map((a, idx) => {
              const Icon = a.icon;
              return (
                <div key={idx} onClick={() => onOpenDetail(a.id)} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 10px', borderRadius: 10, border: '2px solid var(--ink)', cursor: 'pointer', background: 'var(--pink-light)' }}>
                  <Icon size={15} style={{ flexShrink: 0 }} />
                  <span className="ff-ui" style={{ fontSize: 12.5 }}>{a.msg}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="y2k-card" style={{ padding: 18 }}>
          <h3 className="ff-head" style={{ fontSize: 18, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={18} /> IMÓVEIS POR STATUS
          </h3>
          {chartData.length === 0 ? <p className="ff-ui" style={{ color: 'var(--muted)', fontSize: 13 }}>Sem dados ainda.</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {chartData.map((d, i) => <Cell key={i} fill={d.color} stroke="#111111" strokeWidth={2} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontFamily: 'Poppins', fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }} className="dash-grid3">
        <PanelList title="REDUÇÃO RECENTE" icon={TrendingDown} items={reduzidosRecentes} onOpenDetail={onOpenDetail} render={(i) => (
          <>
            <div className="ff-ui" style={{ fontWeight: 600, fontSize: 13 }}>{i.titulo}</div>
            <div style={{ fontSize: 12 }}><s style={{ color: 'var(--muted)' }}>{formatBRL(i.precoAnterior)}</s> → <strong>{formatBRL(i.precoAtual)}</strong></div>
          </>
        )} />
        <PanelList title="PARADOS HÁ MAIS TEMPO" icon={Clock} items={maisAntigos} onOpenDetail={onOpenDetail} render={(i) => (
          <>
            <div className="ff-ui" style={{ fontWeight: 600, fontSize: 13 }}>{i.titulo}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>cadastrado há {daysSince(i.dataCadastro)} dias</div>
          </>
        )} />
        <PanelList title="MAIS VISUALIZADOS" icon={Eye} items={maisVistos} onOpenDetail={onOpenDetail} render={(i) => (
          <>
            <div className="ff-ui" style={{ fontWeight: 600, fontSize: 13 }}>{i.titulo}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{i.visualizacoes || 0} visualizações</div>
          </>
        )} />
      </div>
    </div>
  );
}

function PanelList({ title, icon: Icon, items, render, onOpenDetail }) {
  return (
    <div className="y2k-card" style={{ padding: 16 }}>
      <h4 className="ff-head" style={{ fontSize: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon size={15} /> {title}
      </h4>
      {items.length === 0 && <p className="ff-ui" style={{ fontSize: 12, color: 'var(--muted)' }}>Nada por aqui ainda.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((i) => (
          <div key={i.id} onClick={() => onOpenDetail(i.id)} style={{ cursor: 'pointer', padding: '8px 10px', borderRadius: 8, border: '2px solid var(--ink)' }}>
            {render(i)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- FILTER PANEL ---------------------------------- */

function FilterPanel({ filters, setFilters, cidades, corretores, onClear }) {
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  return (
    <div className="y2k-card" style={{ padding: 16, marginBottom: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
        <div>
          <label className="y2k-label">Código</label>
          <input className="y2k-input" value={filters.codigo} onChange={(e) => set('codigo', e.target.value)} placeholder="IM-0001" />
        </div>
        <div>
          <label className="y2k-label">Cidade</label>
          <select className="y2k-select" value={filters.cidade} onChange={(e) => set('cidade', e.target.value)}>
            <option value="">Todas</option>
            {cidades.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="y2k-label">Bairro</label>
          <input className="y2k-input" value={filters.bairro} onChange={(e) => set('bairro', e.target.value)} placeholder="Centro" />
        </div>
        <div>
          <label className="y2k-label">Status</label>
          <select className="y2k-select" value={filters.status} onChange={(e) => set('status', e.target.value)}>
            <option value="">Todos</option>
            {STATUS_KEYS.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
          </select>
        </div>
        <div>
          <label className="y2k-label">Corretor</label>
          <select className="y2k-select" value={filters.corretor} onChange={(e) => set('corretor', e.target.value)}>
            <option value="">Todos</option>
            {corretores.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="y2k-label">Preço mínimo</label>
          <input type="number" className="y2k-input" value={filters.precoMin} onChange={(e) => set('precoMin', e.target.value)} placeholder="0" />
        </div>
        <div>
          <label className="y2k-label">Preço máximo</label>
          <input type="number" className="y2k-input" value={filters.precoMax} onChange={(e) => set('precoMax', e.target.value)} placeholder="9999999" />
        </div>
        <div>
          <label className="y2k-label">Cadastrado a partir de</label>
          <input type="date" className="y2k-input" value={filters.dataInicio} onChange={(e) => set('dataInicio', e.target.value)} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
        {[['comDesconto', 'Apenas com desconto'], ['apenasVendidos', 'Apenas vendidos'], ['apenasAtivos', 'Apenas ativos']].map(([k, label]) => (
          <label key={k} className="ff-ui" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <input type="checkbox" checked={!!filters[k]} onChange={(e) => set(k, e.target.checked)} /> {label}
          </label>
        ))}
        <button className="y2k-btn y2k-btn-ghost" style={{ marginLeft: 'auto' }} onClick={onClear}><X size={14} /> Limpar filtros</button>
      </div>
    </div>
  );
}

/* ---------------------------------- PROPERTY CARD / ROW ---------------------------------- */

function PropertyCard({ im, onView, onEdit, onDelete, onCopy, onToggleFav }) {
  const desconto = calcDesconto(im.precoAnterior, im.precoAtual);
  return (
    <div className="y2k-card" style={{ padding: 14, position: 'relative' }}>
      <div style={{ position: 'absolute', top: -10, right: 14, zIndex: 2 }}>
        <StatusBadge status={im.status} />
      </div>
      <PhotoFrame src={im.imagemPrincipal} size={'100%'} radius={10} />
      <div style={{ width: '100%', aspectRatio: '4/3', marginBottom: 10 }}>
        <div className="y2k-photo-frame" style={{ width: '100%', height: '100%', borderRadius: 10, overflow: 'hidden' }}>
          {im.imagemPrincipal ? <img src={im.imagemPrincipal} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageOff size={32} />}
        </div>
      </div>
      <div className="ff-ui" style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, marginBottom: 3 }}>{im.codigo} · {im.tipo}</div>
      <div className="ff-head" style={{ fontSize: 15, marginBottom: 6, lineHeight: 1.2 }}>{im.titulo}</div>
      <div className="ff-ui" style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
        <MapPin size={12} /> {im.bairro}, {im.cidade}
      </div>
      <div style={{ marginBottom: 10 }}>
        {desconto && <div style={{ fontSize: 12, color: 'var(--muted)' }}><s>{formatBRL(im.precoAnterior)}</s></div>}
        <div className="ff-stat" style={{ fontSize: 22 }}>{formatBRL(im.precoAtual)}</div>
        {desconto && <span className="y2k-sticker" style={{ background: 'var(--mint)', marginTop: 4 }}>-{desconto.percentual.toFixed(0)}%</span>}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button className="y2k-icon-btn" onClick={() => onView(im.id)} title="Visualizar"><Eye size={15} /></button>
        <button className="y2k-icon-btn" onClick={() => onEdit(im.id)} title="Editar"><Pencil size={15} /></button>
        <button className="y2k-icon-btn" onClick={() => onCopy(im)} title="Copiar link"><Link2 size={15} /></button>
        <button className="y2k-icon-btn" onClick={() => onToggleFav(im.id)} title="Favoritar" style={im.favorito ? { background: 'var(--pink)' } : {}}>
          <Star size={15} fill={im.favorito ? '#111' : 'none'} />
        </button>
        <button className="y2k-icon-btn" onClick={() => onDelete(im.id)} title="Excluir" style={{ marginLeft: 'auto' }}><Trash2 size={15} /></button>
      </div>
    </div>
  );
}

function PropertyTableRow({ im, onView, onEdit, onDelete, onCopy, onToggleFav }) {
  const desconto = calcDesconto(im.precoAnterior, im.precoAtual);
  return (
    <tr>
      <td><PhotoFrame src={im.imagemPrincipal} size={44} radius={8} /></td>
      <td className="ff-ui" style={{ fontWeight: 600, fontSize: 12.5 }}>{im.codigo}</td>
      <td className="ff-ui" style={{ fontSize: 13, maxWidth: 220 }}>{im.titulo}</td>
      <td className="ff-stat" style={{ fontSize: 15 }}>{formatBRL(im.precoAtual)}</td>
      <td style={{ fontSize: 12.5, color: 'var(--muted)' }}>{desconto ? <s>{formatBRL(im.precoAnterior)}</s> : '—'}</td>
      <td>{desconto ? <span className="y2k-sticker" style={{ background: 'var(--mint)' }}>-{desconto.percentual.toFixed(0)}%</span> : '—'}</td>
      <td className="ff-ui" style={{ fontSize: 12.5 }}>{im.cidade} / {im.bairro}</td>
      <td><StatusBadge status={im.status} /></td>
      <td className="ff-ui" style={{ fontSize: 12.5, color: 'var(--muted)' }}>{formatDateBR(im.dataCadastro)}</td>
      <td>
        <div style={{ display: 'flex', gap: 5 }}>
          <button className="y2k-icon-btn" onClick={() => onView(im.id)} title="Visualizar"><Eye size={14} /></button>
          <button className="y2k-icon-btn" onClick={() => onEdit(im.id)} title="Editar"><Pencil size={14} /></button>
          <button className="y2k-icon-btn" onClick={() => onCopy(im)} title="Copiar link"><Link2 size={14} /></button>
          <button className="y2k-icon-btn" onClick={() => onToggleFav(im.id)} title="Favoritar" style={im.favorito ? { background: 'var(--pink)' } : {}}><Star size={14} fill={im.favorito ? '#111' : 'none'} /></button>
          <button className="y2k-icon-btn" onClick={() => onDelete(im.id)} title="Excluir"><Trash2 size={14} /></button>
        </div>
      </td>
    </tr>
  );
}

/* ---------------------------------- LIST VIEW ---------------------------------- */

function ListView({ imoveis, search, onView, onEdit, onDelete, onCopy, onToggleFav, onlyFavorites, title }) {
  const [viewMode, setViewMode] = useState('cards');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ codigo: '', cidade: '', bairro: '', status: '', corretor: '', precoMin: '', precoMax: '', dataInicio: '', comDesconto: false, apenasVendidos: false, apenasAtivos: false });

  const cidades = useMemo(() => [...new Set(imoveis.map((i) => i.cidade).filter(Boolean))].sort(), [imoveis]);
  const corretores = useMemo(() => [...new Set(imoveis.map((i) => i.corretor).filter(Boolean))].sort(), [imoveis]);

  const filtered = useMemo(() => {
    return imoveis.filter((im) => {
      if (onlyFavorites && !im.favorito) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${im.codigo} ${im.cidade} ${im.bairro} ${im.titulo} ${im.corretor}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.codigo && !im.codigo.toLowerCase().includes(filters.codigo.toLowerCase())) return false;
      if (filters.cidade && im.cidade !== filters.cidade) return false;
      if (filters.bairro && !im.bairro.toLowerCase().includes(filters.bairro.toLowerCase())) return false;
      if (filters.status && im.status !== filters.status) return false;
      if (filters.corretor && im.corretor !== filters.corretor) return false;
      if (filters.precoMin && Number(im.precoAtual) < Number(filters.precoMin)) return false;
      if (filters.precoMax && Number(im.precoAtual) > Number(filters.precoMax)) return false;
      if (filters.dataInicio && new Date(im.dataCadastro) < new Date(filters.dataInicio)) return false;
      if (filters.comDesconto && !(Number(im.precoAnterior) > Number(im.precoAtual))) return false;
      if (filters.apenasVendidos && im.status !== 'vendido') return false;
      if (filters.apenasAtivos && im.status !== 'ativo') return false;
      return true;
    });
  }, [imoveis, search, filters, onlyFavorites]);

  const exportRows = filtered.map((im) => ({
    'Código': im.codigo, 'Título': im.titulo, 'Tipo': im.tipo, 'Cidade': im.cidade, 'Bairro': im.bairro,
    'Preço Atual': im.precoAtual, 'Preço Anterior': im.precoAnterior, 'Status': STATUS_META[im.status]?.label || im.status,
    'Corretor': im.corretor, 'Data Cadastro': formatDateBR(im.dataCadastro),
  }));

  const exportCSV = () => {
    const headers = Object.keys(exportRows[0] || { 'Código': '' });
    const lines = [headers.join(';'), ...exportRows.map((r) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(';'))];
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'imoveis.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Imóveis');
      XLSX.writeFile(wb, 'imoveis.xlsx');
    } catch (e) { console.error(e); }
  };

  const exportPDF = () => window.print();

  return (
    <div>
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
        <h2 className="ff-head" style={{ fontSize: 22 }}>{title} <span style={{ color: 'var(--muted)', fontSize: 14 }} className="ff-ui">({filtered.length})</span></h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="y2k-btn" onClick={() => setShowFilters((s) => !s)}><Filter size={14} /> Filtros</button>
          <button className="y2k-btn" onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}>
            {viewMode === 'cards' ? <><ListIcon size={14} /> Tabela</> : <><LayoutGrid size={14} /> Cards</>}
          </button>
          <button className="y2k-btn" onClick={exportCSV}><FileText size={14} /> CSV</button>
          <button className="y2k-btn" onClick={exportExcel}><FileSpreadsheet size={14} /> Excel</button>
          <button className="y2k-btn" onClick={exportPDF}><Printer size={14} /> PDF</button>
        </div>
      </div>

      {showFilters && <div className="no-print"><FilterPanel filters={filters} setFilters={setFilters} cidades={cidades} corretores={corretores}
        onClear={() => setFilters({ codigo: '', cidade: '', bairro: '', status: '', corretor: '', precoMin: '', precoMax: '', dataInicio: '', comDesconto: false, apenasVendidos: false, apenasAtivos: false })} /></div>}

      {filtered.length === 0 && (
        <div className="y2k-card no-print" style={{ padding: 40, textAlign: 'center' }}>
          <p className="ff-ui" style={{ color: 'var(--muted)' }}>Nenhum imóvel encontrado com esses filtros.</p>
        </div>
      )}

      {viewMode === 'cards' ? (
        <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
          {filtered.map((im) => <PropertyCard key={im.id} im={im} onView={onView} onEdit={onEdit} onDelete={onDelete} onCopy={onCopy} onToggleFav={onToggleFav} />)}
        </div>
      ) : (
        <div className="y2k-card no-print" style={{ overflowX: 'auto', padding: 0 }}>
          <table className="y2k-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th>Foto</th><th>Código</th><th>Título</th><th>Preço atual</th><th>Preço anterior</th><th>Desconto</th><th>Local</th><th>Status</th><th>Cadastro</th><th>Ações</th></tr></thead>
            <tbody>{filtered.map((im) => <PropertyTableRow key={im.id} im={im} onView={onView} onEdit={onEdit} onDelete={onDelete} onCopy={onCopy} onToggleFav={onToggleFav} />)}</tbody>
          </table>
        </div>
      )}

      <div className="print-only">
        <h2 style={{ fontFamily: 'Arial' }}>Relatório de Imóveis — {new Date().toLocaleDateString('pt-BR')}</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Arial', fontSize: 11 }}>
          <thead><tr>{Object.keys(exportRows[0] || {}).map((h) => <th key={h} style={{ border: '1px solid #999', padding: 4, textAlign: 'left' }}>{h}</th>)}</tr></thead>
          <tbody>
            {exportRows.map((r, idx) => <tr key={idx}>{Object.values(r).map((v, i2) => <td key={i2} style={{ border: '1px solid #999', padding: 4 }}>{String(v)}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------------------------- FORM VIEW (CADASTRO / EDIÇÃO) ---------------------------------- */

const emptyForm = () => ({
  codigo: '', titulo: '', tipo: TIPOS_IMOVEL[0], cidade: '', bairro: '', endereco: '', corretor: '', telefone: '', whatsapp: '',
  precoAtual: '', precoAnterior: '', dataVencimentoCampanha: '',
  linkInstagram: '', linkFacebook: '', linkMarketplace: '', linkSite: '', linkWhatsapp: '', linkPrincipal: '',
  imagemPrincipal: null, fotos: [], observacoes: '', tagsInput: '', status: 'ativo', favorito: false,
});

function FormView({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => initial ? { ...initial, tagsInput: (initial.tags || []).join(', ') } : emptyForm());
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const desconto = calcDesconto(form.precoAnterior, form.precoAtual);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    for (const file of files) {
      try {
        const b64 = await resizeImageFile(file);
        setForm((f) => ({ ...f, fotos: [...f.fotos, b64], imagemPrincipal: f.imagemPrincipal || b64 }));
      } catch (e) { console.error(e); }
    }
  };

  const removePhoto = (idx) => {
    setForm((f) => {
      const fotos = f.fotos.filter((_, i) => i !== idx);
      const removed = f.fotos[idx];
      return { ...f, fotos, imagemPrincipal: f.imagemPrincipal === removed ? (fotos[0] || null) : f.imagemPrincipal };
    });
  };

  const handleSubmit = () => {
    if (!form.titulo.trim() || !form.cidade.trim() || form.precoAtual === '') {
      alert('Preencha pelo menos Título, Cidade e Preço Atual.');
      return;
    }
    const tags = form.tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const codigo = form.codigo.trim() || `IM-${Date.now().toString().slice(-6)}`;
    const payload = { ...form, codigo, tags };
    delete payload.tagsInput;
    onSave(payload, initial);
  };

  const LinkField = ({ field, label, icon: Icon }) => (
    <div>
      <label className="y2k-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon size={12} /> {label}</label>
      <input className="y2k-input" value={form[field]} onChange={(e) => set(field, e.target.value)} placeholder="https://" />
    </div>
  );

  return (
    <div className="y2k-card" style={{ padding: 22 }}>
      <h2 className="ff-head" style={{ fontSize: 22, marginBottom: 4 }}>{initial ? 'EDITAR IMÓVEL' : 'CADASTRAR IMÓVEL'}</h2>
      <p className="ff-ui" style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 18 }}>Preencha as informações abaixo para {initial ? 'atualizar' : 'cadastrar'} o imóvel.</p>

      <h4 className="ff-head" style={{ fontSize: 14, marginBottom: 10, color: 'var(--pink)' }}>★ DADOS BÁSICOS</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 16 }}>
        <div><label className="y2k-label">Código do imóvel</label><input className="y2k-input" value={form.codigo} onChange={(e) => set('codigo', e.target.value)} placeholder="Gerado automaticamente" /></div>
        <div style={{ gridColumn: 'span 2' }}><label className="y2k-label">Título do imóvel *</label><input className="y2k-input" value={form.titulo} onChange={(e) => set('titulo', e.target.value)} placeholder="Ex: Casa frente ao mar" /></div>
        <div><label className="y2k-label">Tipo do imóvel</label>
          <select className="y2k-select" value={form.tipo} onChange={(e) => set('tipo', e.target.value)}>{TIPOS_IMOVEL.map((t) => <option key={t} value={t}>{t}</option>)}</select>
        </div>
        <div><label className="y2k-label">Cidade *</label><input className="y2k-input" value={form.cidade} onChange={(e) => set('cidade', e.target.value)} /></div>
        <div><label className="y2k-label">Bairro</label><input className="y2k-input" value={form.bairro} onChange={(e) => set('bairro', e.target.value)} /></div>
        <div style={{ gridColumn: 'span 2' }}><label className="y2k-label">Endereço</label><input className="y2k-input" value={form.endereco} onChange={(e) => set('endereco', e.target.value)} /></div>
        <div><label className="y2k-label">Corretor responsável</label><input className="y2k-input" value={form.corretor} onChange={(e) => set('corretor', e.target.value)} /></div>
        <div><label className="y2k-label">Telefone</label><input className="y2k-input" value={form.telefone} onChange={(e) => set('telefone', e.target.value)} /></div>
        <div><label className="y2k-label">WhatsApp</label><input className="y2k-input" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} /></div>
        <div><label className="y2k-label">Status</label>
          <select className="y2k-select" value={form.status} onChange={(e) => set('status', e.target.value)}>{STATUS_KEYS.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}</select>
        </div>
      </div>

      <hr className="y2k-divider" />
      <h4 className="ff-head" style={{ fontSize: 14, marginBottom: 10, color: 'var(--pink)' }}>★ VALORES</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 8 }}>
        <div><label className="y2k-label">Preço atual *</label><input type="number" className="y2k-input" value={form.precoAtual} onChange={(e) => set('precoAtual', e.target.value)} /></div>
        <div><label className="y2k-label">Preço anterior</label><input type="number" className="y2k-input" value={form.precoAnterior} onChange={(e) => set('precoAnterior', e.target.value)} /></div>
        <div><label className="y2k-label">Validade da campanha (opcional)</label><input type="date" className="y2k-input" value={form.dataVencimentoCampanha} onChange={(e) => set('dataVencimentoCampanha', e.target.value)} /></div>
      </div>
      {desconto && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <span className="y2k-sticker" style={{ background: 'var(--mint)' }}>redução de {formatBRL(desconto.valor)}</span>
          <span className="y2k-sticker" style={{ background: 'var(--pink)' }}>-{desconto.percentual.toFixed(1)}%</span>
        </div>
      )}

      <hr className="y2k-divider" />
      <h4 className="ff-head" style={{ fontSize: 14, marginBottom: 10, color: 'var(--pink)' }}>★ LINKS DO ANÚNCIO</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, marginBottom: 16 }}>
        <LinkField field="linkInstagram" label="Instagram" icon={Instagram} />
        <LinkField field="linkFacebook" label="Facebook" icon={Facebook} />
        <LinkField field="linkMarketplace" label="Marketplace" icon={Globe} />
        <LinkField field="linkSite" label="Site" icon={Globe} />
        <LinkField field="linkWhatsapp" label="WhatsApp" icon={MessageCircle} />
        <LinkField field="linkPrincipal" label="Anúncio principal" icon={ExternalLink} />
      </div>

      <hr className="y2k-divider" />
      <h4 className="ff-head" style={{ fontSize: 14, marginBottom: 10, color: 'var(--pink)' }}>★ MÍDIA</h4>
      <div className={`y2k-dropzone ${dragOver ? 'drag' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}>
        <Upload size={24} style={{ marginBottom: 6 }} />
        <p className="ff-ui" style={{ fontWeight: 600, fontSize: 13 }}>Arraste fotos aqui ou clique para selecionar</p>
        <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => handleFiles(e.target.files)} />
      </div>
      {form.fotos.length > 0 && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
          {form.fotos.map((src, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <div style={{ width: 90, height: 90, borderRadius: 10, border: src === form.imagemPrincipal ? '3px solid var(--pink)' : '3px solid var(--ink)', overflow: 'hidden' }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <button type="button" className="y2k-icon-btn" style={{ position: 'absolute', top: -8, right: -8, padding: 3 }} onClick={() => removePhoto(idx)}><X size={12} /></button>
              {src !== form.imagemPrincipal && (
                <button type="button" className="y2k-btn" style={{ fontSize: 9, padding: '3px 6px', marginTop: 4 }} onClick={() => set('imagemPrincipal', src)}>Definir capa</button>
              )}
            </div>
          ))}
        </div>
      )}

      <hr className="y2k-divider" />
      <h4 className="ff-head" style={{ fontSize: 14, marginBottom: 10, color: 'var(--pink)' }}>★ OBSERVAÇÕES &amp; TAGS</h4>
      <label className="y2k-label">Anotações livres</label>
      <textarea className="y2k-textarea" rows={3} value={form.observacoes} onChange={(e) => set('observacoes', e.target.value)} placeholder='Ex: "Cliente aceitou proposta", "Urgência de venda"...' style={{ marginBottom: 12 }} />
      <label className="y2k-label">Tags (separadas por vírgula)</label>
      <input className="y2k-input" value={form.tagsInput} onChange={(e) => set('tagsInput', e.target.value)} placeholder="vista mar, urgente, oportunidade" />

      <div style={{ display: 'flex', gap: 10, marginTop: 26 }}>
        <button className="y2k-btn y2k-btn-pink" onClick={handleSubmit}><Check size={15} /> {initial ? 'Salvar alterações' : 'Cadastrar imóvel'}</button>
        <button className="y2k-btn y2k-btn-ghost" onClick={onCancel}><X size={15} /> Cancelar</button>
      </div>
    </div>
  );
}

/* ---------------------------------- DETAIL VIEW ---------------------------------- */

function DetailView({ im, onClose, onEdit, onDelete, onToggleFav, onChangeStatus, onCopy }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const gallery = im.imagemPrincipal ? [im.imagemPrincipal, ...im.fotos.filter((f) => f !== im.imagemPrincipal)] : im.fotos;
  const desconto = calcDesconto(im.precoAnterior, im.precoAtual);
  const linkRows = [
    ['Instagram', im.linkInstagram, Instagram], ['Facebook', im.linkFacebook, Facebook],
    ['Marketplace', im.linkMarketplace, Globe], ['Site', im.linkSite, Globe],
    ['WhatsApp', im.linkWhatsapp, MessageCircle], ['Anúncio principal', im.linkPrincipal, ExternalLink],
  ].filter(([, v]) => v);

  return (
    <div className="y2k-modal-backdrop no-print" onClick={onClose}>
      <div className="y2k-card" style={{ width: '100%', maxWidth: 780, padding: 24, position: 'relative' }} onClick={(e) => e.stopPropagation()}>
        <button className="y2k-icon-btn" style={{ position: 'absolute', top: 18, right: 18 }} onClick={onClose}><X size={16} /></button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
          <span className="ff-ui" style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>{im.codigo}</span>
          <StatusBadge status={im.status} />
          {im.favorito && <span className="y2k-sticker" style={{ background: 'var(--pink)' }}><Star size={11} fill="#111" /> prioritário</span>}
        </div>
        <h2 className="ff-head" style={{ fontSize: 24, marginBottom: 14 }}>{im.titulo}</h2>

        <div className="y2k-photo-frame" style={{ width: '100%', height: 280, marginBottom: 10, position: 'relative', overflow: 'hidden' }}>
          {gallery.length > 0 ? <img src={gallery[photoIdx]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageOff size={36} />}
          {gallery.length > 1 && (
            <>
              <button className="y2k-icon-btn" style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }} onClick={() => setPhotoIdx((i) => (i - 1 + gallery.length) % gallery.length)}><ChevronLeft size={15} /></button>
              <button className="y2k-icon-btn" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }} onClick={() => setPhotoIdx((i) => (i + 1) % gallery.length)}><ChevronRight size={15} /></button>
            </>
          )}
        </div>
        {gallery.length > 1 && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto' }}>
            {gallery.map((g, i) => <img key={i} src={g} onClick={() => setPhotoIdx(i)} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8, border: i === photoIdx ? '3px solid var(--pink)' : '2px solid var(--ink)', cursor: 'pointer' }} />)}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <div className="y2k-card" style={{ padding: 14, boxShadow: 'none' }}>
            <div className="y2k-label">Comparação de preço</div>
            {desconto ? (
              <>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}><s>{formatBRL(im.precoAnterior)}</s></div>
                <div className="ff-stat" style={{ fontSize: 26 }}>{formatBRL(im.precoAtual)}</div>
                <span className="y2k-sticker" style={{ background: 'var(--mint)' }}>-{desconto.percentual.toFixed(1)}% · economia de {formatBRL(desconto.valor)}</span>
              </>
            ) : <div className="ff-stat" style={{ fontSize: 26 }}>{formatBRL(im.precoAtual)}</div>}
          </div>
          <div className="y2k-card" style={{ padding: 14, boxShadow: 'none' }}>
            <div className="y2k-label">Informações gerais</div>
            <p className="ff-ui" style={{ fontSize: 13, margin: '2px 0' }}><MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />{im.endereco ? `${im.endereco}, ` : ''}{im.bairro}, {im.cidade}</p>
            <p className="ff-ui" style={{ fontSize: 13, margin: '2px 0' }}><User size={12} style={{ display: 'inline', marginRight: 4 }} />{im.corretor || '—'}</p>
            <p className="ff-ui" style={{ fontSize: 13, margin: '2px 0' }}><Phone size={12} style={{ display: 'inline', marginRight: 4 }} />{im.telefone || '—'}</p>
            <p className="ff-ui" style={{ fontSize: 13, margin: '2px 0' }}>Cadastrado em {formatDateBR(im.dataCadastro)}</p>
            <p className="ff-ui" style={{ fontSize: 13, margin: '2px 0' }}>{im.visualizacoes || 0} visualizações</p>
          </div>
        </div>

        {im.tags && im.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {im.tags.map((t, i) => <span key={i} className="y2k-sticker" style={{ background: 'var(--pink-light)' }}><Tag size={10} /> {t}</span>)}
          </div>
        )}

        {linkRows.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div className="y2k-label">Links do anúncio</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {linkRows.map(([label, url, Icon]) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="y2k-btn" style={{ textDecoration: 'none', fontSize: 12 }}><Icon size={13} /> {label}</a>
              ))}
            </div>
          </div>
        )}

        {im.observacoes && (
          <div style={{ marginBottom: 16 }}>
            <div className="y2k-label">Observações</div>
            <p className="ff-ui" style={{ fontSize: 13, background: 'var(--pink-light)', padding: 10, borderRadius: 8, border: '2px solid var(--ink)' }}>{im.observacoes}</p>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <div className="y2k-label">Histórico de alterações</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto' }} className="y2k-scrollbar">
            {[...(im.historico || [])].sort((a, b) => new Date(b.data) - new Date(a.data)).map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12.5 }} className="ff-ui">
                <span style={{ color: 'var(--muted)', flexShrink: 0, width: 80 }}>{formatDateBR(h.data)}</span>
                <span>{h.descricao} <span style={{ color: 'var(--muted)' }}>— {h.usuario}</span></span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <select className="y2k-select" style={{ width: 'auto' }} value={im.status} onChange={(e) => onChangeStatus(im.id, e.target.value)}>
            {STATUS_KEYS.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
          </select>
          <button className="y2k-btn" onClick={() => onToggleFav(im.id)}><Star size={14} fill={im.favorito ? '#111' : 'none'} /> {im.favorito ? 'Remover prioridade' : 'Marcar prioridade'}</button>
          <button className="y2k-btn" onClick={() => onCopy(im)}><Link2 size={14} /> Copiar link</button>
          <button className="y2k-btn y2k-btn-pink" onClick={() => onEdit(im.id)}><Pencil size={14} /> Editar</button>
          <button className="y2k-btn" onClick={() => onDelete(im.id)} style={{ marginLeft: 'auto' }}><Trash2 size={14} /> Excluir</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- ROOT APP ---------------------------------- */

export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [imoveis, setImoveis] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState('dashboard');
  const [editId, setEditId] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Bungee&family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const stored = await window.storage.get('crm_imoveis', false);
        if (stored && stored.value) {
          setImoveis(JSON.parse(stored.value));
        } else {
          const seed = seedData();
          setImoveis(seed);
          await window.storage.set('crm_imoveis', JSON.stringify(seed), false);
        }
      } catch (e) {
        setImoveis(seedData());
      } finally {
        setLoaded(true);
      }
      try {
        const t = await window.storage.get('crm_theme', false);
        if (t && t.value) setTheme(t.value);
      } catch (e) { /* default light */ }
    })();
  }, []);

  const persist = (next) => {
    setImoveis(next);
    window.storage.set('crm_imoveis', JSON.stringify(next), false).catch((e) => console.error(e));
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    window.storage.set('crm_theme', next, false).catch(() => {});
  };

  const handleSaveForm = (payload, initial) => {
    if (initial) {
      const old = imoveis.find((i) => i.id === initial.id);
      const historico = [...(old.historico || [])];
      if (Number(old.precoAtual) !== Number(payload.precoAtual)) {
        historico.push({ data: new Date().toISOString(), tipo: 'preco', descricao: `Preço alterado de ${formatBRL(old.precoAtual)} para ${formatBRL(payload.precoAtual)}`, usuario: user.name });
      }
      if (old.status !== payload.status) {
        historico.push({ data: new Date().toISOString(), tipo: 'status', descricao: `Status alterado de "${STATUS_META[old.status].label}" para "${STATUS_META[payload.status].label}"`, usuario: user.name });
      }
      const linkFields = ['linkInstagram', 'linkFacebook', 'linkMarketplace', 'linkSite', 'linkWhatsapp', 'linkPrincipal'];
      if (linkFields.some((f) => old[f] !== payload[f])) {
        historico.push({ data: new Date().toISOString(), tipo: 'links', descricao: 'Links de anúncio atualizados', usuario: user.name });
      }
      if (old.observacoes !== payload.observacoes) {
        historico.push({ data: new Date().toISOString(), tipo: 'descricao', descricao: 'Observações atualizadas', usuario: user.name });
      }
      const updated = { ...old, ...payload, dataAlteracao: Number(old.precoAtual) !== Number(payload.precoAtual) ? new Date().toISOString() : old.dataAlteracao, historico };
      persist(imoveis.map((i) => (i.id === old.id ? updated : i)));
      showToast('Imóvel atualizado!');
    } else {
      const now = new Date().toISOString();
      const novo = { ...payload, id: uid(), visualizacoes: 0, dataCadastro: now, dataAlteracao: now, favorito: false, historico: [{ data: now, tipo: 'criacao', descricao: 'Imóvel cadastrado no sistema', usuario: user.name }] };
      persist([novo, ...imoveis]);
      showToast('Imóvel cadastrado!');
    }
    setEditId(null);
    setView('listagem');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este imóvel?')) return;
    persist(imoveis.filter((i) => i.id !== id));
    if (detailId === id) setDetailId(null);
    showToast('Imóvel excluído.');
  };

  const handleToggleFav = (id) => persist(imoveis.map((i) => (i.id === id ? { ...i, favorito: !i.favorito } : i)));

  const handleChangeStatus = (id, status) => {
    persist(imoveis.map((i) => {
      if (i.id !== id) return i;
      const historico = [...(i.historico || []), { data: new Date().toISOString(), tipo: 'status', descricao: `Status alterado de "${STATUS_META[i.status].label}" para "${STATUS_META[status].label}"`, usuario: user.name }];
      return { ...i, status, historico };
    }));
  };

  const handleCopyLink = (im) => {
    const link = im.linkPrincipal || im.linkSite || im.linkInstagram || im.linkMarketplace || '';
    if (!link) { showToast('Este imóvel não tem link cadastrado.'); return; }
    navigator.clipboard?.writeText(link).then(() => showToast('Link copiado!')).catch(() => showToast('Não foi possível copiar.'));
  };

  const handleOpenDetail = (id) => {
    persist(imoveis.map((i) => (i.id === id ? { ...i, visualizacoes: (i.visualizacoes || 0) + 1 } : i)));
    setDetailId(id);
  };

  if (!user) return <LoginView onLogin={setUser} />;

  const editingImovel = editId ? imoveis.find((i) => i.id === editId) : null;
  const detailImovel = detailId ? imoveis.find((i) => i.id === detailId) : null;

  const NAV = [
    { key: 'dashboard', label: 'Dashboard', icon: Home },
    { key: 'listagem', label: 'Imóveis', icon: Building2 },
    { key: 'cadastro', label: 'Cadastrar', icon: PlusCircle },
    { key: 'favoritos', label: 'Prioritários', icon: Star },
  ];

  return (
    <div className="y2k-root" data-theme={theme}>
      <style>{GLOBAL_STYLES}</style>
      <Toast toast={toast} />

      <div className="y2k-header no-print">
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div className="ff-display" style={{ fontSize: 20, flexShrink: 0 }}>GLOSSY<span style={{ color: 'var(--pink)' }}>°</span></div>

          <div style={{ position: 'relative', flex: 1, minWidth: 160, maxWidth: 360 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: 10, opacity: .6 }} />
            <input className="y2k-input" style={{ paddingLeft: 32 }} placeholder="Buscar por código, cidade, bairro, corretor..." value={search}
              onChange={(e) => { setSearch(e.target.value); if (view !== 'listagem' && view !== 'favoritos') setView('listagem'); }} />
          </div>

          <div style={{ display: 'flex', gap: 4, marginLeft: 'auto', flexWrap: 'wrap' }}>
            {NAV.map((n) => (
              <button key={n.key} className={`y2k-nav-tab ${view === n.key ? 'active' : ''}`} onClick={() => { setView(n.key); setEditId(null); }}>
                <n.icon size={15} /> <span>{n.label}</span>
              </button>
            ))}
          </div>

          <button className="y2k-icon-btn" onClick={toggleTheme} title="Alternar tema">{theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}</button>
          <div className="y2k-hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="y2k-sticker" style={{ background: 'var(--mint)' }}><User size={11} /> {user.name} · {user.role}</span>
            <button className="y2k-icon-btn" onClick={() => setUser(null)} title="Sair"><LogOut size={16} /></button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '22px 18px 60px' }}>
        {!loaded ? (
          <p className="ff-ui" style={{ color: 'var(--muted)' }}>Carregando imóveis...</p>
        ) : view === 'dashboard' ? (
          <DashboardView imoveis={imoveis} onOpenDetail={handleOpenDetail} onGoTo={setView} />
        ) : view === 'cadastro' || (view === 'listagem' && editId) ? (
          <FormView initial={editingImovel} onSave={handleSaveForm} onCancel={() => { setEditId(null); setView('listagem'); }} />
        ) : view === 'listagem' ? (
          <ListView imoveis={imoveis} search={search} onView={handleOpenDetail} onEdit={(id) => { setEditId(id); setView('listagem'); }}
            onDelete={handleDelete} onCopy={handleCopyLink} onToggleFav={handleToggleFav} onlyFavorites={false} title="Todos os imóveis" />
        ) : view === 'favoritos' ? (
          <ListView imoveis={imoveis} search={search} onView={handleOpenDetail} onEdit={(id) => { setEditId(id); setView('listagem'); }}
            onDelete={handleDelete} onCopy={handleCopyLink} onToggleFav={handleToggleFav} onlyFavorites title="Imóveis prioritários" />
        ) : null}
      </div>

      {detailImovel && (
        <DetailView im={detailImovel} onClose={() => setDetailId(null)}
          onEdit={(id) => { setDetailId(null); setEditId(id); setView('listagem'); }}
          onDelete={(id) => { setDetailId(null); handleDelete(id); }}
          onToggleFav={handleToggleFav} onChangeStatus={handleChangeStatus} onCopy={handleCopyLink} />
      )}
    </div>
  );
}
