import { GetImplInfoOutput } from '@saltify/milky-types';

export function transformProtocolOsType(): GetImplInfoOutput['qq_protocol_type'] {
    // NTQQ is always Windows protocol
    return 'windows';
}

