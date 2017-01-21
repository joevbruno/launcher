import axios from 'axios';

export default class Http {
  constructor() {
    this.headers = [];
    this.request = this.createAxiosInstance();
  }
  createAxiosInstance(options = {}) {
    const defaults = {
      baseURL: `${window.location.origin}/api/v2`,
      timeout: 30000
    };
    this.request = axios.create({
      defaults,
      ...options
    });
  }
  setOptions(options) {
    this.createAxiosInstance(options);
  }
  get(...args) {
    return this.request.get(...args);
  }
  post(...args) {
    return this.request.post(...args);
  }
  put(...args) {
    return this.request.put(...args);
  }
  delete(...args) {
    return this.request.delete(...args);
  }
}
