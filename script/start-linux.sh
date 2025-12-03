SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

chmod +x $SCRIPT_DIR/llbot/node
chmod +x $SCRIPT_DIR/llbot/pmhq

# 检测 xvfb-run 命令是否存在
USE_XVFB=1
if ! command -v xvfb-run &> /dev/null; then
    echo "未找到 xvfb-run 命令"
    echo "如果你是桌面环境，按 Y 继续运行"
    echo "如果不是桌面环境，请先安装 xvfb，按其他键退出"
    read -n 1 -s -r key
    echo ""
    if [[ "$key" == "Y" || "$key" == "y" ]]; then
        USE_XVFB=0
    else
        exit 0
    fi
fi

$SCRIPT_DIR/llbot/node $SCRIPT_DIR/llbot/llonebot.js &

if [ $USE_XVFB -eq 1 ]; then
    xvfb-run $SCRIPT_DIR/llbot/pmhq
else
    $SCRIPT_DIR/llbot/pmhq
fi
