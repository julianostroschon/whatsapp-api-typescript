import { describe } from 'node:test'

import { constructToken } from '../sign'

describe('Assinar token', (): void => {
  test('message', (): void => {
    const options = constructToken('message', '5599999999')
    expect(options).toEqual({ token: expect.any(String) })
  })
});