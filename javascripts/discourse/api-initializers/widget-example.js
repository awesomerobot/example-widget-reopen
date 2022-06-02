// this uses the widget setting to add a label to the "view_all" link

import { withPluginApi } from "discourse/lib/plugin-api";
import I18n from "I18n";

export default {
  name: "widget-example",

  initialize() {
    withPluginApi("0.10.1", (api) => {
      I18n.translations[I18n.locale].js.custom_translation = I18n.t(
        themePrefix("quick_access_more")
      );

      api.changeWidgetSetting(
        "quick-access-notifications",
        "viewAllLabel",
        "custom_translation"
      );
    });
  },
};
