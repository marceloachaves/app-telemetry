# Sistema de telemetria

## API Node/Typescript

A A4 Solutions precisa validar um componente central de telemetria para o um de seus
sistemas. Sua missão é construir o núcleo de processamento que recebe dados de
sensores, valida a propriedade do dispositivo e armazena as leituras em uma base analítica
de série temporal.

### Especificações

- Utilizar docker compose para instâncias de banco
- Postgres Metadados tabelas _devices_. Colunas: id, name, tenant_id
- Clickhouse(Telemetria): deve conter tabela sensor_readings. Colunas: device_id, value(temperatura) e timestamp
- Use o Drizzle ORM.

#### obs: Utilizar o padrão Factory ou Singleton para instanciar seus serviços e repositórios.

### Tasks ~ 5 h

- [ ] Start de uma aplicação NestJs **1h**
  - Criar a estrutura base da aplicação
  - Criação das instancias de base de dados
  - Configuração dos bancos
- [ ] Endpoints de Criação da API **1h** - POST /telemetry: Recebe { "deviceId": string, "value": number }. - Deve validar se o dispositivo pertence ao tenantId do usuário autenticado (simule
      o usuário logado via middleware ou JWT fixo). - Salvar o registro no ClickHouse.

- [ ] Endpoints de Leitura da API **1h** - GET /telemetry/:deviceId: Retorna as últimas 10 leituras do sensor. - Importante: Garanta que um usuário de um Tenant não consiga ver dados de
      dispositivos de outro Tenant.

- [ ] Adicione ao menos um teste de integração que valide o isolamento entre Tenants. **1h**

- [ ] Refatoração, testes e melhorias **1h**

---

## Como rodar a aplicação

Primeiramente é subir os bancos no docker-compose. É necessário rodar o docker-compose na raiz do projeto.

```bash
docker compose up -d
```

Com os containers healthy. O próximo passo é rodar:

```bash
npm install
```

Depois é necessário fazer a migração e a inserção de dados na tabela de metadados devices no postgres:

```bash
npm run db:migrate
npm run db:seed
```

Já o clickhouse não foi feita a migração dessa forma. Foi criado um script na pasta /clickhouse/init/create_table.sql e ela é injetada diretamente no container do clickhouse. Foi feito dessa forma somente para facilitar e para demonstrar uma outra forma de subir localmente.

Com os bancos criados, agora é executar a aplicação. Pode usar o seguinte comando:

```bash
npm run start
```

Com a aplicação inicializada pode executar os seguintes comandos:

Para criação da telemetria(POST /telemetry):

```bash
curl --location 'localhost:3000/telemetry' \
--header 'Content-Type: application/json' \
--data '{
    "deviceId": "1",
    "value": 123
}'
```

Para busca da telemetria(GET /telemetry/:deviceId):

```bash
curl --location 'localhost:3000/telemetry/1'
```

---

## Teste de integração

Execute o seguinte comando:

```bash
npm run test:e2e
```
