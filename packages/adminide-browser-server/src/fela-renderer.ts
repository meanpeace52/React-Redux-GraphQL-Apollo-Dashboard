import * as Fela from 'fela';
import * as prefixer from 'fela-plugin-prefixer';
import * as fallbackValue from 'fela-plugin-fallback-value';
import * as unit from 'fela-plugin-unit';
import * as lvha from 'fela-plugin-lvha';
import * as validator from 'fela-plugin-validator';
import * as logger from 'fela-plugin-logger';

import * as perf from 'fela-perf';
import * as beautifier from 'fela-beautifier';
import * as fontRenderer from 'fela-font-renderer';

export default (fontNode) => {
    const renderer = Fela.createRenderer({
        plugins: [prefixer(), fallbackValue(), unit(), lvha(), validator()],
        enhancers: [perf(), beautifier(), fontRenderer(fontNode)],
    });

    return renderer;
};
