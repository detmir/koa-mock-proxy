import {AddressInfo, Server} from "net";
import Application  from "koa";

interface ListenResult {
  address: string;
  stop: () => Promise<unknown>;
  server: Server;
}

export const startApplication = (app: Application): Promise<ListenResult> => {
  return new Promise((resolve) => {
    const server = app.listen(() => {
      const address = server.address() as AddressInfo;
      resolve({
        server,
        address: `http://[${address.address}]:${address.port}`,
        stop: () => new Promise(resolve => server.close(resolve))
      });
    });
  });
};