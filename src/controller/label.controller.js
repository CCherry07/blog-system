const labelService = require("../service/label.service");

class LabelController {
  async createLabel(ctx, next) {
    const { labels } = ctx.request.body;
    let resArr = [];
    if (labels.length > 1) {
      for (const label of labels) {
        const res = await labelService.createLabel(label);
        resArr.push(res);
      }
      ctx.body = resArr;
    } else {
      const res = await labelService.createLabel(label);
      ctx.body = res;
    }
  }
  async getLabels(ctx, next) {
    const { limit, offset } = ctx.query;
    const res = await labelService.getLabels(limit, offset);
    ctx.body = res;
  }
}
module.exports = new LabelController();
