import { Api } from "metabase/api";

// 获取所有沙盒策略
export const getSandboxPolicies = () => {
  return Api.endpoints.getSandboxPolicies.initiate();
};

// 获取单个沙盒策略
export const getSandboxPolicy = (id) => {
  return Api.endpoints.getSandboxPolicy.initiate(id);
};

// 创建沙盒策略
export const createSandboxPolicy = (policy) => {
  return Api.endpoints.createSandboxPolicy.initiate(policy);
};

// 更新沙盒策略
export const updateSandboxPolicy = (id, policy) => {
  return Api.endpoints.updateSandboxPolicy.initiate({ id, policy });
};

// 删除沙盒策略
export const deleteSandboxPolicy = (id) => {
  return Api.endpoints.deleteSandboxPolicy.initiate(id);
};

// 获取所有用户组
export const getGroups = () => {
  return Api.endpoints.getGroups.initiate();
};

// 获取所有数据表
export const getTables = () => {
  return Api.endpoints.getTables.initiate();
};
