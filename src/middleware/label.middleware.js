const labelService = require("../service/label.service");

const whetherTheLabelExists = async (ctx, next) => {
  const { labels } = ctx.request.body;
  const newLabels = [];
  for (const label of labels) {
    const res = await labelService.getLabelByName(label);
    const labelInfo = { label };
    if (!res) {
      try {
        const createLabel = await labelService.createLabel(label);
        labelInfo.id = createLabel.insertId;
      } catch (err) {
        throw err;
      }
    } else {
      labelInfo.id = res[0].id;
    }
    newLabels.push(labelInfo);
  }
  ctx.labels = newLabels;
  await next();
};

module.exports = {
  whetherTheLabelExists,
};
