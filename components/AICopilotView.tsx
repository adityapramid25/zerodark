'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Trash2, 
  RefreshCw, 
  Lightbulb, 
  Compass, 
  ShieldCheck, 
  Sliders, 
  Copy, 
  Check, 
  Cpu, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AIChatMessage, ScanRecord } from '@/types/scan';
import { 
  getStoredChatHistory, 
  saveStoredChatHistory, 
  getStoredGeminiKey, 
  getStoredGeminiModel 
} from '@/utils/storage';

interface AICopilotViewProps {
  initialScanContext?: ScanRecord | null;
  onOpenModelSettings?: () => void;
  onNavigateToTab?: (tab: 'scan' | 'policy' | 'heatmap') => void;
}

const QUICK_PROMPTS = [
  {
    icon: Lightbulb,
    label: 'Tips Kurangi Polusi Cahaya',
    prompt: 'Bagaimana cara terbaik mengurangi polusi cahaya di lingkungan perumahan saya?',
  },
  {
    icon: ShieldCheck,
    label: 'Dampak Lampu Biru & Satwa',
    prompt: 'Mengapa cahaya LED biru (>4000K) sangat merusak bagi satwa nokturnal dan melatonin manusia?',
  },
  {
    icon: Sliders,
    label: 'Draf Regulasi Langit Gelap',
    prompt: 'Rancang poin-poin utama rancangan peraturan daerah (Perda) untuk membatasi lampu sorot billboard dan PJU.',
  },
  {
    icon: Compass,
    label: 'Panduan AQI & Masker',
    prompt: 'Jika AQI menunjukkan angka di atas 150, langkah proteksi kesehatan apa yang wajib dilakukan?',
  },
];

