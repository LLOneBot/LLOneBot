/// <reference path="../global.d.ts" />
import {
    SettingButton,
    SettingItem,
    SettingList,
    SettingSelect,
    SettingSwitch
} from './components';
import StyleRaw from './style.css?raw';

// 打开设置界面时触发

async function onSettingWindowCreated(view: Element) {
    window.llonebot.log("setting window created");
    const isEmpty = (value: any) => value === undefined || value === null || value === '';
    let config = await window.llonebot.getConfig()

    const parser = new DOMParser();
    const doc = parser.parseFromString([
        '<div>',
        `<style>${StyleRaw}</style>`,
        SettingList([
            SettingItem('启用 HTTP 服务', null,
                SettingSwitch('ob11.enableHttp', config.ob11.enableHttp, { 'control-display-id': 'config-ob11-httpPort' }),
            ),
            SettingItem('HTTP 服务监听端口', null,
                `<div class="q-input"><input class="q-input__inner" type="number" min="1" max="65534" value="${config.ob11.httpPort}" placeholder="${config.ob11.httpPort}" /></div>`,
                'config-ob11-httpPort', config.ob11.enableHttp
            ),
            SettingItem('启用 HTTP 事件上报', null,
                SettingSwitch('ob11.enableHttpPost', config.ob11.enableHttpPost, { 'control-display-id': 'config-ob11-httpPost' }),
            ),
            SettingItem('HTTP 事件上报地址', null,
                '<div></div>',
                'config-ob11-httpPost', config.ob11.enableHttpPost
            ),
            SettingItem('启用正向 WebSocket 服务', null,
                SettingSwitch('ob11.enableWs', config.ob11.enableWs, { 'control-display-id': 'config-ob11-wsPort' }),
            ),
            SettingItem('正向 WebSocket 服务监听端口', null,
                `<div class="q-input"><input class="q-input__inner" type="number" min="1" max="65534" value="${config.ob11.wsPort}" placeholder="${config.ob11.wsPort}" /></div>`,
                'config-ob11-wsPort', config.ob11.enableWs
            ),
            SettingItem('启用反向 WebSocket 服务', null,
                SettingSwitch('ob11.enableWsReverse', config.ob11.enableWsReverse, { 'control-display-id': 'config-ob11-wsHosts' }),
            ),
            SettingItem('反向 WebSocket 监听地址', null,
                '<div></div>',
                'config-ob11-wsHosts', config.ob11.enableWsReverse
            ),
            SettingItem(
                'ffmpeg 路径', `${!isEmpty(config.ffmpeg) ? config.ffmpeg : '未指定'}`,
                SettingButton('选择', 'config-ffmpeg-select'),
                'config-ffmpeg-path',
            ),
            SettingItem(
                '', null,
                SettingButton('保存', 'config-ob11-save', 'primary'),
            )
        ]),
        SettingList([
            SettingItem(
                '消息上报格式类型',
                '如客户端无特殊需求推荐保持默认设置，两者的详细差异可参考 <a href="javascript:LiteLoader.api.openExternal(\'https://github.com/botuniverse/onebot-11/tree/master/message#readme\');">OneBot v11 文档</a>',
                SettingSelect([
                    { text: '消息段', value: 'array' },
                    { text: 'CQ码', value: 'string' },
                ], 'ob11.messagePostFormat', config.ob11.messagePostFormat),
            ),
            SettingItem(
                '使用 Base64 编码获取文件',
                '开启后，调用 /get_image、/get_record 时，获取不到 url 时添加一个 Base64 字段',
                SettingSwitch('enableLocalFile2Url', config.enableLocalFile2Url),
            ),
            SettingItem(
                '调试模式',
                '开启后上报信息会添加 raw 字段以附带原始信息',
                SettingSwitch('debug', config.debug),
            ),
            SettingItem(
                '上报 Bot 自身发送的消息',
                '慎用，可能会导致自己跟自己聊个不停',
                SettingSwitch('reportSelfMessage', config.reportSelfMessage),
            ),
            SettingItem(
                '写入日志',
                `日志文件目录：${window.LiteLoader.plugins['LLOneBot'].path.data}`,
                SettingButton('打开', 'config-open-log-path'),
            ),
            SettingItem(
                '自动删除收到的文件',
                '在收到文件后的指定时间内删除该文件',
                SettingSwitch('autoDeleteFile', config.autoDeleteFile, { 'control-display-id': 'config-auto-delete-file-second' }),
            ),
            SettingItem(
                '自动删除文件时间',
                '单位为秒',
                `<div class="q-input"><input class="q-input__inner" type="number" min="1" value="${config.autoDeleteFileSecond}" placeholder="${config.autoDeleteFileSecond}" /></div>`,
                'config-auto-delete-file-second', config.autoDeleteFile
            ),
        ]),
        '</div>',
    ].join(''), "text/html");

    // 开关
    doc.querySelectorAll('setting-switch[data-config-key]').forEach((dom: HTMLElement) => {
        dom.addEventListener('click', () => {
            const active = dom.getAttribute('is-active') === null;

            if (active) dom.setAttribute('is-active', '');
            else dom.removeAttribute('is-active');

            if (!isEmpty(dom.dataset.controlDisplayId)) {
                const displayDom = document.querySelector(`#${dom.dataset.controlDisplayId}`);
                if (active) displayDom.removeAttribute('is-hidden');
                else displayDom.setAttribute('is-hidden', '');
            }
        });
    });

    doc.body.childNodes.forEach(node => {
        view.appendChild(node);
    });
}

function init () {
  const hash = location.hash
  if (hash === '#/blank') {

  }
}

if (location.hash === '#/blank') {
  (window as any).navigation.addEventListener('navigatesuccess', init, { once: true })
} else {
  init()
}

export {
  onSettingWindowCreated
}
