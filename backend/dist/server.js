import { createApp } from './app.js';
import { env } from './config/env.js';
const app = createApp();
app.listen(env.PORT, () => {
    console.log(`BudgedIn API listening on port ${env.PORT}`);
    console.log(`Database connected via PgBouncer`);
});
