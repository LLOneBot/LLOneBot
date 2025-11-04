import asyncio
import json
import uuid

import websockets

async def async_input(prompt: str = "") -> str:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, input, prompt)

websocket_clients = []

# 处理客户端连接
async def handle_connection(websocket):
    print("LLOneBot 已连接")
    websocket_clients.append(websocket)
    try:
        async for message in websocket:
            print(f"收到消息: {message}")
    except websockets.ConnectionClosed:
        try:
            websocket_clients.remove(websocket)
        except ValueError:
            pass
        print("客户端断开连接")


# 启动 WebSocket 服务器
async def start_server():
    async with websockets.serve(handle_connection, "localhost", 8765):
        print("WebSocket 服务器已启动，监听 ws://localhost:8765")
        await asyncio.Future()

async def main():
    group_id = await async_input("输入群号: ")
    asyncio.create_task(start_server())
    while True:
        message = await async_input("输入消息内容: ")
        echo = str(uuid.uuid4())
        data = {
            "action": "send_group_msg",
            "params": {
                "group_id": group_id,
                "message": {
                    "type": "text",
                    "data": {
                        "text": message
                    }
                }
            },
            'echo': echo
        }
        for ws in websocket_clients:
            await ws.send(json.dumps(data))


asyncio.run(main())