export const AICopilotView: React.FC<AICopilotViewProps> = ({
  initialScanContext,
  onOpenModelSettings,
  onNavigateToTab,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeScanContext, setActiveScanContext] = useState<ScanRecord | null>(initialScanContext || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const history = getStoredChatHistory();
    if (history.length > 0) {
      setMessages(history);
    } else {
      // Default welcome message
      const welcomeMsg: AIChatMessage = {
        id: 'welcome-1',
        role: 'assistant',
        content: `Halo! Saya **ZeroDark Eco-Copilot**, asisten kecerdasan buatan spesialis konservasi atmosfer, analisis kualitas udara (AQI), dan mitigasi polusi cahaya (Skala Bortle).\n\nAda yang ingin Anda konsultasikan atau tanyakan mengenai hasil pemindaian dan tata kelola lingkungan Anda?`,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMsg]);
      saveStoredChatHistory([welcomeMsg]);
    }
  }, []);

  useEffect(() => {
    if (initialScanContext) {
      setActiveScanContext(initialScanContext);
    }
  }, [initialScanContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toISOString(),
      scanContext: activeScanContext
        ? {
            locationName: activeScanContext.coordinates.locationName,
            mode: activeScanContext.mode,
            label: activeScanContext.metadata.label,
            metricValue: activeScanContext.metadata.metricValue,
            metricUnit: activeScanContext.metadata.metricUnit,
            severity: activeScanContext.metadata.severity,
          }
        : undefined,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const apiKey = getStoredGeminiKey();
      const model = getStoredGeminiModel();

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg.content,
          history: newMessages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          scanContext: activeScanContext
            ? {
                locationName: activeScanContext.coordinates.locationName,
                mode: activeScanContext.mode,
                label: activeScanContext.metadata.label,
                metricValue: activeScanContext.metadata.metricValue,
                metricUnit: activeScanContext.metadata.metricUnit,
                severity: activeScanContext.metadata.severity,
                faunaHealthImpact: activeScanContext.metadata.faunaHealthImpact,
                ecoTip: activeScanContext.metadata.ecoTip,
              }
            : undefined,
          apiKey: apiKey || undefined,
          model: model || 'gemini-1.5-flash',
        }),
      });

      const data = await res.json();
      const assistantReply: string = data.reply || 'Mohon maaf, terjadi kendala saat memproses jawaban AI.';

      const assistantMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: assistantReply,
        timestamp: new Date().toISOString(),
      };

      const updated = [...newMessages, assistantMsg];
      setMessages(updated);
      saveStoredChatHistory(updated);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: AIChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Terjadi kendala saat menghubungi AI Copilot: ${err.message || 'Error jaringan'}. Silakan periksa kunci API Anda di menu Pengaturan Model AI.`,
        timestamp: new Date().toISOString(),
      };
      const updated = [...newMessages, errorMsg];
      setMessages(updated);
      saveStoredChatHistory(updated);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    const welcomeMsg: AIChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: `Riwayat percakapan telah dibersihkan. Silakan ajukan pertanyaan baru mengenai kualitas udara atau konservasi langit malam!`,
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMsg]);
    saveStoredChatHistory([welcomeMsg]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-3 pb-24 animate-in fade-in duration-300 flex flex-col h-full min-h-[580px]">
      {/* Header Info Banner */}
      <div className="clay-card-base p-3.5 bg-[#161F30] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#142823] border border-emerald-500/40 flex items-center justify-center shadow-inner">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black text-white">ZeroDark Eco-Copilot</h2>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                Gemini 1.5
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Asisten Konservasi Atmosfer & Ekologi AI</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenModelSettings && (
            <button
              onClick={onOpenModelSettings}
              className="p-2 rounded-xl bg-[#0C121E] border border-white/10 text-slate-400 hover:text-white hover:border-emerald-500/40 transition-colors"
              title="Pengaturan Kunci API Gemini"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          )}

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl bg-[#0C121E] border border-white/10 text-slate-400 hover:text-red-400 transition-colors"
            title="Bersihkan Riwayat Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active Scan Context Reference Badge */}
      {activeScanContext && (
        <div className="p-2.5 rounded-2xl bg-[#142823] border border-emerald-500/40 flex items-center justify-between text-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <div className="line-clamp-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Konteks Scan Aktif:
              </span>
              <span className="text-xs font-bold text-emerald-300">
                {activeScanContext.metadata.label} ({activeScanContext.coordinates.locationName})
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveScanContext(null)}
            className="text-[10px] text-slate-400 hover:text-slate-200 px-2 py-1 bg-black/40 rounded-lg"
          >
            Lepas
          </button>
        </div>
      )}

      {/* Chat Messages Stream Viewport */}
      <div className="flex-1 space-y-3 min-h-[320px] max-h-[480px] overflow-y-auto px-1 pr-2">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-[#142823] border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4 text-emerald-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-slate-950 font-medium rounded-tr-sm shadow-[0_4px_14px_rgba(16,185,129,0.3)]'
                    : 'bg-[#161F30] border border-white/10 text-slate-200 rounded-tl-sm shadow-[inset_1px_1px_2px_rgba(255,255,255,0.08)]'
                }`}
              >
                {/* Scan Context Tag if attached to message */}
                {msg.scanContext && (
                  <div className="mb-2 p-1.5 rounded-lg bg-black/30 text-[10px] text-slate-300 flex items-center gap-1">
                    <span className="font-bold">📍 Konteks:</span>
                    <span>
                      {msg.scanContext.label} ({msg.scanContext.locationName})
                    </span>
                  </div>
                )}

                {/* Message Text with Markdown formatting support */}
                <div className="whitespace-pre-wrap space-y-1">
                  {msg.content}
                </div>

                {/* Copy button for assistant */}
                {!isUser && (
                  <div className="flex justify-end items-center gap-2 mt-2 pt-1 border-t border-white/5 text-[10px] text-slate-400">
                    <span>ZeroDark AI Engine</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                      title="Salin Pesan"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-slate-300">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#142823] border border-emerald-500/40 flex items-center justify-center shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            </div>
            <div className="bg-[#161F30] border border-white/10 rounded-2xl p-3.5 text-xs text-emerald-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>ZeroDark AI sedang memproses penalaran ekologis...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
          Topik Konsultasi Cepat:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {QUICK_PROMPTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1.5 rounded-xl bg-[#0C121E] border border-white/10 hover:border-emerald-500/40 text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
              >
                <Icon className="w-3 h-3 text-emerald-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="clay-card-base p-2 bg-[#161F30] flex items-center gap-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Tanyakan analisis AI, satwa, atau kebijakan..."
          disabled={isLoading}
          className="flex-1 bg-transparent px-2.5 py-2 text-xs text-white placeholder-slate-500 outline-none"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputPrompt.trim() || isLoading}
          className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
            inputPrompt.trim() && !isLoading
              ? 'clay-btn-mint text-slate-950 font-black shadow-md'
              : 'bg-[#0C121E] text-slate-600 border border-white/5 cursor-not-allowed'
          }`}
          title="Kirim Pesan"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
