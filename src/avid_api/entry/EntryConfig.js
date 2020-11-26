/**
 * Copyright 2019 by Avid Technology, Inc.
 */

import { getLocalization } from 'cloudux-l10n';
import appConfig from '../../package.json';
import icon from '../../images/icon.json';
import EntryWrapper from './EntryWrapper';
import l10nData from '../../l10n/lang.en';

export default {
    factory: (config) => {
        return new EntryWrapper(config);
    },
    config: {
        dockable: false,
        isMultiInstance: true,
        title: getLocalization(l10nData)('app-title'),
    },
    menuIcon: {
        group: 200,
        orderInGroup: 200,
        title: appConfig.identity.appName,
        icon: icon.icon,
        gradient: ['#A91F49', '#7E0046'],
    },
};
