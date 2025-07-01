// 沙盒配置状态管理
// 实际项目中这部分建议移到 Redux 或相关状态管理中

// 内存存储当前沙盒配置
const sandboxConfigs = new Map();

// 保存表的沙盒配置
export const setSandboxConfig = (groupId, tableId, config) => {
  const key = `${groupId}-${tableId}`;
  sandboxConfigs.set(key, config);
  console.log(`Sandbox config saved for ${key}:`, config);
  // TODO: 在这里可以添加 API 调用，将配置发送到后端
  return true;
};

// 获取表的沙盒配置
export const getSandboxConfig = (groupId, tableId) => {
  const key = `${groupId}-${tableId}`;
  return sandboxConfigs.get(key) || null;
};

// 判断表是否有沙盒配置
export const hasSandboxConfig = (groupId, tableId) => {
  const key = `${groupId}-${tableId}`;
  return sandboxConfigs.has(key);
};

// 删除表的沙盒配置
export const deleteSandboxConfig = (groupId, tableId) => {
  const key = `${groupId}-${tableId}`;
  return sandboxConfigs.delete(key);
};

// 在此处可以添加其他沙盒工具函数，如：
// - 从后端加载沙盒配置
// - 验证沙盒配置
// - 应用沙盒过滤条件等 