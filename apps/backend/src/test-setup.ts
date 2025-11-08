const TEST_JWT_SECRET = 'test-secret-should-be-long-and-random-123456';

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = TEST_JWT_SECRET;
}
