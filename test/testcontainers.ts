import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { StartedTestContainer } from 'testcontainers';
import { ClickHouseContainer } from '@testcontainers/clickhouse';

export let postgresContainer: StartedPostgreSqlContainer;
export let clickhouseContainer: StartedTestContainer;

export async function startContainers() {
  postgresContainer = await new PostgreSqlContainer('postgres:15')
    .withDatabase('testdb')
    .withUsername('test')
    .withPassword('test')
    .start();

  clickhouseContainer = await new ClickHouseContainer(
    'clickhouse/clickhouse-server:23',
  )
    .withUsername('meuuser')
    .withPassword('minhasenha')
    .withDatabase('telemetry')
    .start();

  // clickhouseContainer = await new GenericContainer(
  //   'clickhouse/clickhouse-server:23',
  // )
  //   .withExposedPorts(8123)
  //   .start();

  // Configurar variáveis de ambiente para os serviços NestJS usarem
  process.env.DATABASE_URL = postgresContainer.getConnectionUri();
  process.env.POSTGRES_HOST = postgresContainer.getHost();
  process.env.POSTGRES_PORT = postgresContainer.getPort().toString();
  process.env.POSTGRES_USER = postgresContainer.getUsername();
  process.env.POSTGRES_PASSWORD = postgresContainer.getPassword();
  process.env.POSTGRES_DB = postgresContainer.getDatabase();

  process.env.CLICKHOUSE_HOST = clickhouseContainer.getHost();
  process.env.CLICKHOUSE_PORT = clickhouseContainer
    .getMappedPort(8123)
    .toString();
  process.env.CLICKHOUSE_URL = `http://${clickhouseContainer.getHost()}:${clickhouseContainer.getMappedPort(8123)}`;
  process.env.CLICKHOUSE_USER = 'meuuser';
  process.env.CLICKHOUSE_PASSWORD = 'minhasenha';
  process.env.CLICKHOUSE_DB = 'telemetry';
}

export async function stopContainers() {
  await postgresContainer?.stop();
  await clickhouseContainer?.stop();
}
