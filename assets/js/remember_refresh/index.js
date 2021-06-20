/** LiveView Hook **/

import { storeRefreshData, loadRefreshData } from "../refresh";

const PhxRememberRefresh = {
  updated() {
    let config = loadRefreshData() || {};
    config[this.el.dataset.page] = this.el.value
    storeRefreshData(config, this.el.dataset.dashboardMountPath);
  }
}

export default PhxRememberRefresh
