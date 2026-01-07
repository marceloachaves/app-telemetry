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
