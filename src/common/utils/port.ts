import getPort from 'get-port'
import path from 'node:path'
import { getFixedDataDir } from '@/common/globalVars'
import fs from 'node:fs/promises'

export async function getAvailablePort(startPort: number, range: number = 100) {
  const ports = Array.from({ length: range }, (_, i) => startPort + i)
  return await getPort({ port: ports })
}

// getAvailablePort(3000).then(port => {
//   console.log(port);
// })
