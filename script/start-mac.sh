SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

chmod u+x $SCRIPT_DIR/llonebot/node
$SCRIPT_DIR/llonebot/node $SCRIPT_DIR/llonebot/llonebot.js &

chmod u+x $SCRIPT_DIR/pmhq/pmhq

osascript -e "do shell script \"$SCRIPT_DIR/pmhq/pmhq\" with administrator privileges"
