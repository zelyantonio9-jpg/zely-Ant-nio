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
  const { currentUser } = useMarket();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'assistant' | 'user'; content: string }>>([
    {
      role: 'assistant',
      content: `Olá ${currentUser.name}! Sou o **AO Assist**, a inteligência especializada no ecossistema económico do AO MARKET.\n\nComo posso ajudar hoje?\n- 🌾 **Produtores**: Escrever descrições de lotes e calcular rendimento de colheita\n- 🛒 **Compradores & Grossistas**: Encontrar fornecedores de grãos, café e cimento por província\n- 🛡️ **Formalização**: Simular enquadramento na Segurança Social (INSS) e benefícios do PREI`
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

      if (q.includes('milho') || q.includes('huambo') || q.includes('comprar')) {
        reply = `Encontrei produtores certificados no Huambo:\n\n1. **Milho Amarelo Seco Grão Selecionado do Bailundo (Saco 50kg)**\n- Produtor: Manuel Kalandula (Fazenda Vale do Bailundo)\n- Preço: 18.500 Kz (Desconto B2B: 15.200 Kz para +200 sacos)\n- Frete para Luanda: ~48.000 Kz via Camião 3.5T com tempo estimado de 2 dias úteis.\n\nDeseja adicionar este lote diretamente ao seu carrinho com garantia AO Protect?`;
      } else if (q.includes('inss') || q.includes('segurança social') || q.includes('formalizar') || q.includes('prei')) {
        reply = `**Guia de Formalização e Segurança Social (INSS Angola):**\n\n- **Regime**: Trabalhador por Conta Própria (Decreto Presidencial n.º 227/18).\n- **Contribuição**: ~8% sobre a base declarada (mínimo de 70.000 Kz = 5.600 Kz/mês).\n- **Benefícios Garantidos**: Reforma por Velhice, Subsídio de Maternidade (90 dias), Invalidez e Sobrevivência à família.\n- **Vantagem no AO MARKET**: Ao registar o seu número de beneficiário, a sua conta recebe o **Selo de Vendedor Formalizado de Nível 4**, permitindo faturar a grandes empresas.`;
      } else if (q.includes('descrever') || q.includes('lote') || q.includes('colheita')) {
        reply = `Aqui está uma sugestão de descrição profissional para o seu lote:\n\n*"Lote de alta pureza colhido na safra atual no Planalto Central de Angola. Grãos selecionados, teor de humidade controlado (<13%), sem impurezas ou pragas. Acondicionado em sacaria nova de ráfia de 50kg, pronto para expedição rodoviária imediata com rastreio AO Logistics e emissão de fatura comercial."*`;
      } else {
        reply = `Compreendido! O ecossistema AO MARKET integra todas as etapas da cadeia: produção no campo, pagamento protegido via AO PAY, frete rodoviário interprovincial com PIN OTP e incentivos à formalização com o INSS.\n\nComo gostaria de prosseguir?`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setIsThinking(false);
    }, 800);
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
