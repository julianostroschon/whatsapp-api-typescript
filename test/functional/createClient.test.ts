import supertest from "supertest";

describe("Beach createClient funcitonal test", () => {
  it('should create a client', async () => {
    const { body, status } = await supertest(app).post('/api/v1/send')
    expect(status).toBe(400)
    expect(body).toBe([{
      "time": "2000-08-08"
    }])
  })
  })