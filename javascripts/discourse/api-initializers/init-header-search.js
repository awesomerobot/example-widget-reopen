import { apiInitializer } from "discourse/lib/api";
import { logSearchLinkClick } from "discourse/lib/search";
import { schedule } from "@ember/runloop";

export default apiInitializer("0.11.1", (api) => {
  const searchMenuWidget = api.container.factoryFor("widget:search-menu");
  const corePanelContents = searchMenuWidget.class.prototype["panelContents"];

  api.reopenWidget("search-menu", {
    defaultState(attrs) {
      return {
        showHeaderResults: false,
        inTopicContext: attrs.inTopicContext,
      };
    },

    html() {
      let contents = [];

      contents.push(
        this.attach("button", {
          icon: "search",
          className: "search-icon",
          action: "showResults",
        })
      );

      if (this.state.showHeaderResults) {
        contents.push(this.panelContents());
      }

      return contents;
    },

    setTopicContext() {
      this.state.inTopicContext = true;
      this.focusSearchInput();
    },

    clearContext() {
      const searchInput = document.querySelector("#search-term");

      this.state.inTopicContext = false;
      searchInput.value = "";
      this.focusSearchInput();
    },

    focusSearchInput() {
      schedule("afterRender", () => {
        const searchInput = document.querySelector("#search-term");
        searchInput.focus();
        searchInput.select();
      });
    },

    mouseDownOutside() {
      this.state.showHeaderResults = false;
      this.scheduleRerender();
    },

    showResults() {
      this.state.showHeaderResults = !this.state.showHeaderResults;
      this.scheduleRerender();
    },

    linkClickedEvent(attrs) {
      if (attrs) {
        const { searchLogId, searchResultId, searchResultType } = attrs;
        if (searchLogId && searchResultId && searchResultType) {
          logSearchLinkClick({
            searchLogId,
            searchResultId,
            searchResultType,
          });
        }
      }
    },

    panelContents() {
      let contents = [];
      contents = contents.concat(...corePanelContents.call(this));
      return contents;
    },
  });

  api.createWidget("search-header", {
    tagName: "div.search-header",

    html() {
      const searchMenuVisible = this.state.searchVisible;

      if (!searchMenuVisible && !this.attrs.topic) {
        return this.attach("search-menu", {
          contextEnabled: this.state.contextEnabled,
        });
      }
    },
  });
});
