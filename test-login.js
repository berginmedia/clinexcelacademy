import { loginFn } from './src/lib/auth.ts';

async function test() {
  try {
    await loginFn({ data: { email: 'test', password: 'test' } });
  } catch (err) {
    console.error("ERROR CAUGHT:");
    console.error(err.stack);
  }
}

test();
