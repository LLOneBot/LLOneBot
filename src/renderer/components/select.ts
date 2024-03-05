import { SettingOption } from "./option";

export const SettingSelect = (items: Array<{ text: string, value: string }>, configKey?: string, configValue?: any) => {
    return `<setting-select ${configKey ? `data-config-key="${configKey}"` : ''}>
    <div>
        ${items.map((e, i) => {
            return SettingOption(e.text, e.value, (configKey && configValue ? configValue === e.value : i === 0));
        }).join('')}
    </div>
</setting-select>`;
}