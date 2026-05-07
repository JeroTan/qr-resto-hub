import { handle } from '@astrojs/cloudflare/handler';
import { DurableObject } from 'cloudflare:workers';

export class OrderLiveCoordinator extends DurableObject<Env> {
  async fetch(): Promise<Response> {
    return new Response('Order live coordinator binding placeholder', { status: 501 });
  }
}

export default {
  async fetch(request, env, ctx) {
    return handle(request, env, ctx);
  }
} satisfies ExportedHandler<Env>;
