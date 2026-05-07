import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function readText(path: string): string {
  return readFileSync(path, 'utf8');
}

function readJsonc(path: string): unknown {
  const text = readText(path).replace(/,\s*([}\]])/g, '$1');
  return JSON.parse(text);
}

describe('foundation Cloudflare configuration', () => {
  it('defines only dev and prod Cloudflare environments', () => {
    const wrangler = readJsonc('wrangler.jsonc') as {
      env: Record<string, unknown>;
    };

    expect(Object.keys(wrangler.env).sort()).toEqual(['dev', 'prod']);
  });

  it('configures D1, R2, Durable Object, and assets bindings for both environments', () => {
    const wrangler = readJsonc('wrangler.jsonc') as {
      assets: { binding: string; directory: string };
      env: Record<
        string,
        {
          d1_databases: Array<{ binding: string; database_name: string; remote: boolean }>;
          r2_buckets: Array<{ binding: string; bucket_name: string; remote: boolean }>;
          durable_objects: { bindings: Array<{ name: string; class_name: string }> };
        }
      >;
    };

    expect(wrangler.assets).toEqual({
      binding: 'ASSETS',
      directory: './dist/client'
    });

    for (const [envName, env] of Object.entries(wrangler.env)) {
      expect(env.d1_databases).toEqual([
        expect.objectContaining({
          binding: 'DB',
          database_name: `qr-resto-hub-${envName}`,
          remote: true
        })
      ]);
      expect(env.r2_buckets).toEqual([
        expect.objectContaining({
          binding: 'ASSET_BUCKET',
          bucket_name: `qr-resto-hub-${envName}-assets`,
          remote: true
        })
      ]);
      expect(env.durable_objects.bindings).toEqual([
        {
          name: 'ORDER_LIVE_COORDINATOR',
          class_name: 'OrderLiveCoordinator'
        }
      ]);
    }
  });

  it('keeps deployment and D1 migration scripts scoped to dev and prod', () => {
    const pkg = JSON.parse(readText('package.json')) as {
      scripts: Record<string, string>;
    };

    expect(pkg.scripts['deploy:dev']).toContain('--env dev');
    expect(pkg.scripts['deploy:prod']).toContain('--env prod');
    expect(pkg.scripts['deploy:dev:dry-run']).toContain('--dry-run');
    expect(pkg.scripts['deploy:prod:dry-run']).toContain('--dry-run');
    expect(pkg.scripts['db:migrate:dev']).toBe(
      'wrangler d1 migrations apply qr-resto-hub-dev --env dev --remote'
    );
    expect(pkg.scripts['db:migrate:prod']).toBe(
      'wrangler d1 migrations apply qr-resto-hub-prod --env prod --remote'
    );
    const cloudflareScripts = Object.entries(pkg.scripts)
      .filter(([name]) => /deploy|migrate/.test(name))
      .map(([name, script]) => `${name} ${script}`)
      .join(' ');
    expect(cloudflareScripts).not.toMatch(/staging|local/);
  });

  it('does not introduce customer food-order PayMongo checkout wiring', () => {
    const implementationText = [
      readText('package.json'),
      readText('wrangler.jsonc'),
      readText('astro.config.mjs'),
      readText('src/worker.ts'),
      readText('src/pages/index.astro')
    ].join('\n');

    expect(implementationText).not.toMatch(/paymongo|checkout/i);
  });
});

describe('foundation app shell', () => {
  it('loads Tailwind CSS and presents the QR Resto Hub app name', () => {
    const page = readText('src/pages/index.astro');

    expect(page).toContain("import '../styles/global.css'");
    expect(page).toContain('<title>QR Resto Hub</title>');
    expect(page).toContain('<h1>QR Resto Hub</h1>');
  });

  it('exports the Durable Object class and delegates fetch handling to Astro Cloudflare', () => {
    const worker = readText('src/worker.ts');

    expect(worker).toContain("import { handle } from '@astrojs/cloudflare/handler'");
    expect(worker).toContain('export class OrderLiveCoordinator');
    expect(worker).toContain('return handle(request, env, ctx)');
  });
});
