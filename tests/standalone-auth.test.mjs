import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authenticate } from '../worker/standalone-auth.ts';
const env={ADMIN_EMAILS:'admin@example.com',ADMIN_PASSWORD:'example-test-password-long'};
const auth='Basic '+btoa('admin@example.com:'+env.ADMIN_PASSWORD);
test('rejects spoofed identity and missing secrets',async()=>{
 assert.equal((await authenticate(new Request('https://test.test/admin',{headers:{'oai-authenticated-user-email':env.ADMIN_EMAILS}}),env)).status,401);
 assert.equal((await authenticate(new Request('https://test.test/admin'),{})).status,503);
});
test('strips public identity and accepts verified admin',async()=>{
 const publicRequest=await authenticate(new Request('https://test.test/',{headers:{'oai-authenticated-user-email':env.ADMIN_EMAILS}}),env);
 assert.equal(publicRequest.headers.get('oai-authenticated-user-email'),null);
 const admin=await authenticate(new Request('https://test.test/admin',{headers:{authorization:auth}}),env);
 assert.equal(admin.headers.get('oai-authenticated-user-email'),env.ADMIN_EMAILS);
});
test('blocks wrong password, cross-origin writes and insecure transport',async()=>{
 assert.equal((await authenticate(new Request('https://test.test/admin',{headers:{authorization:'Basic '+btoa('admin@example.com:wrong')}}),env)).status,401);
 assert.equal((await authenticate(new Request('https://test.test/api/admin/site-config',{method:'PUT',headers:{authorization:auth,origin:'https://evil.test'}}),env)).status,403);
 assert.equal((await authenticate(new Request('http://test.test/admin',{headers:{authorization:auth}}),env)).status,403);
 const request=await authenticate(new Request('https://test.test/api/admin/site-config',{method:'PUT',headers:{authorization:auth,origin:'https://test.test'}}),env);
 assert.ok(request instanceof Request);
});
