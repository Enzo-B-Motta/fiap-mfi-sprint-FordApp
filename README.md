# Ford AI — Desafio 01, Sprint 3 Mobile

Aplicativo Expo/React Native para consultar fichas técnicas de concorrentes na [CarAPI](https://carapi.app/docs/) e comparar versões escolhidas com uma Ford Ranger Raptor brasileira cadastrada manualmente. A CarAPI cobre veículos vendidos **nos EUA**; neste protótipo, a busca aceita anos de **2015 a 2020** (2020 por padrão). Uma versão brasileira pode ter ficha diferente da versão americana de mesmo nome.

## Rodar no VS Code

1. Instale Node.js e execute `npm ci` na pasta do projeto.
2. Crie um arquivo `.env.local` na raiz com as duas variáveis indicadas no `.env.example` e os valores da conta CarAPI. O arquivo é ignorado pelo Git. Reinicie o Expo após editar.
3. Execute `npm run carapi:check`: o diagnóstico testa login, busca de versões e motor sem imprimir chave ou JWT.
4. Execute `npx expo start`. Abra o QR Code com Expo Go no Android ou pressione `w` para abrir no navegador. Pesquise, por exemplo: `Toyota` / `Camry` / versão `LE` / ano `2020`.
5. Escolha uma versão na lista. O app obtém motor, consumo e carroceria pelo mesmo `trim_id`, converte hp para cv, lb-ft para kgfm e mpg dos EUA para km/l, e salva o carro no SQLite local. Abra **Comparar veículos** para escolher qualquer concorrente salvo e comparar com a Raptor.

A tela de pesquisa também aceita atributos separados por vírgula (por exemplo, `potência, torque, suspensão`). A lista de saída segue os nomes pedidos; informações que a fonte não oferece aparecem explicitamente como indisponíveis. A ficha completa é salva para comparação independentemente do filtro de exibição.

## Dados e persistência

- A Ranger Raptor 2024 é inserida no banco local como referência manual. Os valores cadastrados incluem 397 cv e 59,4 kgfm; o consumo ficou sem valor confirmado.
- As fichas dos concorrentes vêm dos endpoints `trims/v2`, `engines/v2`, `mileages/v2` e `bodies/v2`. O app não mistura versões: seleciona o ID da versão e busca as três fichas com esse ID.
- O APK usa `expo-sqlite` para salvar concorrentes entre sessões. No navegador, usa armazenamento local como alternativa. Favoritos e histórico continuam apenas em memória.
- Economia da CarAPI usa medição EPA; não atribua um vencedor ao comparar consumo com um dado brasileiro sem metodologia equivalente. Ausência de dado não vale zero. A CarAPI não fornece suspensão e lista detalhada de equipamentos nesses endpoints.
- Não há modelo de ML integrado nesta tela. A comparação mostra valores e não é apresentada como inferência de IA.

## Erros de autenticação e rede

O login envia `api_token` e `api_secret` para `/api/auth/login` e recebe um JWT em texto. O app guarda o JWT na memória e faz novo login quando necessário; se uma consulta responder 401, renova o JWT uma vez. Um 403 pode indicar bloqueio de rede/Cloudflare ou falta de acesso ao endpoint, **não prova** que a chave expirou. 429 indica limite de requisições. A CarAPI também pode restringir recursos conforme o plano da conta.

Se a consulta falhar no celular, rode `npm run carapi:check` no computador da mesma rede e anote apenas os códigos HTTP exibidos. No teste de desenvolvimento com as credenciais fornecidas pelo grupo, login, versões, motor, consumo e carroceria responderam 200 para Toyota Camry 2020; confirme novamente no ambiente da entrega.

**No navegador**, a CarAPI bloqueia chamadas diretas por CORS. O projeto usa a rota `/carapi` do próprio Expo Router: ela lê as credenciais do `.env.local` no servidor iniciado por `npx expo start` e encaminha somente as quatro consultas de fichas técnicas. Não é necessário abrir outro terminal nem iniciar outro servidor. Para publicar a versão web, use uma hospedagem compatível com as API Routes do Expo.

## APK

O perfil `preview` em `eas.json` gera APK: `npx eas-cli@latest build --platform android --profile preview`. O grupo precisa conectar sua conta Expo e configurar as duas variáveis `EXPO_PUBLIC_CARAPI_*` também no ambiente EAS do build, pois o `.env.local` não deve ser enviado ao repositório. Instale e teste o APK em dispositivo físico ou emulador antes de entregar. **O APK não está incluído neste ZIP.**

## Credenciais

Este é um protótipo local. No navegador, o secret fica na API Route do Expo; no Expo Go/APK, variáveis `EXPO_PUBLIC_*` são embutidas no aplicativo, mesmo que `.env.local` esteja fora do Git. **Não publique o APK ou o ZIP com o secret da CarAPI.** Para publicação segura, mova também o login e as consultas do app Android para um backend que guarde o secret no servidor. Se o ZIP ou APK com credenciais for divulgado, revogue e substitua o secret.

Fontes: [Autenticação CarAPI](https://carapi.app/docs/api/auth/), [fichas técnicas CarAPI](https://carapi.app/features/json-api-specs/), [variáveis Expo](https://docs.expo.dev/guides/environment-variables/), [Ranger Raptor Ford Brasil](https://www.ford.com.br/picapes/ranger-raptor/).
