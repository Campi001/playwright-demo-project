import { app } from './app';
import { env } from './utils/env';

const port = env.PORT;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});
