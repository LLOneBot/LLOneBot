import { encode, decode, encodeResult, decodeResult } from 'silk-wasm'
import { isMainThread, parentPort, Worker, MessageChannel } from 'node:worker_threads'

interface Data {
    type: string,
    params: [input: ArrayBufferView | ArrayBuffer, sampleRate: number]
}

if (!isMainThread && parentPort) {
    parentPort.addListener('message', (e) => {
        const data: Data = e.data
        const port: MessagePort = e.port
        switch (data.type) {
            case "encode":
                encode(...data.params)
                    .then(ret => {
                        port.postMessage(ret)
                    }).catch(err => {
                        port.postMessage(err)
                    }).finally(() => {
                        port.close()
                    })
                break
            case "decode":
                decode(...data.params).then(ret => {
                    port.postMessage(ret)
                }).catch(err => {
                    port.postMessage(err)
                }).finally(() => {
                    port.close()
                })
                break
            default:
                port.postMessage(undefined)
                port.close()
        }
    })
}

function postMessage(data: Data): Promise<any> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(__filename)
        const { port1, port2 } = new MessageChannel()
        port2.once('message', async (ret) => {
            port2.close()
            worker.terminate()
            ret instanceof Error ? reject(ret) : resolve(ret)
        })
        worker.postMessage({ port: port1, data }, [port1])
    })
}

export function silkEncode(...args: Parameters<typeof encode>): Promise<encodeResult> {
    return postMessage({ type: 'encode', params: args })
}

export function silkDecode(...args: Parameters<typeof decode>): Promise<decodeResult> {
    return postMessage({ type: 'decode', params: args })
}