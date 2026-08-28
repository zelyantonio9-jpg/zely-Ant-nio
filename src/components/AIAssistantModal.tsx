import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { Logo } from './Logo';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, products, formatKz } = useMarket();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'assistant' | 'user'; content: string }>>([
    {
      role: 'assistant',
      content: `Olá ${currentUser.name}! Sou o **AO Assist**, o assistente oficial do ecossistema AO MARKET.\n\nComo posso ajudar hoje?\n- 🌾 **Produtores**: Escrever descrições técnicas de colheitas e publicar lotes\n- 🛒 **Compradores & Grossistas**: Consultar o catálogo em tempo real e cotações interprovinciais\n- 🛡️ **Formalização**: Apoio na integração com a Segurança Social (INSS Angola)`
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const newMsgs = [...messages, { role: 'user' as const, content: query }];
    setMessages(newMsgs);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('milho') || q.includes('huambo') || q.includes('comprar') || q.includes('produto') || q.includes('lote')) {
        const matching = products.filter(p => 
          p.title.toLowerCase().includes('milho') || 
          p.originProvince.toLowerCase().includes('huambo') ||
          p.category.toLowerCase().includes('graos')
        );

        if (matching.length > 0) {
          const p = matching[0];
          reply = `Encontrei **${matching.length}** lote(s) real(is) registado(s) no banco de dados:\n\n1. **${p.title}**\n- Fornecedor: ${p.producerName}\n- Origem: ${p.originMunicipality}, ${p.originProvince}\n- Preço: ${formatKz(p.price)} por ${p.unit}\n- Stock disponível: ${p.availableStock} ${p.unit}\n\nPode aceder ao Marketplace para submeter a sua ordem de compra ou solicitar frete integrado.`;
        } else if (products.length > 0) {
          reply = `Atualmente temos ${products.length} produto(s) ativo(s) na plataforma oficial. Pode explorar o catálogo completo no separador Marketplace.`;
        } else {
          reply = `Atualmente não existem produtos registados nesta categoria na base de dados. Se é produtor ou cooperativa agrícola, utilize o **Painel do Produtor** para cadastrar a sua colheita com fotos reais.`;
        }
      } else if (q.includes('inss') || q.includes('segurança social') || q.includes('formalizar') || q.includes('prei')) {
        reply = `**Guia de Formalização e Segurança Social (INSS Angola):**\n\n- **Regime**: Trabalhador por Conta Própria (Decreto Presidencial n.º 227/18).\n- **Benefícios Garantidos**: Reforma por Velhice, Subsídio de Maternidade (90 dias), Invalidez e Sobrevivência à família.\n- **Vantagem no AO MARKET**: Ao registar e validar o seu NIF/NISS no Portal INSS, o seu perfil recebe o **Selo de Conta Verificada**, permitindo faturar com conformidade legal.`;
      } else if (q.includes('descrever') || q.includes('lote') || q.includes('colheita')) {
        reply = `Aqui está um modelo de descrição técnica recomendada para lotes no AO MARKET:\n\n*"Lote agrícola de produção nacional colhido na época corrente. Especificação de grau e humidade controlados, acondicionado em sacaria apropriada, pronto para expedição com rastreio rodoviário e documentação de transporte oficial."*`;
      } else {
        reply = `O ecossistema AO MARKET conecta diretamente a produção agrícola, comércio grossista e transportadoras nas 18 províncias de Angola com base de dados centralizada no Firebase.\n\nComo posso ser útil na sua operação?`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        id="ai-assistant-modal"
        className="bg-white rounded-2xl max-w-xl w-full h-[580px] max-h-[90vh] shadow-2xl border border-slate-200 text-slate-900 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 bg-slate-50 text-slate-900 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-2.5">
            <Logo size="sm" variant="badge" />
            <div>
              <h2 className="text-xs font-bold font-display text-slate-900">AO Assist • Inteligência do Ecossistema</h2>
              <p className="text-[10px] text-slate-500">Apoio a produtores, cotações e formalização em Angola</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center space-x-2 overflow-x-auto text-[11px] shrink-0">
          <button
            onClick={() => handleSend('Como inscrever o meu negócio agrícola no INSS Angola?')}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-amber-400 rounded-xl whitespace-nowrap text-slate-700 text-[10px] font-medium cursor-pointer shadow-xs"
          >
            🛡️ Como formalizar no INSS?
          </button>
          <button
            onClick={() => handleSend('Preciso de cotação para 100 sacos de milho em Luanda')}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-amber-400 rounded-xl whitespace-nowrap text-slate-700 text-[10px] font-medium cursor-pointer shadow-xs"
          >
            🌾 Cotação de Milho no Huambo
          </button>
          <button
            onClick={() => handleSend('Ajuda-me a escrever a descrição de um lote de café da Gabela')}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-amber-400 rounded-xl whitespace-nowrap text-slate-700 text-[10px] font-medium cursor-pointer shadow-xs"
          >
            ☕ Descrever Lote de Café
          </button>
        </div>

        {/* Chat message history */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-slate-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex items-start space-x-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-line leading-relaxed text-xs ${
                m.role === 'user'
                  ? 'bg-amber-500 text-black font-semibold rounded-br-xs shadow-xs border border-amber-400'
                  : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200 shadow-xs'
              }`}>
                {m.content}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-black flex items-center justify-center shrink-0 mt-0.5 font-extrabold text-[9px] shadow-xs">
                  EU
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center space-x-2 text-slate-500 text-xs italic">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>AO Assist está a analisar a rede económica...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2 shrink-0">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte sobre produtos, províncias, fretes ou INSS..."
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim()}
            className="p-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black rounded-xl font-bold transition cursor-pointer border border-amber-400 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
