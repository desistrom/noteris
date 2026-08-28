import app from '../../src/server/index.js';

export class TestClient {
  constructor() {
    this.cookie = null;
  }

  async request(method, path, { json, headers = {} } = {}) {
    const opts = { method, headers: { ...headers } };
    if (json !== undefined) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(json);
    }
    if (this.cookie) opts.headers['Cookie'] = this.cookie;

    const res = await app.request(path, opts);
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      this.cookie = setCookie.split(';')[0];
    }

    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    return { status: res.status, data, setCookie };
  }

  async register(email, password, name, role = 'admin') {
    return this.request('POST', '/api/auth/register', {
      json: { email, password, name, role },
    });
  }

  async login(email, password) {
    return this.request('POST', '/api/auth/login', { json: { email, password } });
  }

  async logout() {
    return this.request('POST', '/api/auth/logout');
  }

  get(path) {
    return this.request('GET', path);
  }

  post(path, json, headers) {
    return this.request('POST', path, { json, headers });
  }

  put(path, json) {
    return this.request('PUT', path, { json });
  }

  del(path) {
    return this.request('DELETE', path);
  }
}
