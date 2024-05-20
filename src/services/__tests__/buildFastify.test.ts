import { describe, mock } from 'node:test'
// import assert from 'node:assert';

import { buildFastify } from '../server'
import { constructRoutes } from '../../routes';


describe('Criação do servidor', (): void => {
  test('servidor criado', async (): Promise<void> => {

    mock.fn(constructRoutes,  async (): Promise<void> => {})
    // calculateMock.mock.mockImplementationOnce(async () => firstValue, 0);

    // assert.strictEqual(req.reply(`${user}@${server}`), "554199999999@c.us");

    expect(await buildFastify('cliente')).resolves.toBeUndefined()

  })
});