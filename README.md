# Maré — App do Passageiro (conectado à API real)

Esse projeto já fala de verdade com o backend publicado no Railway —
login, pedir corrida e acompanhar o status funcionam com dados reais
do banco de dados.

## Como publicar (sem instalar nada, direto do navegador)

1. Suba essa pasta (`frontend-passenger`) pro GitHub, do mesmo jeito que
   fizemos com o `backend` — cria um repositório novo chamado
   `mare-passageiro`, e arrasta o conteúdo dessa pasta pra lá.
2. Vá em **vercel.com** e entre com sua conta do GitHub.
3. Clique em **"Add New" → "Project"**, selecione o repositório
   `mare-passageiro`, e clique em **"Deploy"** (a Vercel já detecta
   sozinha que é um projeto Vite/React, não precisa configurar nada).
4. Em 1-2 minutos você recebe uma URL pública (tipo
   `mare-passageiro.vercel.app`) — esse é o link do app do passageiro
   funcionando de verdade, que dá pra abrir de qualquer celular.

## O que já funciona

- Cadastro e login de passageiro (de verdade, salvo no banco)
- Pedir corrida com pontos fixos de Fortaleza (o mapa de verdade entra
  depois, quando integrarmos localização em tempo real)
- Acompanhar o status da corrida atualizando a cada poucos segundos
- Aviso de zona de risco, se o trajeto passar por uma
- Escolha de forma de pagamento (Pix, cartão, espécie)

## O que falta pra virar produto final

- Mapa de verdade (Google Maps ou Mapbox) em vez dos pontos fixos
- Localização automática do celular (GPS)
- Conectar o app do motorista e o painel admin do mesmo jeito
