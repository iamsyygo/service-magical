import { networkInterfaces } from 'node:os';

/**
 * Get available network addresses
 * @param port - default 8000
 * @param protocol - default http
 */
export function getAvailableNetworkAddresses(port = 8000, protocol = 'http') {
  const local: string[] = [];
  const network: string[] = [];

  Object.values(networkInterfaces())
    .flatMap((nInterface) => nInterface ?? [])
    .filter(
      (detail) =>
        detail &&
        detail.address &&
        (detail.family === 'IPv4' ||
          // @ts-expect-error Node 18.0 - 18.3 returns number
          detail.family === 4),
    )
    .forEach((detail) => {
      let host = detail.address;
      // ipv6 host
      if (host.includes(':')) {
        host = `[${host}]`;
      }
      const url = `${protocol}://${host}:${port}`;
      if (detail.address.includes('127.0.0.1')) {
        local.push(url);
      }

      if (host.startsWith('192.168') || host.startsWith('172')) {
        network.push(url);
      }
    });

  return {
    local: local[0],
    network: network.sort(),
  };
}
