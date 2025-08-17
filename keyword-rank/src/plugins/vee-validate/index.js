import { configure, defineRule } from 'vee-validate';
import { localize, setLocale } from '@vee-validate/i18n';
import fa from '@vee-validate/i18n/dist/locale/fa.json';
import { all as AllRules } from '@vee-validate/rules';
import customRules from './rules';

const customFa = {
  code: 'fa',
  messages: fa.messages,
};

export default {
  name: 'vee-validate',
  parallel: true,
  setup() {
    Object.keys(AllRules).forEach((rule) => {
      defineRule(rule, AllRules[rule]);
    });

    for (const [ruleName, ruleFunction] of Object.entries(customRules)) {
      defineRule(ruleName, ruleFunction);
    }

    configure({
      generateMessage: localize({
        fa: customFa,
      }),
      validateOnBlur: false,
      validateOnChange: false,
      validateOnInput: true,
    });

    setLocale('fa');
  },
};
