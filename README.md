# Ford AI

O Ford AI é um aplicativo para pesquisar carros e comparar a ficha deles com a da Ford Ranger Raptor. Fizemos o projeto na Sprint 3 de Mobile da FIAP, como parte do desafio da Ford.

A Ranger Raptor está cadastrada no aplicativo. Os outros carros são pesquisados na CarAPI, e a busca aceita modelos de **2015 a 2020**. Depois de escolher a versão, dá para salvar o carro e colocar os dados lado a lado.


## Integrantes

| Nome | RM | GitHub |
| --- | --- | --- |
| Eduardo da Silva Lima | RM554804 | [@Eduardo-25](https://github.com/Eduardo-25) |
| Estevam Melo | RM555124 | [@StkStevens](https://github.com/StkStevens) |
| Enzo Bonacasata Motta | RM555372 | [@Enzo-B-Motta](https://github.com/Enzo-B-Motta) |
| Guilherme Ulacco | RM558418 | [@GuilhermeUcadete](https://github.com/GuilhermeUcadete) |
| Matheus Hostim | RM556517 | [@MatheusHostim](https://github.com/MatheusHostim) |

---

## Como iniciar o projeto

Você precisa ter o Node.js instalado e também ter um emulador para abrir o aplicativo android

1. Clone o repositório e entre na pasta:

   ```bash
   git clone https://github.com/Enzo-B-Motta/fiap-mfi-sprint-FordApp.git
   cd fiap-mfi-sprint-FordApp
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie o arquivo `.env.local` na raiz do projeto com as credenciais da sua conta CarAPI:

   ```env
   EXPO_PUBLIC_CARAPI_TOKEN=seu_token
   EXPO_PUBLIC_CARAPI_SECRET=seu_secret
   ```

4. Inicie o Expo:

   ```bash
   npx expo start
   ```

5. Quando o menu aparecer no terminal, aperte **`a`** para abrir no emulador Android.

Se quiser testar no celular, abra o **Expo Go** e escaneie o QR Code mostrado no terminal. Para abrir no navegador, aperte **`w`** com o Expo em execução. Se editar o `.env.local`, reinicie o Expo para carregar as credenciais.

Se a pesquisa não funcionar, este comando testa a conexão e as credenciais da CarAPI:

```bash
npm run carapi:check
```

## O que o aplicativo faz

- Pesquisa carros por marca, modelo e ano, com opção de filtrar a versão.
- Mostra as versões encontradas para você escolher a ficha técnica certa.
- Exibe motor, potência, torque, transmissão, tração, combustível, categoria e consumo quando a CarAPI tem esses dados.
- Salva os carros escolhidos e compara cada um deles com a Ranger Raptor.
- Mostra gráficos de potência e torque, além das fichas lado a lado.
- Tem telas de favoritos e histórico, mantidos durante a sessão do aplicativo.

## Tecnologias utilizadas

| Tecnologia | Uso no projeto |
| --- | --- |
| [React Native](https://reactnative.dev/) e [Expo](https://expo.dev/) | Aplicativo mobile |
| [Expo Router](https://docs.expo.dev/router/introduction/) | Navegação entre as telas |
| TypeScript | Código do aplicativo |
| [CarAPI](https://carapi.app/docs/) | Consulta das fichas técnicas |
| [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) | Carros salvos no Android |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Carros salvos na versão web |

## Sobre os dados

A **Ford Ranger Raptor** foi cadastrada manualmente como referência, por isso ela aparece na comparação mesmo sendo de fora do intervalo de 2015 a 2020. Os carros pesquisados vêm da CarAPI, que reúne versões vendidas nos Estados Unidos. Uma versão americana pode ter especificações diferentes da mesma versão vendida no Brasil.

Para mostrar os dados na mesma unidade, o aplicativo converte potência de hp para cv, torque de lb-ft para kgfm e consumo de mpg para km/l. Se a API não informar algum dado, o campo aparece como indisponível. Suspensão e lista detalhada de equipamentos, por exemplo, não vêm nas fichas consultadas.

Os carros usados na comparação ficam salvos localmente: SQLite no aplicativo mobile e AsyncStorage no navegador. Existe uma configuração de Supabase no código, mas a comparação ainda usa os carros salvos no dispositivo. O aplicativo mostra os dados para comparar; não há um modelo de IA fazendo previsões nesta versão.

O `.env.local` é ignorado pelo Git. Não coloque o token nem o secret no README ou em commits. Para publicar uma versão mobile, o secret precisa ficar em um servidor, já que variáveis `EXPO_PUBLIC_*` entram no aplicativo.
