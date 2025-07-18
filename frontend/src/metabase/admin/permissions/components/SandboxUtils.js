import { SandboxApi_Legacy as SandboxApi } from "metabase/api";

// 内存存储当前沙盒配置
const sandboxConfigs = new Map();

// 保存表的沙盒配置
export const setSandboxConfig = async (groupId, tableId, config) => {
  const key = `${groupId}-${tableId}`;
  try {
    // 调用后端 API 保存配置
    const response = await SandboxApi.create({
      groupId,
      tableId,
      fieldId: config.fieldId,
      groupAttribute: config.groupAttribute
    });
    
    // 保存到本地缓存
    sandboxConfigs.set(key, config);
    return response;
  } catch (error) {
    console.error("Failed to save sandbox config:", error);
    throw error;
  }
};

// 获取表的沙盒配置
export const getSandboxConfig = async (groupId, tableId) => {
  const key = `${groupId}-${tableId}`;
  
  // 先检查本地缓存
  if (sandboxConfigs.has(key)) {
    return sandboxConfigs.get(key);
  }
  
  try {
    // 从后端获取配置
    const response = await SandboxApi.get({ groupId, tableId });
    if (response) {
      const config = {
        fieldId: response.field_id,
        fieldName: response.field_name || "",
        groupAttribute: response.group_attribute
      };
      sandboxConfigs.set(key, config);
      return config;
    }
  } catch (error) {
    // 如果后端返回 404，表示没有配置，这是正常情况
    if (error.status !== 404) {
      console.error("Failed to get sandbox config:", error);
    }
  }
  
  return null;
};

// 判断表是否有沙盒配置
export const hasSandboxConfig = async (groupId, tableId) => {
  const config = await getSandboxConfig(groupId, tableId);
  return config !== null;
};

// 删除表的沙盒配置
export const deleteSandboxConfig = async (groupId, tableId) => {
  const key = `${groupId}-${tableId}`;
  try {
    await SandboxApi.delete({ groupId, tableId });
    sandboxConfigs.delete(key);
    return true;
  } catch (error) {
    console.error("Failed to delete sandbox config:", error);
    throw error;
  }
}; 