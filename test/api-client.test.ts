
import { TestClass } from "tsunit.external";
import { IAPIClient } from "../src/api";
import { MetaApiClient } from "../src/export";
import { apiModel, opNoParams, opWithParams } from "./util-model";

export class ApiClientTest extends TestClass {

  private apiClient: IAPIClient;

  setUp() {
    this.apiClient = new MetaApiClient(apiModel, 'https://localhost/');
  }

  testApiClientCreatesURLForOperation() {
    let url = this.apiClient.urlForOperation(opNoParams, {});
    this.areIdentical('https://localhost/base/op-no-params/', url);
  }
  testApiClientCreatesURLWithParamForOperation() {
    let url = this.apiClient.urlForOperation(opWithParams, { param: 4711, q: 'qqq', a: ['aAa'] });
    this.areIdentical('https://localhost/base/op/4711?q=qqq&a=aAa', url);
  }

  testApiClientUsesDefaultValues() {
      let client = new MetaApiClient(this.apiClient.model, this.apiClient.baseUrl);

      client.setDefaultValues({ param: 23, q: 'defaultQ'});
      let url = client.urlForOperation(opWithParams, { a: ['42']});
      this.areIdentical('https://localhost/base/op/23?q=defaultQ&a=42', url);

  }

  testApiClientDirectValueOverridesDefaultValue() {
      let client = new MetaApiClient(this.apiClient.model, this.apiClient.baseUrl);
  
      client.setDefaultValues({ param: 23, q: 'defaultQ'});
      client.addDefaultValues({ a: [ ]});
      let url = client.urlForOperation(opWithParams, { a: ['42']});
      this.areIdentical('https://localhost/base/op/23?q=defaultQ&a=42', url);

      url = client.urlForOperation(opWithParams, { });
      this.areIdentical('https://localhost/base/op/23?q=defaultQ', url);
  }
  testApiClientUsesDefaultHeaders() {
    let client = new MetaApiClient(this.apiClient.model, this.apiClient.baseUrl);

    client.setDefaultHeaders({ 'x-test-header': 'test-value'});
    let [url, requestInit] = client.requestInfoForOperation(opNoParams, { });
    this.areIdentical("test-value", (requestInit.headers as any)['x-test-header']);
  }
}
