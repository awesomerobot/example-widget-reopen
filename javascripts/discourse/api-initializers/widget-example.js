// this reopens the widget to add a label to the "view_all" link

import { withPluginApi } from "discourse/lib/plugin-api";
import I18n from "I18n";
import { h } from "virtual-dom";

export default {
  name: "widget-example",

  initialize() {
    withPluginApi("0.10.1", (api) => {
      api.reopenWidget("quick-access-notifications", {
        html(attrs, state) {
          if (!state.loaded) {
            this.refreshNotifications(state);
          }

          if (state.loading) {
            return [h("div.spinner-container", h("div.spinner"))];
          }

          const items = this.getItems().length
            ? this.getItems().map((item) => this.itemHtml(item))
            : [this.emptyStatePlaceholderItem()];

          let bottomItems = [];

          if (!this.hideBottomItems()) {
            const tab = I18n.t(this.attrs.titleKey).toLowerCase();

            I18n.translations.en.js.custom_translation = I18n.t(
              themePrefix("quick_access_more")
            );

            bottomItems.push(
              // intentionally a link so it can be ctrl clicked
              this.attach("link", {
                title: "view_all",
                titleOptions: { tab },
                icon: "chevron-down",
                className: "btn btn-default btn-icon no-text show-all",
                "aria-label": "view_all",
                ariaLabelOptions: { tab },
                href: this.showAllHref(),
                label: "custom_translation",
              })
            );
          }

          if (this.hasUnread()) {
            bottomItems.push(
              this.attach("button", {
                title: "user.dismiss_notifications_tooltip",
                icon: "check",
                label: "user.dismiss",
                className: "btn btn-default notifications-dismiss",
                action: "dismissNotifications",
              })
            );
          }

          return [h("ul", items), h("div.panel-body-bottom", bottomItems)];
        },
      });
    });
  },
};
