import { describe, expect, it } from 'vitest';
import { t } from 'elysia';
import { apiError, apiSuccess, resultToApiResponse } from '../src/lib/api/response';
import { tboxApiError, tboxApiResponse, tboxApiSuccess } from '../src/lib/typebox/api';
import { GeneralError } from '../src/utils/general/error';
import { Result } from '../src/utils/general/result';

describe('standard API response helpers', () => {
  it('creates the public success envelope', () => {
    expect(apiSuccess({ id: 'restaurant-1' }, { requestId: 'req-1', code: 'SUCCESS' })).toEqual({
      data: { id: 'restaurant-1' },
      meta: { requestId: 'req-1', code: 'SUCCESS' },
    });
  });

  it('creates the public error envelope without details by default', () => {
    expect(apiError('FORBIDDEN', 'You do not have permission to perform this action.')).toEqual({
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action.',
      },
    });
  });

  it('maps internal success results to public success envelopes', () => {
    const result = Result.okay({ status: 'ready' });

    expect(resultToApiResponse(result, { meta: { requestId: 'req-2' } })).toEqual({
      data: { status: 'ready' },
      meta: { requestId: 'req-2' },
    });
  });

  it('does not expose internal error details unless explicitly allowed', () => {
    const result = Result.error(
      new GeneralError({ internalReason: 'tenant mismatch' }, 'FORBIDDEN'),
    );

    expect(resultToApiResponse(result)).toEqual({
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action.',
      },
    });

    expect(resultToApiResponse(result, { exposeErrorDetails: true })).toEqual({
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action.',
        details: { internalReason: 'tenant mismatch' },
      },
    });
  });
});

describe('standard TypeBox API response schemas', () => {
  it('uses the public success envelope shape', () => {
    expect(tboxApiSuccess(t.Object({ id: t.String() })).properties).toHaveProperty('data');
    expect(tboxApiSuccess(t.String()).properties).toHaveProperty('meta');
  });

  it('uses the public error envelope shape', () => {
    const schema = tboxApiError();

    expect(schema.properties.error.properties).toHaveProperty('code');
    expect(schema.properties.error.properties).toHaveProperty('message');
    expect(schema.properties.error.properties).toHaveProperty('details');
  });

  it('combines success and error schemas for route response maps', () => {
    expect(tboxApiResponse(t.Object({ ok: t.Boolean() })).anyOf).toHaveLength(2);
  });
});
