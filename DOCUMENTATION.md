# AO MARKET • Documentação Oficial do Projeto
**Ecossistema Económico Digital de Produção Nacional, Logística Rodoviária & Formalização Social de Angola**

---

## 1. Visão Geral & Missão Estratégica

O **AO MARKET** é uma infraestrutura digital pública-privada concebida para resolver os estrangulamentos estruturais do comércio e do escoamento da produção nacional em Angola. A plataforma integra, num único ecossistema soberano e interoperável:

1. **Produção Nacional & Origem Direta:** Conexão direta entre cooperativas, camponeses, fazendas e indústrias das 18 províncias com os centros de consumo.
2. **Bolsa de Logística & Escoamento Rodoviário:** Gestão de cargas e transporte de retorno ao longo dos principais corredores estruturantes (EN100, EN120, EN230 e Corredor do Lobito).
3. **Pagamentos com Garantia de Custódia (AO Protect):** Sistema de retenção de fundos em escrow até à confirmação física da entrega e conformidade do lote.
4. **Validação de Entrega Criptográfica (PIN OTP):** Liquidação instantânea e inviolável através de código de 6 dígitos gerado ao comprador e validado pelo motorista no descarregamento.
5. **Inclusão & Formalização Social (INSS Angola):** Retenção automática e bonificada de contribuições para a segurança social de pequenos agricultores e camionistas autónomos.
6. **Comércio Grossista B2B (Mecanismo RFQ):** Negociação de lotes em grande escala com cotações personalizadas entre comerciantes e produtores.

---

## 2. Pilares de Utilizadores e Controlo de Acesso (RBAC)

A plataforma opera com modelo de autenticação unificada e comutação instantânea de perfis:

| Perfil | Código | Responsabilidades Principais |
| :--- | :--- | :--- |
| **Produtor / Cooperativa** | `producer` | Publicação de lotes de colheita, certificação "Feito em Angola", emissão de notas de saída e gestão de cotações RFQ. |
| **Comerciante B2B** | `merchant` | Emissão de pedidos de cotação em grande escala (RFQ), aquisição de lotes por grosso e abastecimento de armazéns/retalho. |
| **Transportador / Motorista** | `driver` / `logistics_company` | Aceitação de cargas na Bolsa de Frete, recolha na fazenda, transporte monitorizado e introdução do PIN OTP no destino. |
| **Comprador Geral** | `buyer` | Compra direta de produtos agrícolas e industriais, pagamento sob custódia e receção de mercadoria com PIN de segurança. |
| **Segurança Social** | `social_protection` | Monitorização de produtores formalizados, emissão de guias de liquidação INSS e microcrédito bonificado. |
| **Administrador Soberano** | `admin` | Gestão de disputas arbitrais, supervisão de corredores, conciliação do cofre escrow e auditoria tributária/formal. |

---

## 3. Arquitetura da Máquina de Estados (Ciclo da Ordem & Logística)

```
[ Criação do Pedido ]
         │
         ▼
[ ESCROW_LOCKED ] ──► (Fundos retidos pelo comprador no cofre seguro)
         │
         ▼
[ DISPATCHED ] ─────► (Produtor emite lote e publica carga na Bolsa de Frete)
         │
         ▼
[ DRIVER_ASSIGNED ] ─► (Camionista aceita frete com rota e seguro vinculados)
         │
         ▼
[ PICKED_UP ] ──────► (Carga recolhida na origem com validação de peso)
         │
         ▼
[ IN_TRANSIT ] ─────► (Transporte em curso com rastreio rodoviário interprovincial)
         │
         ▼
[ Validação PIN OTP ] ─► (Comprador fornece código de 6 dígitos na descarga)
         │
         ▼
[ DELIVERED ] ──────► (Validação concluída com sucesso)
         │
         ▼
[ SETTLED / CONCLUÍDO ] ─► (Libertação dos fundos ao Produtor e ao Transportador + Retenção INSS)
```

---

## 4. Mecanismos de Proteção & Segurança

### 4.1. Pagamento em Custódia (Escrow AO Protect)
- Os fundos do comprador ficam retidos em conta fiduciária segura no momento da encomenda.
- O produtor recebe a garantia de solvência antes de despachar a mercadoria.
- Em caso de desconformidade, é acionado o **Tribunal Arbitral Digital** (`DisputesPortal`), permitindo mediação, devolução total ou compensação parcial.

### 4.2. Confirmação de Entrega via PIN OTP
- No momento em que o pedido transita para `IN_TRANSIT`, o sistema gera um código OTP seguro associado à encomenda.
- Apenas o comprador destinatário tem acesso ao código na sua área de rastreio.
- Na receção física e conferência do lote, o comprador entrega o PIN ao motorista, que o valida na sua aplicação móvel/web, libertando de imediato a liquidação financeira.

### 4.3. Formalização Automática (INSS)
- Dedução automática de uma taxa percentual parametrizável (ex: 3% a 8%) sobre o valor transacionado por operadores individuais.
- Canalização direta para o número de inscrição INSS do produtor/motorista.
- Acesso automático a subsídios de invalidez, reforma rural e microcrédito produtivo de campanha.

---

## 5. Estrutura Técnica do Código

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Motion.
- **Backend / API:** Node.js / Express com modo SPA e endpoints de integração de inteligência artificial.
- **Gestão de Estado & Persistência:** `MarketContext` com persistência reativa e sincronização local imediata (`localStorage` versionado).
- **Dados Geográficos:** Mapeamento completo dos 164 municípios e 18 províncias de Angola (`angolaGeoData.ts`).

---

## 6. Portais & Componentes da Aplicação

1. `HomePageView`: Montra principal com pesquisa inteligente, filtro por província e atalhos de compra rápida.
2. `MarketplaceView`: Catálogo com filtros de província, categoria, selo Feito em Angola e ordenação.
3. `ProducerPortal`: Registo de lotes agrícolas, gestão de stock, manifesto de expedição e cotações RFQ.
4. `MerchantPortal`: Módulo de negociação grossista B2B, emissão e resposta a pedidos de cotação (RFQ).
5. `LogisticsPortal`: Bolsa de frete, corredores rodoviários e terminal de validação OTP do motorista.
6. `SocialProtectionPortal`: Painel de formalização INSS, emissão de guias e histórico de contribuições sociais.
7. `DisputesPortal`: Mecanismo de resolução e mediação arbitral de litígios e devoluções.
8. `AdminPortal`: Painel de controlo central, métricas macroeconómicas, auditoria e limpeza de dados.
9. `AIAssistantModal`: Assistente inteligente treinado nas rotas rodoviárias e cotações de mercado de Angola.

---

© 2026 AO MARKET • República de Angola. Todos os direitos reservados.
